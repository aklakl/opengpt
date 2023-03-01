import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigurationService } from '../../config/configuration.service';
import * as crusadeDto from '../dto/crusade';
import * as enums from '../constant/enums';
import * as commonUtils from '../util/commonUtils';
import moment from 'moment';
import { GroupByDailyResDto, GroupByResDto } from '../dto/analyse';
import { DATE_FORMATE } from '../constant/constant';
import { ChannelType } from '../constant/enums';

@Injectable()
export class DatabricksDataService {
  async getExternalIdsFromEmailAddresses(
    partnerId: string,
    emailAddresses: string[],
    channelType: ChannelType,
  ): Promise<{ external_id: string; email: string; count: number }[]> {
    if (!partnerId || partnerId == '') {
      this.logger.log(
        'DatabricksDataService.getExternalIdsFromEmailAddresses | passed empty partnerId, returning',
      );
      return;
    }
    let emails = '';
    emailAddresses.forEach((value: string, index: number, array: string[]) => {
      emails += `'${value}'`;
      if (index !== array.length - 1) {
        emails += ', ';
      }
    });
    const idColumn =
      channelType === ChannelType.EMAIL ? 'location_id' : 'customer_id';
    const querySql = `select count(distinct l.${idColumn}) count, first(l.${idColumn}) external_id, u.email
    from ${this.userTableName} u left join ${this.locationDataTableName} l on u.external_id = l.location_id
    where l.partner_id = '${partnerId}'
    and u.email in (${emails})
    group by u.email;`;
    this.logger.log(
      'DatabricksDataService.getExternalIdsFromEmailAddresses | querySql = ' +
      querySql,
    );
    const result: { external_id: string; email: string; count: number }[] =
      await this.odbcService.executeQuery(querySql);
    result.forEach(element => {
      element.count = Number(element.count);
      element.external_id = element.external_id.toString();
    });
    return result;
  }
  private locationDataTableName = '';
  private metaDataTableName = '';
  private pushNotificationEventTableName = '';
  private emailEventTableName = '';
  private userTableName = '';
  private readonly odbcService: any;
  constructor(
    @Inject(ConfigurationService)
    config: ConfigurationService,
  ) {
    // const databricksConfig = config.getConfigValue('databricks');
    // this.locationDataTableName = databricksConfig.tables.locationData;
    // this.metaDataTableName = databricksConfig.tables.metaData;
    // this.pushNotificationEventTableName =
    //   databricksConfig.tables.pushNotificationEvent;
    // this.emailEventTableName = databricksConfig.tables.emailEvent;
    // this.userTableName = databricksConfig.tables.user;
  }
  private readonly logger = new Logger(DatabricksDataService.name);

  async count(queryExpression: string): Promise<number> {
    if (!queryExpression || queryExpression == '') {
      queryExpression = '1=1';
    }
    this.logger.log('queryExpression = ' + queryExpression);
    const result: any[] = null;
    return parseInt(result[0]['cnt']);
  }
  async findAllowdValues(partnerId: string, segmentName: string) {
    this.logger.log(
      `DatabricksDataService.findAllowdValues | sql = SELECT ${segmentName} FROM ${this.metaDataTableName} WHERE partner_id = "${partnerId}"`,
    );
    const locationsMetadata = null;
    return locationsMetadata;
  }

  async futureCounts(queryExpressions: string[]): Promise<number[]> {
    let sql = '';
    const querySqlList = queryExpressions.map(item => {
      return `SELECT count(*) as cnt FROM ${this.locationDataTableName} WHERE ${item}`;
    });
    sql = querySqlList.join(' UNION ALL ');
    const result = null;
    return result.map((item: any) => {
      return parseInt(item['cnt']);
    });
  }

