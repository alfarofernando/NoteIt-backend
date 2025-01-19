import morgan, { StreamOptions } from 'morgan';

// Define un flujo personalizado para redirigir los logs al console.log
const stream: StreamOptions = {
  write: (message) => console.log(message.trim()),
};

// Opciones para Morgan
const skip = () => process.env.NODE_ENV === 'test'; // Evitar logs durante pruebas

const loggerMiddleware = morgan(':method :url :status :response-time ms - :res[content-length]', {
  stream,
  skip,
});

export default loggerMiddleware;
