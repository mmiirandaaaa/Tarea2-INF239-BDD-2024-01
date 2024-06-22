import Elysia from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface VerCorreosFavoritosBody {
  correo: string;
  clave: string;
}

const verCorreosFavoritos = new Elysia()
  .get('/api/vercorreofavorito', async ({ query }: { query: VerCorreosFavoritosBody }) => {
    const { correo, clave } = query;

    try {
      // Buscar al usuario en la base de datos
      const usuario = await prisma.user.findUnique({ where: { email: correo } });

      if (usuario && usuario.clave === clave) {
        // Obtener los correos favoritos del usuario
        const favoritos = await prisma.favorito.findMany({
          where: { usuario_id: usuario.id },
          include: { correo: true },
        });

        return {
          estado: 200,
          mensaje: 'Correos favoritos obtenidos correctamente',
          favoritos,
        };
      } else {
        return {
          estado: 400,
          mensaje: 'Credenciales incorrectas',
        };
      }
    } catch (error) {
      // Manejo de errores
      return {
        estado: 500,
        mensaje: 'Error al obtener correos favoritos',
        error: error.message,
      };
    }
  });

export default verCorreosFavoritos;