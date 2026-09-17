import { IsInt } from 'class-validator';

export class ApplyJobDto {
  @IsInt()
  jobId: number;
}