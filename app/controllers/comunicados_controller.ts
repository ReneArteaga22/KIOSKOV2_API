import Comunicado from '#models/comunicado'
import type { HttpContext } from '@adonisjs/core/http'

export default class ComunicadosController {

    async comunicados({response}:HttpContext){
        const comunicados = await Comunicado.all()
        return response.status(200).json({
            titulo:'Exito',
            comunicados:comunicados
        })
    }
}