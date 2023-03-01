import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrazeCustomer } from '../entities/braze.customer.entity';
import { BrazeCustomAttribute } from '../entities/braze.custom.attribute.entity';
import { Campaigns } from '../entities/campaigns.entity';
import { Journeys } from '../entities/journeys.entity';
import { CampaignsPartner } from '../entities/campaigns.partner.entity';
import { PartnerConfigurations } from '../entities/partner.configuration.entity';
import { CampaignAudience } from '../entities/campaign.audience.entity';
import { ScheduleTriggerLog } from '../entities/schedule.trigger.log.entity';
import { PartnerConfigurationLogo } from '../entities/partner.configuration.logo.entity';
import { DaoService } from './dao.service';
import { DatabricksDataModule } from '../databricks-data/databricks-data.module';
import { WarmupDaySchedule } from '../entities/warmup.day.schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Journeys,
      Campaigns,
      CampaignsPartner,
      BrazeCustomer,
      BrazeCustomAttribute,
      PartnerConfigurations,
      CampaignAudience,
      PartnerConfigurationLogo,
      ScheduleTriggerLog,
      WarmupDaySchedule,
    ]),
    DatabricksDataModule,
    DaoModule,
  ],
  providers: [DaoService],
  exports: [DaoService],
})
export class DaoModule {}
