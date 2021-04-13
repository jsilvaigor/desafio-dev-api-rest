import { checkPassword, hashPassword } from '../password.utils';

describe('password utils', () => {
  it('should return a valid bcrypt', async () => {
    const bcryptRegex = /^\$2[ayb]\$.{56}$/;
    const hashed = await hashPassword('pass', 10);
    expect(hashed).toBeTruthy();
    expect(bcryptRegex.test(hashed)).toBeTruthy();
  });
  it('should validate correctly', async () => {
    const hashed = await hashPassword('pass', 10);
    const validated = await checkPassword('pass', hashed);
    expect(validated).toBeTruthy();
  });
  it('should not validate', async () => {
    const hashed = await hashPassword('pass', 10);
    const validated = await checkPassword('wrong', hashed);
    expect(validated).toBeFalsy();
  });
  it('should not validate due to invalid hash', async () => {
    const validated = await checkPassword('', undefined);
    expect(validated).toBeFalsy();
  });
});
