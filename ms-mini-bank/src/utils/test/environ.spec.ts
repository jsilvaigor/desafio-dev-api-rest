import { configureEnvironmentVars } from '../environ';

describe('Environment variables validation', () => {
  let envVars: any;

  beforeEach(() => {
    envVars = {
      DOTENV_CONFIG_PATH: 'env/local/.env',
      NODE_ENV: 'test',
      LOG_LEVEL: 'debug',
      PORT: '3000',
      APPLICATION_PREFIX: '/mini-bank/v1',
      APPLICATION: 'ms-mini-bank',
      PGSQL_USER: 'test_user',
      PGSQL_PASS: 'test_pass',
      PGSQL_HOST: 'localhost',
      PGSQL_PORT: '5432',
      PGSQL_DATABASE: 'db',
      SALTS_OR_ROUNDS: '10',
      JWT_SECRET: 'secret',
    };
  });

  it('success validation', () => {
    const expected = {
      NODE_ENV: 'test',
      LOG_LEVEL: 'debug',
      PORT: 3000,
      APPLICATION_PREFIX: '/mini-bank/v1',
      APPLICATION: 'ms-mini-bank',
      PGSQL_USER: 'test_user',
      PGSQL_PASS: 'test_pass',
      PGSQL_HOST: 'localhost',
      PGSQL_PORT: 5432,
      PGSQL_DATABASE: 'db',
      SALTS_OR_ROUNDS: 10,
      JWT_SECRET: 'secret',
    };
    const validated = configureEnvironmentVars(envVars);
    expect(validated).toEqual(expected);
  });

  describe('exception validation', () => {
    it('no pgsql_user', () => {
      delete envVars.PGSQL_USER;
      expect(() => configureEnvironmentVars(envVars)).toThrowError('Config validation error: "PGSQL_USER" is required');
    });

    it('no pgsql_pass', () => {
      delete envVars.PGSQL_PASS;
      expect(() => configureEnvironmentVars(envVars)).toThrowError('Config validation error: "PGSQL_PASS" is required');
    });
    it('no pgsql_host', () => {
      delete envVars.PGSQL_HOST;
      expect(() => configureEnvironmentVars(envVars)).toThrowError('Config validation error: "PGSQL_HOST" is required');
    });
    it('no pgsql_database', () => {
      delete envVars.PGSQL_DATABASE;
      expect(() => configureEnvironmentVars(envVars)).toThrowError(
        'Config validation error: "PGSQL_DATABASE" is required',
      );
    });

    it('unknown node_env', () => {
      envVars.NODE_ENV = 'not_a_env';
      expect(() => configureEnvironmentVars(envVars)).toThrowError(
        'Config validation error: "NODE_ENV" must be one of [dev, prod, test',
      );
    });
    it('unknown log_level', () => {
      envVars.LOG_LEVEL = 'not_a_loglevel';
      expect(() => configureEnvironmentVars(envVars)).toThrowError(
        'Config validation error: "LOG_LEVEL" must be one of [debug, info, warn, error',
      );
    });
  });
});
