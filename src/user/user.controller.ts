import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, HttpCode } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtTokenUser } from '../common/types/jwtTokenUser';
import { EndpointIsPublic, getToken, AdminAction, CurrentUser, getUser } from '../common/decorators';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticateEntity, LoginEntity, UserEntity, ValidateTokenEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all Users [admin operation]' })
  @ApiForbiddenResponse({ description: 'You are not allowed to perform this action' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ status: 200, description: 'Records fetched', type: [UserEntity] })
  find(@Query() findUserDto: FindUserDto, @getUser() user: JwtTokenUser) {
    if (!user.is_admin) findUserDto.id = [user.id];
    return this.usersService.find(findUserDto);
  }

  @Get(':id')
  @CurrentUser()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find A User' })
  @ApiForbiddenResponse({ description: 'You are not allowed to perform this action' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ status: 200, description: 'Record fetched', type: UserEntity })
  async findUnique(@Param('id', ParseIntPipe) id) {
    return this.usersService.findUnique({ id });
  }

  @Post()
  @EndpointIsPublic()
  @ApiOperation({ summary: 'Create a User' })
  @ApiOkResponse({ status: 200, description: 'User created', type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch()
  @ApiBearerAuth()
  @CurrentUser()
  @ApiOperation({ summary: 'Update a User' })
  @ApiForbiddenResponse({ description: 'You are not allowed to perform this action' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ status: 200, description: 'User updated', type: UserEntity })
  async update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete()
  @AdminAction()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete A User [admin operation]' })
  @ApiForbiddenResponse({ description: 'You are not allowed to perform this action' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ status: 200, description: 'Record deleted', type: UserEntity })
  async delete(@Body() deleteUserDto: DeleteUserDto) {
    return this.usersService.delete(deleteUserDto);
  }

  @Post('validate')
  @HttpCode(200)
  @EndpointIsPublic()
  @ApiOperation({ summary: 'Validate User token' })
  @ApiOkResponse({ status: 200, description: 'Token validate', type: ValidateTokenEntity })
  async userValidateToken(@getToken() token: string) {
    return this.usersService.validateToken(token);
  }

  @Post('authenticate')
  @HttpCode(200)
  @EndpointIsPublic()
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiOkResponse({ status: 200, description: 'Is user credential valid', type: AuthenticateEntity })
  async userAuthenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.usersService.authenticate(authenticateUserDto, false);
  }

  @Post('token')
  @HttpCode(200)
  @EndpointIsPublic()
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ status: 200, description: 'Returns a jwt token', type: LoginEntity })
  async userGetToken(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.usersService.authenticateAndGetJwtToken(authenticateUserDto);
  }
}
