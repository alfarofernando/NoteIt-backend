import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Hashea una contraseña utilizando bcrypt.
 * @param password Contraseña en texto plano que será hasheada.
 * @returns La contraseña hasheada.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcryptjs.hash(password, saltRounds);
};

/**
 * Verifica si una contraseña proporcionada coincide con la contraseña hasheada almacenada.
 * @param plainPassword Contraseña en texto plano proporcionada por el usuario.
 * @param hashedPassword Contraseña hasheada almacenada en la base de datos.
 * @returns Un booleano que indica si las contraseñas coinciden.
 */
export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcryptjs.compare(plainPassword, hashedPassword);
};
