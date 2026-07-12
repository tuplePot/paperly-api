import { Book, type BookCreate, type BookUpdate } from '../../books/model'
import { BookFile } from '../../book-files/model'
import { BookCover } from '../../book-covers/model'
import { ok, fail } from '../../../libs/response'
import type { PaginationQuery, FileBody, CoverBody } from './model'

export abstract class AdminBookService {
  static async findAll({ page = 1, limit = 20 }: PaginationQuery) {
    const [books, total] = await Promise.all([
      Book.find().skip((page - 1) * limit).limit(limit).lean(),
      Book.countDocuments(),
    ])
    return ok({ books, total, page, limit }, 'Books fetched')
  }

  static async findById(id: string) {
    const book = await Book.findById(id).lean()
    if (!book) return fail(404, 'Book not found')
    return ok(book, 'Book fetched')
  }

  static async create(data: BookCreate) {
    const { file_data, cover_data, ...bookFields } = data
    const book = await Book.create(bookFields)
    if (file_data) await BookFile.create({ book_id: book._id, file_data })
    if (cover_data) await BookCover.create({ book_id: book._id, cover_data })
    return ok(book, 'Book created')
  }

  static async update(id: string, data: BookUpdate) {
    const book = await Book.findByIdAndUpdate(id, data, { new: true }).lean()
    if (!book) return fail(404, 'Book not found')
    return ok(book, 'Book updated')
  }

  static async remove(id: string) {
    const book = await Book.findByIdAndDelete(id)
    if (!book) return fail(404, 'Book not found')
    await Promise.all([
      BookFile.deleteOne({ book_id: id }),
      BookCover.deleteOne({ book_id: id }),
    ])
    return ok(null, 'Book deleted')
  }

  // ── File ────────────────────────────────────────────────────────────────────

  static async getFile(bookId: string) {
    const file = await BookFile.findOne({ book_id: bookId }).lean()
    if (!file) return fail(404, 'File not found')
    return ok(file, 'File fetched')
  }

  static async upsertFile(bookId: string, data: FileBody) {
    const file = await BookFile.findOneAndUpdate(
      { book_id: bookId },
      { file_data: data.file_data },
      { upsert: true, new: true }
    ).lean()
    return ok(file, 'File updated')
  }

  static async removeFile(bookId: string) {
    const file = await BookFile.findOneAndDelete({ book_id: bookId })
    if (!file) return fail(404, 'File not found')
    return ok(null, 'File deleted')
  }

  // ── Cover ───────────────────────────────────────────────────────────────────

  static async getCover(bookId: string) {
    const cover = await BookCover.findOne({ book_id: bookId }).lean()
    if (!cover) return fail(404, 'Cover not found')
    return ok(cover, 'Cover fetched')
  }

  static async upsertCover(bookId: string, data: CoverBody) {
    const cover = await BookCover.findOneAndUpdate(
      { book_id: bookId },
      { cover_data: data.cover_data },
      { upsert: true, new: true }
    ).lean()
    return ok(cover, 'Cover updated')
  }

  static async removeCover(bookId: string) {
    const cover = await BookCover.findOneAndDelete({ book_id: bookId })
    if (!cover) return fail(404, 'Cover not found')
    return ok(null, 'Cover deleted')
  }
}
