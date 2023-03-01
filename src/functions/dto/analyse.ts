export class NotificationAnalyse {
  public messageSend: number;
  public directOpend: number;
  public deliveries: number;
  public influencedOpen: number;
  public clicks: number;
  public bounce: number;
}
//This is old pushNotification Analytics DTO , has too much typo, it should be replace by DailyPushNotificationAnalytics
export class DaliyNotificationAnalyse {
  public date: string;
  public messageSend: number;
  public deliveries: number;
  public directOpend: number;
  public bounce: number;
}
//Currently use the new one for Daily PushNotification campaign Analytics DTO
export class DailyPushNotificationAnalytics {
  public date: string;
  public messageSend: number;
  public deliveries: number;
  public directOpened: number;
  public bounce: number;
}

export class GroupByResDto {
  public num: number;
  public event_type: string;
}

export class GroupByDailyResDto {
  public num: number;
  public event_type: string;
  public date: string;
}

export class DispatchId {
  ios: string[];
  android: string[];
}
