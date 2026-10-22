import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateBy,
} from 'class-validator';

const MAX_PASSWORD_BYTES = 1024;

export class LoginDto {
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
}