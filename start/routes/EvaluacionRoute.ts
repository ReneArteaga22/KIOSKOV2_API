import router from '@adonisjs/core/services/router'
import EvaluacionController from '#controllers/evaluacion_controller'

router.group(()=>{
    router.get('/evaluaciones-transporte',[EvaluacionController,'evaluaciones_transporte'])
    router.get('/evaluaciones-comedor',[EvaluacionController,'evaluaciones_comedor'])
    router.post('/evaluar',[EvaluacionController,'evaluar_servicio'])
    router.post('/filtrar',[EvaluacionController,'filtrar_evaluaciones_comedor'])
}).prefix('/api/evaluacion')
