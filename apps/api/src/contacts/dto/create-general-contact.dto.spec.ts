import { BadRequestException } from '@nestjs/common';
import { CreateGeneralContactDto } from './create-general-contact.dto';
import { createRequestValidationPipe } from '../../common/validation/request-validation.pipe';

describe('CreateGeneralContactDto', () => {
  const pipe = createRequestValidationPipe();

  const metadata = {
    type: 'body' as const,
    metatype: CreateGeneralContactDto,
  };

  const validContact = {
    name: 'Contato Ficticio',
    contactInfo: 'contato@example.invalid',
    subject: 'Consulta de produto',
    message: 'Gostaria de receber mais informacoes.',
    consent: true,
  };

  it('aceita uma solicitacao valida', async () => {
    const result = await pipe.transform(validContact, metadata);

    expect(result).toBeInstanceOf(CreateGeneralContactDto);
    expect(result).toMatchObject(validContact);
  });

  it.each([
    ['nome ausente', { name: undefined }],
    ['nome vazio', { name: '   ' }],
    ['nome acima do limite', { name: 'A'.repeat(161) }],
    ['contato vazio', { contactInfo: ' ' }],
    ['contato acima do limite', { contactInfo: 'a'.repeat(321) }],
    ['assunto vazio', { subject: '' }],
    ['assunto acima do limite', { subject: 'a'.repeat(201) }],
    ['mensagem vazia', { message: '  ' }],
    ['mensagem acima do limite', { message: 'a'.repeat(5001) }],
    ['consentimento ausente', { consent: undefined }],
    ['consentimento recusado', { consent: false }],
    ['consentimento como texto', { consent: 'true' }],
    ['campo inesperado', { statusId: 'valor-indevido' }],
    ['data de consentimento enviada pelo cliente', {
      consentRecordedAt: '2026-01-01T00:00:00Z',
    }],
  ])('rejeita %s', async (_scenario, changes) => {
    await expect(
      pipe.transform({ ...validContact, ...changes }, metadata),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
