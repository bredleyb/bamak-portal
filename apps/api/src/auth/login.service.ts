import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { isValidAdminEmail } from './admin-email-validation';

const DUMMY_PASSWORD_HASH =
  'scrypt-v1$16384$8$1$' +
  'd93b758d0e4a836c221a909f4dcca1fb$' +
  '2a5814840a1b4ef9b35e2b5a1b870bcf4a82e35cc0e800d94b0e370738a606ee' +
  '43cf098e59dea4709ce97bd09fad641cc96eebfa7ff93fcf30befef195993107';

const INVALID_CREDENTIALS = 'Credenciais invalidas.';

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly sessions: SessionService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    if (
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail.length === 0 ||
      normalizedEmail.length > 320 ||
      !isValidAdminEmail(normalizedEmail)
    ) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
        passwordHash: true,
        isActive: true,
      },
    });

    const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;

    const passwordMatches = await this.passwords.verifyPassword(
      password,
      passwordHash,
    );

    if (!user || !passwordMatches || !user.isActive) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    return this.sessions.createSession(user.id);
  }
}