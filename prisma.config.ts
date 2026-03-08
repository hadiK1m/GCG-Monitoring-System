import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // DIRECT_URL (port 5432) digunakan untuk CLI/migrasi
    // karena pgbouncer (port 6543) tidak support DDL statements
    url: env('DIRECT_URL'),
  },
})
