import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { PrismaService } from '../prisma.services';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { FindUserDto } from './dto/find-user.dto';
import { DELETED_USER_NAME } from '../common/utils/constants';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import mockData from './mocks';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    const PrismaServiceMock = {
      provide: PrismaService,
      useFactory: () => ({
        user: {
          findUnique: jest.fn((obj) => {
            if (obj.where.id) {
              return mockData.users.find((x) => x.id === obj.where.id);
            } else {
              const user = mockData.users.find((x) => x.email === obj.where.email);
              if (user) {
                user.credential = mockData.credentials[0];
              }
              return user;
            }
          }),
          findMany: jest.fn(() => mockData.users),
          // create: jest.fn((dto: CreateUserDto) => dto),
          create: jest.fn((obj) => {
            const credData = {
              id: mockData.credentials.length + 1,
              hash: obj.data.credential.hash,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            mockData.credentials.push(credData);
            mockData.users.push({
              name: obj.name,
              email: obj.email,
              credentials_id: credData.id,
              email_confirmed: false,
              is_admin: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              deleted_at: null,
              id: mockData.users.length + 1,
            });
            return mockData.users[2];
          }),
          update: jest.fn((obj) => {
            mockData.users[0].name = obj.data.name;
            return mockData.users[0];
          }),
          delete: jest.fn((obj) => obj),
          authenticate: jest.fn((obj) => obj),
        },
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
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
      providers: [UserService, PrismaServiceMock, JwtStrategy, ConfigService],
    }).compile();
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('User.find', () => {
    it('should get all users', async () => {
      const findUserSpy = jest.spyOn(userService, 'find');
      const dto = new FindUserDto();
      let result = null;
      try {
        result = await userService.find(dto);
      } catch (e) {}
      expect(findUserSpy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockData.users);
    });
  });

  describe('User.create', () => {
    it('should create a user', async () => {
      const createUserSpy = jest.spyOn(userService, 'create');
      const dto = new CreateUserDto();
      dto.name = 'Yusuff Mustapha';
      dto.email = 'dele@alli.com';
      dto.password = 'password';
      let result = null;
      try {
        result = await userService.create(dto);
      } catch (e) {}
      expect(createUserSpy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockData.users[2]);
    });
  });

  describe('User.findUnique', () => {
    it('should get a user', async () => {
      const findUserSpy = jest.spyOn(userService, 'findUnique');
      const dto = { id: 1 };
      let result = null;
      try {
        result = await userService.findUnique(dto);
      } catch (e) {}
      expect(findUserSpy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockData.users[0]);
    });
  });

  describe('User.update', () => {
    it('should update a user', async () => {
      const updateUserSpy = jest.spyOn(userService, 'update');
      const dto = new UpdateUserDto();
      dto.id = 1;
      dto.name = 'New name';
      let result = null;
      try {
        result = await userService.update(dto);
      } catch (e) {}
      expect(updateUserSpy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockData.users[0]);
      expect(result.name).toEqual('New name');
    });
  });

  describe('User.delete', () => {
    it('should delete a user', async () => {
      const deleteUserSpy = jest.spyOn(userService, 'delete');
      const findUniqueUserSpy = jest.spyOn(userService, 'findUnique');
      const updateUserSpy = jest.spyOn(userService, 'update');
      const dto = new DeleteUserDto();
      dto.id = 1;
      let result = null;
      try {
        result = await userService.delete(dto);
      } catch (e) {}
      expect(deleteUserSpy).toHaveBeenCalledWith(dto);
      expect(findUniqueUserSpy).toHaveBeenCalledWith(dto);
      expect(updateUserSpy).toBeCalled();
      expect(result.users.name).toEqual(DELETED_USER_NAME);
    });
  });

  describe('User.authenticate', () => {
    it('should NOT authenticate a user - incorrect credentials', async () => {
      const authenticateUserSpy = jest.spyOn(userService, 'authenticate');
      const findUniqueUserSpy = jest.spyOn(userService, 'findUnique');
      const dto = new AuthenticateUserDto();
      dto.email = 'yusuff@gmail.com';
      dto.password = 'gmailascom';
      await expect(userService.authenticate(dto, false)).rejects.toThrow(
        'Authentication failed. Please confirm your credentials',
      );
      expect(authenticateUserSpy).toHaveBeenCalledWith(dto, false);
      expect(findUniqueUserSpy).toBeCalled();
    });

    it('should authenticate a user', async () => {
      const authenticateUserSpy = jest.spyOn(userService, 'authenticate');
      const findUniqueUserSpy = jest.spyOn(userService, 'findUnique');
      const dto = new AuthenticateUserDto();
      dto.email = 'Allen_Nienow@fake-mail.com';
      dto.password = 'password123';
      let result;
      try {
        result = await userService.authenticate(dto, false);
      } catch (error) {}
      expect(result).toHaveProperty('is_authenticated');
      expect(result.is_authenticated).toBe(true);
      expect(authenticateUserSpy).toHaveBeenCalledWith(dto, false);
      expect(findUniqueUserSpy).toBeCalled();
    });
  });

  describe('User.authenticateAndGetJwtToken', () => {
    it('should authenticate a user and return token', async () => {
      const authenticateUserSpy = jest.spyOn(userService, 'authenticate');
      const authenticateAndGetJWTSpy = jest.spyOn(userService, 'authenticateAndGetJwtToken');
      const findUniqueUserSpy = jest.spyOn(userService, 'findUnique');
      const dto = new AuthenticateUserDto();
      dto.email = 'Allen_Nienow@fake-mail.com';
      dto.password = 'password123';
      let result;
      try {
        result = await userService.authenticateAndGetJwtToken(dto);
      } catch (error) {}
      mockData.token = result.token;
      expect(result).toHaveProperty('token');
      expect(result.token).not.toBeFalsy();
      expect(authenticateAndGetJWTSpy).toHaveBeenCalledWith(dto);
      expect(authenticateUserSpy).toHaveBeenCalledWith(dto, true);
      expect(findUniqueUserSpy).toBeCalled();
    });
  });

  describe('User.validateToken', () => {
    it("should validate a user token - return valid as it's a valid token ", async () => {
      const validateTokenSpy = jest.spyOn(userService, 'validateToken');
      let result = null;
      try {
        result = await userService.validateToken(mockData.token);
      } catch (e) {}
      expect(result).toHaveProperty('is_valid');
      expect(result.is_valid).not.toBeFalsy();
      expect(validateTokenSpy).toHaveBeenCalledWith(mockData.token);
    });

    it('should validate a user token - return invalid as token is not valid', async () => {
      const validateTokenSpy = jest.spyOn(userService, 'validateToken');
      let result = null;
      try {
        result = await userService.validateToken(mockData.credentials[1].hash);
      } catch (e) {}
      expect(result).toHaveProperty('is_valid');
      expect(result.is_valid).toBeFalsy();
      expect(validateTokenSpy).toHaveBeenCalledWith(mockData.credentials[1].hash);
    });
  });
});
