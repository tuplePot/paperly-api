import { t } from 'elysia'
import mongoose, { Schema } from 'mongoose'

export interface IBookmark {
  user_id: mongoose.Types.ObjectId
  book_id: mongoose.Types.ObjectId
  position: string
  note?: string
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    position: { type: String, required: true },
    note: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const Bookmark = mongoose.model<IBookmark>('Bookmark', BookmarkSchema)

export const bookmarkCreate = t.Object({
  book_id: t.String({ pattern: '^[0-9a-fA-F]{24}$' }),
  position: t.String({ minLength: 1, maxLength: 500 }),
  note: t.Optional(t.String({ maxLength: 1000 })),
})

export type BookmarkCreate = typeof bookmarkCreate.static
