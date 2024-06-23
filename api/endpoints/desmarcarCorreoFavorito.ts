import Elysia from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DesmarcarCorreoFavoritoBody {
  correo: string;
  clave: string;
  id_correo_favorito: number;
}

/**
 * Realiza una petición tipo DELETE para desmarcar un correo como favorito.
 * Se recibe un JSON con las credenciales del usuario y el ID del correo a desmarcar como favorito.
 * Devuelve un JSON con el estado de la operación.
 */
export const desmarcarCorreoFavorito = new Elysia()
  .delete('/api/desmarcarcorreo', async ({ body }: { body: DesmarcarCorreoFavoritoBody }) => {
    const { correo, clave, id_correo_favorito } = body;

    let fecha = new Date()

    console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Se ha recibido una solicitud para desmarcar un correo de los favoritos de', body.correo);

    try {
      // Verificar credenciales del usuario
      if (!correo || !clave) {
        throw new Error('Correo y clave son requeridos');
      }

      const usuario = await prisma.usuario.findUnique({ where: { correo } });

      if (usuario && usuario.clave === clave) {
        // Verificar que el correo favorito existe
        const favorito = await prisma.favoritos.findUnique({ where: { id: id_correo_favorito } });

        if (favorito?.usuario_id === usuario.id) {
          // Desmarcar el correo como favorito
          const eliminado = await prisma.favoritos.delete({
            where : {
              id : id_correo_favorito,
            },
          })
          
          console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] El correo',eliminado.correo_id, 'se ha desmarcado de los favoritos de', body.correo);

          return {
            estado: 200,
            mensaje: 'Correo desmarcado como favorito correctamente',
          };
        } else {

          console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] El usuario', body.correo, 'no tiene el correo', body.id_correo_favorito, 'en sus favoritos o no existe');
  
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
