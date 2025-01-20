import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: ['http://localhost:5173', 'https://noteit-frontend.netlify.app/'], // Orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  credentials: true, // Permitir cookies o encabezados de autenticación
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