  async getPreviewSegmentNode(queryExpression: string) {
    let result: any = await this.odbcService.executeQuery(
      `SELECT location_id AS locationId, customer_id AS customerId FROM ${this.locationDataTableName} WHERE ${queryExpression}`,
    );
    result = result.map((item: any) => {
      item.locationId = parseInt(item['locationId']);
      item.customerId = parseInt(item['customerId']);
      item.accountId = null;
      return item;
    });
    return result;
  }

  async getLocationIds(
    partnerId: string,
    queryExpression: string,
    sendToTheseUsers: string,
    offset?: number,
    size?: number,
  ): Promise<any[]> {
    if (!partnerId || partnerId == '') {
      return;
    }
    let emailSubscribeWhere;
    if (sendToTheseUsers == enums.SendToTheseUsers.OPTEDIN_ONLY) {
      emailSubscribeWhere = `WHERE email_subscribe = 'opted_in'`;
    }
    if (sendToTheseUsers == enums.SendToTheseUsers.SUBSCRIBED_OR_OPTEDIN) {
      emailSubscribeWhere = `WHERE email_subscribe in ('subscribed','opted_in') `;
    }
    //SELECT distinct location_id FROM default.location_360_data_json where partner_id = '5d2e22b126ad033b05956af4'
    let querySql = `SELECT distinct location_id FROM ${this.locationDataTableName} WHERE partner_id = "${partnerId}"  and ${queryExpression}`;
    if (emailSubscribeWhere) {
      querySql = `SELECT distinct location_id FROM
          (${querySql}) as l
          inner join 
          (select distinct external_id FROM  ${this.userTableName} ${emailSubscribeWhere}) as u
          on u.external_id = l.location_id`;
    }
    if (offset != undefined && size != undefined) {
      querySql = `WITH pg_temp_data AS (
        select row_number() over (win) as pg_temp_count, * from (
          ${querySql}
        ) window win as (order by location_id)
      )
      SELECT * FROM pg_temp_data 
        WHERE pg_temp_count > ${offset} AND pg_temp_count <= ${offset + size};`;
    }
    this.logger.log(
      'DatabricksDataService.getLocationIds | querySql = ' + querySql,
    );
    const res: any[] = null;
    return res;
  }

  async getLocationIdsAsArray(
    partnerId: string,
    queryExpression: string,
    sendToTheseUsers: string,
    offset?: number,
    size?: number,
  ): Promise<any[]> {
    const locationIds: any[] = [];
    const locationIdsObj = await this.getLocationIds(
      partnerId,
      queryExpression,
      sendToTheseUsers,
      offset,
      size,
    );
    locationIdsObj.forEach(element => {
      const locationId = element.location_id.toString();
      locationIds.push(locationId);
    });
    return locationIds;
  }

