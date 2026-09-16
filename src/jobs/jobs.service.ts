import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
    });
  }
}