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

    async evaluaciones_comedor({response}:HttpContext){
        const evaluacionComedor = await Evaluacion.query()
        .where('servicio','comedor')

        return response.status(200).json({
            tiutlo:'Exito',
            mensaje:'Evaluaciones de comedor',
            evaluaciones:evaluacionComedor
        })
    }

    async evaluaciones_transporte({response}:HttpContext){
        const evaluacionTransporte = await Evaluacion.query()
        .where('servicio','transporte')

        return response.status(200).json({
            titulo:'Exito',
            mensaje:'Evaluaciones de transporte',
            evaluaciones:evaluacionTransporte
        })
    }

    
    async filtrar_evaluaciones_comedor({ response, request }: HttpContext) {
        const { calificacion, planta } = request.body()

        let query = Evaluacion.query()

        if (calificacion) {
            query = query.where('calificacion', 'like', `%${calificacion}%`)
            query = query.andWhere('servicio','comedor')
        }
    
        if (planta) {
            query = query.where('planta', planta)
            query = query.andWhere('servicio','comedor')
        }

       const filtro = await query

        return response.status(200).json({
            titulo:'smn',
            filtro:filtro
        })
    }
    
}