  async getUserIdsHaveAnyEvent(
    inputUserIds: string[],
    selectionCriterion: crusadeDto.GlobalFilterSelectionCriterion,
  ): Promise<string[]> {
    if (!(inputUserIds?.length > 0)) {
      return [];
    }
    let eventTableName;
    let eventType;
    switch (selectionCriterion?.criterionName) {
      case enums.GlobalFilterSelections.HASMARKEDYOUASSPAM:
        if (selectionCriterion?.criterionValue) {
          eventTableName = this.emailEventTableName;
          eventType = 'users.messages.email.Click';
          break;
        } else {
          return inputUserIds;
        }
      case enums.GlobalFilterSelections.LASTCLICKEDANYEMAIL:
        eventTableName = this.emailEventTableName;
        eventType = 'users.messages.email.Click';
        break;
      case enums.GlobalFilterSelections.LASTOPENEDANYEMAIL:
        eventTableName = this.emailEventTableName;
        eventType = 'users.messages.email.Open';
        break;
      case enums.GlobalFilterSelections.LASTRECEIVEDEMAIL:
        eventTableName = this.emailEventTableName;
        eventType = 'users.messages.email.Delivery';
        break;
      case enums.GlobalFilterSelections.LASTCLICKEDANYINAPPMESSAGE:
        eventTableName = this.pushNotificationEventTableName;
        eventType = 'users.messages.pushnotification.Bounce';
        break;
      case enums.GlobalFilterSelections.LASTOPENEDANYPUSH:
        eventTableName = this.pushNotificationEventTableName;
        eventType = 'users.messages.pushnotification.Open';
        break;
      case enums.GlobalFilterSelections.LASTRECEIVEDPUSH:
        eventTableName = this.pushNotificationEventTableName;
        eventType = 'users.messages.pushnotification.Send';
        break;
      default:
        this.logger.error(
          'DatabricksDataService.getUserIdsHaveAnyEvent | ' +
          `unknown globalFilterSelectionCriterion=>${JSON.stringify(
            selectionCriterion,
          )}`,
        );
        return inputUserIds;
    }
    let querySql = `SELECT distinct external_user_id FROM ${eventTableName} 
      WHERE event_type = '${eventType}'`;
    const haveTimeFilter =
      selectionCriterion?.operator &&
      selectionCriterion?.criterionValue &&
      selectionCriterion.operator.toLocaleLowerCase() != 'never' &&
      selectionCriterion?.criterionName !=
      enums.GlobalFilterSelections.HASMARKEDYOUASSPAM;
    if (haveTimeFilter) {
      querySql +=
        ` and time ${selectionCriterion.operator}` +
        ` '${selectionCriterion.criterionValue}'`;
    }
    this.logger.log(
      'DatabricksDataService.getUserIdsHaveAnyEvent | querySql = ' + querySql,
    );
    querySql += ` and external_user_id in (${inputUserIds.map(
      item => `'${item}'`,
    )})`;
    const res: any[] = null;
    this.logger.log(
      'DatabricksDataService.getUserIdsHaveAnyEvent | res = ' + res?.length,
    );
    if (res?.length > 0) {
      return res.map(e => e.external_user_id.toString());
    } else {
      return [];
    }
  }

  async getCustomerIdsOfReceivedAnyMessage(
    searchCondition: string,
    customerIds: string[],
    globalFilterSelectionCriterion: crusadeDto.GlobalFilterSelectionCriterion,
  ): Promise<string[]> {
    if (!customerIds || customerIds.length <= 0) {
      return [];
    }

    let querySql = `SELECT distinct l.customer_id FROM ${this.locationDataTableName} as l `;
    if (searchCondition == enums.ChannelType.EMAIL) {
      // customerId -> locationId -> customerId
      querySql += `right join ${this.emailEventTableName} as e on e.external_user_id = l.location_id
        where e.event_type in ('users.messages.email.Delivery', 'users.messages.email.Click','users.messages.email.Open') `;
    } else {
      // customerId -> customerId
      querySql += `right join ${this.pushNotificationEventTableName} as e on e.external_user_id = l.customer_id
        where e.event_type in ('users.messages.pushnotification.Bounce', 'users.messages.pushnotification.Open') `;
    }
    if (
      globalFilterSelectionCriterion?.criterionName ==
      enums.GlobalFilterSelections.HASNOTRECEIVEDCAMPAIGN.toString()
    ) {
      if (globalFilterSelectionCriterion?.campaignList?.length > 0) {
        querySql += ` and e.send_id in (
          ${globalFilterSelectionCriterion.campaignList.map(
          item => `'${item.campaignId}'`,
        )}
        )`;
      } else {
        return [];
      }
      if (typeof globalFilterSelectionCriterion?.criterionValue === 'number') {
        // there is only one operator
        querySql += ` and e.time > date_sub(current_date(), ${globalFilterSelectionCriterion.criterionValue})`;
      }
    } else if (
      globalFilterSelectionCriterion?.operator &&
      globalFilterSelectionCriterion?.criterionValue
    ) {
      querySql += ` and e.time ${globalFilterSelectionCriterion.operator} '${globalFilterSelectionCriterion.criterionValue}' `;
    }
    this.logger.log(
      `DatabricksDataService.getCustomerIdsOfReceivedAnyMessage | querySql = ${querySql}`,
    );
    querySql += `and l.customer_id in (${customerIds.map(
      item => `'${item}'`,
    )})`;
    const customerUserIdsObj: any[] = await this.odbcService.executeQuery(
      querySql,
    );
    if (customerUserIdsObj) {
      this.logger.log(
        `DatabricksDataService.getCustomerIdsOfReceivedAnyMessage | length = ${customerUserIdsObj.length}`,
      );
      return customerUserIdsObj.map(e => e.customer_id.toString());
    }
    return [];
  }

