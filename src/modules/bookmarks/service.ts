import { Bookmark, type BookmarkCreate } from './model'
import { ok, fail } from '../../libs/response'

export abstract class BookmarkService {
  static async findAll(userId: string, bookId?: string) {
    const filter: Record<string, unknown> = { user_id: userId }
    if (bookId) filter.book_id = bookId
    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 }).lean()
    return ok(bookmarks, 'Bookmarks fetched')
  }

  static async create(userId: string, data: BookmarkCreate) {
    const bookmark = await Bookmark.create({ user_id: userId, ...data })
    return ok(bookmark, 'Bookmark created')
  }

  static async remove(userId: string, id: string) {
    const bookmark = await Bookmark.findOneAndDelete({ _id: id, user_id: userId })
    if (!bookmark) return fail(404, 'Bookmark not found')
    return ok(null, 'Bookmark deleted')
  }
}
