import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // supaya AuthModule bisa pakai
})
export class UsersModule {}