  async getLocationIdsOfReceivedAnyMessage(
    searchCondition: string,
    locationIds: string[],
    globalFilterSelectionCriterion: crusadeDto.GlobalFilterSelectionCriterion,
  ): Promise<string[]> {
    if (!locationIds || locationIds.length <= 0) {
      return [];
    }

    let querySql = `SELECT distinct l.location_id FROM ${this.locationDataTableName} as l `;
    if (searchCondition == enums.ChannelType.EMAIL) {
      // locationId -> locationId
      querySql += `right join ${this.emailEventTableName} as e on e.external_user_id = l.location_id
        where e.event_type in ('users.messages.email.Delivery', 'users.messages.email.Click','users.messages.email.Open') `;
    } else {
      // locationId -> customerId -> locationId
      querySql += `right join ${this.pushNotificationEventTableName} as e on e.external_user_id = l.customer_id
        where e.event_type in ('users.messages.pushnotification.Bounce', 'users.messages.pushnotification.Open') `;
    }
    if (
      globalFilterSelectionCriterion?.criterionName ==
      enums.GlobalFilterSelections.HASNOTRECEIVEDCAMPAIGN.toString()
    ) {
      if (globalFilterSelectionCriterion?.campaignList?.length > 0) {
        querySql += ` and e.send_id in (
          ${globalFilterSelectionCriterion.campaignList.map(
          item => `'${item.campaignId}'`,
        )}
        )`;
      } else {
        return [];
      }
      if (typeof globalFilterSelectionCriterion?.criterionValue === 'number') {
        // there is only one operator
        querySql += ` and e.time > date_sub(current_date(), ${globalFilterSelectionCriterion.criterionValue})`;
      }
    } else if (
      globalFilterSelectionCriterion?.operator &&
      globalFilterSelectionCriterion?.criterionValue
    ) {
      querySql += ` and e.time ${globalFilterSelectionCriterion.operator} '${globalFilterSelectionCriterion.criterionValue}' `;
    }
    this.logger.log(
      `DatabricksDataService.getLocationIdsOfReceivedAnyMessage | querySql =  ${querySql}`,
    );
    querySql += `and l.location_id in (${locationIds.map(
      item => `'${item}'`,
    )})`;
    const resLocationIds: any[] = await this.odbcService.executeQuery(querySql);
    if (resLocationIds) {
      this.logger.log(
        `DatabricksDataService.getLocationIdsOfReceivedAnyMessage | length = ${resLocationIds.length}`,
      );
      return resLocationIds.map(e => e.location_id.toString());
    }
    return [];
  }

  async getAllCustomerIdsOfReceivedAnyMessage(
    inputCustomerIds: string[],
    globalFilterSelectionCriterion: crusadeDto.GlobalFilterSelectionCriterion,
  ) {
    const customerIdsOfReceivedAnyNotification =
      await this.getCustomerIdsOfReceivedAnyMessage(
        enums.ChannelType.NOTIFICATION,
        inputCustomerIds,
        globalFilterSelectionCriterion,
      );
    const customerIdsOfReceivedAnyEmail =
      await this.getCustomerIdsOfReceivedAnyMessage(
        enums.ChannelType.EMAIL,
        inputCustomerIds,
        globalFilterSelectionCriterion,
      );
    const resCustomerIds = Array.from(
      new Set([
        ...(customerIdsOfReceivedAnyNotification || []),
        ...(customerIdsOfReceivedAnyEmail || []),
      ]),
    );
    this.logger.debug(
      'DatabricksDataService.getAllCustomerIdsOfReceivedAnyMessage | inputCustomerIds.length = ' +
      inputCustomerIds.length +
      ' | final resCustomerIds.length = ' +
      resCustomerIds.length,
    );
    return resCustomerIds;
  }

