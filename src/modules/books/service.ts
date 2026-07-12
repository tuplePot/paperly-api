import { Book, type BookQuery } from './model'
import { BookFile } from '../book-files/model'
import { BookCover } from '../book-covers/model'
import { UserLibrary } from '../library/model'
import { ok, fail } from '../../libs/response'

export abstract class BookService {
  static async findAll(query: BookQuery) {
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const filter: Record<string, unknown> = {}

    if (query.search) filter.$text = { $search: query.search }
    if (query.format) filter.format = query.format

    const [books, total] = await Promise.all([
      Book.find(filter).skip((page - 1) * limit).limit(limit).lean(),
      Book.countDocuments(filter),
    ])

    return ok({ books, total, page, limit }, 'Books fetched')
  }

  static async findById(id: string) {
    const book = await Book.findById(id).lean()
    if (!book) return fail(404, 'Book not found')
    return ok(book, 'Book fetched')
  }

  static async getCover(bookId: string) {
    const cover = await BookCover.findOne({ book_id: bookId }).lean()
    if (!cover) return fail(404, 'Cover not found')
    return ok(cover, 'Cover fetched')
  }

  static async getFile(bookId: string, userId: string) {
    const inLibrary = await UserLibrary.exists({ user_id: userId, book_id: bookId })
    if (!inLibrary) return fail(403, 'Book not in your library. Add it to your library first.')

    const file = await BookFile.findOne({ book_id: bookId }).lean()
    if (!file) return fail(404, 'Book file not found')
    return ok(file, 'Book file fetched')
  }
}
