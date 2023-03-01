// Copyright 2022 opengpt Inc. or its affiliates. All Rights Reserved.
import { ConfigService } from '@nestjs/config';
import { configurationServiceUtilsIns } from '../util/configurationServiceUtils';

export interface ConfigBraze {
  //basic configuration
  baseUrl: string;
  generateBaseUrl: string;
  apiKey: string;
  appId: string;

  //basic uri resource name
  campaignsListResource: string;
  templatesEmailListResource: string;
  messagesSendResource: string;
  templatesEmailInfoResource: string;
  contentBlocksListResource: string;
  contentBlocksInfoResource: string;
  campaignsDataSeriesResource: string;
  sendsIdCreateResource: string;
  campaignsDetailsResource: string;
  usersTrackResource: string;
  sendsDataSeriesResource: string;
  partnersResource: string;
  partnerIdSegmentTreeResource: string;
  createSegmentNodeApi: string;

  //auth
  authorization: string;
  header: any;
  axiosConfig: any;

  //tmp identifier for testing
  sendIdentifier: string;
  campaignIdentifier: string;
  emailTemplateId: string;
  campaignName: string;
  templatePrefix: string;
  partnerId: string;
  testopengptCampaignInstanceId: string;

  //function urls
  templatesEmailList: string;
  campaignslist: string;
  templateEmailInfo: string;
  contentBlocksList: string;
  contentBlocksInfo: string;
  campaignAnalytics: string;
  campaignDetail: string;
  createSendId: string;
  messagesSend: string;
  usersTrack: string;
  campaignDataSeries: string;

  segmentTree: string;
  allSegmentTree: string;
}

export const configBraze = {} as ConfigBraze;

