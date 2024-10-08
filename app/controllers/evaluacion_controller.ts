import Evaluacion from '#models/evaluacion'
import type { HttpContext } from '@adonisjs/core/http'

export default class EvaluacionController {

    async evaluar_servicio({response, request}:HttpContext){
        const {calificacion, comentario, planta, servicio} = request.body()

        const evaluacion = new Evaluacion
        evaluacion.calificacion = calificacion
        evaluacion.comentario = comentario
        evaluacion.planta = planta
        evaluacion.servicio = servicio

        await evaluacion.save()

        return response.status(200).json({
            titulo:'Exito',
            mensaje:'Evaluacion guardada con exito',
            evaluacion:evaluacion
        })
    }
}