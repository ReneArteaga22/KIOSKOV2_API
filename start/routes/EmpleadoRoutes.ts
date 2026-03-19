import router from '@adonisjs/core/services/router'

const EmpleadosController = () => import('#controllers/empleados_controller')

router.group(() => {

  // GET /api/empleados?q=102        → autocomplete
  // GET /api/empleados?q=Juan       → autocomplete por nombre
  router.get('/empleados',          [EmpleadosController, 'index'])

  // GET /api/empleados/10234        → autofill de un empleado exacto
  router.get('/empleados/:numero',  [EmpleadosController, 'show'])

}).prefix('/api')