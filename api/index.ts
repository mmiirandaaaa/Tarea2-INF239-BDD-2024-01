import { Elysia } from 'elysia';
import api from './endpoints/api';

const app = new Elysia();

app.use(api);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
