import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminAccessGuard } from './admin-access.guard';
import { AuthController } from './auth.controller';
import { LoginRateLimitService } from './login-rate-limit.service';
import { LoginService } from './login.service';
import { PasswordChangeController } from './password-change.controller';
import { PasswordChangeService } from './password-change.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { SessionTokenService } from './session-token.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController, PasswordChangeController],
  providers: [
    PasswordService,
    PasswordChangeService,
    SessionTokenService,
    SessionService,
    LoginService,
    LoginRateLimitService,
    AdminAccessGuard,
  ],
  exports: [SessionService, AdminAccessGuard, PasswordService],
})
export class AuthModule {}