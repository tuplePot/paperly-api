import mongoose, { Schema } from 'mongoose'
import type { IStatusCheck } from './types'

const StatusCheckSchema = new Schema<IStatusCheck>(
  {
    service: {
      type: String,
      enum: ['memoria', 'paperly', 'cms-portfolio', 'cms-blog'],
      required: true,
    },
    status: { type: String, enum: ['up', 'down'], required: true },
    responseTimeMs: { type: Number, required: true },
    checkedAt: { type: Date, required: true },
    errorMessage: { type: String },
  },
  { timestamps: false }
)

StatusCheckSchema.index({ service: 1, checkedAt: -1 })
StatusCheckSchema.index({ checkedAt: -1 })

export const StatusCheck = mongoose.model<IStatusCheck>('StatusCheck', StatusCheckSchema)
