import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: ['https://noteit-frontend.netlify.app' , 'http://localhost:5173'], // Orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  credentials: true, // Permitir cookies o encabezados de autenticación
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
