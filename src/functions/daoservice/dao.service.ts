import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabricksDataService } from '../databricks-data/databricks-data.service';
import { BrazeCustomer } from '../entities/braze.customer.entity';
import { CampaignAudience } from '../entities/campaign.audience.entity';
import { Campaigns } from '../entities/campaigns.entity';
import { CampaignsPartner } from '../entities/campaigns.partner.entity';
import { Journeys } from '../entities/journeys.entity';
import { PartnerConfigurations } from '../entities/partner.configuration.entity';
import { PartnerConfigurationLogo } from '../entities/partner.configuration.logo.entity';
import { ScheduleTriggerLog } from '../entities/schedule.trigger.log.entity';
import { WarmupDaySchedule } from '../entities/warmup.day.schedule.entity';
import * as commonUtils from '../util/commonUtils';
//import { WarmupDayScheduleAudience } from '../entities/warmup.day.schedule.audience.entity';
import { ConfigurationService } from '../../config/configuration.service';

@Injectable()
export class DaoService implements OnModuleInit {
  @InjectRepository(Journeys)
  private readonly journeysRepo: Repository<Journeys>;
  @InjectRepository(Campaigns)
  private readonly campaignsRepo: Repository<Campaigns>;
  @InjectRepository(CampaignsPartner)
  private readonly campaignsPartnerRepo: Repository<CampaignsPartner>;
  @InjectRepository(BrazeCustomer)
  private readonly brazeCustomerRepo: Repository<BrazeCustomer>;
  @InjectRepository(PartnerConfigurations)
  private readonly partnerConfigurationsRepo: Repository<PartnerConfigurations>;
  @InjectRepository(PartnerConfigurationLogo)
  private readonly partnerConfigurationLogoRepo: Repository<PartnerConfigurationLogo>;
  @InjectRepository(CampaignAudience)
  private readonly campaignAudienceRepo: Repository<CampaignAudience>;
  @InjectRepository(ScheduleTriggerLog)
  private readonly scheduleTriggerLogRepo: Repository<ScheduleTriggerLog>;
  @InjectRepository(WarmupDaySchedule)
  private readonly warmupDayScheduleRepo: Repository<WarmupDaySchedule>;
  @Inject(DatabricksDataService)
  private readonly databricksDataService: DatabricksDataService;
  private readonly logger = new Logger(DaoService.name);

  private configurationService: ConfigurationService;

  constructor(private moduleRef: ModuleRef) { }

  onModuleInit() {
    this.configurationService = this.moduleRef.get(ConfigurationService, {
      strict: false,
    });
  }

  async getJourneys(partnerId: string, JourneyIds: string[]) {
    const querySql = this.journeysRepo
      .createQueryBuilder('journey')
      .where(' journey.partner_id is null ');
    if (partnerId != undefined && partnerId != null) {
      querySql.orWhere('journey.partner_id = :partnerId', {
        partnerId: partnerId,
      });
    }
    if (JourneyIds != undefined && JourneyIds != null) {
      querySql.andWhere(
        ` journey.opengpt_journey_id in (${JourneyIds.map(item => `'${item}'`)})`,
      );
    }
    const journeys = await querySql
      .select(
        'journey.opengpt_journey_id as journey_id, journey.opengpt_journey_name as journey_name,journey.journey_description as journey_description',
      )
      .getRawMany();

    this.logger.debug(
      'DaoService.getJourneys | journeys = ' + JSON.stringify(journeys),
    );
    return commonUtils.camelizeKeys(journeys);
  }

  async getPartnersCustomFooteByPartnerId(partnerId: string) {
    return await this.partnerConfigurationLogoRepo.findOne({
      where: {
        partnerId: partnerId,
        //customFooter: Not(IsNull()),  //here each partner only have one customFooter. so no need this condition.
      },
    });
  }

  async getPartnerConfigurationLogoRepoById(pid: number) {
    return await this.partnerConfigurationLogoRepo.findOne({
      where: {
        id: pid,
      },
    });
  }

  async createOrUpdatePartnersConfigurationsLogoTable(
    partnerConfigurationLogo: PartnerConfigurationLogo,
  ) {
    return await this.partnerConfigurationLogoRepo.save(
      partnerConfigurationLogo,
    );
  }

