import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminUsersController } from './admin-users.controller';
import { AdminUserAccessService } from './admin-user-access.service';
import { AdminUserCreationService } from './admin-user-creation.service';
import { AdminUsersService } from './admin-users.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminUsersController],
  providers: [
    AdminUsersService,
    AdminUserCreationService,
    AdminUserAccessService,
  ],
})
export class AdminUsersModule {}