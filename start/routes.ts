//Archivo de rutas
import router from '@adonisjs/core/services/router'
import EmployeesController from '#controllers/employees_controller'

import './routes/ReporteSeguridadRoute.ts'
import './routes/UsuariosRoute.ts'
import './routes/EvaluacionRoute.ts'
import './routes/ReportesRoute.ts'
import './routes/ComunicadoRoute.ts'
import './routes/SugerenciaRoute.ts'
import './routes/EmailsRouter.js'
import './routes/InventarioRoutes.ts'

router.get('/', async () => {
    return { hello: 'your route works!' }
  })

  router.get('/employees', async (ctx) => {
    const controller = new EmployeesController()
    return await controller.index(ctx)
})





