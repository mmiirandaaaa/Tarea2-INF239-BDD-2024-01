import Elysia from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MarcarCorreoFavoritoBody {
  correo: string;
  clave: string;
  id_correo_favorito: number;
}

let fecha = new Date()

/**
 * Realiza una petición tipo POST para marcar un correo como favorito.
 * Se recibe un JSON con las credenciales del usuario y el ID del correo a marcar como favorito.
 * Devuelve un JSON con el estado de la operación.
 */
export const marcarCorreoFavorito = new Elysia()
  .post('/api/marcarcorreo', async ({ body }: { body: MarcarCorreoFavoritoBody }) => {
    const { correo, clave, id_correo_favorito } = body;

    console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Usuario',body.correo, 'está intentando marcar como favorito el correo',body.id_correo_favorito);

    try {
      // Verificar credenciales del usuario
      if (!correo || !clave) {
        throw new Error('Correo y clave son requeridos');
      }

      const usuario = await prisma.usuario.findUnique({ where: { correo } });

      if (usuario && usuario.clave === clave) {
        // Verificar que el correo existe
        const correoFavorito = await prisma.correos.findUnique({ where: { id: id_correo_favorito } });

        if (correoFavorito) {
          // Marcar el correo como favorito
          const favorito = await prisma.favoritos.create({
            data: {
              usuario_id: usuario.id,
              correo_id: correoFavorito.id,
            },
          });

          console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Petición cumplida con éxito.',body.correo,'ha agregado como favorito el correo',body.id_correo_favorito);

          return {
            estado: 200,
            mensaje: 'Correo marcado como favorito correctamente',
            favorito,
          };
        } else {
          console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] El correo que se quiere marcar no existe')
          return {
            estado: 400,
            mensaje: 'El correo a marcar como favorito no existe',
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
        console.error('Error al marcar correo como favorito:', error);
        if (error instanceof Error) {
          return {
            estado: 400,
            mensaje: 'Error al marcar correo como favorito',
            error: error.message,  // Añadir mensaje de error detallado
          };
        } else {
          return {
            estado: 400,
            mensaje: 'Error desconocido al marcar correo como favorito',
          };
        }
      }
    });

export default marcarCorreoFavorito;
