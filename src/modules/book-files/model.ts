import mongoose, { Schema } from 'mongoose'

export interface IBookFile {
  book_id: mongoose.Types.ObjectId
  file_data: string
}

const BookFileSchema = new Schema<IBookFile>(
  {
    book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true, unique: true },
    file_data: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const BookFile = mongoose.model<IBookFile>('BookFile', BookFileSchema)