  async getAllLocationIdsOfReceivedAnyMessage(
    inputLocationIds: string[],
    globalFilterSelectionCriterion: crusadeDto.GlobalFilterSelectionCriterion,
  ) {
    const locationIdsOfReceivedAnyNotification =
      await this.getLocationIdsOfReceivedAnyMessage(
        enums.ChannelType.NOTIFICATION,
        inputLocationIds,
        globalFilterSelectionCriterion,
      );
    const locationIdsOfReceivedAnyEmail =
      await this.getLocationIdsOfReceivedAnyMessage(
        enums.ChannelType.EMAIL,
        inputLocationIds,
        globalFilterSelectionCriterion,
      );
    const resLocationIds = Array.from(
      new Set([
        ...(locationIdsOfReceivedAnyEmail || []),
        ...(locationIdsOfReceivedAnyNotification || []),
      ]),
    );
    this.logger.debug(
      'DatabricksDataService.getAllLocationIdsOfReceivedAnyMessage | inputLocationIds.length = ' +
      inputLocationIds.length +
      ' | final resLocationIds.length = ' +
      resLocationIds.length,
    );
    return resLocationIds;
  }

  async getEmailCampaignStats(
    brazeCampaignId: string,
    brazeSendId: string | string[],
    startDate: string,
    endDate: string,
  ): Promise<Map<string, crusadeDto.CampaignStatsDetail>> {
    let querySql = `SELECT time, eventType, count(id) as dataCount,
        count(distinct external_user_id) as uniqueDataCount FROM (
          select id, external_user_id, event_type as eventType, 
            date_format(time, 'y-MM-dd') as time
          from ${this.emailEventTableName} e WHERE 1=1`;
    if (brazeCampaignId) {
      querySql += ` and e.campaign_id = '${brazeCampaignId}'`;
    }
    if (brazeSendId) {
      if (typeof brazeSendId === 'string')
        querySql += ` and e.send_id = '${brazeSendId}' `;
      if (Array.isArray(brazeSendId))
        querySql += ` and e.send_id in ('${brazeSendId}') `;
    }
    if (startDate) {
      querySql += ` and e.time >= '${startDate} 00:00:00.000' `;
    }
    if (endDate) {
      querySql += ` and e.time <= '${endDate} 23:59:59.999' `;
    }
    querySql += `) temp group by time, eventType order by time`;

    this.logger.debug(
      'DatabricksDataService.getEmailCampaignStats | querySql = ' + querySql,
    );
    const res: any[] = await this.odbcService.executeQuery(querySql);
    this.logger.debug(
      'DatabricksDataService.getEmailCampaignStats | resObj = ' +
      JSON.stringify(commonUtils.bigintToString(res)),
    );

    const statsMap = new Map<string, crusadeDto.CampaignStatsDetail>();
    const startDateMoment = startDate ? moment.utc(startDate) : moment.utc();
    const endDateMoment = endDate ? moment.utc(endDate) : moment.utc();
    while (startDateMoment <= endDateMoment) {
      statsMap.set(
        startDateMoment.format(DATE_FORMATE),
        new crusadeDto.CampaignStatsDetail(),
      );
      startDateMoment.add(1, 'days');
    }

    if (res.length > 0) {
      res.forEach(e => {
        if (!statsMap.has(e.time)) {
          statsMap.set(e.time, new crusadeDto.CampaignStatsDetail());
        }
        const stats = statsMap.get(e.time);
        switch (e.eventType) {
          case 'users.messages.email.Open':
            stats.opens = commonUtils.toNumber(e.dataCount);
            stats.uniqueOpens = commonUtils.toNumber(e.uniqueDataCount);
            break;
          case 'users.messages.email.Delivery':
            stats.delivered = commonUtils.toNumber(e.dataCount);
            break;
          case 'users.messages.email.Send':
            stats.sent = commonUtils.toNumber(e.dataCount);
            break;
          case 'users.messages.email.Bounce':
          case 'users.messages.email.SoftBounce':
            stats.bounces += commonUtils.toNumber(e.dataCount);
            break;
          case 'users.messages.email.MarkAsSpam':
            stats.reportedSpam = commonUtils.toNumber(e.dataCount);
            break;
          case 'users.messages.email.Click':
            stats.clicks = commonUtils.toNumber(e.dataCount);
            stats.uniqueClicks = commonUtils.toNumber(e.uniqueDataCount);
            break;
          case 'users.messages.email.Unsubscribe':
            stats.unsubscribes = commonUtils.toNumber(e.dataCount);
            break;
          default:
            this.logger.warn(
              'DatabricksDataService.getEmailCampaignStats | emailCampaignMonthStats = ' +
              JSON.stringify(e.eventType),
            );
        }
      });
    }
    this.logger.debug(
      'DatabricksDataService.getEmailCampaignStats | statsMap = ' +
      JSON.stringify(statsMap),
    );
    return statsMap;
  }

