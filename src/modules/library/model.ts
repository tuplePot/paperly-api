import mongoose, { Schema } from 'mongoose'

export interface IUserLibrary {
  user_id: mongoose.Types.ObjectId
  book_id: mongoose.Types.ObjectId
  added_at: Date
  is_favorite: boolean
}

const UserLibrarySchema = new Schema<IUserLibrary>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  added_at: { type: Date, default: Date.now },
  is_favorite: { type: Boolean, default: false },
})

UserLibrarySchema.index({ user_id: 1, book_id: 1 }, { unique: true })

export const UserLibrary = mongoose.model<IUserLibrary>('UserLibrary', UserLibrarySchema)
