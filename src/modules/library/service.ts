import { Book } from '../books/model'
import { BookCover } from '../book-covers/model'
import { ReadingProgress } from '../progress/model'
import { UserLibrary } from './model'
import { ok, fail } from '../../libs/response'

export abstract class LibraryService {
  static async getLibrary(userId: string) {
    const entries = await UserLibrary.find({ user_id: userId })
      .populate('book_id')
      .sort({ added_at: -1 })
      .lean()

    // Ambil progres baca user untuk semua buku ini sekaligus (1 query),
    // lalu tempelkan ke tiap entry supaya client cukup 1 request.
    const bookIds = entries
      .map((e) => (e.book_id as any)?._id)
      .filter(Boolean)
    const progresses = await ReadingProgress.find({
      user_id: userId,
      book_id: { $in: bookIds },
    }).lean()
    const progressByBook = new Map(
      progresses.map((p) => [p.book_id.toString(), p])
    )

    // Cek buku mana yang punya cover (tanpa ikut menarik blob base64-nya,
    // supaya response list tetap ringan). Client cukup tahu ada/tidaknya.
    const covers = await BookCover.find({ book_id: { $in: bookIds } })
      .select('book_id')
      .lean()
    const coverSet = new Set(covers.map((c) => c.book_id.toString()))

    const data = entries.map((e) => {
      const bookId = (e.book_id as any)?._id?.toString()
      const p = bookId ? progressByBook.get(bookId) : undefined
      return {
        ...e,
        has_cover: bookId ? coverSet.has(bookId) : false,
        progress: p
          ? {
              position: p.position,
              percent: p.percent ?? 0,
              chapter_label: p.chapter_label ?? null,
              last_read_at: p.last_read_at,
            }
          : null,
      }
    })

    return ok(data, 'Library fetched')
  }

  static async addBook(userId: string, bookId: string) {
    const book = await Book.exists({ _id: bookId })
    if (!book) return fail(404, 'Book not found')

    const existing = await UserLibrary.exists({ user_id: userId, book_id: bookId })
    if (existing) return fail(409, 'Book already in library')

    const entry = await UserLibrary.create({ user_id: userId, book_id: bookId })
    return ok(entry, 'Book added to library')
  }

  static async removeBook(userId: string, bookId: string) {
    const entry = await UserLibrary.findOneAndDelete({ user_id: userId, book_id: bookId })
    if (!entry) return fail(404, 'Book not in library')
    return ok(null, 'Book removed from library')
  }

  static async toggleFavorite(userId: string, bookId: string) {
    const entry = await UserLibrary.findOne({ user_id: userId, book_id: bookId })
    if (!entry) return fail(404, 'Book not in library')

    entry.is_favorite = !entry.is_favorite
    await entry.save()
    return ok({ is_favorite: entry.is_favorite }, 'Favorite toggled')
  }
}
