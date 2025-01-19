"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
// Define un flujo personalizado para redirigir los logs al console.log
const stream = {
    write: (message) => console.log(message.trim()),
};
// Opciones para Morgan
const skip = () => process.env.NODE_ENV === 'test'; // Evitar logs durante pruebas
const loggerMiddleware = (0, morgan_1.default)(':method :url :status :response-time ms - :res[content-length]', {
    stream,
    skip,
});
exports.default = loggerMiddleware;
//# sourceMappingURL=loggerMiddleware.js.map