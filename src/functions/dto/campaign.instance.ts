import { Optional } from '@nestjs/common';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { SendToTheseUsers } from '../constant/enums';
//import { getTemplateEmailInfoFromEmailTemplateId } from "../braze";

import { CampaignAudience } from '../entities/campaign.audience.entity';
//import { Delivery } from '../scheduler/scheduler.entity';
import { Message } from './notification';

// export class EmailInfo {
//   public from?: string;
//   public subject?: string;
//   public introduction?: string;
// }

export class CampaignsUpdateDto {
  @IsString()
  @Optional()
  public opengptCampaignInstanceId: string;
  @Optional()
  public journeyId?: string;
  @Optional()
  public campaignName?: string;
  @Optional()
  public campaignDescription?: string;
  @Optional()
  public partnerId?: string;
  @Optional()
  public message?: Message;
  // @Optional()
  // public delivery?: Delivery;
  @Optional()
  public immediately?: boolean;
  @Optional()
  public httpParams?: string;
  @Optional()
  public globalFilter?: [JSON];

  @Optional()
  public introduction?: string;
  @Optional()
  public campaignSendId?: string;
  @Optional()
  public tags?: string[];
  @Optional()
  public status?: string;
  @Optional()
  public authorship?: string;
  @Optional()
  audienceSegments?: CampaignAudience[];
  @Optional()
  public from?: string;
  @Optional()
  public subject?: string;
  @Optional()
  public emailPreheaderOverWrite?: string;
  @Optional()
  public warmup?: boolean;
  @Optional()
  @IsNumber()
  public audienceSize?: number;
  @Optional()
  public audienceSummary?: string;
  @Optional()
  @IsEnum(SendToTheseUsers)
  public sendToTheseUsers?: string;
}