  async getOpenRateAndBounceRateWithEmailCampaign(
    brazeCampaignId: string,
    brazeSendId: string,
    startDate: string,
    endDate: string,
  ) {
    /*
    SELECT count(*) as dataCount,event_type as eventType,date_format(e.time, 'y-M-d') as day FROM email_event e WHERE 1=1  
    and event_type in ('users.messages.email.Delivery','users.messages.email.Open','users.messages.email.SoftBounce','users.messages.email.Bounce','users.messages.email.Send' )  
    --and e.campaign_id = 'b3d16106-0706-6d0d-9828-f6596f8c59e1' and e.send_id = '5d2e22b126ad033b05956af4_b3d16106-0706-6d0d-9828-f6596f8c59e1' 
    and  time > '2022-04-23' and time <  '2022-05-21' 
    group by e.event_type,date_format(e.time, 'y-M-d')
    
    */
    let querySql = `SELECT count(*) as dataCount,event_type as eventType,date_format(e.time, 'y-M-d') as day  FROM ${this.emailEventTableName} e WHERE 1=1 `;
    querySql += ` and e.event_type in ('users.messages.email.Delivery','users.messages.email.Open','users.messages.email.SoftBounce','users.messages.email.Bounce','users.messages.email.Send' ) `;
    if (brazeCampaignId != undefined && brazeCampaignId != null) {
      querySql += ` and e.campaign_id = '${brazeCampaignId}'`;
    }
    if (brazeSendId != undefined && brazeSendId != null) {
      querySql += ` and e.send_id = '${brazeSendId}' `;
    }
    if (startDate != undefined && startDate != null) {
      querySql += ` and time > '${startDate}' `;
    }
    //if we want the data include endDate,need endDate + 1 day
    if (endDate != undefined && endDate != null) {
      querySql += ` and time < '${endDate}' `;
    }
    querySql += ` group by e.event_type,date_format(e.time, 'y-M-d') `;

    this.logger.debug(
      'DatabricksDataService.getOpenRateAndBounceRateWithEmailCampaign | querySql = ' +
      querySql,
    );
    const resObj: any[] = await this.odbcService.executeQuery(querySql);
    this.logger.debug(
      'DatabricksDataService.getOpenRateAndBounceRateWithEmailCampaign | resObj = ' +
      JSON.stringify(commonUtils.bigintToString(resObj)),
    );
    return resObj;
  }

  async query(querySql: string): Promise<any[]> {
    if (!querySql || querySql == '') {
      return;
    }
    this.logger.log('DatabricksDataService query | querySql = ' + querySql);
    const res: any[] = await this.odbcService.executeQuery(querySql);
    return res;
  }

