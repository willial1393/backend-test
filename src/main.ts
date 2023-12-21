import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('NestApplication');
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Skill Test - Backend Developer')
    .setDescription('The Skill Test API description')
    .setContact(
      'William Vega',
      'https://github.com/willial1393',
      'willial1393@gmail.com',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
  logger.log('Application is running on: http://localhost:3000');
  logger.log('Documentation is running on: http://localhost:3000/doc');
}

bootstrap();
