"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const noteController_1 = require("../controllers/noteController");
// Ruta para crear una nueva nota
router.post('/', noteController_1.createNote);
// Ruta para editar una nota existente
router.put('/:id', noteController_1.updateNote);
// Ruta para eliminar una nota
router.delete('/:id', noteController_1.deleteNote);
// Ruta para obtener las notas activas
router.get('/active', noteController_1.getActiveNotes);
// Ruta para obtener las notas archivadas
router.get('/archived', noteController_1.getArchivedNotes);
// Ruta que obtiene nota por id
router.get('/:id', noteController_1.getNoteById);
// Ruta para alternar el estado "archived" de una nota
router.put('/:id/archive', noteController_1.toggleArchiveNote);
exports.default = router;
//# sourceMappingURL=noteRoutes.js.map