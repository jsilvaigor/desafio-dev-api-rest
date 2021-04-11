import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH });

export interface EnvVars {
  NODE_ENV: string;
  LOG_LEVEL: string;
  PORT: number;

  APPLICATION_PREFIX: string;
  APPLICATION: string;

  PGSQL_USER: string;
  PGSQL_PASS: string;
  PGSQL_HOST: string;
  PGSQL_PORT: number;
  PGSQL_DATABASE: string;
}

const PGSQL_VARS = {
  PGSQL_USER: Joi.string().required(),
  PGSQL_PASS: Joi.string().required(),
  PGSQL_HOST: Joi.string().required(),
  PGSQL_PORT: Joi.number().default(5234),
  PGSQL_DATABASE: Joi.string().required(),
};

export function configureEnvironmentVars(environment: Record<string, unknown>): EnvVars {
  const schema = Joi.object({
    NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
    LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('debug'),
    PORT: Joi.number().default(3000),
    APPLICATION_PREFIX: Joi.string().default('/mini-bank/v1'),
    APPLICATION: Joi.string().default('ms-mini-bank'),
    ...PGSQL_VARS,
  });

  const { error, value: vars } = schema.validate(environment, {
    stripUnknown: true,
  });
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return vars;
}

let envVars: EnvVars;

try {
  envVars = configureEnvironmentVars(process.env);
} catch (e) {
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') {
    console.error(e);
    /* istanbul ignore next */
    process.exit(1);
  }
}
export default envVars;
