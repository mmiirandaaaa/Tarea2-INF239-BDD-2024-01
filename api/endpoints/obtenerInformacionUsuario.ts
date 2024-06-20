import Elysia from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ObtenerInformacionParams {
  correo: string;
}

/**
 * Realiza una petición tipo GET para obtener información de un usuario.
 * Se recibe el correo del usuario como parámetro.
 * Devuelve un JSON con la información del usuario.
 */
export const obtenerInformacionUsuario = new Elysia()
    .get('/api/informacion/:correo', async ({ params }: { params: ObtenerInformacionParams }) => {
        const { correo } = params;
        
        try {
            // Buscar al usuario en la base de datos
            const usuario = await prisma.usuario.findUnique({ where: { correo } });
            
            if (usuario) {
                return {
                    estado: 200,
                    usuario
                };
            } else {
                return {
                    estado: 400,
                    mensaje: 'Usuario no encontrado'
                };
            }
        } catch (error) {
            // Manejo de errores
            return {
                estado: 400,
                mensaje: 'Error al obtener información del usuario',
                error
            };
        }
    });

export default obtenerInformacionUsuario;
