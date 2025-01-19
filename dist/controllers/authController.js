"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const prisma_1 = require("../config/prisma"); // Asegúrate de tener Prisma configurado y el cliente importado
const authService_1 = require("../services/authService");
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    try {
        // Buscar el usuario por email
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // Verificar si la contraseña es correcta
        const isPasswordValid = await (0, authService_1.verifyPassword)(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        // Enviar la respuesta sin generar un token
        res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map