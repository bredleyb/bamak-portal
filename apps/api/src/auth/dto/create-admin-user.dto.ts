import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateBy,
} from 'class-validator';
import type { AdminRole } from '../require-roles.decorator';

const MAX_PASSWORD_BYTES = 1024;

export class CreateAdminUserDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string'
      ? value.trim().toLowerCase()
      : value,
  )
  @IsString()
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  @ValidateBy({
    name: 'maxPasswordBytes',
    validator: {
      validate(value: unknown): boolean {
        return (
          typeof value === 'string' &&
          Buffer.byteLength(value, 'utf8') <=
            MAX_PASSWORD_BYTES
        );
      },
    },
  })
  password!: string;

  @IsString()
  @IsIn(['ADMINISTRATOR', 'OPERATOR'])
  role!: AdminRole;
}