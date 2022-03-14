import { Injectable, NotImplementedException, BadRequestException, UnauthorizedException } from '@nestjs/common';
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
import { DELETED_USER_NAME, ERRORS } from '../common/utils/constants';
import { response } from 'express';
import { CommonFindAttributesDto } from 'src/common/dto/common-find-attributes.dto';
import {
  AuthenticateJWTResponse
} from 'src/common/interfaces';

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
    const { offset: skip, limit: take, credentials, name, email, updatedSince, id } = findUserDto;
    console.log('Limnit is ', take, typeof take);
    console.log('Crdentials is ', take, typeof credentials);
    const where: CommonFindAttributesDto = { deleted_at: null };
    if (name) where.name = { contains: name };
    if (email) where.email = { contains: email };
    if (updatedSince) where.updated_at = { gt: updatedSince };
    if (id?.length) where.id = { in: id };

    const queryObject = { skip, take, where, include: { credential: credentials || false } };
    console.log(queryObject)
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
  async create(createUserDto: CreateUserDto): Promise<User> {
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
  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const { id, password, ...updateData } = updateUserDto;
    const query = { data: updateData, credential: null };
    if (password) {
      const hashedPassword = await hashPassword(password);
      query.credential = { update: { hash: hashedPassword } };
    }
    if (!query.credential) delete query.credential;
    return this.prisma.user.update({ where: { id }, data: query });
  }

  /**
   * Deletes a user
   * Function do -). es not actually remove the user from database but instead marks them as deleted by:
   * - removing the corresponding `credentials` row from your db
   * - changing the name to DELETED_USER_NAME constant (default: `(deleted)`)
   * - setting email to NULL
   *
   * @param deleteUserDto
   * @returns results of users and credentials table modification
   */
  async delete(deleteUserDto: DeleteUserDto) {
    const user = await this.findUnique({ id: Number(deleteUserDto.id) });
    if (!user || user.deleted_at) {
      throw new BadRequestException(ERRORS.USER_NOT_FOUND);
    }
    const result = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: DELETED_USER_NAME,
        email: null,
        deleted_at: new Date(),
        credential: {
          delete: true,
        },
      },
    });
    return { users: result };
  }

  /**
   * Authenticates a user and returns a JWT token
   *
   * @param authenticateUserDto email and password for authentication
   * @returns a JWT token
   */
  async authenticateAndGetJwtToken(authenticateUserDto: AuthenticateUserDto): Promise<AuthenticateJWTResponse> {
    const { isAuthenticated, user } = await this.authenticate(authenticateUserDto, true);
    if (!isAuthenticated) throw new UnauthorizedException({ message: ERRORS.INVALID_CREDENTIALS });
    const token = this.jwtService.sign({ id: user.id });
    return { token };
  }

  /**
   * Authenticates a user
   *
   * @param authenticateUserDto email and password for authentication
   * @returns true or false
   */
  async authenticate(authenticateUserDto: AuthenticateUserDto, returnUserObject: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { email: authenticateUserDto.email },
      include: { credential: true },
    });
    // It is generally not a good idea to be specific about the missing field of a signing operation
    if (!user) throw new UnauthorizedException({ message: ERRORS.INVALID_CREDENTIALS });
    const isAuthenticated = await matchHashedPassword(authenticateUserDto.password, user.credential.hash);

    if (returnUserObject) {
      return { isAuthenticated, user };
    }
    return { credentials: isAuthenticated };
  }

  /**
   * Validates a JWT token
   *
   * @param token a JWT token
   * @returns the decoded token if valid
   */
  async validateToken(token: string) {
    const data = { is_valid: false };
    if (!token) return response;
    try {
      await this.jwtService.verifyAsync(token);
      data.is_valid = true;
    } catch (error) {
      data.is_valid = false;
    }
    return data;
  }
}
