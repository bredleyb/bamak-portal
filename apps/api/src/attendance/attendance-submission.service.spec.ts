import {
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { PrismaService } from '../prisma/prisma.service';
import { AttendanceSubmissionService } from './attendance-submission.service';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaServiceMock {},
}));

describe('AttendanceSubmissionService', () => {
  const receivedAt = new Date('2026-10-20T12:00:00Z');
  const attendanceId = '00000000-0000-4000-8000-000000000010';
  const statusId = '00000000-0000-4000-8000-000000000011';

  const tx = {
    attendanceStatus: {
      findFirst: jest.fn(),
    },
    attendance: {
      create: jest.fn(),
    },
  };

  const transaction = jest.fn(
    async (work: (client: typeof tx) => Promise<unknown>) => work(tx),
  );

  const service = new AttendanceSubmissionService({
    $transaction: transaction,
  } as unknown as PrismaService);

  const contact = {
    name: '  Pessoa Ficticia  ',
    contactInfo: '  contato@example.invalid  ',
    subject: '  Consulta  ',
    message: '  Gostaria de informacoes.  ',
    consent: true,
  };

  const cableway = {
    contactName: ' Pessoa Ficticia ',
    contactInfo: ' contato@example.invalid ',
    installationContext: ' Instalacao de teste ',
    locationDescription: ' Local ficticio ',
    consent: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    tx.attendanceStatus.findFirst.mockResolvedValue({ id: statusId });
    tx.attendance.create.mockResolvedValue({ id: attendanceId, createdAt: receivedAt });
  });

  it('cria contato geral e atendimento na mesma transacao', async () => {
    const result = await service.submitGeneralContact(contact, 'consent-v1');

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(tx.attendanceStatus.findFirst).toHaveBeenCalledWith({
      where: { code: 'RECEIVED', isActive: true },
      select: { id: true },
    });

    expect(tx.attendance.create).toHaveBeenCalledWith({
      data: {
        type: 'GENERAL_CONTACT',
        status: { connect: { id: statusId } },
        generalContact: {
          create: {
            name: 'Pessoa Ficticia',
            contactInfo: 'contato@example.invalid',
            subject: 'Consulta',
            message: 'Gostaria de informacoes.',
            consentRecordedAt: expect.any(Date),
            consentTextVersion: 'consent-v1',
          },
        },
      },
      select: { id: true, createdAt: true },
    });

    expect(result).toEqual({ attendanceId, receivedAt });
  });

  it('cria solicitacao de Cabo Aereo com coordenadas', async () => {
    const result = await service.submitCablewayRequest(
      {
        ...cableway,
        coordinates: { latitude: -26.49, longitude: -49.12 },
      },
      'consent-v1',
    );

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(tx.attendance.create).toHaveBeenCalledWith({
      data: {
        type: 'CABLEWAY_REQUEST',
        status: { connect: { id: statusId } },
        cablewayRequest: {
          create: {
            contactName: 'Pessoa Ficticia',
            contactInfo: 'contato@example.invalid',
            installationContext: 'Instalacao de teste',
            locationDescription: 'Local ficticio',
            latitude: -26.49,
            longitude: -49.12,
            consentRecordedAt: expect.any(Date),
            consentTextVersion: 'consent-v1',
          },
        },
      },
      select: { id: true, createdAt: true },
    });

    expect(result).toEqual({ attendanceId, receivedAt });
  });

  it('preserva coordenadas ausentes como null', async () => {
    await service.submitCablewayRequest(cableway, 'consent-v1');

    expect(tx.attendance.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          cablewayRequest: {
            create: expect.objectContaining({
              latitude: null,
              longitude: null,
            }),
          },
        }),
      }),
    );
  });

  it.each([
    ['contato geral', 'general'],
    ['Cabo Aereo', 'cableway'],
  ])('rejeita %s quando nao existe estado inicial ativo', async (_, type) => {
    tx.attendanceStatus.findFirst.mockResolvedValueOnce(null);

    const submission = type === 'general'
      ? service.submitGeneralContact(contact, 'consent-v1')
      : service.submitCablewayRequest(cableway, 'consent-v1');

    await expect(submission).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );

    expect(tx.attendance.create).not.toHaveBeenCalled();
  });

  it.each(['', '   ', 'v'.repeat(65)])(
    'rejeita versao de consentimento invalida',
    async (version) => {
      await expect(
        service.submitGeneralContact(contact, version),
      ).rejects.toBeInstanceOf(InternalServerErrorException);

      expect(transaction).not.toHaveBeenCalled();
    },
  );

  it('propaga falha de persistencia sem retornar sucesso', async () => {
    const error = new Error('Falha simulada de persistencia');
    tx.attendance.create.mockRejectedValueOnce(error);

    await expect(
      service.submitGeneralContact(contact, 'consent-v1'),
    ).rejects.toBe(error);

    expect(transaction).toHaveBeenCalledTimes(1);
  });
});
