import { t } from 'elysia'
import mongoose, { Schema } from 'mongoose'

export interface IHighlight {
  user_id: mongoose.Types.ObjectId
  book_id: mongoose.Types.ObjectId
  selected_text: string
  position_start: string
  position_end: string
  color: string
  note?: string
}

const HighlightSchema = new Schema<IHighlight>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    selected_text: { type: String, required: true },
    position_start: { type: String, required: true },
    position_end: { type: String, required: true },
    color: { type: String, required: true, default: '#FFFF00' },
    note: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const Highlight = mongoose.model<IHighlight>('Highlight', HighlightSchema)

export const highlightCreate = t.Object({
  book_id: t.String({ pattern: '^[0-9a-fA-F]{24}$' }),
  selected_text: t.String({ minLength: 1, maxLength: 5000 }),
  position_start: t.String({ minLength: 1, maxLength: 500 }),
  position_end: t.String({ minLength: 1, maxLength: 500 }),
  color: t.Optional(t.String({ maxLength: 50 })),
  note: t.Optional(t.String({ maxLength: 2000 })),
})

export type HighlightCreate = typeof highlightCreate.static
