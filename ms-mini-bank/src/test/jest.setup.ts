import { TypeOrmForTest } from './test.utils';

beforeAll(async () => {
  TypeOrmForTest.getInstance();
  await TypeOrmForTest.getConnection();
});
afterAll(() => {
  return TypeOrmForTest.closeConnection();
});
