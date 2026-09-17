import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { UserRole } from '@prisma/client';

@Controller('applications')
@UseGuards(JwtAuthGuard) // semua endpoint di sini wajib login
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.JOB_SEEKER)
  apply(@CurrentUser() user: CurrentUserPayload, @Body() dto: ApplyJobDto) {
    return this.applicationsService.apply(user.userId, dto);
  }

  @Get('me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.JOB_SEEKER)
  findMine(@CurrentUser() user: CurrentUserPayload) {
    return this.applicationsService.findMyApplications(user.userId);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.applicationsService.updateStatus(id, user.userId, dto);
  }

  @Get(':id/history')
  findHistory(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserPayload) {
    return this.applicationsService.findHistory(id, user.userId, user.role);
  }
}