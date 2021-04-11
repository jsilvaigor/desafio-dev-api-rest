import envVars from './environ';
import * as bcrypt from 'bcrypt';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, envVars.SALTS_OR_ROUNDS);
}

export async function checkPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (e) {
    console.error(e);
    return false;
  }
}
