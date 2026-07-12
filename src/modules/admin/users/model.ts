import { t } from 'elysia'

export const paginationQuery = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
})

export const userCreate = t.Object({
  email: t.String({ format: 'email', maxLength: 254 }),
  password: t.String({ minLength: 8, maxLength: 128 }),
  display_name: t.String({ minLength: 1, maxLength: 100 }),
  role: t.Optional(t.Union([t.Literal('user'), t.Literal('admin')])),
  is_suspended: t.Optional(t.Boolean()),
})

export const userPatch = t.Partial(t.Object({
  display_name: t.String({ minLength: 1, maxLength: 100 }),
  role: t.Union([t.Literal('user'), t.Literal('admin')]),
  is_suspended: t.Boolean(),
}))

const objectId = t.String({ pattern: '^[0-9a-fA-F]{24}$' })

export const objectIdParam = t.Object({
  id: objectId,
})

/** User id + book id, for managing a user's library. */
export const userBookParam = t.Object({
  id: objectId,
  bookId: objectId,
})

export type PaginationQuery = typeof paginationQuery.static
export type UserCreate = typeof userCreate.static
export type UserPatch = typeof userPatch.static
