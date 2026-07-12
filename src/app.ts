import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { helmet } from 'elysia-helmet'
import { connectDB, mongoosePlugin } from './libs/mongoose'
import { log } from './libs/logger'
import { docsModule } from './modules/docs'

// v1 — user-facing (Paperly mobile app)
import { authModule, meModule } from './modules/auth'
import { booksModule } from './modules/books'
import { libraryModule } from './modules/library'
import { progressModule } from './modules/progress'
import { bookmarksModule } from './modules/bookmarks'
import { highlightsModule } from './modules/highlights'

// admin — Vault Josh (CMS web app)
import { adminBooksRouter } from './modules/admin/books'
import { adminUsersRouter } from './modules/admin/users'

const isProd = process.env.NODE_ENV === 'production'

const app = new Elysia()
  .use(helmet())
  .use(cors({
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  }))
  .use(log.into())
  .onBeforeHandle(connectDB)
  .use(mongoosePlugin)
  .use(isProd ? new Elysia() : docsModule)
  .get('/', ({ set }) => { set.status = 404; return null })
  .group('/api', (app) =>
    app
      // ── Admin (Vault Josh) — x-api-key required ─────────────────── /api/admin/*
      .use(adminBooksRouter)   // /api/admin/books
      .use(adminUsersRouter)   // /api/admin/users
      
      // ── User-facing (Paperly) — JWT required ─────────────────────── /api/v1/*
      .use(authModule)         // /api/v1/auth
      .use(meModule)           // /api/v1/me
      .use(booksModule)        // /api/v1/books
      .use(libraryModule)      // /api/v1/library
      .use(progressModule)     // /api/v1/progress
      .use(bookmarksModule)    // /api/v1/bookmarks
      .use(highlightsModule)   // /api/v1/highlights
  )

export default app
