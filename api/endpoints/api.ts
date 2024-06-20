import { Elysia } from 'elysia';
import registrarUsuario from './registrarUsuario';
import obtenerInformacionUsuario from './obtenerInformacionUsuario';
import bloquearUsuario from './bloquearUsuario';

const app = new Elysia();

app.use(registrarUsuario);
app.use(obtenerInformacionUsuario);
app.use(bloquearUsuario);
export default app;