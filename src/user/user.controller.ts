import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, HttpCode } from '@nestjs/common';

import { getToken } from './../common/decorators';
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
  find(@Query() findUserDto: FindUserDto) {
    return this.usersService.find(findUserDto);
  }

  @Get(':id')
  async findUnique(@Param('id', ParseIntPipe) id) {
    return this.usersService.findUnique({ id });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete()
  @HttpCode(200)
  async delete(@Body() deleteUserDto: DeleteUserDto) {
    return this.usersService.delete(deleteUserDto);
  }

  @Post('validate')
  @HttpCode(200)
  async userValidateToken(@getToken() token: string) {
    return this.usersService.validateToken(token);
  }

  @Post('authenticate')
  @HttpCode(200)
  async userAuthenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.usersService.authenticate(authenticateUserDto, false);
  }

  @Post('token')
  @HttpCode(200)
  async userGetToken(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.usersService.authenticateAndGetJwtToken(authenticateUserDto);
  }
}
