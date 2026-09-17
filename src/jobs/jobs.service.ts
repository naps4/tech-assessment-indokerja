import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.job.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job dengan id ${id} tidak ditemukan`);
    }

    return job;
  }

  async create(companyId: number, dto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        ...dto,
        companyId,
      },
    });
  }

  // Dipakai nanti buat modul Applications: pastikan job ini milik company yang login
  async findOwnedByCompany(jobId: number, companyId: number) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException(`Job dengan id ${jobId} tidak ditemukan`);
    }
    if (job.companyId !== companyId) {
      throw new NotFoundException(`Job dengan id ${jobId} tidak ditemukan`);
    }
    return job;
  }
}