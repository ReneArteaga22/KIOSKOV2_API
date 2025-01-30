import UsuariosController from '#controllers/usuarios_controller'
import router from '@adonisjs/core/services/router'
import EmployeesController from '#controllers/employees_controller'

router.group(()=>{
    router.get('/index',[UsuariosController,'index'])
    router.get('/employees',[EmployeesController,'index'])


    router.put('/modificar_estado/:id',[UsuariosController,'modificar_estado'])
    router.put('/editar-usuario/:id',[UsuariosController,'editar_usuario'])
    router.put('/recuperar-contrasena',[UsuariosController,'recuperar_contrasena'])

    router.post('/login',[UsuariosController,'login'])
    router.post('/register',[UsuariosController,'register'])
    router.post('/buscar-usuario',[UsuariosController,'buscar_usuario'])
    router.post('/usuario-id',[UsuariosController,'usuario_x_id'])
    
}).prefix('/api/usuarios')



