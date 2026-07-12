import { User, type RegisterBody, type LoginBody, type UpdateMeBody } from './model'
import { ok, fail } from '../../libs/response'

export abstract class AuthService {
  static async register(data: RegisterBody) {
    const exists = await User.findOne({ email: data.email.toLowerCase() }).lean()
    if (exists) return fail(409, 'Email already registered')

    const hashed = await Bun.password.hash(data.password)
    const user = await User.create({ email: data.email, password: hashed, display_name: data.display_name })

    return ok(
      { _id: user._id, email: user.email, display_name: user.display_name, role: user.role },
      'Registration successful'
    )
  }

  static async validateCredentials(data: LoginBody) {
    const user = await User.findOne({ email: data.email.toLowerCase() }).lean()
    if (!user) return null
    if (user.is_suspended) return null

    const valid = await Bun.password.verify(data.password, user.password)
    if (!valid) return null

    return { id: user._id.toString(), email: user.email, role: user.role }
  }

  static async getMe(userId: string) {
    const user = await User.findById(userId).select('-password').lean()
    if (!user) return fail(404, 'User not found')
    return ok(user, 'Profile fetched')
  }

  static async updateMe(userId: string, data: UpdateMeBody) {
    const user = await User.findByIdAndUpdate(userId, data, { new: true }).select('-password').lean()
    if (!user) return fail(404, 'User not found')
    return ok(user, 'Profile updated')
  }
}
