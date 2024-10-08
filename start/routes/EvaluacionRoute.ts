import router from '@adonisjs/core/services/router'
import EvaluacionController from '#controllers/evaluacion_controller'

router.group(()=>{
    router.post('/evaluar',[EvaluacionController,'evaluar_servicio'])

}).prefix('/api/evaluacion')
