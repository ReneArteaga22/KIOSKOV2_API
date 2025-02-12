import Evaluacion from '#models/evaluacion'
import type { HttpContext } from '@adonisjs/core/http'

export default class EvaluacionController {

    async evaluar_servicio({ response, request }: HttpContext) {
        try {
            const { calificacion, comentario, planta, servicio } = request.body()

            const evaluacion = new Evaluacion
            evaluacion.calificacion = calificacion
            evaluacion.comentario = comentario
            evaluacion.planta = planta
            evaluacion.servicio = servicio

            await evaluacion.save()

            return response.status(200).json({
                titulo: 'Exito',
                mensaje: 'Evaluacion guardada con exito',
                evaluacion: evaluacion
            })
        } catch (error) {
            return response.status(400).json({
                titulo: 'Error',
                error: error.message
            })
        }
    }

    async evaluaciones_comedor({ response }: HttpContext) {
        const evaluacionComedor = await Evaluacion.query()
            .where('servicio', 'comedor')
            .orderBy('createdAt', 'desc')

        return response.status(200).json({
            tiutlo: 'Exito',
            mensaje: 'Evaluaciones de comedor',
            evaluaciones: evaluacionComedor
        })
    }

    async evaluaciones_limpieza({ response }: HttpContext) {
        const evaluacionLimpieza = await Evaluacion.query()
            .where('servicio', 'limpieza')
            .orderBy('createdAt', 'desc')

        return response.status(200).json({
            tiutlo: 'Exito',
            mensaje: 'Evaluaciones de limpieza',
            evaluaciones: evaluacionLimpieza
        })
    }


    async evaluaciones_transporte({ response }: HttpContext) {
        const evaluacionTransporte = await Evaluacion.query()
            .where('servicio', 'transporte')
            .orderBy('createdAt', 'desc')

        return response.status(200).json({
            titulo: 'Exito',
            mensaje: 'Evaluaciones de transporte',
            evaluaciones: evaluacionTransporte
        })
    }

    async evaluaciones_enfermeria({ response }: HttpContext) {
        const evaluacionEnfermeria = await Evaluacion.query()
            .where('servicio', 'enfermeria')
            .orderBy('createdAt', 'desc')

        return response.status(200).json({
            titulo: 'Exito',
            mensaje: 'Evaluaciones de enfermeria',
            evaluaciones: evaluacionEnfermeria
        })
    }

    async filtrar_evaluaciones_limpieza({ response, request }: HttpContext) {
        const { calificacion, planta, fechas } = request.body();
        console.log('Datos recibidos:', { calificacion, planta, fechas }); // Verifica los datos recibidos
    
        let query = Evaluacion.query().where('servicio', 'limpieza').orderBy('createdAt', 'desc');
    
        if (calificacion) {
            query = query.where('calificacion', calificacion);
        }
    
        if (planta) {
            query = query.where('planta', 'like', `%${planta}%`);
        }
    
        if (fechas && fechas.length === 2) {
            const [startDate, endDate] = fechas;
            const endDateAdjusted = new Date(endDate);
            endDateAdjusted.setHours(23, 59, 59, 999); 
            console.log('Filtrando por fechas:', { startDate, endDateAdjusted }); 
            query = query.whereBetween('createdAt', [startDate, endDateAdjusted]);
        }
    
        const filtro = await query;
        console.log('Resultados filtrados:', filtro); 
    
        return response.status(200).json({
            filtro: filtro
        });
    }

    async filtrar_evaluaciones_comedor({ response, request }: HttpContext) {
        const { calificacion, planta, fechas } = request.body();
        // console.log('Datos recibidos:', { calificacion, planta, fechas }); // Verifica los datos recibidos
    
        let query = Evaluacion.query().where('servicio', 'comedor').orderBy('createdAt', 'desc');
    
        if (calificacion) {
            query = query.where('calificacion', calificacion);
        }
    
        if (planta) {
            query = query.where('planta', 'like', `%${planta}%`);
        }
    
        if (fechas && fechas.length === 2) {
            const [startDate, endDate] = fechas;
            const endDateAdjusted = new Date(endDate);
            endDateAdjusted.setHours(23, 59, 59, 999); 
            // console.log('Filtrando por fechas:', { startDate, endDateAdjusted }); 
            query = query.whereBetween('createdAt', [startDate, endDateAdjusted]);
        }
    
        const filtro = await query;
        // console.log('Resultados filtrados:', filtro); 
    
        return response.status(200).json({
            filtro: filtro
        });
    }
    

    async filtrar_evaluaciones_transporte({ response, request }: HttpContext) {
        const { calificacion } = request.body()

        let query = Evaluacion.query().orderBy('createdAt', 'desc');

        if (calificacion) {
            query = query.where('calificacion', calificacion)
            query = query.andWhere('servicio', 'transporte').orderBy('createdAt', 'desc');
        }

        const filtro = await query

        return response.status(200).json({
            filtro: filtro
        })
    }

    async filtrar_evaluaciones_enfermeria({ response, request }: HttpContext) {
        const { calificacion } = request.body()

        let query = Evaluacion.query().orderBy('createdAt', 'desc');

        if (calificacion) {
            query = query.where('calificacion', calificacion)
            query = query.andWhere('servicio', 'enfermeria').orderBy('createdAt', 'desc');
        }

        const filtro = await query

        return response.status(200).json({
            filtro: filtro
        })
    }

    async mostar_comentario_id({ request, response }: HttpContext) {
        const { id } = request.body()
        const comentario = await Evaluacion.query()
            .select('comentario')
            .where('id', id)
            .first()

        return response.status(200).json({
            comentario: comentario
        })
    }
}

// {
// 	"nombre":"comedor",
// 	"apellidos":"planta1",
// 	"usuario":"comedor.1",
// 	"contrasena":"comedor.1",
// 	"area":"comedor_1",
// 	"estatus":"activo",
// 	"puesto":"comedor",
// 	"firma":"si",
// 	"correo":"comedor1@gmail.com",
// 	"telefono":"7321111",
// 	"foto":"no"
// }