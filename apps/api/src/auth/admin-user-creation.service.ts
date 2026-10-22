import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';
import type { AdminRole } from './require-roles.decorator';

export interface CreateAdminUserInput {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
}

function isUniqueConstraintViolation(
  error: unknown,
): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}

@Injectable()
export class AdminUserCreationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
  ) {}

  async createUser(input: CreateAdminUserInput) {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    // A senha nunca deve ser normalizada nem gravada em texto puro.
    const passwordHash = await this.passwords.hashPassword(
      input.password,
    );

    try {
      return await this.prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: input.role,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error: unknown) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException(
          'Ja existe uma conta com os dados informados.',
        );
      }

      throw error;
    }
  }
}