import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { PrismaService } from '../prisma.services';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import mockData from './mocks';
import { FindUserDto } from './dto/find-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const UserServiceProvider = {
      provide: UserService,
      useFactory: () => ({
        find: jest.fn().mockResolvedValue(mockData.users),
        findUnique: jest.fn().mockResolvedValue(mockData.users[0]),
        create: jest.fn().mockResolvedValue(mockData.users[0]),
        update: jest.fn().mockResolvedValue(mockData.users[0]),
        delete: jest.fn().mockResolvedValue({ users: mockData.users[0] }),
        authenticateAndGetJwtToken: jest.fn().mockResolvedValue({ token: 'token-string' }),
        authenticate: jest.fn().mockResolvedValue({ is_authenticated: false }),
        validateToken: jest.fn().mockResolvedValue({ is_valid: true }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'JWT_SECRET',
          signOptions: {
            expiresIn: '1year',
            algorithm: 'HS256',
          },
        }),
      ],
      providers: [UserServiceProvider, PrismaService, JwtStrategy, ConfigService],
    }).compile();
    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  // These test ascertains that the respective services are called.
  // The services itself have been tested, so we can as well mock the results here
  describe('UserController.find', () => {
    it('should get an array of users', async () => {
      const dto = new FindUserDto();
      const findUserSpy = jest.spyOn(userService, 'find');
      const user = { username: 'Dele Alli', id: 1, is_admin: true };
      const result = await userController.find(dto, user);
      expect(result).toEqual(mockData.users);
      expect(findUserSpy).toHaveBeenCalledWith(dto);
    });
  });

  describe('UserController.findUnique', () => {
    it('should get a user', async () => {
      const findOneUserSpy = jest.spyOn(userService, 'findUnique');
      const result = await userController.findUnique(1);
      expect(result).toEqual(mockData.users[0]);
      expect(findOneUserSpy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('UserController.create', () => {
    it('should create a user', async () => {
      const createUserSpy = jest.spyOn(userService, 'create');
      const createUserDto = new CreateUserDto();
      const result = await userController.create(createUserDto);
      expect(result).toEqual(mockData.users[0]);
      expect(createUserSpy).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('UserController.update', () => {
    it('should update a user', async () => {
      const updateUserSpy = jest.spyOn(userService, 'update');
      const updateUserDto = new UpdateUserDto();
      updateUserDto.id = 1;
      const result = await userController.update(updateUserDto);
      expect(result).toEqual(mockData.users[0]);
      expect(updateUserSpy).toHaveBeenCalledWith(updateUserDto);
    });
  });

  describe('UserController.delete', () => {
    it('should delete a user', async () => {
      const deleteUserSpy = jest.spyOn(userService, 'delete');
      const deleteUserDto = new DeleteUserDto();
      deleteUserDto.id = 1;

      const result = await userController.delete(deleteUserDto);
      expect(result).toEqual({ users: mockData.users[0] });
      expect(deleteUserSpy).toHaveBeenCalledWith(deleteUserDto);
    });
  });

  describe('UserController.userValidateToken', () => {
    it('should validate a user', async () => {
      const validateTokenSpy = jest.spyOn(userService, 'validateToken');
      const result = await userController.userValidateToken(mockData.token);
      expect(result).toEqual({ is_valid: true });
      expect(validateTokenSpy).toBeCalled();
    });
  });

  describe('UserController.userAuthenticate', () => {
    it('should authenticate a user', async () => {
      const authenticateSpy = jest.spyOn(userService, 'authenticate');
      const authenticateUserDto = new AuthenticateUserDto();
      authenticateUserDto.email = 'random-email@hey.com';
      authenticateUserDto.password = 'rasazSwds';
      const result = await userController.userAuthenticate(authenticateUserDto);
      expect(result).toEqual({ is_authenticated: false });
      expect(authenticateSpy).toHaveBeenCalledWith(authenticateUserDto, false);
    });
  });

  describe('UserController.userGetToken', () => {
    it('should authenticate a user and return token', async () => {
      const authenticateAndGetJWTSpy = jest.spyOn(userService, 'authenticateAndGetJwtToken');
      const authenticateUserDto = new AuthenticateUserDto();
      authenticateUserDto.email = 'random-email@hey.com';
      authenticateUserDto.password = 'rasazSwds';
      const result = await userController.userGetToken(authenticateUserDto);
      expect(result).toEqual({ token: 'token-string' });
      expect(authenticateAndGetJWTSpy).toHaveBeenCalledWith(authenticateUserDto);
    });
  });
});
