"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./config/prisma"); // Importa el cliente de Prisma
const dotenv_1 = __importDefault(require("dotenv"));
const corsMiddleware_1 = __importDefault(require("./middlewares/corsMiddleware"));
const loggerMiddleware_1 = __importDefault(require("./middlewares/loggerMiddleware"));
const authController_1 = require("./controllers/authController");
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config(); // Cargar las variables de entorno
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use(loggerMiddleware_1.default); // Logger para registrar las solicitudes
app.use(corsMiddleware_1.default); // Middleware de CORS
app.use(express_1.default.json()); // Parseo de JSON
// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Backend is running...');
});
// Rutas
app.post('/login', authController_1.login);
app.use('/notes', noteRoutes_1.default);
app.use('/user', userRoutes_1.default);
// Verificar la conexión a la base de datos utilizando Prisma
const testDbConnection = async () => {
    try {
        // Comprobamos la conexión
        await prisma_1.prisma.$queryRaw `SELECT 1`; // Consulta sencilla para verificar la conexión
        console.log('Connection to the database has been established successfully.');
        // Inicia el servidor
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Unable to connect to the database:', error.message);
            console.error(error.stack);
        }
        else {
            console.error('Unknown error while connecting to the database:', error);
        }
    }
};
testDbConnection();
//# sourceMappingURL=server.js.map