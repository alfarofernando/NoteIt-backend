/**
 * Hashea una contraseña utilizando bcrypt.
 * @param password Contraseña en texto plano que será hasheada.
 * @returns La contraseña hasheada.
 */
export declare const hashPassword: (password: string) => Promise<string>;
/**
 * Verifica si una contraseña proporcionada coincide con la contraseña hasheada almacenada.
 * @param plainPassword Contraseña en texto plano proporcionada por el usuario.
 * @param hashedPassword Contraseña hasheada almacenada en la base de datos.
 * @returns Un booleano que indica si las contraseñas coinciden.
 */
export declare const verifyPassword: (plainPassword: string, hashedPassword: string) => Promise<boolean>;
//# sourceMappingURL=authService.d.ts.map