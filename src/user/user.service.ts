import { Injectable, NotImplementedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma.services';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateCredentialDto } from './dto/create-credentials.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword, matchHashedPassword } from '../common/utils/password';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  /**
   * Finds users with matching fields
   *
   * @param findUserDto
   * @returns User[]
   */
  async find(findUserDto: FindUserDto): Promise<User[] | null> {
    const { offset: skip, limit: take } = findUserDto;
    const queryObject = { skip, take };
    // if (findUserDto.credentials) {
    //   queryObject.include = { findUserDto.credentials }
    // }
    return this.prisma.user.findMany(queryObject);
  }

  /**
   * Finds single User by id, name or email
   *
   * @param whereUnique
   * @returns User
   */
  async findUnique(whereUnique: Prisma.UserWhereUniqueInput, includeCredentials = false): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: whereUnique,
      include: { credential: includeCredentials },
    });
  }

  /**
   * Creates a new user with credentials
   *
   * @param createUserDto
   * @returns result of create
   */
  async create(createUserDto: CreateUserDto) {
    console.log('create User DTO IS', createUserDto);
    const { password, ...userData } = createUserDto;
    const hash = await hashPassword(password);
    // Guarantee transactional write
    return this.prisma.user.create({
      data: { ...userData, credential: { create: { hash } } },
    });
  }

  /**
   * Updates a user unless it does not exist or has been marked as deleted before
   *
   * @param updateUserDto
   * @returns result of update
   */
  // async update(updateUserDto: UpdateUserDto) {
  //   const { id, credential, ...updateData } = updateUserDto;
  //   if (credential) {
  //     credential: {
  //       update: {
  //         where;
  //       }
  //     }
  //   }
  //   return this.prisma.user.update({ data: updateData });
  // }

  /**
   * Deletes a user
   * Function does not actually remove the user from database but instead marks them as deleted by:
   * - removing the corresponding `credentials` row from your db
   * - changing the name to DELETED_USER_NAME constant (default: `(deleted)`)
   * - setting email to NULL
   *
   * @param deleteUserDto
   * @returns results of users and credentials table modification
   */
  async delete(deleteUserDto: DeleteUserDto) {
    throw new NotImplementedException();
  }

  /**
   * Authenticates a user and returns a JWT token
   *
   * @param authenticateUserDto email and password for authentication
   * @returns a JWT token
   */
  async authenticateAndGetJwtToken(authenticateUserDto: AuthenticateUserDto) {
    throw new NotImplementedException();
  }

  /**
   * Authenticates a user
   *
   * @param authenticateUserDto email and password for authentication
   * @returns true or false
   */
  async authenticate(authenticateUserDto: AuthenticateUserDto) {
    const user = await this.findUnique({ email: authenticateUserDto.email }, true);
    console.log('[user found]', user);
    if (!user) throw new BadRequestException({ message: 'Authentication failed. Please confirm your credentials' });
    console.log('[user found]', user);
    // return matchHashedPassword(authenticateUserDto.password, user.credentials.password);
  }

  /**
   * Validates a JWT token
   *
   * @param token a JWT token
   * @returns the decoded token if valid
   */
  async validateToken(token: string) {
    throw new NotImplementedException();
  }
}
