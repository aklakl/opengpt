import { Optional } from '@nestjs/common';
import { IsEnum, IsString } from 'class-validator';
import { ChannelType, SendToTheseUsers } from '../constant/enums';
import { CampaignAudience } from '../entities/campaign.audience.entity';
import { Message } from './notification';

export class Journey {
  public journeyId: string;
  @IsString()
  public journeyName: string;
  public description: string;
  public campaigns: Campaign[];
}

//20220511 Now for front-end all the campaignId use the opengptCampaignInstanceId
export class Campaign {
  public campaignInstanceId: string;
  //This is the opengptCampaignId
  public opengptCampaignId: string;
  public brazeCampaignId: string;
  public brazeTemplateId: string;
  public campaignId: string;
  public campaignType: string;
  @IsString()
  public campaignName: string;
  public description: string;
  public status: any;
  public tags: any[];

  public sendId: string;
  public lastEdited: string;
  public updatedBy: string;
  public createdBy: string;
  public createdAt: string;
  public globalFilter: any;
  public delivery: any;
  public httpParams: string;
  public dagId: string;
  public authorship: string;
  public audienceSegments: any[];
  public audienceSummary: string;
  public audienceSize: number;
  public warmup: boolean;
  public warmupScheduleId: string;
  public immediately: boolean;
  public sendToTheseUsers: string;
  public emailTemplateContent: string;
  //Audience is Segment(by Generate API ), could be multiple audience in the future
  public audience: Audience[];

  //email attributes
  public from: string;
  public subject: string;
  public introduction: string;
  public emailPreheaderOverwrite: string;

  //push Notification attributes
  public message: Message;
  public notificationTitle: string;
  public notificationMessageBody: string;
  public notificationAction: string;
  public notificationRedirectURL: string;
}

export class Audience {
  //generateSegmentId
  public segmentId: string;
  @IsString()
  public audienceName: string;
  public globalFilters: string;
  public audienceSize: number;
}

//BrazeMappingDto include Journeys and Campaigns
export class BrazeMappingDto {
  public journey_name: string;
  public campaign_name: string;
  public braze_template_id: string;
  public status: string;
  public partnerId: string;
  public braze_campaign_id: string;
  public email_subject_overwrite: string;
  public email_preheader_overwrite: string;
  public email_from: string;
}

export class DisplayNameAddresses {
  public id: number;
  public fromDisplayName: string;
  public localPart: string;
}

export class DisplayNameAddressesDto extends DisplayNameAddresses {
  public isDefault: boolean;
  public emailIpPool: string;
  public emailDomain: string;
}

export class EmailConfigurationsDto {
  public displayNameAddresses: any[];
}

//journeys and campaigns in each journey -  board view
export class JourneysAndCampaignsDto {
  public connectionEndpointType: string;
  public oAuthToken: string;
  public brazeAppId: string;
  public journeys: Journey[];
}

export class CampaignsMessagesDto extends Campaign {
  public from: string;
  public subject: string;
  public introduction: string;
  public emailTemplateContent: any;
}
export class CampaignsDto extends CampaignsMessagesDto {
  public emailTemplateId: string;
  public templateName: string;
  public description: string;
  public preheader: string;
  public body: string;
  public plaintextBody: string;
  public shouldInlineCss: string;
  //public tags: string;
  //public message: Message;
}

export class SendBodyDto {
  broadcast: boolean;
  externalUserIds: string[]; //phase1. location_id=external_id
  messages: SendBodyMessageDto;
  audience: any;
  overrideFrequencyCapping: boolean;
  campaignId: string;
  sendId: string;
}
export class SendBodyMessageDto {
  email?: SendBodyMessageEmailDto;
  androidPush?: BrazeAndroidPush;
  applePush?: BrazeApplePush;
}
export class SendBodyMessageEmailDto {
  appId: string;
  subject: string;
  from: string;
  replyTo: string;
  body: string;
  messageVariationId: string;
}

export class BrazeAndroidPush {
  messageVariationId: string;
  alert: string;
  title: string;
  customUri?: string;
}

export class BrazeApplePush {
  messageVariationId: string;
  alert: string;
  interruptionLevel: string;
  'content-available'?: boolean;
  customUri?: string;
}

export class SendIdDto {
  campaignId: string;
  sendId: string;
}

////Audience and Segments
export class AudienceDto {
  audienceSegments: SegmentsDto[];
  audienceSummary: string;
  audienceSize: number;
}

export class SegmentsDto {
  segmentId: string;
  segmentName: string;
}

export class PreviewTestMessageDto {
  public testRecipients: string[];
  //push Notification attributes
  public message: Message;
}

export class PreCalculateGlobalFilter {
  @IsEnum(ChannelType)
  public campaignType: string;
  @Optional()
  public audienceSegments?: CampaignAudience[];
  @IsEnum(SendToTheseUsers)
  public sendToTheseUsers?: string;
  @Optional()
  public globalFilter?: GlobalFilterSelectionCriterion[];
}

export class GlobalFilterSelectionCriterion {
  criterionName: string;
  operator: string;
  criterionValue: any;
  campaignList: [
    {
      campaignId: string;
    },
  ];
}

//consider rename to EmailCampaignStatsDto,PS:This is email CampaignStats
export class CampaignStatsDto {
  messagesSent = 0;
  uniqueOpenRate = 0;
  openRate = 0;
  deliveries = 0;
  bounceRate = 0;
  clicks = 0;
  unsubscribes = 0;
  uniqueClicks = 0;
  details: any;
}

export class EmailCampaignStatsDto extends CampaignStatsDto {
  lastRecurringPeriod: CampaignStatsDto;
  lastPeriodAnalytics: any;
  lastSendDate: any;
}

export class CampaignStatsDetail {
  sent = 0;
  opens = 0;
  machineOpen = 0;
  uniqueOpens = 0;
  machineAmpOpen = 0;
  clicks = 0;
  uniqueClicks = 0;
  unsubscribes = 0;
  bounces = 0;
  delivered = 0;
  reportedSpam = 0;
  openRate = 0;
  uniqueOpenRate = 0;
  bounceRate = 0;
}
export class CustomFooterDto {
  public partnerId?: string;
  public customFooterId?: number;
  public customFooterContent: string;
}

export class JourneyTemplatesResDto {
  journeyName: string;
  description: string;
  templates: DefaultTemplateResDto[];
}

export class DefaultTemplateResDto {
  templateId: string;
  templateName: string;
  templateType: string;
  templateDescription: string;
  thumbnail: string;
}
/*
  //temporary remove these fields from DefaultTemplateResDto
  segmentId: string;
  segmentName: string;
*/

export class InitializationTemplateDto {
  templateId: string;
  templateName: string;
}
