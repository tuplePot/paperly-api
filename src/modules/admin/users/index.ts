import { Elysia } from 'elysia'
import { paginationQuery, userCreate, userPatch, objectIdParam, userBookParam } from './model'
import { AdminUserService } from './service'
import { adminGuard } from '../../../libs/adminGuard'

export const adminUsersRouter = new Elysia({ prefix: '/admin/users' })
  .use(adminGuard)
  .get('/', ({ query }) => AdminUserService.findAll(query), { query: paginationQuery })
  .post('/', ({ body }) => AdminUserService.create(body), { body: userCreate })
  .get('/:id', ({ params: { id } }) => AdminUserService.findById(id), { params: objectIdParam })
  .patch('/:id', ({ params: { id }, body }) => AdminUserService.update(id, body), { params: objectIdParam, body: userPatch })
  .delete('/:id', ({ params: { id } }) => AdminUserService.remove(id), { params: objectIdParam })
  // ── User library (admin-assigned shelves) ────────────────────────────────────
  .get('/:id/library', ({ params: { id } }) => AdminUserService.getLibrary(id), { params: objectIdParam })
  .post('/:id/library/:bookId', ({ params: { id, bookId } }) => AdminUserService.assignBook(id, bookId), { params: userBookParam })
  .delete('/:id/library/:bookId', ({ params: { id, bookId } }) => AdminUserService.removeFromLibrary(id, bookId), { params: userBookParam })
