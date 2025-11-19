import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,0
  origin: ['http://kiosko.clayens.com:8080', 'http://localhost:8080', 'http://10.38.12.4:8080'],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  exposeHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 90,
})


export default corsConfig
