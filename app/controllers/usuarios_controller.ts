import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import hash from '@adonisjs/core/services/hash'

export default class UsuariosController {
    async index ({response}:HttpContext){
        const Users = await Usuario.all()
        return response.status(200).json({
            title: 'Success',
            usuarios: Users
        })
    }

    async register({request, response}:HttpContext){

        const{nombre, apellidos, usuario, contrasena, area, estatus, puesto, firma, correo, telefono, foto} = request.body()
        const contrasenaHash = await hash.make(contrasena)
        const nuevoUsuario = new Usuario
        nuevoUsuario.nombre = nombre
        nuevoUsuario.apellidos = apellidos
        nuevoUsuario.usuario = usuario
        nuevoUsuario.contrasena = contrasenaHash
        nuevoUsuario.area = area
        nuevoUsuario.estatus= estatus
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

    async login({request, response}:HttpContext){
        const {correo, contrasena} = request.only(['correo','contrasena'])
        const usuario = await Usuario.query()
        .where('correo',correo)
        .orWhere('usuario', correo)
        .first()

        //Validacion en caso de que le usuario no exista o no este registrado 
        if(!usuario){
            return response.status(404).json({
                titulo: 'Error',
                mensaje:'Usuario no encontrado'
            })
        } 

        //validacion si la contraseña guardada es la misma que el usuario esta ingresando 
        if (await hash.verify(usuario.contrasena, contrasena)) {

            return response.status(200).json({
                titulo:'exito',
                mensaje:'Inicio de sesion exitoso'
            })
        }
        //en caso de error en alguno de los campos manda a la excepcion 
        else{
            return response.status(400).json({
                titulo:'Error',
                mensaje:'Contraseña o usuario incorrectos'
            })
        }
    }

    async recuperar_contrasena({request, response}:HttpContext){
        const {correo, nuevaContrasena} = request.body()
        const usuario = await Usuario.findByOrFail('correo',correo)
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
}