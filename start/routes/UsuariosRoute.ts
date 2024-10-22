import UsuariosController from '#controllers/usuarios_controller'
import router from '@adonisjs/core/services/router'
import EmployeesController from '#controllers/employees_controller'

router.group(()=>{
    router.get('/index',[UsuariosController,'index'])
    router.post('/mail',[UsuariosController,'store'])
    router.get('/employees',async (ctx) => {
        const controller = new EmployeesController()
        return await controller.index(ctx)
    })

    router.put('/editar-usuario',[UsuariosController,'editar_usuario'])
    router.put('/recuperar-contrasena',[UsuariosController,'recuperar_contrasena'])

    router.post('/login',[UsuariosController,'login'])
    router.post('/register',[UsuariosController,'register'])
    router.post('/buscar-usuario',[UsuariosController,'buscar_usuario'])
    router.post('/usuario-id',[UsuariosController,'usuario_x_id'])
    
}).prefix('/api/usuarios')



