import { t } from 'elysia'

export const paginationQuery = t.Object({
  page: t.Optional(t.Numeric({ minimum: 1 })),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
})

export const fileBody = t.Object({
  file_data: t.String({ minLength: 1 }),
})

export const coverBody = t.Object({
  cover_data: t.String({ minLength: 1 }),
})

export type PaginationQuery = typeof paginationQuery.static
export type FileBody = typeof fileBody.static
export type CoverBody = typeof coverBody.static
