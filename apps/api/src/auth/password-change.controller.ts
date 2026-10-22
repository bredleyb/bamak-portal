import {
  Body,
  Controller,
  Header,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AdminAccessGuard } from './admin-access.guard';
import {
  assertTrustedOrigin,
  SESSION_COOKIE,
  sessionCookieOptions,
} from './auth-http-security';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PasswordChangeService } from './password-change.service';

type AuthenticatedRequest = Request & {
  adminIdentity?: {
    userId: string;
  };
};

@Controller('auth')
export class PasswordChangeController {
  constructor(
    private readonly passwordChange: PasswordChangeService,
  ) {}

  @Post('change-password')
  @UseGuards(AdminAccessGuard)
  @HttpCode(204)
  @Header('Cache-Control', 'no-store')
  async changePassword(
    @Req() request: AuthenticatedRequest,
    @Body() body: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    assertTrustedOrigin(request);

    // A identidade vem do guard, que valida a sessao no
    // banco. Nunca aceitar um userId informado pelo cliente.
    const identity = request.adminIdentity;

    if (!identity) {
      throw new UnauthorizedException('Sessao invalida.');
    }

    await this.passwordChange.changeOwnPassword(
      identity.userId,
      body.currentPassword,
      body.newPassword,
    );

    // O servico ja revogou todas as sessoes na mesma
    // transacao da alteracao do hash.
    // Limpar o cookie somente apos o sucesso.
    response.cookie(SESSION_COOKIE, '', {
      ...sessionCookieOptions(),
      maxAge: 0,
    });
  }
}