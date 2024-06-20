import Elysia from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RegistrarUsuarioBody {
  nombre: string;
  correo: string;
  clave: string;
  descripcion?: string;
}

/**
 * Realiza una petición tipo POST para registrar un nuevo usuario.
 * Se recibe un JSON con los datos del usuario y se guarda en la base de datos.
 * Devuelve un JSON con el estado de la operación.
 */
export const registrarUsuario = new Elysia()
    .post('/api/registrar', async ({ body }: { body: RegistrarUsuarioBody }) => {
        console.log('Solicitud recibida:', body);

        const { nombre, correo, clave, descripcion } = body;
        
        try {
            // Crear un nuevo usuario en la base de datos
            const newUser = await prisma.usuario.create({
                data: { nombre, correo, clave, descripcion },
            });
            console.log('Usuario registrado:', newUser);
            
            return {
                estado: 200,
                mensaje: 'Usuario registrado correctamente',
                usuario: newUser
            };
        } catch (error) {
            // Manejo de errores
            console.error('Error al registrar usuario:', error);
            return {
                estado: 400,
                mensaje: 'Error al registrar usuario',
                error
            };
        }
    });

export default registrarUsuario;
