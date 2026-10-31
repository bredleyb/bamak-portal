import {
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
  type INestApplication,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { createCorsOptions } from './cors-options';

@Controller('auth')
class CorsProbeController {
  @Get('me')
  me(): never {
    throw new UnauthorizedException('Sessao invalida.');
  }

  @Post('login')
  @HttpCode(200)
  login() {
    return { success: true };
  }
}

describe('CORS HTTP da API', () => {
  let app: INestApplication;

  async function createApp(webUrl?: string) {
    const module = await Test.createTestingModule({
      controllers: [CorsProbeController],
    }).compile();

    const application = module.createNestApplication();
    application.setGlobalPrefix('api');
    application.enableCors(createCorsOptions(webUrl));

    await application.init();
    return application;
  }

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('responde ao preflight de login com origem e credenciais autorizadas', async () => {
    const response = await request(app.getHttpServer())
      .options('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type');

    expect(response.status).toBe(204);

    expect(
      response.headers['access-control-allow-origin'],
    ).toBe('http://localhost:3000');

    expect(
      response.headers['access-control-allow-credentials'],
    ).toBe('true');

    expect(
      response.headers['access-control-allow-methods'],
    ).toContain('POST');

    expect(
      response.headers['access-control-allow-headers'],
    ).toContain('content-type');
  });

  it('preserva CORS na resposta HTTP 401 de consulta da sessao', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Origin', 'http://localhost:3000');

    expect(response.status).toBe(401);

    expect(
      response.headers['access-control-allow-origin'],
    ).toBe('http://localhost:3000');

    expect(
      response.headers['access-control-allow-credentials'],
    ).toBe('true');
  });

  it('nao autoriza a origem externa no preflight', async () => {
    const externalOrigin = 'https://externo.example.invalid';

    const response = await request(app.getHttpServer())
      .options('/api/auth/login')
      .set('Origin', externalOrigin)
      .set('Access-Control-Request-Method', 'POST');

    expect(
      response.headers['access-control-allow-origin'],
    ).not.toBe(externalOrigin);

    expect(
      response.headers['access-control-allow-origin'],
    ).not.toBe('*');

    expect(
      response.headers['access-control-allow-origin'],
    ).toBe('http://localhost:3000');
  });

  it('respeita a origem configurada para o ambiente publicado', async () => {
    const productionOrigin = 'https://portal.example.invalid';
    const productionApp = await createApp(productionOrigin);

    try {
      const response = await request(
        productionApp.getHttpServer(),
      )
        .options('/api/auth/login')
        .set('Origin', productionOrigin)
        .set('Access-Control-Request-Method', 'POST');

      expect(response.status).toBe(204);

      expect(
        response.headers['access-control-allow-origin'],
      ).toBe(productionOrigin);

      expect(
        response.headers['access-control-allow-credentials'],
      ).toBe('true');
    } finally {
      await productionApp.close();
    }
  });
});