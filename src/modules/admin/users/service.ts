import { User } from '../../auth/model'
import { Book } from '../../books/model'
import { UserLibrary } from '../../library/model'
import { ok, fail } from '../../../libs/response'
import type { PaginationQuery, UserCreate, UserPatch } from './model'

export abstract class AdminUserService {
  static async findAll({ page = 1, limit = 20 }: PaginationQuery) {
    const [users, total] = await Promise.all([
      User.find().select('-password').skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(),
    ])
    return ok({ users, total, page, limit }, 'Users fetched')
  }

  static async create(data: UserCreate) {
    const exists = await User.findOne({ email: data.email.toLowerCase() }).lean()
    if (exists) return fail(409, 'Email already registered')

    const hashed = await Bun.password.hash(data.password)
    const user = await User.create({ ...data, password: hashed })
    const created = await User.findById(user._id).select('-password').lean()
    return ok(created, 'User created')
  }

  static async findById(id: string) {
    const user = await User.findById(id).select('-password').lean()
    if (!user) return fail(404, 'User not found')
    return ok(user, 'User fetched')
  }

  static async update(id: string, data: UserPatch) {
    const user = await User.findByIdAndUpdate(id, data, { new: true }).select('-password').lean()
    if (!user) return fail(404, 'User not found')
    return ok(user, 'User updated')
  }

  static async remove(id: string) {
    const user = await User.findByIdAndDelete(id)
    if (!user) return fail(404, 'User not found')
    return ok(null, 'User deleted')
  }

  // ── User library (admin-assigned shelves) ────────────────────────────────────

  static async getLibrary(userId: string) {
    const user = await User.exists({ _id: userId })
    if (!user) return fail(404, 'User not found')

    const entries = await UserLibrary.find({ user_id: userId })
      .populate('book_id')
      .sort({ added_at: -1 })
      .lean()
    return ok(entries, 'User library fetched')
  }

  static async assignBook(userId: string, bookId: string) {
    const [user, book] = await Promise.all([
      User.exists({ _id: userId }),
      Book.exists({ _id: bookId }),
    ])
    if (!user) return fail(404, 'User not found')
    if (!book) return fail(404, 'Book not found')

    const existing = await UserLibrary.exists({ user_id: userId, book_id: bookId })
    if (existing) return fail(409, 'Book already in user library')

    const entry = await UserLibrary.create({ user_id: userId, book_id: bookId })
    return ok(entry, 'Book assigned to user')
  }

  static async removeFromLibrary(userId: string, bookId: string) {
    const entry = await UserLibrary.findOneAndDelete({ user_id: userId, book_id: bookId })
    if (!entry) return fail(404, 'Book not in user library')
    return ok(null, 'Book removed from user library')
  }
}
