import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';




const VERSION = 'scrypt-v1';
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const MAX_PASSWORD_BYTES = 1024;

const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 32 * 1024 * 1024,
} as const;

function deriveKey(
  password: string,
  salt: Buffer,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      KEY_LENGTH,
      SCRYPT_OPTIONS,
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      },
    );
  });
}

function isValidPassword(password: unknown): password is string {
  return (
    typeof password === 'string' &&
    Buffer.byteLength(password, 'utf8') > 0 &&
    Buffer.byteLength(password, 'utf8') <= MAX_PASSWORD_BYTES
  );
}

@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    if (!isValidPassword(password)) {
      throw new RangeError('Comprimento de senha invalido.');
    }

    const salt = randomBytes(SALT_LENGTH);

    const derivedKey = await deriveKey(password, salt);

    return [
      VERSION,
      SCRYPT_OPTIONS.N,
      SCRYPT_OPTIONS.r,
      SCRYPT_OPTIONS.p,
      salt.toString('hex'),
      derivedKey.toString('hex'),
    ].join('$');
  }

  async verifyPassword(
    password: string,
    encodedHash: string,
  ): Promise<boolean> {
    if (
      !isValidPassword(password) ||
      typeof encodedHash !== 'string' ||
      encodedHash.length > 256
    ) {
      return false;
    }

    const parts = encodedHash.split('$');

    if (parts.length !== 6) {
      return false;
    }

    const [version, n, r, p, saltHex, hashHex] = parts;

    if (
      version !== VERSION ||
      n !== String(SCRYPT_OPTIONS.N) ||
      r !== String(SCRYPT_OPTIONS.r) ||
      p !== String(SCRYPT_OPTIONS.p) ||
      !/^[0-9a-f]{32}$/.test(saltHex) ||
      !/^[0-9a-f]{128}$/.test(hashHex)
    ) {
      return false;
    }

    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(hashHex, 'hex');

    const actual = await deriveKey(password, salt);

    return timingSafeEqual(actual, expected);
  }
}
