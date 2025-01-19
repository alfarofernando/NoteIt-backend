const express = require("express");
const router = express.Router();
import { createUser, updateUser } from "../controllers/userController";


// Ruta para crear un nuevo usuario
router.post('/register', createUser);

// Ruta para actualizar un usuario existente
router.put('/update/:id', updateUser);

export default router;
