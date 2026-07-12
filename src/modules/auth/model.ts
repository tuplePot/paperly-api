import { t } from 'elysia'
import mongoose, { Schema } from 'mongoose'
import { IUser } from '../users/interface'

// ─── TypeBox ─────────────────────────────────────────────────────────────────

export const registerBody = t.Object({
  email: t.String({ format: 'email', maxLength: 254 }),
  password: t.String({ minLength: 8, maxLength: 128 }),
  display_name: t.String({ minLength: 1, maxLength: 100 }),
})

export const loginBody = t.Object({
  email: t.String({ format: 'email', maxLength: 254 }),
  password: t.String({ minLength: 1, maxLength: 128 }),
})

export const updateMeBody = t.Partial(t.Object({
  display_name: t.String({ minLength: 1, maxLength: 100 }),
  avatar_url: t.String({ maxLength: 500 }),
}))

export type RegisterBody = typeof registerBody.static
export type LoginBody = typeof loginBody.static
export type UpdateMeBody = typeof updateMeBody.static

// ─── Mongoose ────────────────────────────────────────────────────────────────

// export interface IUser {
//   email: string
//   password: string
//   display_name: string
//   avatar_url?: string
//   role: 'user' | 'admin'
//   is_suspended: boolean
// }

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    display_name: { type: String, required: true, maxlength: 100 },
    avatar_url: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    is_suspended: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const User = mongoose.model<IUser>('User', UserSchema)
