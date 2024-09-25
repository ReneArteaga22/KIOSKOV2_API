import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'

export default class UsuariosController {
    public async index ({}:HttpContext){
        return "hola"
    }

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
}