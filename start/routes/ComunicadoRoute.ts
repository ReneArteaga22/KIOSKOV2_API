import router from '@adonisjs/core/services/router'
import ComunicadosController from '#controllers/comunicados_controller'

router.group(()=>{
    router.get('/comunicados',[ComunicadosController,'comunicados'])
    router.delete('/eliminar_comunicado/:id',[ComunicadosController,'eliminar_comunicado'])
}).prefix('/api/comunicado')