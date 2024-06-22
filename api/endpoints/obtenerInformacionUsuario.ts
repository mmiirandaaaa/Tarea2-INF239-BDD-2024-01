import Elysia from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ObtenerInformacionParams {
  correo: string;
}

let fecha = new Date()

/**
 * Realiza una petición tipo GET para obtener información de un usuario.
 * Se recibe el correo del usuario como parámetro.
 * Devuelve un JSON con la información del usuario.
 */
export const obtenerInformacionUsuario = new Elysia()
    .get('/api/informacion/:correo', async ({ params }: { params: ObtenerInformacionParams }) => {
        const { correo } = params;
        console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Solicitud para encontrar al usuario:', params.correo, 'recibida')
        try {
            // Buscar al usuario en la base de datos
            const usuario = await prisma.usuario.findUnique({ where: { correo } });
            
            if (usuario) { 
                console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Usuario:', usuario.correo, 'encontrado')
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
            console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] No se encontró el usuario')
            return {
                estado: 400,
                mensaje: 'Error al obtener información del usuario',
                error
            };
        }
    });

export default obtenerInformacionUsuario;
