import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  /**
   * @example User
   */

  @ApiProperty({ example: 'Yusuff Mustapha', description: 'Name of the user' })
  name: string;

  @ApiProperty({ example: 1, description: 'Id of the user' })
  id: number;

  @ApiProperty({
    example: 'officialwebdev@gmail.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    example: false,
    description: 'Is user an admin',
  })
  is_admin: boolean;

  @ApiProperty({
    example: false,
    description: 'Is user"s email verified',
  })
  is_email_confimed: boolean;

  @ApiProperty({
    example: 3,
    description: 'Credential id',
  })
  credentials_id: number;

  @ApiProperty({
    example: '2022-03-20T12:04:22.084Z',
    description: 'Created date',
  })
  created_at: Date;

  @ApiProperty({
    example: new Date(),
    description: 'Updated date',
  })
  updated_at: Date;

  @ApiProperty({
    example: null,
    description: 'Deleted date',
  })
  deleted_at: Date | null;
}

export class ValidateTokenEntity {
  @ApiProperty({ example: true, description: 'Is the passed token valid' })
  is_valid: boolean;
}

export class AuthenticateEntity {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.s', description: 'User token' })
  is_authenticated: string;
}
export class LoginEntity {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.s', description: 'User token' })
  token: string;
}
