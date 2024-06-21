import { Elysia } from 'elysia';
import registrarUsuario from './registrarUsuario';
import obtenerInformacionUsuario from './obtenerInformacionUsuario';
import bloquearUsuario from './bloquearUsuario';
import marcarCorreoFavorito from './marcarCorreoFavorito';
import desmarcarCorreoFavorito from './desmarcarCorreoFavorito';

const app = new Elysia();

app.use(registrarUsuario);
app.use(obtenerInformacionUsuario);
app.use(bloquearUsuario);
app.use(marcarCorreoFavorito);
app.use(desmarcarCorreoFavorito);
export default app;