import { forwardRef, Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { ApplicationsModule } from '../applications/applications.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => ApplicationsModule), AuthModule],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}