export const CustomDiagnostics = {
  CampaignInstanceNotExist: 'Campaign Instance Not Exist.',

  CampaignNotExist: 'Can Not Target A Campaign By CampaignInstanceId.',

  CampaignNotActive: 'Campaign Instance Not Active.',

  TriggerWithoutAudience: 'Trigger Notification Does not match any audience.',

  CampInstIdNotNoTrigger:
    'Does not match any trigger about campaignInstanceId.',

  SegmentNotFindInGenerate:
    'Did not find the SegmentInfo exist in Generate, Could be Generate already delete this SegmentInfo.',

  DispatchNotFindInDatabricks:
    'Did not find the Dispatch exist in databricks Table push Notification or connect databricks error',

  PushNotificationFailed: 'Push android Or Ios Notification Failed.',

  DispatchIdMissOrParseFailed:
    'TriggerLog miss dispatchId or parse dispatchId error.',
  CreateSchedulerFailed: ' New CampaignInstance Create Scheduler failed.',
  JourneysIdNotExist: 'JourneysId must exist.',
  CreateUnclassifiedJourney: 'create Journey error',
  DagBlocking:
    "Campaign's airflow task is still pushing, can't update now maybe try later",
  PushEmailCampaignToNotificationTirgger: `Can't push a notification trigger by email campaign id`,
  //commom
  InternalError: 'Internal server error, please contact administrator.',

  NotFound: 'Resource not found',
  //segmentNode
  CanNotAddChildNodes: 'Can not add child nodes.',

  SegmentIdNotMatchPartnerId: 'Invalid segment ID.',

  CanNotFindEverythingElseNode: 'Can not find everythingElse Node.',

  UpdateSegmentNodeError: 'update segment node error.',

  CurrentParentSegmentCanNotUpdate:
    'Current parent semgnet node can not update.',

  CurrentSegmentCanNotUpdate:
    'Current segment can not update, invalid segment id.',

  CurrentSegmentCanNotRemove:
    'Current segment can not remove, invalid segment id',

  InvalidColumnName: 'Invalid column name',

  InvalidPartnerId: 'Invalid partner ID',

  InvalidSegmentId: 'Invalid segment ID',

  InvalidChannelId: 'Invalid channel ID',

  InvalidStartDate: 'Invalid start date',

  InvalidEndDate: 'Invalid end date',

  InvalidDataRange: 'Invalid data range',

  InvalidCategory: 'Invalid category',

  DeleteSyncsFirst: 'Please delete the associated syncs first',

  DeleteTagAttached: 'Can not delete tag which already attached to a segment',

  TagIdNoExist: 'Tag id does not exist',

  DuplicateTagName: 'Tag name already exist',

  AttachedAbsentTag: 'SegmentNode attached at least one absent tag',

  // warmup start
  WarmupAudienceIsNotEnough:
    'There is not enough audience to warmup, please confirm.',
  // warmup end

  // airflow start
  AirflowMwaaCliResponseError:
    'There is not a right response from aws_mwaa_cli',
  // airflow end
};
