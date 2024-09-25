import router from '@adonisjs/core/services/router'

router.get('/index','UsuariosController.index')
router.post('/register','UsuariosController.register')

// router.group(()=>{
//     router.get('/index','UsuariosController.index')
//     router.post('/register','UsuariosController.register')
// }).prefix('/api/usuarios')

