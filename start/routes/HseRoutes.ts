import router from '@adonisjs/core/services/router'
import AmonestacionesController from '#controllers/amonestaciones_controller'

// El prefijo ya incluye '/api/amonestaciones'
router.group(() => {
  
  // 1. Rutas específicas (quedan limpias)
  router.get('/kpis',    [AmonestacionesController, 'kpis'])
  router.get('/resumen', [AmonestacionesController, 'resumen'])
  router.get('/export',  [AmonestacionesController, 'exportJSON'])
  router.get('/years',   [AmonestacionesController, 'years'])

  // 2. Rutas principales (CRUD)
  router.get('/',        [AmonestacionesController, 'index'])   // <-- Esta es la que te daba el 404
  router.post('/',       [AmonestacionesController, 'store'])
  router.put('/:id',     [AmonestacionesController, 'update'])
  router.delete('/:id',  [AmonestacionesController, 'destroy'])

}).prefix('/api/amonestaciones')