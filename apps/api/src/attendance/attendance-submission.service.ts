import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { CreateCablewayRequestDto } from '../cableway/dto/create-cableway-request.dto';
import type { CreateGeneralContactDto } from '../contacts/dto/create-general-contact.dto';
import { PrismaService } from '../prisma/prisma.service';

const INITIAL_STATUS_CODE = 'RECEIVED';

@Injectable()
export class AttendanceSubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  async submitGeneralContact(
    dto: CreateGeneralContactDto,
    consentVersion: string,
  ) {
    const version = this.requireConsentVersion(consentVersion);

    return this.prisma.$transaction(async (tx) => {
      const status = await tx.attendanceStatus.findFirst({
        where: {
          code: INITIAL_STATUS_CODE,
          isActive: true,
        },
        select: { id: true },
      });

      if (!status) {
        throw new ServiceUnavailableException(
          'O recebimento de solicitacoes esta indisponivel.',
        );
      }

      const attendance = await tx.attendance.create({
        data: {
          type: 'GENERAL_CONTACT',
          status: { connect: { id: status.id } },
          generalContact: {
            create: {
              name: dto.name.trim(),
              contactInfo: dto.contactInfo.trim(),
              subject: dto.subject.trim(),
              message: dto.message.trim(),
              consentRecordedAt: new Date(),
              consentTextVersion: version,
            },
          },
        },
        select: { id: true, createdAt: true },
      });

      return {
        attendanceId: attendance.id,
        receivedAt: attendance.createdAt,
      };
    });
  }

  async submitCablewayRequest(
    dto: CreateCablewayRequestDto,
    consentVersion: string,
  ) {
    const version = this.requireConsentVersion(consentVersion);

    return this.prisma.$transaction(async (tx) => {
      const status = await tx.attendanceStatus.findFirst({
        where: {
          code: INITIAL_STATUS_CODE,
          isActive: true,
        },
        select: { id: true },
      });

      if (!status) {
        throw new ServiceUnavailableException(
          'O recebimento de solicitacoes esta indisponivel.',
        );
      }

      const attendance = await tx.attendance.create({
        data: {
          type: 'CABLEWAY_REQUEST',
          status: { connect: { id: status.id } },
          cablewayRequest: {
            create: {
              contactName: dto.contactName.trim(),
              contactInfo: dto.contactInfo.trim(),
              installationContext: dto.installationContext.trim(),
              locationDescription: dto.locationDescription.trim(),
              latitude: dto.coordinates?.latitude ?? null,
              longitude: dto.coordinates?.longitude ?? null,
              consentRecordedAt: new Date(),
              consentTextVersion: version,
            },
          },
        },
        select: { id: true, createdAt: true },
      });

      return {
        attendanceId: attendance.id,
        receivedAt: attendance.createdAt,
      };
    });
  }

  private requireConsentVersion(value: string): string {
    const version = value.trim();

    if (!version || version.length > 64) {
      throw new InternalServerErrorException(
        'A versao do consentimento nao esta configurada.',
      );
    }

    return version;
  }
}
