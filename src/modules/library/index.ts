import { Elysia, t } from 'elysia'
import { LibraryService } from './service'
import { guard } from '../../libs/guard'

const objectId = t.String({ pattern: '^[0-9a-fA-F]{24}$' })

export const libraryModule = new Elysia({ prefix: '/v1/library' })
  .guard({}, (app) =>
    app
      .use(guard)
      .get('/', ({ user }) => LibraryService.getLibrary(user.sub))
      .post(
        '/:bookId',
        ({ user, params: { bookId } }) => LibraryService.addBook(user.sub, bookId),
        { params: t.Object({ bookId: objectId }) }
      )
      .delete(
        '/:bookId',
        ({ user, params: { bookId } }) => LibraryService.removeBook(user.sub, bookId),
        { params: t.Object({ bookId: objectId }) }
      )
      .patch(
        '/:bookId/favorite',
        ({ user, params: { bookId } }) => LibraryService.toggleFavorite(user.sub, bookId),
        { params: t.Object({ bookId: objectId }) }
      )
  )
