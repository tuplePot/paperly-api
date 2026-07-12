import { Elysia } from 'elysia'
import { objectIdParam, bookQuery } from './model'
import { BookService } from './service'
import { BookCover } from '../book-covers/model'
import { guard } from '../../libs/guard'

export const booksModule = new Elysia({ prefix: '/v1/books' })
  // Public
  .get('/', ({ query }) => BookService.findAll(query), { query: bookQuery })
  .get('/:id', ({ params: { id } }) => BookService.findById(id), { params: objectIdParam })
  // Metadata cover (base64 dalam JSON) — dipakai admin/CMS.
  .get('/:id/cover', ({ params: { id } }) => BookService.getCover(id), { params: objectIdParam })
  // Gambar cover MENTAH (bytes) — dipakai app mobile buat thumbnail
  // (bisa di-cache Image.network/CachedNetworkImage). Public, tanpa JWT.
  .get(
    '/:id/cover/image',
    async ({ params: { id }, set }) => {
      const cover = await BookCover.findOne({ book_id: id }).lean()
      if (!cover) {
        set.status = 404
        return 'Cover not found'
      }
      // Toleran ke prefix data URI (data:image/png;base64,....).
      const raw = cover.cover_data
      const comma = raw.indexOf(',')
      const b64 = raw.startsWith('data:') && comma !== -1 ? raw.slice(comma + 1) : raw
      const buf = Buffer.from(b64, 'base64')
      // Deteksi tipe dari magic bytes (PNG vs JPEG), default png.
      const isJpeg = buf[0] === 0xff && buf[1] === 0xd8
      set.headers['content-type'] = isJpeg ? 'image/jpeg' : 'image/png'
      set.headers['cache-control'] = 'public, max-age=86400'
      return buf
    },
    { params: objectIdParam }
  )
  // Requires library membership
  .guard({}, (app) =>
    app
      .use(guard)
      .get(
        '/:id/file',
        ({ params: { id }, user }) => BookService.getFile(id, user.sub),
        { params: objectIdParam }
      )
  )
