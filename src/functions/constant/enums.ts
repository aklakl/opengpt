// Copyright 2022 opengpt Inc. or its affiliates. All Rights Reserved.

//20220517 Lisa Steele confirmed the status is Draft, Active, Inactive(Paused), Completed. refer：https://docs.google.com/document/u/1/d/1BZTpyLGzJvrlzhF9EziFydV5yWcTLM0n8xnTcW8UCoE/edit?usp=sharing_eip_m&ts=6283cf60
export enum CampaignStatus {
  DRAFT = 'Draft',
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  INACTIVE = 'Inactive',
  COMPLETED = 'Completed',
}
export enum createNewCampaignsWithoutJourneyId {
  JOURNEY_NAME = 'Unclassified',
  JOURNEY_DESCRIPTION = 'create new campagin without journey id',
}
export enum ChannelType {
  EMAIL = 'email',
  NOTIFICATION = 'pushNotification',
  WARMUP = 'warmup',
}

export enum MessageIdType {
  EMAIL = 'email',
  LocationId = 'locationId',
  CustomerId = 'customerId',
}

export enum Authorship {
  CUSTOMERCREATED = 'customerCreated',
  opengpt = 'opengpt',
}

export enum HttpMethod {
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

//20220608 new update refer:https://www.figma.com/file/r3BYgpBt8h8X89bgJxTBwO/Harvest---Crusade-1.0?node-id=202%3A84675
export enum GlobalFilterSelections {
  HASMARKEDYOUASSPAM = 'Has marked you as spam',
  HASNOTRECEIVEDCAMPAIGN = 'Has not received campaign',
  HASRECEIVEDCAMPAIGN = 'Has received campaign', //20220708 Suhui add new feature, need a new ticket.
  LASTCLICKEDANYEMAIL = 'Last clicked any email',
  LASTCLICKEDANYINAPPMESSAGE = 'Last Clicked any in-app message',
  LASTOPENEDANYEMAIL = 'Last opened any email',
  LASTOPENEDANYPUSH = 'Last opened any push',
  LASTRECEIVEDANYMESSAGE = 'Last received any message',
  LASTRECEIVEDEMAIL = 'Last received email',
  LASTRECEIVEDPUSH = 'Last received push',
}

export enum DagStatus {
  PUSHING = 'pushing',
  ON = 'on',
}

export enum OneStepStatus {
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done',
  ERROR = 'error',
}

export enum SendToTheseUsers {
  SUBSCRIBED_OR_OPTEDIN = 'Users who are subscribed or opted in',
  OPTEDIN_ONLY = 'Opted-in uses only',
  ALL = 'All users including unsubscribed users',
}

export enum NotificationAction {
  OPENAPP = 'openApp',
  REDIRECTTOWEBURL = 'redirectToWebUrl',
}
