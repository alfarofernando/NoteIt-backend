import { Request, Response } from 'express';
import {prisma} from '../config/prisma';

//CREATE NOTES FUNCIONANDO
export const createNote = async (req: Request, res: Response): Promise<Response> => {
  const { title, content, userId, categoryNames, tagNames } = req.body;

  // Validación de longitud para el título y contenido
  if (title.length > 200) {
    return res.status(400).json({ message: 'Title exceeds maximum length of 200 characters' });
  }

  if (content.length > 5000) {
    return res.status(400).json({ message: 'Content exceeds maximum length of 5000 characters' });
  }

  try {
    // Crear las categorías si no existen
    const categories = categoryNames && categoryNames.length > 0
      ? await Promise.all(
          categoryNames.map(async (name: string) => {
            let category = await prisma.category.findFirst({ where: { name } });

            if (!category) {
              category = await prisma.category.create({ data: { name } });
            }

            return category;
          })
        )
      : [];

    // Crear las etiquetas si no existen
    const tags = tagNames && tagNames.length > 0
      ? await Promise.all(
          tagNames.map(async (name: string) => {
            let tag = await prisma.tag.findFirst({ where: { name } });

            if (!tag) {
              tag = await prisma.tag.create({ data: { name } });
            }

            return tag;
          })
        )
      : [];

    // Crear la nota con relaciones a categorías y etiquetas
    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
        categories: {
          create: categories.map((category) => ({
            category: { connect: { id: category.id } }, // Conectar con categoría existente
          })),
        },
        tags: {
          create: tags.map((tag) => ({
            tag: { connect: { id: tag.id } }, // Conectar con etiqueta existente
          })),
        },
      },
    });

    return res.status(201).json({ message: 'Note created successfully', note });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create note' });
  }
};

//UPDATE NOTES FUNCIONANDO
export const updateNote = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { title, content, archived, categoryNames, tagNames, userId } = req.body;

  // Validación de longitud para el título y contenido
  if (title.length > 200) {
    return res.status(400).json({ message: 'Title exceeds maximum length of 200 characters' });
  }

  if (content.length > 5000) {
    return res.status(400).json({ message: 'Content exceeds maximum length of 5000 characters' });
  }

  try {
    const parsedNoteId = parseInt(id);
    if (isNaN(parsedNoteId)) {
      return res.status(400).json({ message: 'Invalid noteId' });
    }

    // Buscar la nota que pertenece al usuario
    const existingNote = await prisma.note.findUnique({
      where: {
        id: parsedNoteId,
        userId, // Verificar que la nota pertenezca al usuario
      },
    });

    if (!existingNote) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    // Actualizar el título y contenido
    const updatedNote = await prisma.note.update({
      where: { id: parsedNoteId },
      data: {
        title,        // Actualizar el título
        content,      // Actualizar el contenido
        archived,     // Actualizar el estado de archivado
      },
    });

    // Eliminar las categorías y etiquetas actuales
    await prisma.noteCategory.deleteMany({
      where: { noteId: parsedNoteId },
    });
    await prisma.noteTag.deleteMany({
      where: { noteId: parsedNoteId },
    });

    // Crear o buscar las nuevas categorías
    const categories = categoryNames && categoryNames.length > 0
      ? await Promise.all(
          categoryNames.map(async (name: string) => {
            let category = await prisma.category.findFirst({
              where: { name },
            });

            if (!category) {
              category = await prisma.category.create({
                data: { name },
              });
            }

            return category;
          })
        )
      : [];

    // Crear o buscar las nuevas etiquetas
    const tags = tagNames && tagNames.length > 0
      ? await Promise.all(
          tagNames.map(async (name: string) => {
            let tag = await prisma.tag.findFirst({
              where: { name },
            });

            if (!tag) {
              tag = await prisma.tag.create({
                data: { name },
              });
            }

            return tag;
          })
        )
      : [];

    // Crear las relaciones con las nuevas categorías y etiquetas
    await Promise.all(
      categories.map(async (category) => {
        await prisma.noteCategory.create({
          data: {
            noteId: parsedNoteId,
            categoryId: category.id,
          },
        });
      })
    );

    await Promise.all(
      tags.map(async (tag) => {
        await prisma.noteTag.create({
          data: {
            noteId: parsedNoteId,
            tagId: tag.id,
          },
        });
      })
    );

    return res.status(200).json({
      message: 'Note updated successfully',
      note: updatedNote,
    });
  } catch (err) {
    console.error('Error al actualizar la nota:', err);
    return res.status(500).json({ message: 'Failed to update note' });
  }
};

