import {
  IsIn,
  IsString,
} from 'class-validator';
import type { AdminRole } from '../require-roles.decorator';

export class UpdateAdminUserRoleDto {
  @IsString()
  @IsIn(['ADMINISTRATOR', 'OPERATOR'])
  role!: AdminRole;
}