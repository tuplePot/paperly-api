import { Elysia } from 'elysia'
import { jwt as jwtPlugin } from '@elysiajs/jwt'
import { registerBody, loginBody, updateMeBody } from './model'
import { AuthService } from './service'
import { fail } from '../../libs/response'
import { guard } from '../../libs/guard'

const jwtConfig = jwtPlugin({ name: 'jwt', secret: process.env.JWT_SECRET!, exp: '7d' })

export const authModule = new Elysia({ prefix: '/v1/auth' })
  .use(jwtConfig)
  .post('/register', ({ body }) => AuthService.register(body), { body: registerBody })
  .post(
    '/login',
    async ({ body, jwt }) => {
      const user = await AuthService.validateCredentials(body)
      if (!user) return fail(401, 'Invalid email or password')
      const token = await jwt.sign({ sub: user.id, email: user.email, role: user.role })
      return { success: true as const, message: 'Login successful', data: { token } }
    },
    { body: loginBody }
  )

export const meModule = new Elysia({ prefix: '/v1/me' })
  .guard({}, (app) =>
    app
      .use(guard)
      .get('/', ({ user }) => AuthService.getMe(user.sub))
      .patch('/', ({ user, body }) => AuthService.updateMe(user.sub, body), { body: updateMeBody })
  )
