import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomDiagnostics } from '../constant/error';
import { CampaignsUpdateDto } from '../dto/campaign.instance';
import { Campaigns } from '../entities/campaigns.entity';
import { CampaignsPartner } from '../entities/campaigns.partner.entity';

const CampInstDtoMapEntity = new Map();
CampInstDtoMapEntity.set('from', 'emailFrom');
CampInstDtoMapEntity.set('subject', 'emailSubjectOverwrite');
CampInstDtoMapEntity.set('introduction', 'introduction');
CampInstDtoMapEntity.set('emailPreheaderOverWrite', 'emailPreheaderOverwrite');
CampInstDtoMapEntity.set('audienceSegments', 'audienceSegments');
CampInstDtoMapEntity.set('campaignName', 'campaignName');
CampInstDtoMapEntity.set('campaignDescription', 'campaignDescription');
CampInstDtoMapEntity.set('journeyId', 'journeyId');
CampInstDtoMapEntity.set('partnerId', 'partnerId');
CampInstDtoMapEntity.set('delivery', 'delivery');
CampInstDtoMapEntity.set('httpParams', 'httpParams');
CampInstDtoMapEntity.set('globalFilter', 'globalFilter');
CampInstDtoMapEntity.set('campaignSendId', 'campaignSendId');
CampInstDtoMapEntity.set('tags', 'tags');
CampInstDtoMapEntity.set('status', 'status');
CampInstDtoMapEntity.set('authorship', 'authorship');
// }

export const CampUpdateDtoToCampInst = (
  type: string,
  campUpdateDto: CampaignsUpdateDto,
): CampaignsPartner => {
  const campInst = new CampaignsPartner();
  if (campUpdateDto.from) {
    campInst.emailFrom = campUpdateDto.from;
  }
  if (campUpdateDto.subject) {
    campInst.emailSubjectOverwrite = campUpdateDto.subject;
  }
  if (campUpdateDto.introduction) {
    campInst.introduction = campUpdateDto.introduction;
  }
  if (
    campUpdateDto.immediately != null ||
    campUpdateDto.immediately != undefined
  ) {
    campInst.immediately = campUpdateDto.immediately;
  }
  if (campUpdateDto.emailPreheaderOverWrite) {
    campInst.emailPreheaderOverwrite = campUpdateDto.emailPreheaderOverWrite;
  }
  if (campUpdateDto.audienceSegments) {
    campInst.campaignAudiences = campUpdateDto.audienceSegments;
  }
  // if (campUpdateDto.delivery) {
  //   campInst.delivery = JSON.stringify(campUpdateDto.delivery);
  // }
  if (campUpdateDto.httpParams) {
    campInst.httpParams = campUpdateDto.httpParams;
  }
  if (campUpdateDto.globalFilter) {
    campInst.globalFilter = JSON.stringify(campUpdateDto.globalFilter);
  }
  if (campUpdateDto.tags) {
    campInst.tags = campUpdateDto.tags;
  }

  if (campUpdateDto.authorship) {
    campInst.authorship = campUpdateDto.authorship;
  }
  if (campUpdateDto.message) {
    campInst.notificationTitle = campUpdateDto.message.title;
    campInst.notificationMessageBody = campUpdateDto.message.messageBody;
    campInst.notificationAction = campUpdateDto.message.onClickBehavior.action;
    campInst.notificationRedirectURL =
      campUpdateDto.message.onClickBehavior.redirectURL;
  }
  if (campUpdateDto.warmup != null && campUpdateDto.warmup != undefined) {
    campInst.warmup = campUpdateDto.warmup;
  }
  if (campUpdateDto.audienceSize) {
    campInst.audienceSize = campUpdateDto.audienceSize;
  }
  if (campUpdateDto.audienceSummary) {
    campInst.audienceSummary = campUpdateDto.audienceSummary;
  }
  if (campUpdateDto.sendToTheseUsers) {
    campInst.sendToTheseUsers = campUpdateDto.sendToTheseUsers;
  }
  return campInst;
};

export const getCampAndCampInstByCampInstId = async (
  campInstId: string,
  campRepo: Repository<Campaigns>,
  campInstRepo: Repository<CampaignsPartner>,
): Promise<[Campaigns, CampaignsPartner]> => {
  const campInstDb: CampaignsPartner = await campInstRepo.findOneBy({
    opengptCampaignInstanceId: campInstId,
  });
  if (!campInstDb) {
    throw new HttpException(
      CustomDiagnostics.CampaignInstanceNotExist,
      HttpStatus.BAD_REQUEST,
    );
  }
  const campDb: Campaigns = await campRepo.findOneBy({
    opengptCampaignId: campInstDb.opengptCampaignId,
  });
  if (!campDb) {
    throw new HttpException(
      CustomDiagnostics.CampaignInstanceNotExist,
      HttpStatus.BAD_REQUEST,
    );
  }
  return [campDb, campInstDb];
};
