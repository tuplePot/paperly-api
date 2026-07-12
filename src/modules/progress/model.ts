import { t } from 'elysia'
import mongoose, { Schema } from 'mongoose'

export interface IReadingProgress {
  user_id: mongoose.Types.ObjectId
  book_id: mongoose.Types.ObjectId
  position: string
  // Persen baca 0–100, dipakai UI untuk progress bar & "Lanjutkan Membaca".
  percent: number
  // Label posisi manusiawi, mis. "Bab 12" (opsional).
  chapter_label?: string
  last_read_at: Date
}

const ReadingProgressSchema = new Schema<IReadingProgress>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  position: { type: String, required: true },
  percent: { type: Number, default: 0, min: 0, max: 100 },
  chapter_label: { type: String },
  last_read_at: { type: Date, default: Date.now },
})

ReadingProgressSchema.index({ user_id: 1, book_id: 1 }, { unique: true })

export const ReadingProgress = mongoose.model<IReadingProgress>('ReadingProgress', ReadingProgressSchema)

export const progressBody = t.Object({
  position: t.String({ minLength: 1, maxLength: 500 }),
  percent: t.Optional(t.Number({ minimum: 0, maximum: 100 })),
  chapter_label: t.Optional(t.String({ maxLength: 100 })),
})

export type ProgressBody = typeof progressBody.static
