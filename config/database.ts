import env from '#start/env'

import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'mysql', // Define la conexión predeterminada. Puede ser 'mysql' o 'sqlServer'
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
    sqlserver: {
      client: 'mssql',
      connection: {
        server: env.get('SQLSERVER_HOST') as string, // Asegúrate de que sea una cadena
        port: Number(env.get('SQLSERVER_PORT')), // Convertir a número
        user: env.get('SQLSERVER_USER') as string, // Asegúrate de que sea una cadena
        password: env.get('SQLSERVER_PASSWORD') as string, // Asegúrate de que sea una cadena
        database: env.get('SQLSERVER_DB_NAME') as string, // Asegúrate de que sea una cadena
        options: {
          encrypt: false, // Establecer en true si la conexión requiere encriptación (Azure, por ejemplo)
          trustServerCertificate: true,
        },
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'], // Puedes cambiarlo si tienes rutas específicas para SQL Server
      },
    },
  },
})

export default dbConfig
