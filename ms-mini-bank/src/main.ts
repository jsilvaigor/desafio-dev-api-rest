/* istanbul ignore file */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import envVars from './utils/environ';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';

async function bootstrap() {
  // Initialize and validate environment variables
  require('./utils/environ');
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.setGlobalPrefix(envVars.APPLICATION_PREFIX);
  const config = new DocumentBuilder()
    .setTitle('MS Mini Bank')
    .setDescription('Manage Persons and Accounts')
    .setVersion('1.0')
    .addTag('person')
    .addTag('bankAccount')
    .addTag('health')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(envVars.PORT);
}

(async () => bootstrap())();
