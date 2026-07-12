import { Elysia, t } from 'elysia'
import { progressBody } from './model'
import { ProgressService } from './service'
import { guard } from '../../libs/guard'

const objectId = t.String({ pattern: '^[0-9a-fA-F]{24}$' })

export const progressModule = new Elysia({ prefix: '/v1/progress' })
  .guard({}, (app) =>
    app
      .use(guard)
      .get(
        '/:bookId',
        ({ user, params: { bookId } }) => ProgressService.get(user.sub, bookId),
        { params: t.Object({ bookId: objectId }) }
      )
      .put(
        '/:bookId',
        ({ user, params: { bookId }, body }) => ProgressService.upsert(user.sub, bookId, body),
        { params: t.Object({ bookId: objectId }), body: progressBody }
      )
  )
