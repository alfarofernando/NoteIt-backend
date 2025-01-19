"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const userController_1 = require("../controllers/userController");
// Ruta para crear un nuevo usuario
router.post('/register', userController_1.createUser);
// Ruta para actualizar un usuario existente
router.put('/update/:id', userController_1.updateUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map