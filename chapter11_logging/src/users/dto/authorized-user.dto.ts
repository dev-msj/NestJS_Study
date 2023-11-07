import { IsString } from 'class-validator';

export class AuthorizedUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly email: string;
}