// DELETE NOTE FUNCIONANDO
export const deleteNote = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    // Verificar si la nota existe
    const note = await prisma.note.findUnique({
      where: { id: Number(id) },
      include: {
        categories: true, // Incluye las categorías relacionadas
        tags: true,       // Incluye las etiquetas relacionadas
      },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Verificar que la nota pertenece al usuario
    if (note.userId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this note' });
    }

    // Eliminar las relaciones con categorías y etiquetas
    await prisma.noteCategory.deleteMany({
      where: { noteId: Number(id) },
    });
    await prisma.noteTag.deleteMany({
      where: { noteId: Number(id) },
    });

    // Eliminar la nota
    await prisma.note.delete({
      where: { id: Number(id) },
    });

    console.log(`Nota con ID ${id} eliminada exitosamente por el usuario ${userId}`);

    return res.status(204).send(); // Respuesta exitosa sin contenido
  } catch (error) {
    console.error('Error al eliminar la nota:', error);
    return res.status(500).json({ error: 'Failed to delete note' });
  }
};
//GET ACTIVE NOTES FUNCIONANDO
export const getActiveNotes = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.query;

  // Verificar que userId sea válido
  if (!userId || isNaN(Number(userId))) {
    return res.status(400).json({ error: 'userId is required and must be a number' });
  }

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: Number(userId),
        archived: false, // Filtrar por notas activas
      },
      include: {
        categories: {
          include: {
            category: true, // Obtener detalles de las categorías relacionadas
          },
        },
        tags: {
          include: {
            tag: true, // Obtener detalles de las etiquetas relacionadas
          },
        },
      },
    });

    // Mapear la respuesta para simplificar la estructura de salida
    const formattedNotes = notes.map((note) => ({
      ...note,
      categories: note.categories.map((noteCategory) => noteCategory.category),
      tags: note.tags.map((noteTag) => noteTag.tag),
    }));

    return res.json(formattedNotes);
  } catch (error) {
    console.error('Error al obtener las notas activas:', error);
    return res.status(500).json({ error: 'Failed to fetch active notes' });
  }
};
// GET ARCHIVED FUNCIONANDO
export const getArchivedNotes = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.query;

  // Verificar que userId sea válido
  if (!userId || isNaN(Number(userId))) {
    return res.status(400).json({ error: 'userId is required and must be a number' });
  }

  try {
    const archivedNotes = await prisma.note.findMany({
      where: {
        userId: Number(userId),
        archived: true, // Filtrar por notas archivadas
      },
      include: {
        categories: true,
        tags: true,
      },
    });

    // Si no hay notas archivadas, devolver un array vacío
    return res.json(archivedNotes.length > 0 ? archivedNotes : []);
  } catch (error) {
    console.error('Error al obtener las notas archivadas:', error);
    return res.status(500).json({ error: 'Failed to fetch archived notes' });
  }
};
// GET NOTE BY ID FUNCIONANDO
export const getNoteById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  // Verificar que el ID sea válido
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'id is required and must be a number' });
  }

  try {
    // Buscar la nota por ID con las relaciones de categorías y etiquetas
    const note = await prisma.note.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        categories: {
          include: {
            category: true, // Obtener detalles de las categorías relacionadas
          },
        },
        tags: {
          include: {
            tag: true, // Obtener detalles de las etiquetas relacionadas
          },
        },
      },
    });

    // Verificar si la nota existe
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Mapear la respuesta para simplificar la estructura de salida
    const formattedNote = {
      ...note,
      categories: note.categories.map((noteCategory) => noteCategory.category),
      tags: note.tags.map((noteTag) => noteTag.tag),
    };
    return res.json(formattedNote);
  } catch (error) {
    console.error('Error al obtener la nota por ID:', error);
    return res.status(500).json({ error: 'Failed to fetch note' });
  }
};

// toogle funcionando
export const toggleArchiveNote = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params; // ID de la nota a actualizar

  try {
    // Buscar la nota por su ID
    const note = await prisma.note.findUnique({ where: { id: Number(id) } });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Alternar el valor de "archived"
    const updatedNote = await prisma.note.update({
      where: { id: Number(id) },
      data: { archived: !note.archived },
    });

    // Verificar si la nota fue realmente actualizada
    if (!updatedNote) {
      return res.status(400).json({ message: 'Failed to update archived status' });
    }

    return res.status(200).json({
      message: 'Note archived status toggled successfully',
      note: updatedNote,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to toggle archived status' });
  }
};
