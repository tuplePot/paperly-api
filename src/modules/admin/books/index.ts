import { Elysia } from 'elysia'
import { bookCreate, bookUpdate, objectIdParam } from '../../books/model'
import { paginationQuery, fileBody, coverBody } from './model'
import { AdminBookService } from './service'
import { adminGuard } from '../../../libs/adminGuard'

export const adminBooksRouter = new Elysia({ prefix: '/admin/books' })
  .use(adminGuard)
  // ── Book CRUD ────────────────────────────────────────────────────────────────
  .get('/', ({ query }) => AdminBookService.findAll(query), { query: paginationQuery })
  .post('/', ({ body }) => AdminBookService.create(body), { body: bookCreate })
  .get('/:id', ({ params: { id } }) => AdminBookService.findById(id), { params: objectIdParam })
  .put('/:id', ({ params: { id }, body }) => AdminBookService.update(id, body), { params: objectIdParam, body: bookUpdate })
  .delete('/:id', ({ params: { id } }) => AdminBookService.remove(id), { params: objectIdParam })
  // ── File ─────────────────────────────────────────────────────────────────────
  .get('/:id/file', ({ params: { id } }) => AdminBookService.getFile(id), { params: objectIdParam })
  .put('/:id/file', ({ params: { id }, body }) => AdminBookService.upsertFile(id, body), { params: objectIdParam, body: fileBody })
  .delete('/:id/file', ({ params: { id } }) => AdminBookService.removeFile(id), { params: objectIdParam })
  // ── Cover ────────────────────────────────────────────────────────────────────
  .get('/:id/cover', ({ params: { id } }) => AdminBookService.getCover(id), { params: objectIdParam })
  .put('/:id/cover', ({ params: { id }, body }) => AdminBookService.upsertCover(id, body), { params: objectIdParam, body: coverBody })
  .delete('/:id/cover', ({ params: { id } }) => AdminBookService.removeCover(id), { params: objectIdParam })
