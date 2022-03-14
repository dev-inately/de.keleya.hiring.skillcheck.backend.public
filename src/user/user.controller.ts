import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  HttpCode,
  UseGuards,
  NotImplementedException,
  ValidationPipe,
  SetMetadata,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { EndpointIsPublic, getToken } from 'src/common/decorators';
import { adminAction } from 'src/common/decorators/adminAction.decorator';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async find(@Query(new ValidationPipe({ transform: true })) findUserDto: FindUserDto) {
    return this.usersService.find(findUserDto);
  }

  @Get(':id')
  async findUnique(@Param('id', ParseIntPipe) id){
    return this.usersService.findUnique({ id });
  }

  @Post()
  @EndpointIsPublic()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete()
  @adminAction()
  async delete(@Body() deleteUserDto: DeleteUserDto) {
    return this.usersService.delete(deleteUserDto);
  }

  @Post('validate')
  @HttpCode(200)
  @EndpointIsPublic()
  async userValidateToken(@getToken() token: string) {
    return this.usersService.validateToken(token);
  }

  @Post('authenticate')
  @HttpCode(200)
  @EndpointIsPublic()
  async userAuthenticate(@Body(new ValidationPipe({ transform: true })) authenticateUserDto: AuthenticateUserDto) {
    return this.usersService.authenticate(authenticateUserDto, false);
  }

  @Post('token')
  @HttpCode(200)
  @EndpointIsPublic()
  async userGetToken(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.usersService.authenticateAndGetJwtToken(authenticateUserDto);
  }
}
