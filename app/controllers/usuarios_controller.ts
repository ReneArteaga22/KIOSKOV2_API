import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class UsuariosController {


    async index({response}:HttpContext){
        const usuarios = await User.all()
        return response.status(200).json({
            titulo:'Exito',
            mensaje:'Lista de usuarios',
            usuarios:usuarios
            
        })
    }

    async register({request, response}:HttpContext){
        const {nombre, apellidos, usuario, contrasena, area, estatus, puesto, firma, correo, telefono, foto } = request.body()

        const nuevoUsuario = new User
        nuevoUsuario.nombre = nombre
        nuevoUsuario.apellidos = apellidos
        nuevoUsuario.usuario = usuario
        nuevoUsuario.contrasena = contrasena
        nuevoUsuario.area = area
        nuevoUsuario.estatus = estatus
        nuevoUsuario.puesto = puesto
        nuevoUsuario.firma = firma
        nuevoUsuario.correo = correo
        nuevoUsuario.telefono = telefono
        nuevoUsuario.foto = foto
        // nuevoUsuario.id_planta = id_planta

        nuevoUsuario.save()

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
            // const token = await User.accessTokens.create(usuario)
            return response.status(200).json({
                titulo:'exito',
                mensaje:'Inicio de sesion exitoso',
                usuario:usuario
                // token:token
            })
        }
        else{
            return response.status(400).json({                
                titulo:'Error',
                mensaje:'Contraseña o usuario incorrectos'
            })
        }
    }

    async recuperar_contrasena({request, response}:HttpContext){
        const {correo, nuevaContrasena} = request.body()
        const usuario = await User.findByOrFail('correo',correo)
        const contrasenaNuevaHash = await hash.make(nuevaContrasena)

 
        if(!usuario){
            return response.status(404).json({
                titulo:'Error',
                mensaje:'Usuario no existe'
            })
        }
        if(usuario.correo === correo){
            usuario.contrasena = contrasenaNuevaHash
            await usuario.save()
            return response.status(200).json({
                titulo:'Exito!',
                mensaje:'Contraseña recuperada con exito'
            })
        }else{
            return response.status(400).json({
                titulo:'Error',
                mensaje:'Contraseña o usuario incorrectos'
            })
        }
    }

    async buscar_usuario({ response, request }: HttpContext) {
        const { nombre, area } = request.body()

        let query = User.query()

        if(nombre){
            query = query.where('nombre','like',`%${nombre}%`)
        }
        if(area){
            query = query.where('area',area)
        }

        const filtro = await query

        return response.status(200).json({
            filtro:filtro
        })
    }
}
