import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  ServiceUnavailableException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  assertTrustedOrigin,
  readSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE_MS,
  sessionCookieOptions,
} from './auth-http-security';
import { LoginRateLimitService } from './login-rate-limit.service';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';
import { SessionService } from './session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly sessions: SessionService,
    private readonly loginRateLimit: LoginRateLimitService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  async login(
    @Req() request: Request,
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ expiresAt: Date }> {
    assertTrustedOrigin(request);

    const ip = request.ip;

    if (!ip) {
      throw new ServiceUnavailableException(
        'Identificacao do cliente indisponivel.',
      );
    }

    const decision = await this.loginRateLimit.consumeAttempt(ip);

    if (!decision.allowed) {
      response.setHeader(
        'Retry-After',
        String(decision.retryAfterSeconds ?? 900),
      );

      throw new HttpException(
        'Limite de tentativas de login excedido.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (
      !body ||
      typeof body.email !== 'string' ||
      typeof body.password !== 'string'
    ) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const { token, expiresAt } = await this.loginService.login(
      body.email,
      body.password,
    );

    response.cookie(SESSION_COOKIE, token, {
      ...sessionCookieOptions(),
      maxAge: SESSION_MAX_AGE_MS,
    });

    return { expiresAt };
  }

  @Post('logout')
  @HttpCode(204)
  @Header('Cache-Control', 'no-store')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    assertTrustedOrigin(request);

    const token = readSessionToken(request);

    if (token) {
      await this.sessions.revokeSession(token);
    }

    response.cookie(SESSION_COOKIE, '', {
      ...sessionCookieOptions(),
      maxAge: 0,
    });
  }

  @Get('me')
  @Header('Cache-Control', 'no-store')
  async me(@Req() request: Request): Promise<{
    userId: string;
    role: 'ADMINISTRATOR' | 'OPERATOR';
  }> {
    const token = readSessionToken(request);

    if (!token) {
      throw new UnauthorizedException('Sessao invalida.');
    }

    const identity = await this.sessions.validateSession(token);

    if (!identity) {
      throw new UnauthorizedException('Sessao invalida.');
    }

    return identity;
  }
}