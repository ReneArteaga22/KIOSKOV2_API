import UsuariosController from '#controllers/usuarios_controller'
import router from '@adonisjs/core/services/router'

router.group(()=>{
    router.get('/usuarios',[UsuariosController,'index'])
    router.post('/login',[UsuariosController,'login'])
    router.post('/register',[UsuariosController,'register'])
    router.put('/recuperar-contrasena',[UsuariosController,'recuperar_contrasena'])
}).prefix('/api/usuarios')



