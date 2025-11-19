import router from '@adonisjs/core/services/router'
import AvancesController from '#controllers/avances_controller'

// Importar controllers
const DashboardInventariosController = () => import('#controllers/dashboard_inventarios_controller')
const LocalidadesController = () => import('#controllers/localidades_controller')

router.group(() => {
  
  // --- Rutas del Dashboard (Para mostrar datos) ---
  // Este grupo se encarga de leer y formatear los datos 
  // que consumirá tu dashboard de Angular.
  router.group(() => {
    
    /**
     * [GET] /api/dashboard/inventario
     * RUTA PRINCIPAL DEL DASHBOARD.
     * Obtiene la lista completa de equipos ('avances') con sus localidades,
     * miembros, y el avance promedio de cada uno.
     * También incluye las estadísticas globales ('estadisticas') 
     * con el promedio general de todos los equipos.
     */
    router.get('/', [DashboardInventariosController, 'index'])

    /**
     * [GET] /api/dashboard/inventario/estadisticas
     * Obtiene únicamente las estadísticas globales del inventario
     * (Total de dinero, conteo por estatus, etc.).
     */
    router.get('/estadisticas', [DashboardInventariosController, 'estadisticas'])

    /**
     * [GET] /api/dashboard/inventario/:id
     * Obtiene los datos detallados de UN solo equipo, incluyendo
     * sus localidades y su avance promedio.
     */
    router.get('/:id', [DashboardInventariosController, 'show'])

  }).prefix('dashboard/inventario')


  // --- Rutas de Localidades (Para gestionar datos) ---
  // Este grupo se encarga del CRUD (Crear, Leer, Actualizar, Borrar)
  // de las localidades individuales. Tu app móvil o de captura usará estas rutas.
  router.group(() => {

    // --- RUTAS CRUD BÁSICAS ---

    /**
     * [GET] /api/localidades
     * Obtiene una lista de TODAS las localidades registradas,
     * incluyendo a qué usuario (equipo) pertenecen.
     */
    router.get('/', [LocalidadesController, 'index'])

    /**
     * [POST] /api/localidades
     * Crea una NUEVA localidad en la base de datos.
     * Espera en el body: { userId, localidadNombre, dineroTotal, ... }
     */
    router.post('/', [LocalidadesController, 'store'])

    /**
     * [GET] /api/localidades/:id
     * Obtiene la información detallada de UNA localidad específica
     * por su ID.
     */
    router.get('/:id', [LocalidadesController, 'show'])

    /**
     * [PUT] /api/localidades/:id
     * Actualiza TODOS los campos de una localidad.
     * (Sobrescribe toda la información).
     */
    router.put('/:id', [LocalidadesController, 'update'])

    /**
     * [DELETE] /api/localidades/:id
     * Elimina una localidad de la base de datos usando su ID.
     */
    router.delete('/:id', [LocalidadesController, 'destroy'])

    
    // --- RUTAS DE ACTUALIZACIÓN PARCIAL (PATCH) ---
    // Estas son más específicas y útiles para la app de conteo.

    /**
     * [PATCH] /api/localidades/:id/estatus
     * Actualiza el estatus y/o el dinero de una localidad.
     * Es la ruta ideal para "Guardar Conteo".
     * Espera: { estatus?, dineroEncontrado?, dineroAjuste? }
     */
    router.patch('/:id/estatus', [LocalidadesController, 'updateEstatus'])

    /**
     * [PATCH] /api/localidades/:id/cambiar-estatus
     * Actualiza ÚNICAMENTE el estatus de una localidad
     * (Ej. "Pasar a Validación").
     * Espera: { estatus: "VALIDACION" }
     */
    router.patch('/:id/cambiar-estatus', [LocalidadesController, 'cambiarEstatus'])

    /**
     * [PATCH] /api/localidades/:id/quick-update
     * Actualiza ÚNICAMENTE los montos de dinero, sin
     * cambiar el estatus.
     * Espera: { dineroEncontrado?, dineroAjuste? }
     */
    router.patch('/:id/quick-update', [LocalidadesController, 'quickUpdate'])


    // --- RUTAS DE FILTRO Y BÚSQUEDA ---

    /**
     * [GET] /api/localidades/equipo/:userId
     * Obtiene todas las localidades que pertenecen a UN
     * equipo (usuario) específico.
     */
    router.get('/equipo/:userId', [LocalidadesController, 'porEquipo'])

    /**
     * [GET] /api/localidades/estatus/:estatus
     * Obtiene todas las localidades que se encuentren
     * en un estatus específico (CONTEO, CAPTURA, etc.).
     */
    router.get('/estatus/:estatus', [LocalidadesController, 'porEstatus'])

  }).prefix('localidades')

}).prefix('api')

