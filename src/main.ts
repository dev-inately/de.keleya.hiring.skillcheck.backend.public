import { UnprocessableEntityException, ValidationError, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { RedocModule, RedocOptions } from 'nestjs-redoc';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception-filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['Authorization', 'Content-Type', 'apikey', 'Accept-Encoding'],
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  const configService = app.get(ConfigService);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

  const config = new DocumentBuilder()
    .setTitle('Keleya Test Documentation')
    .setDescription('A short demo description of the Keleya Test API')
    .addBearerAuth()
    .build();

  const options = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  const redocOptions: RedocOptions = {
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
    tagGroups: [
      {
        name: 'User resources',
        tags: ['Users'],
      },
      {
        name: 'Misc resources',
        tags: ['default'],
      },
    ],
  };
  SwaggerModule.setup('/docs', app, document);
  await RedocModule.setup('/api-docs', app, document, redocOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new UnprocessableEntityException({
          // Abort early type of erro, like joi does
          message: Object.values(validationErrors[0].constraints)[0],
        });
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  // enable useContainer to be able to inject into class validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(configService.get('PORT'));
}
bootstrap();
