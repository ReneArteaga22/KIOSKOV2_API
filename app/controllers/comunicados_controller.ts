import Comunicado from '#models/comunicado'
import type { HttpContext } from '@adonisjs/core/http'


export default class ComunicadosController {

  async comunicados_menu({response}:HttpContext){
    const menuComu = await Comunicado.query()
    .where('tipo','menu')

    response.status(200).json({
      comunicado:menuComu
    })
  }

    async comunicados({response}:HttpContext){
        const comunicados = await Comunicado.query()
        .where('tipo','comunicado')
        return response.status(200).json({
            titulo:'Exito',
            comunicados:comunicados
        })
    }

  
  public async agregar_comunicado({ request, response }: HttpContext) {
    try {
      // Manejo de archivo
      const imagen = request.file('imagen', {
        size: '20mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })

      if (!imagen) {
        return response.status(400).json({
          mensaje: 'Imagen no puede estar vacía',
        })
      }

      // Mover imagen a la carpeta deseada
      await imagen.move('public/uploads/comunicados', {
        name: `${new Date().getTime()}.${imagen.extname}`,
      })

      if (!imagen.fileName) {
        return response.status(500).json({
          titulo: 'Error',
          mensaje: 'No se pudo guardar la imagen',
        })
      }

      // Extraer datos adicionales del request
      const { nombre, tipo } = request.body()
      const newComunicado = new Comunicado()

      // Guardar la ruta de la imagen en el modelo
      newComunicado.imagen = `/uploads/comunicados/${imagen.fileName}`
      newComunicado.nombre = nombre
      newComunicado.tipo = tipo

      // Guardar en la base de datos
      await newComunicado.save()

      return response.status(200).json({
        titulo: 'Éxito',
        mensaje: 'Comunicado creado con éxito',
        comunicado: newComunicado,
      })
    } catch (error) {
      return response.status(400).json({
        titulo: 'Error',
        error: error.message,
      })
    }
  }

    // async agregar_comunicado({response, request}:HttpContext){
    //   try {
    //     const {imagen, nombre, tipo } = request.body()
    //     const newComunicado = new Comunicado
    //     newComunicado.imagen = (`/comunicados/${imagen}`)
    //     newComunicado.nombre = nombre
    //     newComunicado.tipo = tipo

    //     await newComunicado.save()
    //     return response.status(200).json({
    //       titulo:'Exito',
    //       mensaje:'comunicado creado con exito',
    //       comunicado:newComunicado
    //     })
    //   } catch (error) {
    //     return response.status(400).json({
    //       titulo:'Error',
    //       error:error.message
    //     })
    //   }
    // }

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