export function initialBrazeConfig(config: ConfigService) {
  //inital configuration
  configurationServiceUtilsIns.setConfigService(config);
  const brazeConfig =
    configurationServiceUtilsIns.getDeploymentConfigs().brazeConfig || {};
  const braze = config.get('braze') || {};
  const externalServiceConfig = config.get('externalService');

  configBraze.baseUrl = braze.baseUrl;
  configBraze.apiKey = braze.apiKey;
  configBraze.appId = braze.appId;
  configBraze.campaignsListResource = brazeConfig.campaignsListResource;
  configBraze.templatesEmailListResource =
    brazeConfig.templatesEmailListResource;
  configBraze.messagesSendResource = brazeConfig.messagesSendResource;
  configBraze.templatesEmailInfoResource =
    brazeConfig.templatesEmailInfoResource;
  configBraze.contentBlocksListResource = brazeConfig.contentBlocksListResource;
  configBraze.contentBlocksInfoResource = brazeConfig.contentBlocksInfoResource;
  configBraze.campaignsDataSeriesResource =
    brazeConfig.campaignsDataSeriesResource;
  configBraze.sendsIdCreateResource = brazeConfig.sendsIdCreateResource;
  configBraze.campaignsDetailsResource = brazeConfig.campaignsDetailsResource;
  configBraze.usersTrackResource = brazeConfig.usersTrackResource;
  configBraze.sendsDataSeriesResource = brazeConfig.sendsDataSeriesResource;
  configBraze.partnersResource = brazeConfig.partnersResource;
  configBraze.partnerIdSegmentTreeResource =
    brazeConfig.partnerIdSegmentTreeResource;

  configBraze.generateBaseUrl = externalServiceConfig.generate.apiEndpoint;

  //Braze - opengpt Dev
  // configBraze.baseUrl = "https://rest.iad-03.braze.com";
  // configBraze.apiKey = "0c2aa1c2-41ec-4471-b817-06687ae0f036";
  // configBraze.app_id = "cdb9d88c-ee84-4570-b3a6-e53ed4c7db65";
  // configBraze.emailDomain = "dev.campaigns.opengptdesign.io";
  // configBraze.email_ip_pool = configBraze.emailDomain;

  // //tmp identifier for testing
  // configBraze.campaign_identifier = "f1263c38-aa55-4057-b648-d1da9995f70b";
  // configBraze.email_template_id = "04425c3d-8ef1-48e3-b639-ec6f7bb40cac";
  // configBraze.template_prefix = "opengpt Harvest Crusade - Dev - ";
  // configBraze.campaign_name = configBraze.template_prefix + "Value Discovery - Monthly Value Discovery";
  // configBraze.send_identifier = "partner_Id_01_campaign_id_02";
  // configBraze.partner_id = "test_partner_id_1";

  // //Braze - Harvest Crusade - Dev
  // configBraze.baseUrl = 'https://rest.iad-03.braze.com';
  // configBraze.apiKey = '3c0b35a3-db91-4977-bd8f-2e856371ba42';
  // configBraze.app_id = '6fa348af-7e7e-4a0c-8343-6c4242d6bbea';
  // configBraze.emailDomain = 'dev.campaigns.opengptdesign.io';
  // configBraze.email_ip_pool = configBraze.emailDomain;

  //tmp identifier for testing
  //(opengpt own campaigns table, braze_campaign_id will be used with singleton by the channel, the channel like push notification or email)
  // configBraze.campaign_identifier = '2b51d231-c870-164f-936c-61abb402b1aa';
  // configBraze.email_template_id = 'bf1e617f-2359-494a-8a0b-6e5343e33d59';
  // configBraze.template_prefix = 'opengpt Harvest Crusade - Dev - ';
  // configBraze.campaign_name =
  //   configBraze.template_prefix + 'Value Discovery - Monthly Value Discovery';
  // configBraze.send_identifier = 'partner_Id_01_campaign_id_02';
  // configBraze.partner_id = '5a97345f39276a4c5ecaa70c';

  // init the urls
  configBraze.templatesEmailList =
    configBraze.baseUrl + configBraze.templatesEmailListResource;
  configBraze.campaignslist =
    configBraze.baseUrl + configBraze.campaignsListResource;
  configBraze.messagesSend =
    configBraze.baseUrl + configBraze.messagesSendResource;
  configBraze.templateEmailInfo =
    configBraze.baseUrl + configBraze.templatesEmailInfoResource;
  configBraze.contentBlocksList =
    configBraze.baseUrl + configBraze.contentBlocksListResource;
  configBraze.contentBlocksInfo =
    configBraze.baseUrl + configBraze.contentBlocksInfoResource;
  configBraze.campaignAnalytics =
    configBraze.baseUrl + configBraze.campaignsDataSeriesResource;
  configBraze.createSendId =
    configBraze.baseUrl + configBraze.sendsIdCreateResource;
  configBraze.campaignDetail =
    configBraze.baseUrl + configBraze.campaignsDetailsResource;
  configBraze.usersTrack = configBraze.baseUrl + configBraze.usersTrackResource;
  configBraze.campaignDataSeries =
    configBraze.baseUrl + configBraze.sendsDataSeriesResource;

  //configBraze.generateBaseUrl = 'http://100.21.224.24:3000/generate';  //Dev
  //configBraze.generateBaseUrl = 'http://54.245.242.9:3000/generate'; //QA and Prod for opengpt
  //configBraze.generateBaseUrl = braze.generateBaseUrl;
  configBraze.segmentTree =
    configBraze.generateBaseUrl +
    configBraze.partnersResource +
    configBraze.partnerIdSegmentTreeResource; //'/partners/$partnerId/segmentTree';
  configBraze.allSegmentTree =
    configBraze.generateBaseUrl + configBraze.partnersResource;
  configBraze.createSegmentNodeApi =
    configBraze.generateBaseUrl +
    configBraze.partnersResource +
    brazeConfig.createSegmentNode;

  configBraze.authorization = 'Bearer ' + configBraze.apiKey;
  configBraze.header = {
    'content-type': 'application/json',
    Authorization: configBraze.authorization,
  };
  configBraze.axiosConfig = {
    headers: configBraze.header,
  };
}
//============================================================

//Variable/Cache/cacheBraze
export interface CacheBraze {
  campaigns: any;
  emailTemplates: any;
  templateNameCache: Map<string, string>;
  campaignNameCache: Map<string, string>;
  audienceSegmentTreesCache: Map<string, []>; // key is the partnerId,array is audienceSegmentTree
}

export const cacheBraze = {} as CacheBraze;
export const filterExpressionSplitFlag = ';';
export const hyphenSplitFlag = '-';
export const hyphenWithSpaceSplitFlag = ' - ';

console.log('cacheBraze = ' + JSON.stringify(cacheBraze));

export const analyseCsvName = 'pushNotificationAnalyse.csv';
export const emailAnalyticsCsvName = 'emailStatistics.csv';

export const DATE_FORMATE = 'YYYY-MM-DD';
export const TIME_FORMATE = 'HH:mm:ss';

export const opengpt_INITIALIZED = 'opengpt Initialized';
