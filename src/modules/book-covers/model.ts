import mongoose, { Schema } from 'mongoose'

export interface IBookCover {
  book_id: mongoose.Types.ObjectId
  cover_data: string
}

const BookCoverSchema = new Schema<IBookCover>(
  {
    book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true, unique: true },
    cover_data: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const BookCover = mongoose.model<IBookCover>('BookCover', BookCoverSchema)
