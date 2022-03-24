import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, HttpCode } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { getUser } from '../common/decorators/getUser.decorator';
import { JwtTokenUser } from '../common/types/jwtTokenUser';
import { EndpointIsPublic, getToken, AdminAction, CurrentUser } from './../common/decorators';
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
  @ApiBearerAuth()
  find(@Query() findUserDto: FindUserDto, @getUser() user: JwtTokenUser) {
    if (!user.is_admin) findUserDto.id = [user.id];
    return this.usersService.find(findUserDto);
  }

  @Get(':id')
  @CurrentUser()
  async findUnique(@Param('id', ParseIntPipe) id) {
    return this.usersService.findUnique({ id });
  }

  @Post()
  @EndpointIsPublic()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch()
  @ApiBearerAuth()
  @CurrentUser()
  async update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete()
  @AdminAction()
  @HttpCode(200)
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
  async userAuthenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.usersService.authenticate(authenticateUserDto, false);
  }

  @Post('token')
  @HttpCode(200)
  @EndpointIsPublic()
  async userGetToken(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.usersService.authenticateAndGetJwtToken(authenticateUserDto);
  }
}
