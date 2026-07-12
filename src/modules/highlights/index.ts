import { Elysia, t } from 'elysia'
import { highlightCreate } from './model'
import { HighlightService } from './service'
import { guard } from '../../libs/guard'

const objectId = t.String({ pattern: '^[0-9a-fA-F]{24}$' })

export const highlightsModule = new Elysia({ prefix: '/v1/highlights' })
  .guard({}, (app) =>
    app
      .use(guard)
      .get(
        '/',
        ({ user, query }) => HighlightService.findAll(user.sub, query.bookId),
        { query: t.Object({ bookId: t.Optional(objectId) }) }
      )
      .post('/', ({ user, body }) => HighlightService.create(user.sub, body), { body: highlightCreate })
      .delete(
        '/:id',
        ({ user, params: { id } }) => HighlightService.remove(user.sub, id),
        { params: t.Object({ id: objectId }) }
      )
  )
