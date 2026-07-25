import { Elysia } from 'elysia'
import { adminGuard } from '../../libs/adminGuard'
import { ok } from '../../libs/response'
import { checkAllServices, getStatusSummary } from './service'

export const monitoringModule = new Elysia({ prefix: '/monitoring' })
  .use(adminGuard)
  .get('/check-status', async () => {
    const results = await checkAllServices()
    return ok(results, 'Status checks completed')
  })
  .get('/status-summary', async () => {
    const data = await getStatusSummary()
    return ok(data, 'Status summary fetched')
  })
