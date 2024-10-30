import router from '@adonisjs/core/services/router'
import ComunicadosController from '#controllers/comunicados_controller'

router.group(()=>{
    router.get('/comunicados',[ComunicadosController,'comunicados'])
}).prefix('/api/comunicado')