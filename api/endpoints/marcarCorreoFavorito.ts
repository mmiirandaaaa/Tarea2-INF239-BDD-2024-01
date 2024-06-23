import Elysia from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MarcarCorreoFavoritoBody {
  correo: string;
  clave: string;
  id_correo_favorito: number;
}

/**
 * Realiza una petición tipo POST para marcar un correo como favorito.
 * Se recibe un JSON con las credenciales del usuario y el ID del correo a marcar como favorito.
 * Devuelve un JSON con el estado de la operación.
 */
export const marcarCorreoFavorito = new Elysia()
  .post('/api/marcarcorreo', async ({ body }: { body: MarcarCorreoFavoritoBody }) => {
    const { correo, clave, id_correo_favorito } = body;

    let fecha = new Date()

    console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Solicitud recibida para marcar como favorito el correo',body.id_correo_favorito, 'en los favoritos del usuario', body.correo);

    try {
      // Verificar credenciales del usuario
      if (!correo || !clave) {
        throw new Error('Correo y clave son requeridos');
      }

      const usuario = await prisma.usuario.findUnique({ where: { correo } });

      if (usuario && usuario.clave === clave) {
        // Verificar que el correo existe
        const correofavorito = await prisma.correos.findUnique({ where: { id: id_correo_favorito } });
        
        if (correofavorito?.destinatario_id === usuario.id || correofavorito?.remitente_id === usuario.id) {
          // Verificamos que el usuario que quiere guardar el correo como favorito es remitente o destinatario del mensaje, es decir, tiene acceso a este
          const favorito = await prisma.favoritos.create({
            data: {
              usuario_id: usuario.id,
              correo_id: correofavorito.id,
            },
          });

          console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Petición cumplida con éxito. Se ha agregado como el correo',body.id_correo_favorito, 'a los favoritos de',body.correo, 'con éxito');

          return {
            estado: 200,
            mensaje: 'Correo marcado como favorito correctamente',
            favorito,
          };
        } else {
          console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] El correo',body.id_correo_favorito,' no existe o no es del usuario');
          return {
            estado: 400,
            mensaje: 'El correo a marcar como favorito no existe',
          };
        }
      } else {
        console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Usuario inexistente o clave errónea');
        return {
          estado: 400,
          mensaje: 'Credenciales incorrectas',
          };
        }
      } catch (error: unknown) {
        // Manejo de errores
        console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Ocurrió un error al intentar agregar el correo',body.id_correo_favorito,'a los favoritos del usuario',body.correo,'. Puede que el correo ya esté en su lista');
        return {
          estado: 400,
          mensaje: 'Error al marcar correo como favorito'
        };
      }
    });

export default marcarCorreoFavorito;
