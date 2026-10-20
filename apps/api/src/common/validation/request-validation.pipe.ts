import { ValidationPipe } from '@nestjs/common';

export function createRequestValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: false,
    },
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  });
}
