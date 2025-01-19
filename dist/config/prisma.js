"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Validar variables de entorno
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;
if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
    throw new Error('Faltan variables de entorno necesarias');
}
// Crear una instancia de Prisma Client
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Opcional: para registrar eventos del cliente Prisma
});
exports.prisma = prisma;
// Función para inicializar la conexión a la base de datos
const initDatabase = async () => {
    try {
        await prisma.$connect(); // Establecer conexión con la base de datos
        console.log('Conexión a la base de datos establecida correctamente.');
    }
    catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1); // Salir si hay errores críticos
    }
};
// Ejecutar la inicialización de la base de datos al cargar el archivo
initDatabase();
//# sourceMappingURL=prisma.js.map