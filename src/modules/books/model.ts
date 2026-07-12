import { t } from 'elysia'
import mongoose, { Schema } from 'mongoose'
import type { IBook } from './types'

// ─── Shared helpers ───────────────────────────────────────────────────────────

export const objectId = t.String({ pattern: '^[0-9a-fA-F]{24}$' })
export const objectIdParam = t.Object({ id: objectId })

const formatEnum = t.Union([t.Literal('epub'), t.Literal('pdf'), t.Literal('txt')])

// ─── TypeBox ─────────────────────────────────────────────────────────────────

export const bookCreate = t.Object({
  title: t.String({ minLength: 1, maxLength: 255 }),
  author: t.String({ minLength: 1, maxLength: 255 }),
  format: formatEnum,
  file_size: t.Number({ minimum: 0 }),
  uploaded_by: t.Optional(t.String({ maxLength: 100 })),
  // admin-only: attach file/cover in the same request
  file_data: t.Optional(t.String()),
  cover_data: t.Optional(t.String()),
})

export const bookUpdate = t.Partial(t.Object({
  title: t.String({ minLength: 1, maxLength: 255 }),
  author: t.String({ minLength: 1, maxLength: 255 }),
  format: formatEnum,
  file_size: t.Number({ minimum: 0 }),
}))

export const bookQuery = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
  search: t.Optional(t.String()),
  format: t.Optional(formatEnum),
})

export type BookCreate = typeof bookCreate.static
export type BookUpdate = typeof bookUpdate.static
export type BookQuery = typeof bookQuery.static

// ─── Mongoose ────────────────────────────────────────────────────────────────

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, maxlength: 255 },
    author: { type: String, required: true, maxlength: 255 },
    format: { type: String, required: true, enum: ['epub', 'pdf', 'txt'] },
    file_size: { type: Number, required: true, default: 0 },
    uploaded_by: { type: String, required: true, default: 'admin' },
  },
  { timestamps: true }
)

BookSchema.index({ title: 'text', author: 'text' })

export const Book = mongoose.model<IBook>('Book', BookSchema)
