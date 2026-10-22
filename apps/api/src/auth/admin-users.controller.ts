import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  Header,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AdminAccessGuard } from './admin-access.guard';
import { assertTrustedOrigin } from './auth-http-security';
import { AdminUserAccessService } from './admin-user-access.service';
import { AdminUserCreationService } from './admin-user-creation.service';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { SetAdminUserActiveDto } from './dto/set-admin-user-active.dto';
import { UpdateAdminUserRoleDto } from './dto/update-admin-user-role.dto';
import { RequireRoles } from './require-roles.decorator';

@Controller('admin/users')
@UseGuards(AdminAccessGuard)
@RequireRoles('ADMINISTRATOR')
export class AdminUsersController {
  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly creationService: AdminUserCreationService,
    private readonly accessService: AdminUserAccessService,
  ) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  async listUsers() {
    const users = await this.adminUsersService.listUsers();

    return { users };
  }

  @Post()
  @Header('Cache-Control', 'no-store')
  async createUser(
    @Req() request: Request,
    @Body() body: CreateAdminUserDto,
  ) {
    assertTrustedOrigin(request);

    const user = await this.creationService.createUser(body);

    return { user };
  }

  @Patch(':id/role')
  @Header('Cache-Control', 'no-store')
  async changeRole(
    @Req() request: Request,
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    userId: string,
    @Body() body: UpdateAdminUserRoleDto,
  ) {
    assertTrustedOrigin(request);

    const user = await this.accessService.changeRole(
      userId,
      body.role,
    );

    return { user };
  }

  @Patch(':id/active')
  @Header('Cache-Control', 'no-store')
  async setActive(
    @Req() request: Request,
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    userId: string,
    @Body() body: SetAdminUserActiveDto,
  ) {
    assertTrustedOrigin(request);

    const user = await this.accessService.setActive(
      userId,
      body.isActive,
    );

    return { user };
  }
}