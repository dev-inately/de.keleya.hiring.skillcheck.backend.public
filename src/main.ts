import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
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
  // app.useGlobalFilters()
  app.useGlobalFilters(new HttpExceptionFilter());
  // enable useContainer to be able to inject into class validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(configService.get('PORT'));
}
bootstrap();
