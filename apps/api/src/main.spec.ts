import type { INestApplication } from '@nestjs/common';


jest.mock('./app.module', () => ({
  AppModule: class AppModuleMock {},
}));

describe('Inicializacao da API', () => {
  it.each([
    {
      descricao: 'utiliza configuracoes explicitas',
      webUrl: 'https://portal.example.invalid',
      port: 4321,
      expectedOrigin: 'https://portal.example.invalid',
      expectedPort: 4321,
    },
    {
      descricao: 'utiliza valores padrao quando ausentes',
      webUrl: undefined,
      port: undefined,
      expectedOrigin: 'http://localhost:3000',
      expectedPort: 3001,
    },
  ])(
    '$descricao',
    async ({ webUrl, port, expectedOrigin, expectedPort }) => {
      await jest.isolateModulesAsync(async () => {
        const { NestFactory } = await import('@nestjs/core');

        const config = {
          get: jest.fn((key: string) => {
            if (key === 'WEB_URL') {
              return webUrl;
            }

            if (key === 'PORT') {
              return port;
            }

            return undefined;
          }),
        };

        const app = {
          get: jest.fn(() => config),
          setGlobalPrefix: jest.fn(),
          useGlobalPipes: jest.fn(),
          enableCors: jest.fn(),
          listen: jest.fn().mockResolvedValue(undefined),
        };

        const create = jest.spyOn(NestFactory, 'create');

        create.mockResolvedValue(
          app as unknown as INestApplication,
        );

        await import('./main');

        // bootstrap() e iniciado pelo modulo e retorna uma Promise.
        // Aguarda a conclusao das etapas assincronas simuladas.
        await new Promise<void>((resolve) => {
          setImmediate(resolve);
        });

        expect(create).toHaveBeenCalledTimes(1);

        expect(app.setGlobalPrefix).toHaveBeenCalledWith(
          'api',
        );

        expect(app.useGlobalPipes).toHaveBeenCalledTimes(1);

        expect(config.get).toHaveBeenCalledWith('WEB_URL');
        expect(config.get).toHaveBeenCalledWith('PORT');

        expect(app.enableCors).toHaveBeenCalledWith({
          origin: expectedOrigin,
        });

        expect(app.listen).toHaveBeenCalledWith(
          expectedPort,
        );
      });
    },
  );
});
