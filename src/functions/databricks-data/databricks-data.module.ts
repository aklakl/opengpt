import { Module } from '@nestjs/common';
import { DatabricksDataService } from './databricks-data.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [DatabricksDataService],
  exports: [DatabricksDataService],
})
export class DatabricksDataModule { }
