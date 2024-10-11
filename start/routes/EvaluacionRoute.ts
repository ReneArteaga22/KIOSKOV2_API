import router from '@adonisjs/core/services/router'
import EvaluacionController from '#controllers/evaluacion_controller'

router.group(()=>{
    router.get('/evaluaciones-transporte',[EvaluacionController,'evaluaciones_transporte'])
    router.get('/evaluaciones-comedor',[EvaluacionController,'evaluaciones_comedor'])
    router.post('/evaluar',[EvaluacionController,'evaluar_servicio'])
    router.post('/filtrar-comedor',[EvaluacionController,'filtrar_evaluaciones_comedor'])
    router.post('/filtrar-transporte',[EvaluacionController,'filtrar_evaluaciones_transporte'])
    router.post('/mostrar-comentario',[EvaluacionController,'mostar_comentario_id'])
}).prefix('/api/evaluacion')
