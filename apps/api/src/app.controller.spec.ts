import { AppController } from './app.controller';
import type { PrismaService } from './prisma/prisma.service';

jest.mock('./prisma/prisma.service', () => ({
  PrismaService: class PrismaServiceMock {},
}));

describe('AppController', () => {
  describe('GET /health', () => {
    it('retorna status saudável quando o banco responde', async () => {
      const consultarBanco = jest.fn(async () => [{ resultado: 1 }]);

      const controller = new AppController({
        $queryRaw: consultarBanco,
      } as unknown as PrismaService);

      await expect(controller.getHealth()).resolves.toEqual({
        status: 'ok',
        database: 'ok',
      });

      expect(consultarBanco).toHaveBeenCalledTimes(1);
    });

    it('propaga o erro quando a consulta ao banco falha', async () => {
      const erro = new Error('Banco indisponível');
      const consultarBanco = jest.fn(async () => {
        throw erro;
      });

      const controller = new AppController({
        $queryRaw: consultarBanco,
      } as unknown as PrismaService);

      await expect(controller.getHealth()).rejects.toThrow(erro);
      expect(consultarBanco).toHaveBeenCalledTimes(1);
    });
  });
});
