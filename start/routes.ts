//Archivo de rutas
import router from '@adonisjs/core/services/router'
import './routes/UsuariosRoute.js'

router.get('/', async () => {
    return { hello: 'your route works!' }
  })




