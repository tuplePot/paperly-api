import { Elysia, t } from 'elysia'
import { bookmarkCreate } from './model'
import { BookmarkService } from './service'
import { guard } from '../../libs/guard'

const objectId = t.String({ pattern: '^[0-9a-fA-F]{24}$' })

export const bookmarksModule = new Elysia({ prefix: '/v1/bookmarks' })
  .guard({}, (app) =>
    app
      .use(guard)
      .get(
        '/',
        ({ user, query }) => BookmarkService.findAll(user.sub, query.bookId),
        { query: t.Object({ bookId: t.Optional(objectId) }) }
      )
      .post('/', ({ user, body }) => BookmarkService.create(user.sub, body), { body: bookmarkCreate })
      .delete(
        '/:id',
        ({ user, params: { id } }) => BookmarkService.remove(user.sub, id),
        { params: t.Object({ id: objectId }) }
      )
  )
