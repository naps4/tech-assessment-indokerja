import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
  ) {}

  // Job Seeker melamar sebuah job
  async apply(jobSeekerId: number, dto: ApplyJobDto) {
    await this.jobsService.findOne(dto.jobId);

    const existing = await this.prisma.application.findUnique({
      where: {
        jobId_jobSeekerId: {
          jobId: dto.jobId,
          jobSeekerId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Anda sudah pernah melamar pekerjaan ini');
    }

    // Buat application + history awal (APPLIED) dalam satu transaction
    return this.prisma.$transaction(async (tx) => {
      const application = await tx.application.create({
        data: {
          jobId: dto.jobId,
          jobSeekerId,
        },
      });

      await tx.applicationHistory.create({
        data: {
          applicationId: application.id,
          status: application.status, // APPLIED (default)
        },
      });

      return application;
    });
  }

  // Job Seeker lihat lamaran miliknya sendiri
  async findMyApplications(jobSeekerId: number) {
    return this.prisma.application.findMany({
      where: { jobSeekerId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            jobType: true,
            company: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Company lihat kandidat yang melamar ke salah satu job miliknya
  async findApplicantsByJob(jobId: number, companyId: number) {
    await this.jobsService.findOwnedByCompany(jobId, companyId);

    return this.prisma.application.findMany({
      where: { jobId },
      include: {
        jobSeeker: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Company ubah status lamaran
  async updateStatus(applicationId: number, companyId: number, dto: UpdateStatusDto) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) {
      throw new NotFoundException(`Application dengan id ${applicationId} tidak ditemukan`);
    }

    // pastikan company yang login memang pemilik job ini
    if (application.job.companyId !== companyId) {
      throw new ForbiddenException('Anda tidak berhak mengubah status lamaran ini');
    }

    // update status + insert history harus atomic
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.application.update({
        where: { id: applicationId },
        data: { status: dto.status },
      });

      await tx.applicationHistory.create({
        data: {
          applicationId: updated.id,
          status: dto.status,
        },
      });

      return updated;
    });
  }

  // Lihat riwayat status satu application (opsional, nilai tambah)
  async findHistory(applicationId: number, userId: number, role: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) {
      throw new NotFoundException(`Application dengan id ${applicationId} tidak ditemukan`);
    }

    // hanya job seeker pemilik lamaran ATAU company pemilik job yang boleh lihat
    const isOwner = application.jobSeekerId === userId;
    const isJobOwner = application.job.companyId === userId;

    if (role === 'JOB_SEEKER' && !isOwner) {
      throw new ForbiddenException('Anda tidak berhak melihat riwayat ini');
    }
    if (role === 'COMPANY' && !isJobOwner) {
      throw new ForbiddenException('Anda tidak berhak melihat riwayat ini');
    }

    return this.prisma.applicationHistory.findMany({
      where: { applicationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}