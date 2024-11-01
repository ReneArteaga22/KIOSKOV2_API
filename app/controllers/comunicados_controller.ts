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

    async agregar_comunicado({response, request}:HttpContext){
      try {
        const {imagen, nombre, fecha} = request.body()
        const newComunicado = new Comunicado
        newComunicado.imagen = (`/comunicados/${imagen}`)
        newComunicado.nombre = nombre
        newComunicado.fecha = fecha

        await newComunicado.save()
        return response.status(200).json({
          titulo:'Exito',
          mensaje:'comunicado creado con exito',
          comunicado:newComunicado
        })
      } catch (error) {
        return response.status(400).json({
          titulo:'Error',
          error:error.message
        })
      }
    }

    async eliminar_comunicado({ params, response }: HttpContext) {
        try {
          const { id } = params;
          const comunicado = await Comunicado.find(id);
      
          if (!comunicado) {
            return response.status(404).json({
              titulo: 'Error',
              mensaje: 'Comunicado no encontrado :('
            });
          }
      
          await comunicado.delete();
      
          return response.status(200).json({
            titulo: 'Éxito',
            mensaje: 'Comunicado eliminado exitosamente',
            comunicado: comunicado
          });
        } catch (error) {
          return response.status(400).json({
            titulo: 'Error',
            error: error.message
          });
        }
    }  
}