  getLocationDataTableName() {
    return this.locationDataTableName;
  }

  findAll() {
    return `This action returns all locationData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} locationDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} locationDatum`;
  }
  // month param like '2022-02'
  async getMonthNotificationEventAnalyse(
    androidDispatchList: string[],
    iosDispatchList: string[],
    month: string,
  ) {
    const allDispatchListStr = this.concatDispatchList(
      androidDispatchList,
      iosDispatchList,
    );
    const sql = `SELECT COUNT(*)::int as num, event_type FROM ${this.pushNotificationEventTableName
      } 
    where dispatch_id in ( ${allDispatchListStr.join(',')}) 
    AND date_format(time, 'yyyy-MM') = '${month}'
    GROUP BY event_type;`;
    this.logger.log(
      'DatabricksDataService.getMonthNotificationEventAnalyse | sql->' + sql,
    );
    return null;
  }
  // day param like '2022-02-01'
  async getMonthDailyNotificationEventAnalytics(
    androidDispatchList: string[],
    iosDispatchList: string[],
    month: string,
  ) {
    const allDispatchListStr = this.concatDispatchList(
      androidDispatchList,
      iosDispatchList,
    );
    const sql = `SELECT COUNT(*)::int as num, event_type , date_format(time, 'yyyy-MM-dd') as date FROM ${this.pushNotificationEventTableName
      } 
    WHERE dispatch_id in (   ${allDispatchListStr.join(',')})
    GROUP BY event_type , date
    ORDER BY  date;`;
    this.logger.log(
      'DatabricksDataService.getMonthDailyNotificationEventAnalytics | sql-> ' +
      sql,
    );
    return null;
  }

  async getEveryDayInMonth(dispatchId: string, month?: string) {
    const dis = JSON.parse(dispatchId);
    const androidDispatch: string[] = dis.android;
    const iosDispatch: string[] = dis.ios;
    const allDispatchListStr = this.concatDispatchList(
      androidDispatch,
      iosDispatch,
    );
    const sql = ` SELECT DISTINCT date_format(time, 'yyyy-MM-dd')  as date  FROM ${this.pushNotificationEventTableName
      } 
    where dispatch_id in ( ${allDispatchListStr.join(',')})   
    and date_format(time, 'yyyy-MM') = '2022-06'  `;
    this.logger.log(`DatabricksDataService.getEveryDayInMonth | sql->${sql}`);
    return null;
  }

  async getUser(userId: string) {
    const sql = ` SELECT * FROM ${this.userTableName} 
    where external_id = '${userId}' `;
    this.logger.log(`DatabricksDataService.getUser | sql->${sql}`);
    return null;
  }

  async getCustomerIds(
    partnerId: string,
    queryExpression: string,
    sendToTheseUsers: string,
    offset?: number,
    size?: number,
  ): Promise<any[]> {
    if (!partnerId || partnerId == '') {
      return;
    }
    let emailSubscribeWhere;
    if (sendToTheseUsers == enums.SendToTheseUsers.OPTEDIN_ONLY) {
      emailSubscribeWhere = `WHERE push_subscribe = 'opted_in'`;
    }
    if (sendToTheseUsers == enums.SendToTheseUsers.SUBSCRIBED_OR_OPTEDIN) {
      emailSubscribeWhere = `WHERE push_subscribe in ('subscribed','opted_in') `;
    }
    //SELECT distinct location_id FROM default.location_360_data_json where partner_id = '5d2e22b126ad033b05956af4'
    // const querySql = `SELECT distinct customer_id FROM ${this.config.getConfigValue('databricks').tables.locationData
    //   } WHERE partner_id = "${partnerId}"  and ${queryExpression}`;
    // Here we need use brazeLocationDataTable.customer_id match the BrazeUserTable.external_id, as Sameer mention this on 20221109
    let querySql = `SELECT distinct location_id, customer_id FROM ${this.locationDataTableName} WHERE partner_id = "${partnerId}"  and ${queryExpression}`;
    if (emailSubscribeWhere) {
      querySql = `SELECT customer_id FROM
          (${querySql}) as l
          inner join 
          (select distinct external_id FROM  ${this.userTableName} ${emailSubscribeWhere}) as u
          on u.external_id = l.customer_id`;
    }
    if (offset != undefined && size != undefined) {
      querySql = `WITH pg_temp_data AS (
        select row_number() over (win) as pg_temp_count, * from (
          ${querySql}
        ) window win as (order by customer_id) 
      )
      SELECT * FROM pg_temp_data 
        WHERE pg_temp_count > ${offset} AND pg_temp_count <= ${offset + size};`;
    }
    this.logger.log(
      'DatabricksDataService.getCustomerIds | querySql = ' + querySql,
    );
    const res: any[] = await this.odbcService.executeQuery(querySql);
    return res;
  }

