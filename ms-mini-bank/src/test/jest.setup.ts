import { TypeOrmForTest } from './test.utils';

beforeAll(() => {
  TypeOrmForTest.getInstance();
});
afterAll(() => {
  return TypeOrmForTest.closeConnection();
});
