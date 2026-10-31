import {
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateBy,
} from 'class-validator';

const MAX_PASSWORD_BYTES = 1024;

function hasValidByteLength(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    Buffer.byteLength(value, 'utf8') <= MAX_PASSWORD_BYTES
  );
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ValidateBy({
    name: 'currentPasswordMaxBytes',
    validator: {
      validate: hasValidByteLength,
    },
  })
  currentPassword!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  @ValidateBy({
    name: 'newPasswordMaxBytes',
    validator: {
      validate: hasValidByteLength,
    },
  })
  newPassword!: string;
}