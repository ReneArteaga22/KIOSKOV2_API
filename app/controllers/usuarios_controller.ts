import Usuario from '#models/usuario'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsuariosController {

  async register({request, response}:HttpContext){
    const{nombre, apellidos, usuario, contraseña, area, estado, puesto, firma, correo, telefono, foto} = request.body()
    const nuevoUsuario = new Usuario
    nuevoUsuario.nombre = nombre
    nuevoUsuario.apellidos = apellidos
    nuevoUsuario.usuario = usuario
    nuevoUsuario.contraseña = contraseña
    nuevoUsuario.area = area
    nuevoUsuario.estado = estado
    nuevoUsuario.puesto = puesto
    nuevoUsuario.firma = firma
    nuevoUsuario.correo = correo
    nuevoUsuario.telefono = telefono
    nuevoUsuario.foto = foto

    nuevoUsuario.save()

    return response.status(200).json({
      titulo: 'Exito',
      mensaje: 'Usuario registrado con exito',
      usuario: nuevoUsuario
    })
  }
  async index({}: HttpContext) {}
}
