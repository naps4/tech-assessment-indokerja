import { IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { JobType } from '@prisma/client';

export class CreateJobDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsInt()
  salary?: number;

  @IsEnum(JobType)
  jobType: JobType; // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP
}