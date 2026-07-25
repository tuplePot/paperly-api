import type { Types } from 'mongoose'

export type ServiceId = 'memoria' | 'paperly' | 'cms-portfolio' | 'cms-blog'

export interface IStatusCheck {
  service: ServiceId
  status: 'up' | 'down'
  responseTimeMs: number
  checkedAt: Date
  errorMessage?: string
}

export interface CheckResult {
  service: ServiceId
  status: 'up' | 'down'
  responseTimeMs: number
  checkedAt: Date
  errorMessage?: string
  _id?: Types.ObjectId
}
