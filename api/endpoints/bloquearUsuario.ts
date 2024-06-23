import Elysia from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BloquearUsuarioBody {
  correo: string;
  clave: string;
  correo_bloquear: string;
}

/*
 * Realiza una petición tipo POST para bloquear a un usuario.
 * Se recibe un JSON con las credenciales del usuario y el correo del usuario a bloquear.
 * Devuelve un JSON con el estado de la operación.
 */
export const bloquearUsuario = new Elysia()
    .post('/api/bloquear', async ({ body }: { body: BloquearUsuarioBody }) => {
        const { correo, clave, correo_bloquear } = body;
        
        let fecha = new Date()

        console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Solicitud de',body.correo,'para bloquear al usuario:', body.correo_bloquear)

        try {
            // Buscar al usuario que hace la petición en la base de datos
            const usuario = await prisma.usuario.findUnique({ where: { correo } });
            
            if (usuario && usuario.clave === clave) {
                // Obtener el usuario a bloquear en la base de datos
                const usuarioBloqueado = await prisma.usuario.findUnique({ where: { correo: correo_bloquear } });
                
                if (usuarioBloqueado) {
                    // Crear una entrada de bloqueo para el usuario
                    const bloqueado = await prisma.bloqueados.create({
                        data: {
                            usuario_id: usuario.id,
                            usuario_bloqueado_id: usuarioBloqueado.id,
                        },
                    });

                    console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] El usuario',body.correo,'ha bloqueado al usuario:',usuarioBloqueado.correo)
                    
                    return {
                        estado: 200,
                        mensaje: 'Usuario bloqueado correctamente',
                        bloqueado
                    };
                } else {
                    console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] No se ha encontrado al usuario',body.correo_bloquear)
                    return {
                        estado: 400,
                        mensaje: 'Usuario a bloquear no encontrado'
                    };
                }
            } else {
                console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] El usuario',body.correo,'no existe o la clave no corresponde a ese correo')
                return {
                    estado: 400,
                    mensaje: 'Credenciales incorrectas'
                };
            }
        } catch (error) {
            console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Ha ocurrido un error. Podría ser que el usuario',body.correo,'ya tenga bloqueado al usuario:',body.correo_bloquear)
            return {
                estado: 400,
                mensaje: 'Error al bloquear usuario',
                error
            };
        }
    });

export default bloquearUsuario;
