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