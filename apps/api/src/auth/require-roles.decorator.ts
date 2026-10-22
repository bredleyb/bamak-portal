import { SetMetadata } from '@nestjs/common';

export type AdminRole = 'ADMINISTRATOR' | 'OPERATOR';

export const ADMIN_ROLES_KEY = 'bamak:admin:roles';

export const RequireRoles = (...roles: AdminRole[]) =>
  SetMetadata(ADMIN_ROLES_KEY, roles);