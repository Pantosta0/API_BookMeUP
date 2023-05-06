import bcrypt from "bcrypt";

/**
 * Función para cifrar una contraseña.
 * @param password La contraseña a cifrar.
 * @returns Una promesa que se resuelve con la contraseña cifrada.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

/**
 * Función para descifrar una contraseña.
 * @param password La contraseña cifrada.
 * @param hash La contraseña original cifrada.
 * @returns Una promesa que se resuelve con un booleano que indica si las contraseñas coinciden.
 */
export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  const match = await bcrypt.compare(password, hash);
  return match;
}
