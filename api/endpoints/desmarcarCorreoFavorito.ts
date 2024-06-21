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
 * Se recibe un JSON con las credenciales del usuario y el ID del correo a desmarcar.
 * Devuelve un JSON con el estado de la operación.
 */
export const desmarcarCorreoFavorito = new Elysia()
    .delete('/api/desmarcarcorreo', async ({ body }: { body: DesmarcarCorreoFavoritoBody }) => {
        const { correo, clave, id_correo_favorito } = body;
        
        try {
            // Buscar al usuario en la base de datos
            const usuario = await prisma.usuario.findUnique({ where: { correo } });
            
            if (usuario && usuario.clave === clave) {
                // Desmarcar el correo como favorito
                await prisma.favoritos.deleteMany({
                    where: {
                        usuario_id: usuario.id,
                        correo_id: id_correo_favorito,
                    },
                });
                
                return {
                    estado: 200,
                    mensaje: 'Correo desmarcado como favorito'
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
                mensaje: 'Error al desmarcar correo como favorito',
                error
            };
        }
    });

export default desmarcarCorreoFavorito;
