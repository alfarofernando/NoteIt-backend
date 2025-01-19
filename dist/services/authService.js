"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Hashea una contraseña utilizando bcrypt.
 * @param password Contraseña en texto plano que será hasheada.
 * @returns La contraseña hasheada.
 */
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcryptjs_1.default.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
/**
 * Verifica si una contraseña proporcionada coincide con la contraseña hasheada almacenada.
 * @param plainPassword Contraseña en texto plano proporcionada por el usuario.
 * @param hashedPassword Contraseña hasheada almacenada en la base de datos.
 * @returns Un booleano que indica si las contraseñas coinciden.
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcryptjs_1.default.compare(plainPassword, hashedPassword);
};
exports.verifyPassword = verifyPassword;
//# sourceMappingURL=authService.js.map