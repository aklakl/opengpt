import { Module } from '@nestjs/common';
import { OpengptController } from './opengpt.controller';
import { OpengptService } from './opengpt.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [OpengptController],
  providers: [OpengptService],
})
export class OpengptModule { }
