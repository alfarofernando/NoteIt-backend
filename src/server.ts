import { prisma } from './config/prisma'; // Importa el cliente de Prisma
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import corsMiddleware from './middlewares/corsMiddleware';
import loggerMiddleware from './middlewares/loggerMiddleware';
import { login } from './controllers/authController';
import noteRoutes from './routes/noteRoutes';
import userRoutes from './routes/userRoutes';
import express from 'express';

dotenv.config(); // Cargar las variables de entorno

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(loggerMiddleware); // Logger para registrar las solicitudes
app.use(corsMiddleware);   // Middleware de CORS
app.use(express.json());   // Parseo de JSON

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running...');
});
// Manejar preflight requests
app.options('*', corsMiddleware);

// Rutas
app.post('/login', login);
app.use('/notes', noteRoutes);
app.use('/user', userRoutes);

// Verificar la conexión a la base de datos utilizando Prisma
const testDbConnection = async () => {
  try {
    // Comprobamos la conexión
    await prisma.$queryRaw`SELECT 1`; 

    console.log('Connection to the database has been established successfully.');

    // Inicia el servidor
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Unable to connect to the database:', error.message);
      console.error(error.stack);
    } else {
      console.error('Unknown error while connecting to the database:', error);
    }
  }
};

testDbConnection();
