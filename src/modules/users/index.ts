import { Elysia } from 'elysia'


//there will be get user identity, update user identity, delete user identity.
export const usersRouter = new Elysia({ prefix: '/users' })
    .get('/me', ({ }) => { })
    .patch('/:id', ({ }) => { })



