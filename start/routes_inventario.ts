import router from '@adonisjs/core/services/router'

const AdminCatalogosController = () => import('#controllers/inv/admin_catalogos_controller')
const AdminListasController = () => import('#controllers/inv/admin_listas_controller')
const DashboardController = () => import('#controllers/inv/dashboard_controller')

const num = router.matchers.number()

router
  .group(() => {
    // ─────────── DASHBOARD PÚBLICO (solo lectura) ───────────
    router.get('/dashboard', [DashboardController, 'index'])
    router.get('/dashboard/listas/:id', [DashboardController, 'lista']).where('id', num)

    // ─────────── ADMIN (protegido por el guard de Angular) ───────────
    router
      .group(() => {
        // Áreas
        router.get('/areas', [AdminCatalogosController, 'areas'])
        router.post('/areas', [AdminCatalogosController, 'crearArea'])
        router.put('/areas/:id', [AdminCatalogosController, 'actualizarArea']).where('id', num)
        router.delete('/areas/:id', [AdminCatalogosController, 'eliminarArea']).where('id', num)

        // Equipos e integrantes
        router.get('/equipos', [AdminCatalogosController, 'equipos'])
        router.post('/equipos', [AdminCatalogosController, 'crearEquipo'])
        router.put('/equipos/:id', [AdminCatalogosController, 'actualizarEquipo']).where('id', num)
        router.delete('/equipos/:id', [AdminCatalogosController, 'eliminarEquipo']).where('id', num)
        router.post('/equipos/:equipoId/integrantes', [AdminCatalogosController, 'crearIntegrante']).where('equipoId', num)
        router.put('/integrantes/:id', [AdminCatalogosController, 'actualizarIntegrante']).where('id', num)
        router.delete('/integrantes/:id', [AdminCatalogosController, 'eliminarIntegrante']).where('id', num)

        // Localidades
        router.get('/localidades', [AdminCatalogosController, 'localidades'])
        router.post('/localidades', [AdminCatalogosController, 'crearLocalidad'])
        router.put('/localidades/:id', [AdminCatalogosController, 'actualizarLocalidad']).where('id', num)
        router.delete('/localidades/:id', [AdminCatalogosController, 'eliminarLocalidad']).where('id', num)

        // Listas: operaciones masivas
        router.post('/listas/estado-masivo', [AdminListasController, 'estadoMasivo'])
        router.post('/listas/reasignar', [AdminListasController, 'reasignar'])
        router.post('/listas/reasignar-localidad', [AdminListasController, 'reasignarLocalidad'])
        router.post('/listas/reasignar-equipo', [AdminListasController, 'reasignarEquipo'])

        // Listas: CRUD y por lista
        router.get('/listas', [AdminListasController, 'index'])
        router.post('/listas', [AdminListasController, 'store'])
        router.get('/listas/:id', [AdminListasController, 'show']).where('id', num)
        router.put('/listas/:id', [AdminListasController, 'update']).where('id', num)
        router.delete('/listas/:id', [AdminListasController, 'destroy']).where('id', num)
        router.put('/listas/:id/localidades', [AdminListasController, 'localidades']).where('id', num)
        router.post('/listas/:id/avanzar', [AdminListasController, 'avanzar']).where('id', num)
        router.post('/listas/:id/estado', [AdminListasController, 'cambiarEstado']).where('id', num)
        router.patch('/listas/:id/ajuste', [AdminListasController, 'ajuste']).where('id', num)
      })
      .prefix('/admin')
  })
  .prefix('/api/inv')
