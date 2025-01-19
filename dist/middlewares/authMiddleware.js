"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const prisma_1 = require("../config/prisma"); // Importa el cliente de Prisma
const authService_1 = require("../services/authService");
const login = async (req, res) => {
    const { email, password } = req.body;
    // Validar que se envíen el email y la contraseña
    if (!email || !password) {
        res.status(400).json({ message: 'Email y contraseña son requeridos.' });
        return;
    }
    try {
        // Buscar al usuario por su email
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(401).json({ message: 'Email o contraseña inválidos.' });
            return;
        }
        // Verificar la contraseña utilizando el servicio
        const isPasswordValid = await (0, authService_1.verifyPassword)(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Email o contraseña inválidos.' });
            return;
        }
        // Responder con éxito, excluyendo la contraseña
        const { password: _, ...userData } = user;
        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            user: userData,
        });
    }
    catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
exports.login = login;
//# sourceMappingURL=authMiddleware.js.map