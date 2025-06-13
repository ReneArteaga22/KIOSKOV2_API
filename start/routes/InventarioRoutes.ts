import router from '@adonisjs/core/services/router'
import AvancesController from '#controllers/avances_controller'

router.group(() => {
  router.post('/registrar', [AvancesController, 'registrar'])           
  router.get('/ver', [AvancesController, 'verTodos'])             
  router.post('/equipo', [AvancesController, 'verPorEquipo'])  
}).prefix('/api/avances')
