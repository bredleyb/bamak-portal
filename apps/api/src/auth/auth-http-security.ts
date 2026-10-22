import { ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';

export const SESSION_COOKIE = 'bamak_admin_session';
export const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/api',
  };
}

export function assertTrustedOrigin(request: Request): void {
  const configuredWebUrl = process.env.WEB_URL;

  const allowedUrl =
    configuredWebUrl ??
    (process.env.NODE_ENV === 'production'
      ? null
      : 'http://localhost:3000');

  if (
    !allowedUrl ||
    request.get('origin') !== new URL(allowedUrl).origin
  ) {
    throw new ForbiddenException('Origem nao autorizada.');
  }
}

export function readSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const prefix = `${SESSION_COOKIE}=`;

  const matches = cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .filter((entry) => entry.startsWith(prefix));

  if (matches.length !== 1) {
    return null;
  }

  return matches[0].slice(prefix.length) || null;
}