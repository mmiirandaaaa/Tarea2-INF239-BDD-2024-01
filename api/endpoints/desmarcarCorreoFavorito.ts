import Elysia from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DesmarcarCorreoFavoritoBody {
  correo: string;
  clave: string;
  id_correo_favorito: number;
}

let fecha = new Date()

/**
 * Realiza una petición tipo DELETE para desmarcar un correo como favorito.
 * Se recibe un JSON con las credenciales del usuario y el ID del correo a desmarcar como favorito.
 * Devuelve un JSON con el estado de la operación.
 */
export const desmarcarCorreoFavorito = new Elysia()
  .delete('/api/desmarcarcorreo', async ({ body }: { body: DesmarcarCorreoFavoritoBody }) => {
    const { correo, clave, id_correo_favorito } = body;

    console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Usuario',body.correo, 'está intentando desmarcar de favoritos el correo',body.id_correo_favorito);

    try {
      // Verificar credenciales del usuario
      if (!correo || !clave) {
        throw new Error('Correo y clave son requeridos');
      }

      const usuario = await prisma.usuario.findUnique({ where: { correo } });

      if (usuario && usuario.clave === clave) {
        // Verificar que el correo favorito existe
        const favorito = await prisma.favoritos.findUnique({
          where: {
            usuario_id_correo_id: {
              usuario_id: usuario.id,
              correo_id: id_correo_favorito,
            },
          },
        });

        if (favorito) {
          // Desmarcar el correo como favorito
          await prisma.favoritos.delete({
            where: {
              usuario_id_correo_id: {
                usuario_id: usuario.id,
                correo_id: id_correo_favorito,
              },
            },
          });
          
          console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] El usuario',body.correo, 'ha desmarcado de favoritos el correo',body.id_correo_favorito);

          return {
            estado: 200,
            mensaje: 'Correo desmarcado como favorito correctamente',
          };
        } else {

          console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] No existe el correo',body.id_correo_favorito);
  
          return {
            estado: 400,
            mensaje: 'El correo a desmarcar como favorito no existe',
          };
        }
      } else {
        return {
          estado: 400,
          mensaje: 'Credenciales incorrectas',
        };
      }
    } catch (error: unknown) {
      // Manejo de errores
      console.error('Error al desmarcar correo como favorito:', error);
      if (error instanceof Error) {
        return {
          estado: 400,
          mensaje: 'Error al desmarcar correo como favorito',
          error: error.message,  // Añadir mensaje de error detallado
        };
      } else {
        return {
          estado: 400,
          mensaje: 'Error desconocido al desmarcar correo como favorito',
        };
      }
    }
  });

export default desmarcarCorreoFavorito;
