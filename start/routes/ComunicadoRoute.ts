import router from '@adonisjs/core/services/router'
import ComunicadosController from '#controllers/comunicados_controller'

router.group(()=>{
    router.get('/menu_comunicado',[ComunicadosController,'comunicados_menu'])
    router.get('/comunicados',[ComunicadosController,'comunicados'])
    router.post('/agregar_comunicado',[ComunicadosController,'agregar_comunicado'])
    router.delete('/eliminar_comunicado/:id',[ComunicadosController,'eliminar_comunicado'])
    
}).prefix('/api/comunicado')