import { Highlight, type HighlightCreate } from './model'
import { ok, fail } from '../../libs/response'

export abstract class HighlightService {
  static async findAll(userId: string, bookId?: string) {
    const filter: Record<string, unknown> = { user_id: userId }
    if (bookId) filter.book_id = bookId
    const highlights = await Highlight.find(filter).sort({ createdAt: -1 }).lean()
    return ok(highlights, 'Highlights fetched')
  }

  static async create(userId: string, data: HighlightCreate) {
    const highlight = await Highlight.create({ user_id: userId, ...data })
    return ok(highlight, 'Highlight created')
  }

  static async remove(userId: string, id: string) {
    const highlight = await Highlight.findOneAndDelete({ _id: id, user_id: userId })
    if (!highlight) return fail(404, 'Highlight not found')
    return ok(null, 'Highlight deleted')
  }
}
