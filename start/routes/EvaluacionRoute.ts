import router from '@adonisjs/core/services/router'
import EvaluacionController from '#controllers/evaluacion_controller'

router.group(()=>{
    router.get('/evaluaciones-limpieza',[EvaluacionController,'evaluaciones_limpieza'])
    router.get('/evaluaciones-transporte',[EvaluacionController,'evaluaciones_transporte'])
    router.get('/evaluaciones-comedor',[EvaluacionController,'evaluaciones_comedor'])
    router.get('/evaluaciones-enfermeria',[EvaluacionController,'evaluaciones_enfermeria'])
    router.post('/evaluar',[EvaluacionController,'evaluar_servicio'])
    router.post('/filtrar-comedor',[EvaluacionController,'filtrar_evaluaciones_comedor'])
    router.post('/filtrar-transporte',[EvaluacionController,'filtrar_evaluaciones_transporte'])
    router.post('/filtrar-limpieza',[EvaluacionController,'filtrar_evaluaciones_limpieza'])
    router.post('/filtrar-enfermeria',[EvaluacionController,'filtrar_evaluaciones_enfermeria'])
    router.post('/mostrar-comentario',[EvaluacionController,'mostar_comentario_id'])
}).prefix('/api/evaluacion')
