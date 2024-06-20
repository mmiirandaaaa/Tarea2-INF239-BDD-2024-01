import { Elysia } from 'elysia';
import registrarUsuario from './registrarUsuario';

const app = new Elysia();

app.use(registrarUsuario);
export default app;