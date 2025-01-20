import { Request, Response } from 'express';
import { prisma } from '../config/prisma'; // Asegúrate de importar el cliente Prisma
import bcryptjs from 'bcryptjs';
const validator = require('validator');


// Controlador para crear un nuevo usuario
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  console.log(req.body);
  // Validación básica de campos
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Todos los campos son obligatorios.',
    });
  }

  // Validar si el usuario o el email ya existen
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { name: name }],
    },
  });

  if (existingUser) {
    return res.status(400).json({
      message: 'El usuario o el email ya están registrados.',
    });
  }

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: 'Usuario creado con éxito',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Error al crear el usuario.' });
    }
    console.error('Error desconocido');
    return res.status(500).json({ message: 'Error al crear el usuario.' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  console.log("Datos recibidos en el backend:", { id, name, email, password }); // Log de los datos recibidos

  try {
    // Validación de ID
    const userId = parseInt(id);
    if (isNaN(userId)) {
      console.error("ID de usuario inválido");
      return res.status(400).json({ message: "ID de usuario inválido." });
    }

    // Validar el usuario existente
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("Usuario no encontrado");
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Validar correo electrónico si se proporciona
    if (email) {
      if (!validator.isEmail(email)) {
        console.error("Correo electrónico no válido");
        return res.status(400).json({ message: "El correo electrónico no es válido." });
      }

      // Verificar si el correo ya está en uso por otro usuario
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists && emailExists.id !== userId) {
        console.error("Correo electrónico ya en uso");
        return res.status(409).json({ message: "El correo electrónico ya está en uso." });
      }
    }

    // Validar contraseña si se proporciona
    let hashedPassword = undefined;
    if (password) {
      if (!validator.isStrongPassword(password)) {
        console.error("Contraseña no segura");
        return res.status(400).json({
          message: "La contraseña no es suficientemente segura.",
          criteria:
            "Debe incluir al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un símbolo ! @ # $ % ^ & * ( ) _ - = + { } [ ] | \ : ;  ' < > , . ? / ",
        });
      }

      hashedPassword = await bcryptjs.hash(password, 10);
    }

    // Construir objeto de actualización dinámicamente
    const updatedData: any = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (hashedPassword) updatedData.password = hashedPassword;

    // Verificar que al menos un campo se va a actualizar
    if (Object.keys(updatedData).length === 0) {
      console.error("No se proporcionaron datos para actualizar");
      return res.status(400).json({ message: "No se proporcionaron datos para actualizar." });
    }

    // Actualizar el usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    console.log("Usuario actualizado:", updatedUser); // Log del usuario actualizado

    return res.status(200).json({
      message: "Usuario actualizado con éxito.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en el backend:", error.message);
      return res.status(500).json({ message: "Error al actualizar el usuario.", error });
    }
    console.error("Error desconocido");
    return res.status(500).json({ message: "Error al actualizar el usuario.", error });
  }
};



