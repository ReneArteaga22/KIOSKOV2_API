import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class UsuariosController {


    async index({response}:HttpContext){
        const usuarios = await User.all()
        response.status(200).json({
            titulo:'Exito',
            mensaje:'Lista de usuarios',
            usuaris:usuarios
            
        })
    }

    async register({request, response}:HttpContext){
        const {nombre, apellidos, usuario, contrasena, firma, correo, telefono, foto} = request.body()

        const nuevoUsuario = new User
        nuevoUsuario.nombre = nombre
        nuevoUsuario.apellidos = apellidos
        nuevoUsuario.usuario = usuario
        nuevoUsuario.contrasena = contrasena
        nuevoUsuario.firma = firma
        nuevoUsuario.correo = correo
        nuevoUsuario.telefono = telefono
        nuevoUsuario.foto = foto

        nuevoUsuario.save()

        console.log(contrasena)
        return response.status(200).json({
            titulo:'Exito',
            mensaje:'Usuario registrado'
        })
    }

    async login({request, response}:HttpContext){
        const {uids, contrasena} = request.only(['uids','contrasena'])
        const usuario = await User.query()
        .where('correo',uids)
        .orWhere('usuario', uids)
        .firstOrFail()

        if (await hash.verify(usuario.contrasena, contrasena)) {
            return response.status(200).json({
                titulo:'exito',
                mensaje:'Inicio de sesion exitoso'
            })
        }
        else{
            return response.status(400).json({                
                titulo:'Error',
                mensaje:'Contraseña o usuario incorrectos'
            })
        }
    }
}