  concatDispatchList(
    androidDispatchList: string[],
    iosDispatchList: string[],
  ): string[] {
    const allDispatchList = androidDispatchList.concat(iosDispatchList);
    const allDispatchListStr: string[] = [];
    allDispatchList.forEach(ele => {
      allDispatchListStr.push(`'${ele}'`);
    });
    return allDispatchListStr;
  }

  async mapEmailsToIds(
    partnerId: string,
    testRecipientEmailAddresses: string[],
    channelType: ChannelType,
  ): Promise<{
    mappedIdList: string[];
    missingEmailToExternalIds: string[];
    foundEmailToExternalIds: string[];
    message: string;
    map: Map<string, string>;
  }> {
    const idsFromEmailAddresses = await this.getExternalIdsFromEmailAddresses(
      partnerId,
      testRecipientEmailAddresses,
      channelType,
    );
    this.logger.debug(
      'DatabricksDataService.mapEmailsToIds | idsFromEmailAddresses = ' +
      JSON.stringify(idsFromEmailAddresses),
    );
    const resultMap: Map<string, string> = new Map();
    const mappedIdList: string[] = [];
    idsFromEmailAddresses.forEach(value => {
      mappedIdList.push(value.external_id);
      resultMap.set(value.email, value.external_id);
    });
    this.logger.debug(
      'DatabricksDataService.mapEmailsToIds | mappedIdList = ' +
      JSON.stringify(mappedIdList),
    );
    this.logger.debug(
      'DatabricksDataService.mapEmailsToIds | resultMap = ' +
      JSON.stringify(resultMap),
    );
    let message = `${mappedIdList.length} external Ids were mapped successfully.`;
    let pleaseInvestigate = false;
    idsFromEmailAddresses.forEach(value => {
      if (value.count > 1) {
        message += ` The email ${value.email} could be mapped to several ids, with the first one being used.`;
        pleaseInvestigate = true;
      }
    });
    if (pleaseInvestigate)
      message += ' This is not standard behavior, please investigate.';

    const failedEmailList = testRecipientEmailAddresses.filter(
      email => resultMap.get(email) === undefined,
    );
    if (failedEmailList.length !== 0) {
      let failedMessage =
        " The following emails couldn't be mapped to external ids. Please verify:";
      failedEmailList.forEach((value, index) => {
        failedMessage += value;
        failedMessage += index !== failedEmailList.length - 1 ? ', ' : '.';
      });
      message += failedMessage;
    }
    const foundEmailToExternalIdsList = [...mappedIdList];
    const finalResult = {
      message: message,
      map: resultMap,
      mappedIdList: mappedIdList,
      missingEmailToExternalIds: failedEmailList,
      foundEmailToExternalIds: foundEmailToExternalIdsList,
    };
    this.logger.debug(
      'DatabricksDataService.mapEmailsToIds | finalResult = ' +
      JSON.stringify(mappedIdList),
    );
    return finalResult;
  }
}
