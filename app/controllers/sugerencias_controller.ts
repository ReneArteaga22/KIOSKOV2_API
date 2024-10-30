import Sugerencia from '#models/sugerencia'
import type { HttpContext } from '@adonisjs/core/http'

export default class SugerenciasController {

    async sugerencias({response}:HttpContext){
        const sugerencias = await Sugerencia.all()
        return response.status(200).json({
            titulo:'Exito',
            sugerencias:sugerencias
        })
    }

    async crear_sugerencia({request, response}:HttpContext){
        try {
            const{sugerencia} = request.body()
            const newSugerencia = new Sugerencia
    
            newSugerencia.sugerencia = sugerencia
    
            await newSugerencia.save()

            return response.status(200).json({
                titulo:'Exito',
                mensaje:'Sugerencia mandada con extio',
                sugerencia:newSugerencia
            })
        } catch (error) {
            response.status(200).json({
                titulo:'Error',
                error:error.message
            })
        }
    }
}