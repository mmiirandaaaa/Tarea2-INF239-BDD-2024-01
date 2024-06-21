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
        
        try {
            // Buscar al usuario en la base de datos
            const usuario = await prisma.usuario.findUnique({ where: { correo } });
            
            if (usuario && usuario.clave === clave) {
                // Marcar el correo como favorito
                const favorito = await prisma.favoritos.create({
                    data: {
                        usuario_id: usuario.id,
                        correo_id: id_correo_favorito,
                    },
                });
                
                return {
                    estado: 200,
                    mensaje: 'Correo marcado como favorito',
                    favorito
                };
            } else {
                return {
                    estado: 400,
                    mensaje: 'Credenciales incorrectas'
                };
            }
        } catch (error) {
            // Manejo de errores
            return {
                estado: 400,
                mensaje: 'Error al marcar correo como favorito',
                error
            };
        }
    });

export default marcarCorreoFavorito;
