import { IsBoolean } from 'class-validator';

export class SetAdminUserActiveDto {
  @IsBoolean()
  isActive!: boolean;
}