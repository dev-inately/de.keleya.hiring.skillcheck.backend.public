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
} from '@nestjs/common';
import { Request } from 'express';
import { IResponse } from 'src/common/interfaces';
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
  async find(
    @Query(new ValidationPipe({ transform: true })) findUserDto: FindUserDto,
    @Req() req: Request,
  ): Promise<IResponse> {
    const data = await this.usersService.find(findUserDto);
    return {
      status: 'success',
      data,
      message: 'Users fetch result',
    };
  }

  @Get(':id')
  async findUnique(@Param('id', ParseIntPipe) id, @Req() req: Request): Promise<IResponse> {
    const data = await this.usersService.findUnique({ id });
    return {
      status: 'success',
      data,
      message: 'User fetch Result',
    };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Patch()
  // async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
  //   throw new NotImplementedException();
  // }

  // @Delete()
  // async delete(@Body() deleteUserDto: DeleteUserDto, @Req() req: Request) {
  //   throw new NotImplementedException();
  // }

  // @Post('validate')
  // async userValidateToken(@Req() req: Request) {
  //   throw new NotImplementedException();
  // }

  @Post('authenticate')
  async userAuthenticate(
    @Body(new ValidationPipe({ transform: true })) authenticateUserDto: AuthenticateUserDto,
  ): Promise<IResponse> {
    const response = await this.usersService.authenticate(authenticateUserDto);
    return {
      status: 'success',
      data: { is_authenticated: response },
      message: 'Users fetch resulta',
    };
  }

  // @Post('token')
  // async userGetToken(@Body() authenticateUserDto: AuthenticateUserDto) {
  //   throw new NotImplementedException();
  // }
}
