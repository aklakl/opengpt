import { Optional } from '@nestjs/common';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { SendToTheseUsers } from '../constant/enums';

export class Message {
  public title: string;
  public messageBody: string;
  public onClickBehavior: Behavior;
}

export class Behavior {
  public action: string;
  public redirectURL: string;
}

export class PostNotificationRes {
  public campaignId: string;
  public campaignName: string;
  public campaignType: string;
  public status: string;
  public tags: string[];
  public audienceSegments: any[];
  public audienceSummary: string;
  public audienceSize: number;
  public immediately: boolean;
  public globalFilter: [JSON];
  //public delivery: Delivery;
  public sendToTheseUsers?: string;
  public warmup?: boolean;
  public campaignDescription: string;
  public journeyId: string;
  public authorship: string;
}

export class NotificationCampaign {
  public campaignType: string;
  //This is the opengptCampaignId
  public campaignName: string;
  @Optional()
  public journeyId?: string;
  @Optional()
  public campaignDescription?: string;
  @Optional()
  public status?: string;
  @Optional()
  public tags?: string[];
  //Audience is Segment(by Generate API ), could be multiple audience in the future
  @Optional()
  public audienceSegments?: any[];
  @Optional()
  public message?: Message;
  @Optional()
  //public delivery?: Delivery;
  @Optional()
  public authorship?: string;
  @Optional()
  public globalFilter?: [JSON];
  @IsBoolean()
  public immediately?: boolean;
  // @Optional()
  // public warmup?: string;
  @Optional()
  @IsNumber()
  public audienceSize?: number;
  @Optional()
  public audienceSummary?: string;
  @IsEnum(SendToTheseUsers)
  public sendToTheseUsers?: string;
  @Optional()
  public warmup?: boolean;
}
