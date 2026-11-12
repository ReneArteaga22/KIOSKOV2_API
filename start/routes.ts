//Archivo de rutas
import router from '@adonisjs/core/services/router'
import EmployeesController from '#controllers/employees_controller'

import './routes/ReporteSeguridadRoute.js'
import './routes/UsuariosRoute.js'
import './routes/EvaluacionRoute.js'
import './routes/ReportesRoute.js'
import './routes/ComunicadoRoute.js'
import './routes/SugerenciaRoute.js'
import './routes/EmailsRouter.js'
import './routes/InventarioRoutes.js'
import './routes/HseRoutes.js'
import './routes/EmpleadoRoutes.js'
import './routes_inventario.js'          // ← nuevo: inventario (panel admin)

router.get('/', async () => {
    return { hello: 'your route works!' }
  })

  router.get('/employees', async (ctx) => {
    const controller = new EmployeesController()
    return await controller.index(ctx)
})