"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: ['http://localhost:5173', 'https://mi-app-produccion.com'], // Orígenes permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true, // Permitir cookies o encabezados de autenticación
};
const corsMiddleware = (0, cors_1.default)(corsOptions);
exports.default = corsMiddleware;
//# sourceMappingURL=corsMiddleware.js.map