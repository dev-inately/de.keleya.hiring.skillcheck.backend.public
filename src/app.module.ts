import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { QueryExceptionFilter } from './common/exception-filters';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { CurrentUserGuard, JwtAuthGuard, RolesGuard } from './common/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !process.env.NODE_ENV ? '.env' : `.env.${process.env.NODE_ENV}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      cache: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string(),
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string(),
      }),
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1year',
          algorithm: 'HS256',
        },
      }),
    }),
  ],
  controllers: [AppController, UserController],
  providers: [
    UserService,
    PrismaService,
    ConfigService,
    JwtStrategy,
    { provide: APP_FILTER, useClass: QueryExceptionFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: CurrentUserGuard },
  ],
})
export class AppModule {}
