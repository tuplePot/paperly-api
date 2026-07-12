import { ReadingProgress, type ProgressBody } from './model'
import { ok, fail } from '../../libs/response'

export abstract class ProgressService {
  static async get(userId: string, bookId: string) {
    const progress = await ReadingProgress.findOne({ user_id: userId, book_id: bookId }).lean()
    if (!progress) return fail(404, 'No reading progress for this book')
    return ok(progress, 'Progress fetched')
  }

  static async upsert(userId: string, bookId: string, data: ProgressBody) {
    const update: Record<string, unknown> = {
      position: data.position,
      last_read_at: new Date(),
    }
    if (data.percent !== undefined) update.percent = data.percent
    if (data.chapter_label !== undefined) update.chapter_label = data.chapter_label

    const progress = await ReadingProgress.findOneAndUpdate(
      { user_id: userId, book_id: bookId },
      update,
      { upsert: true, new: true }
    ).lean()
    return ok(progress, 'Progress saved')
  }
}