  async getAllEmailConfiguration(partnerId: string) {
    const partnerConfigurations = await this.partnerConfigurationsRepo
      .createQueryBuilder('PartnerConfigurations')
      .where('PartnerConfigurations.partner_id = :pid', { pid: partnerId })
      .orderBy('is_default', 'DESC')
      .getMany();
    return partnerConfigurations;
  }

  // async cloneCampaignsAudiences(
  //   oldopengptCampaignInstanceId: string,
  //   newopengptCampaignInstanceId: string,
  // ) {
  //   //audienceDto structure likes [audienceArray,size]
  //   // const audienceDto = await this.crusadeService.getAudience(
  //   //   oldopengptCampaignInstanceId,
  //   // );
  //   const audienceSegmentSaveList: CampaignAudience[] = [];
  //   if (audienceDto && audienceDto.length > 0) {
  //     for (let i = 0; i < audienceDto[0].length; i++) {
  //       const segmentsDto = audienceDto[0][i];
  //       const saveAudience: CampaignAudience = new CampaignAudience();
  //       saveAudience.opengptCampaignInstanceId = newopengptCampaignInstanceId; ////opengptCampaignInstanceId or opengptCampaignId????
  //       saveAudience.segmentId = segmentsDto.segmentId;
  //       saveAudience.segmentName = segmentsDto.segmentName;
  //       audienceSegmentSaveList.push(saveAudience);
  //     }
  //   }
  //   const saveAudienceSegments = await this.campaignAudienceRepo.save(
  //     audienceSegmentSaveList,
  //   );
  //   this.logger.debug(
  //     'cloneCampaignsAudiences | saveAudienceSegments successful, saveAudienceSegments = ' +
  //     JSON.stringify(saveAudienceSegments),
  //   );
  //   return saveAudienceSegments;
  // }

  async getIpWarmupSendDates(campaignInstanceId: string, scheduleId: string) {
    const sqlExecution = this.warmupDayScheduleRepo
      .createQueryBuilder('WarmupDaySchedule')
      .where('opengpt_campaign_instance_id = :opengptCampaignInstanceId', {
        opengptCampaignInstanceId: campaignInstanceId,
      });
    if (scheduleId) {
      sqlExecution.andWhere('schedule_id = :scheduleId', {
        scheduleId: scheduleId,
      });
    }
    sqlExecution.orderBy('id', 'ASC');

    this.logger.debug(
      'DaoService.getFirstIpWarmupSendDate | sql = ' + sqlExecution.getSql(),
    );
    const resWarmupDaySchedule = await sqlExecution.getMany();
    return resWarmupDaySchedule;
  }

  getDefaultPartnerConfigurationFromStaticConfiguration() {
    return this.configurationService.getDeploymentConfigs().brazeConfig
      .defaultPartnerConfiguration;
  }

  getDefaultIntroductionFromStaticConfiguration() {
    const defaultPartnerConfiguration =
      this.getDefaultPartnerConfigurationFromStaticConfiguration();
    this.logger.debug(
      'DaoService.getDefaultIntroductionFromStaticConfiguration | defaultPartnerConfiguration = ' +
      JSON.stringify(defaultPartnerConfiguration),
    );
    return defaultPartnerConfiguration.introduction;
  }

  async getDefaultIntroductionFromDB(partnerId: string) {
    return await this.partnerConfigurationLogoRepo.findOneBy({ partnerId });
  }

  async getDefaultIntroductionConfiguration(partnerId: string) {
    let dbConfig = await this.getDefaultIntroductionFromDB(partnerId);
    this.logger.debug(
      'DaoService.getDefaultIntroductionConfiguration | dbConfig = ' +
      JSON.stringify(dbConfig),
    );
    if (!dbConfig) {
      dbConfig = new PartnerConfigurationLogo();
      dbConfig.partnerId = partnerId;
      dbConfig.introduction =
        this.getDefaultIntroductionFromStaticConfiguration();
      return this.partnerConfigurationLogoRepo.save(dbConfig);
    } else {
      return dbConfig;
    }
  }

  async getDefaultIntroductionAsString(partnerId: string) {
    const defaultIntroductionConfiguration =
      await this.getDefaultIntroductionConfiguration(partnerId);
    this.logger.debug(
      'DaoService.getDefaultIntroductionAsString | defaultIntroductionConfiguration = ' +
      JSON.stringify(defaultIntroductionConfiguration),
    );
    const defaultIntroductionAsString: string =
      defaultIntroductionConfiguration.introduction;
    return defaultIntroductionAsString;
  }
}
