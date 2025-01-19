const express = require("express");
const router = express.Router();
import { createNote,updateNote,deleteNote,getActiveNotes,getArchivedNotes, toggleArchiveNote, getNoteById } from "../controllers/noteController";

// Ruta para crear una nueva nota
router.post('/', createNote);

// Ruta para editar una nota existente
router.put('/:id', updateNote);

// Ruta para eliminar una nota
router.delete('/:id', deleteNote);

// Ruta para obtener las notas activas
router.get('/active', getActiveNotes);

// Ruta para obtener las notas archivadas
router.get('/archived', getArchivedNotes);

// Ruta que obtiene nota por id
router.get('/:id', getNoteById);

// Ruta para alternar el estado "archived" de una nota
router.put('/:id/archive', toggleArchiveNote);


export default router;
