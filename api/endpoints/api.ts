import { Elysia } from 'elysia';
import registrarUsuario from './registrarUsuario';
import obtenerInformacionUsuario from './obtenerInformacionUsuario';
import bloquearUsuario from './bloquearUsuario';
import marcarCorreoFavorito from './marcarCorreoFavorito';
import desmarcarCorreoFavorito from './desmarcarCorreoFavorito';
import verCorreosFavoritos from './verCorreosFavoritos';

const app = new Elysia();

app.use(registrarUsuario);
app.use(obtenerInformacionUsuario);
app.use(bloquearUsuario);
app.use(marcarCorreoFavorito);
app.use(desmarcarCorreoFavorito);
app.use(verCorreosFavoritos);
export default app;