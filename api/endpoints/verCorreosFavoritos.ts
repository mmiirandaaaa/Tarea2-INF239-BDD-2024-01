import Elysia from 'elysia';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface VerCorreosFavoritosBody {
  correo: string;
}

const verCorreosFavoritos = new Elysia()
  .get('/api/favoritos/:correo', async ({ params }: { params: VerCorreosFavoritosBody }) => {
    const { correo } = params;

    let fecha = new Date();

    console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Solicitud para ver los correos favoritos del usuario', params.correo);

    try {
      // Buscar al usuario en la base de datos
      const usuario = await prisma.usuario.findUnique({ where: { correo } });

      if (usuario) {
        // Obtenemos un arreglo con los correos favoritos del usuario de la tabla favoritos, es decir, con formato {id, usuario_id, correo_id}
        const favoritos1 = await prisma.favoritos.findMany({ where: { usuario_id: usuario.id } });

        // Recorremos el arreglo anterior y buscamos el id del correo en la tabla correos para luego retornar un arreglo con los correos favoritos del usuario en el formato {id, remitente_id, destinatario_id, asunto, cuerpo, fecha}
        let arreglo_correos = new Array(); 
        for(let i = 0; i < favoritos1.length; i++){
          
          let favorito = await prisma.correos.findUnique({where: { id : favoritos1[i].correo_id}});

          let remitente = await prisma.usuario.findUnique({where: { id : favorito?.remitente_id }});
          let destinatario = await prisma.usuario.findUnique({where: { id : favorito?.destinatario_id }});

          arreglo_correos.push({
            "id": favorito?.id,
            "asunto": favorito?.asunto,
            "cuerpo": favorito?.cuerpo,
            "fecha": favorito?.fecha,
            "remitente": remitente?.correo,
            "destinatario": destinatario?.correo
          });
        }

        // log del servidor indicando la hora de la petición y en qué estado se encuentra
        console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] Solicitud procesada correctamente');

        return {
          estado: 200,
          mensaje: 'Correos favoritos obtenidos correctamente',
          arreglo_correos,
        };
      } else {

        console.log('['+String(fecha.getHours())+':'+String(fecha.getMinutes())+'] No se ha podido procesar la solicitud');
        
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
        error,
      };
    }
  });

export default verCorreosFavoritos;