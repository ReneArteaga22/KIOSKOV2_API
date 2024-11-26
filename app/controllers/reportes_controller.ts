import Reporte from '#models/reporte'
import type { HttpContext } from '@adonisjs/core/http'

export default class ReportesController {
    async crear_reporte({ request, response }: HttpContext) {
        try {
            const { categoria, no_empleado, grupo, nombre, descripcion, planta, telefono } = request.body();
            const reporte = new Reporte();
            const date = new Date(); // La fecha actual

            // Determina el prefijo del folio basado en la planta
            let folioPrefix;
            if (planta === '1') {
            folioPrefix = '01';
            } else if (planta === '2') {
            folioPrefix = '02';
            } else {
            return response.status(400).json({
                titulo: 'Error',
                mensaje: 'Planta desconocida'
            });
            }

            // Encuentra el último reporte de la misma planta
            const ultimoReporte = await Reporte.query()
            .where('planta', planta)
            .orderBy('fecha', 'desc')
            .first();

            // Genera el nuevo folio
            let nuevoFolio;
            if (ultimoReporte) {
            const ultimoFolio = parseInt(ultimoReporte.folio.split('-')[1], 10); // Obtiene el número actual del folio
            nuevoFolio = `${folioPrefix}-${(ultimoFolio + 1).toString().padStart(3, '0')}`; // Incrementa y asegura que tenga 3 dígitos
            } else {
            nuevoFolio = `${folioPrefix}-100`; // Si no hay registros previos, empieza en 100
            }

            reporte.folio = nuevoFolio;
            reporte.fecha = date.toISOString().split('T')[0];
            reporte.categoria = categoria;
            reporte.no_empleado = no_empleado;
            reporte.grupo = grupo;
            reporte.nombre = nombre;
            reporte.descripcion = descripcion;
            reporte.planta = planta;
            reporte.telefono = telefono;

            await reporte.save();

            return response.status(200).json({
            titulo: 'Éxito',
            mensaje: 'Reporte enviado con éxito',
            reporte: reporte
            });
            } catch (error) {
                return response.status(400).json({
                titulo: 'Error',
                error: error.message
            });
        }
    }   

    async reportes({response}:HttpContext){
        try {
            const resportes = await Reporte.query()
            .whereNot('estatus','resuelto')
            .orderBy('fecha', 'desc')
            return response.status(200).json({
                titulo:'Exito',
                mensaje:'Lista de reportes',
                reportes: resportes
            })
        } catch (error) {
            return response.status(200).json({
                titulo:'Error',
                mensaje:'Algo sucedio al procesar la solicitud :/',
                error:error.message
            })
        }
    }

    async reporte_x_id({response, request}:HttpContext){
        try {
            const{id} = request.body()
            const reporte = await Reporte.query()
            .where('id',id)
            .firstOrFail()

            return response.status(200).json({
                titulo:'Exito',
                mensaje:'Reporte obtenido',
                reporte:reporte
            })
        } catch (error) {
            return response.status(400).json({
                titulo:'Error',
                error:error.message
            })
        }
    }

    async filtrar_reportes({response, request}:HttpContext){
        const{categoria, estatus, planta} = request.body()
        let query = Reporte.query()
        

        if(categoria){
            query = query.where('categoria',categoria)
        }
        if(estatus){
            query = query.where('estatus',estatus)
        }
        if(planta){
            query = query.where('planta',planta)
        }

        const filtro = await query

        if(!filtro || filtro.length === 0){
            return response.status(404).json({
                titulo:'Error',
                mensaje:'No existen reportes :/'
            })
        }

        return response.status(200).json({
            titulo:'Exito',
            reportes:filtro
        })
    }

    async actualizar_estado_reporte({response, request}: HttpContext) {
        try {
            const { id, estatus } = request.body();
    
            const reporte = await Reporte.query().where('id', id).firstOrFail();
    
            reporte.estatus = estatus;
    
            await reporte.save();
    
            return response.status(200).json({
                titulo: 'Éxito',
                mensaje: 'Estado actualizado',
                reporte: reporte
            });
        } catch (error) {
            return response.status(400).json({
                titulo: 'Error',
                error: error.message
            });
        }
    }    
}