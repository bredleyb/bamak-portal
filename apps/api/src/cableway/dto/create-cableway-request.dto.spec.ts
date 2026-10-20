import { BadRequestException } from '@nestjs/common';
import { createRequestValidationPipe } from '../../common/validation/request-validation.pipe';
import {
  CablewayCoordinatesDto,
  CreateCablewayRequestDto,
} from './create-cableway-request.dto';

describe('CreateCablewayRequestDto', () => {
  const pipe = createRequestValidationPipe();

  const metadata = {
    type: 'body' as const,
    metatype: CreateCablewayRequestDto,
  };

  const validRequest = {
    contactName: 'Pessoa Ficticia',
    contactInfo: 'contato@example.invalid',
    installationContext: 'Instalacao ficticia para avaliacao inicial.',
    locationDescription: 'Localizacao ficticia descrita em texto.',
    consent: true,
  };

  it('aceita solicitacao sem coordenadas', async () => {
    const result = await pipe.transform(validRequest, metadata);

    expect(result).toBeInstanceOf(CreateCablewayRequestDto);
    expect(result).toMatchObject(validRequest);
    expect(result.coordinates).toBeUndefined();
  });

  it('aceita coordenadas validas', async () => {
    const coordinates = {
      latitude: -26.49,
      longitude: -49.12,
    };

    const result = await pipe.transform(
      { ...validRequest, coordinates },
      metadata,
    );

    expect(result.coordinates).toBeInstanceOf(CablewayCoordinatesDto);
    expect(result.coordinates).toMatchObject(coordinates);
  });

  it('aceita coordenadas nos limites geograficos', async () => {
    const result = await pipe.transform(
      {
        ...validRequest,
        coordinates: {
          latitude: 90,
          longitude: -180,
        },
      },
      metadata,
    );

    expect(result.coordinates).toMatchObject({
      latitude: 90,
      longitude: -180,
    });
  });

  it.each([
    ['nome ausente', { contactName: undefined }],
    ['nome vazio', { contactName: '   ' }],
    ['nome excessivo', { contactName: 'A'.repeat(161) }],
    ['contato ausente', { contactInfo: undefined }],
    ['contato vazio', { contactInfo: '  ' }],
    ['contato excessivo', { contactInfo: 'A'.repeat(321) }],
    ['contexto ausente', { installationContext: undefined }],
    ['contexto vazio', { installationContext: '  ' }],
    ['contexto excessivo', { installationContext: 'A'.repeat(5001) }],
    ['localizacao ausente', { locationDescription: undefined }],
    ['localizacao vazia', { locationDescription: '   ' }],
    ['localizacao excessiva', { locationDescription: 'A'.repeat(2001) }],
    ['consentimento ausente', { consent: undefined }],
    ['consentimento recusado', { consent: false }],
    ['consentimento textual', { consent: 'true' }],
    ['coordenadas nulas', { coordinates: null }],
    ['coordenadas em array', { coordinates: [0, 0] }],
    ['coordenadas vazias', { coordinates: {} }],
    ['latitude ausente', { coordinates: { longitude: -49.12 } }],
    ['longitude ausente', { coordinates: { latitude: -26.49 } }],
    ['latitude acima do limite', {
      coordinates: { latitude: 90.000001, longitude: 0 },
    }],
    ['latitude abaixo do limite', {
      coordinates: { latitude: -90.000001, longitude: 0 },
    }],
    ['longitude acima do limite', {
      coordinates: { latitude: 0, longitude: 180.000001 },
    }],
    ['longitude abaixo do limite', {
      coordinates: { latitude: 0, longitude: -180.000001 },
    }],
    ['latitude como texto', {
      coordinates: { latitude: '-26.49', longitude: -49.12 },
    }],
    ['coordenadas com precisao excessiva', {
      coordinates: { latitude: -26.1234567, longitude: -49.12 },
    }],
    ['campo inesperado nas coordenadas', {
      coordinates: { latitude: 0, longitude: 0, altitude: 50 },
    }],
    ['estado enviado pelo visitante', { statusId: 'indevido' }],
    ['data de consentimento enviada pelo visitante', {
      consentRecordedAt: '2026-01-01T00:00:00Z',
    }],
    ['anexos enviados como JSON', { attachments: [] }],
  ])('rejeita %s', async (_scenario, changes) => {
    await expect(
      pipe.transform({ ...validRequest, ...changes }, metadata),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
