import { TestUtils } from './test.utils';

beforeAll(async () => {
  TestUtils.getInstance();
  await TestUtils.getConnection();
});
afterAll(() => {
  return TestUtils.closeConnection();
});
