import { DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY } from 'constants/appConstant';
import ScheduleAndGoalsEnums from 'enums/campaigns/scheduleAndGoalsEnums';
import S3SFTPImportEnums from 'enums/s3sftp/s3stfpImportEnums';
import moment from 'moment';

export const getDbImportsAudienceType = (type) => {
  let audienceType = '';
  if (type === 'anonymous_audience' || type === 'registered_audience') {
    audienceType = 'audience';
  } else {
    audienceType = 'event';
  }
  return audienceType;
};

let status = '';
export const setStatusType = (type) => {
  status = type;
};

export const getPayloadForEditDB = (object) => {
  const payload = {
    selectSource: {
      sourceType: object?.source_type,
      audienceType: object?.import_type,
      eventSelect: object?.events_name,
      importType: object?.import_type,
    },
    dataBaseFormat: {
      dbConnection: object?.source_id,
      tableName: object?.table_name,
      importName: object?.import_name,
      emailID: object?.email_ids,
    },
    schedule: {
      id: object.id,
      campaignTimeZone: object?.time_zone,
      sourceType: object?.source_type,
      scheduleType:
        object?.schedule_type === ScheduleAndGoalsEnums.PERIODIC
          ? ScheduleAndGoalsEnums.PERIODIC
          : ScheduleAndGoalsEnums.ONE_TIME,
      ...(object?.schedule_type === ScheduleAndGoalsEnums.PERIODIC && {
        periodic: {
          sendCampaignType: object?.frequency,
          sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
          atFixedTime: {
            startDate: moment
              .unix(object?.start_date)
              .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
            sendTime: moment.unix(object?.start_date).format('LT'),
            ends: object.end_type,
            ...(object.end_type === ScheduleAndGoalsEnums.ON && {
              on: {
                endDate: moment
                  .unix(object?.end_date)
                  .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
              },
            }),
            ...(object.end_type === ScheduleAndGoalsEnums.AFTER && {
              after: {
                occurrences: object?.occurrences,
              },
            }),
          },
          repeatEvery: object?.repeat_every,
          repeatOn:
            object?.frequency === ScheduleAndGoalsEnums.WEEKLY
              ? ScheduleAndGoalsEnums.DAY_OF_WEEK
              : Object.keys(object?.repeat_on_day_of_month).length > 0
              ? ScheduleAndGoalsEnums.DAY_OF_MONTH
              : ScheduleAndGoalsEnums.DAY_OF_WEEK,
          daysOfMonth: object?.repeat_on_day_of_month ?? [],
          daysOfWeek: object?.repeat_on_day_of_week ?? [],
        },
      }),
      ...(object.schedule_type === ScheduleAndGoalsEnums.AS_SOON_AS_POSSIBLE ||
        (object.schedule_type === ScheduleAndGoalsEnums.AT_SPECIFIC_TIME && {
          one_time: {
            sendCampaignTime: ScheduleAndGoalsEnums.AT_FIXED_TIME,
            sendCampaignType:
              object.schedule_type === ScheduleAndGoalsEnums.AS_SOON_AS_POSSIBLE
                ? ScheduleAndGoalsEnums.IMMEDIATELY
                : ScheduleAndGoalsEnums.AT_SPECIFIC_DATE_AND_TIME,
            atFixedTime: {
              startDate: moment
                .unix(object?.start_date)
                .format(DATE_FORMAT_WITHOUT_TIME_DD_MMM_YYYY),
              sendTime: moment.unix(object?.start_date).format('LT'),
            },
          },
        })),
    },
  };
  return payload;
};

export const getPayloadForAddUpdateDB = (
  object,
  selectSource,
  dataBaseFormat
) => {
  const payload = {
    id: object?.id ?? '',
    db_schedule_detail: {
      ...(status === S3SFTPImportEnums.STATUS.CANCELLED && {
        status: S3SFTPImportEnums.STATUS.INITIATED,
      }),
      end_type:
        object.scheduleType === ScheduleAndGoalsEnums.PERIODIC
          ? object?.periodic.atFixedTime.ends
          : '',
      ...(object.scheduleType === ScheduleAndGoalsEnums.PERIODIC &&
        object?.periodic.ends === ScheduleAndGoalsEnums.ON && {
          end_date: moment(object?.periodic.atFixedTime.on.endDate).unix(),
        }),
      ...(object.scheduleType === ScheduleAndGoalsEnums.PERIODIC && {
        repeat_every: object?.periodic.repeatEvery,
      }),
      ...(object.scheduleType === ScheduleAndGoalsEnums.PERIODIC && {
        repeat_on_day_of_week:
          object?.periodic.sendCampaignType === ScheduleAndGoalsEnums.WEEKLY ||
          (object?.periodic.sendCampaignType ===
            ScheduleAndGoalsEnums.MONTHLY &&
            object?.periodic.repeatOn === ScheduleAndGoalsEnums.DAY_OF_WEEK)
            ? object?.periodic.daysOfWeek
            : [],
      }),
      ...(object.scheduleType === ScheduleAndGoalsEnums.PERIODIC && {
        repeat_on_day_of_month:
          object?.periodic.repeatOn === ScheduleAndGoalsEnums.DAY_OF_MONTH
            ? object?.periodic.daysOfMonth
            : [],
      }),
      ...(object.scheduleType === ScheduleAndGoalsEnums.PERIODIC && {
        frequency: object[object.scheduleType].sendCampaignType,
      }),
      import_name: dataBaseFormat.importName,
      ...(object[object.scheduleType].sendCampaignType ===
      ScheduleAndGoalsEnums.IMMEDIATELY
        ? {
            start_date: moment().unix(),
          }
        : {
            start_date: moment(
              `${object[object.scheduleType]?.atFixedTime.startDate} ${
                object[object.scheduleType]?.atFixedTime.sendTime
              }`
            ).unix(),
          }),
      ...(object.scheduleType === ScheduleAndGoalsEnums.PERIODIC &&
        object[object.scheduleType]?.atFixedTime.ends ===
          ScheduleAndGoalsEnums.AFTER && {
          occurrences:
            object[object.scheduleType]?.atFixedTime.after.occurrences,
        }),
      schedule_type:
        object.scheduleType === ScheduleAndGoalsEnums.ONE_TIME
          ? object?.[object.scheduleType].sendCampaignType ===
            ScheduleAndGoalsEnums.IMMEDIATELY
            ? ScheduleAndGoalsEnums.AS_SOON_AS_POSSIBLE
            : ScheduleAndGoalsEnums.AT_SPECIFIC_TIME
          : object.scheduleType,
      source_id: dataBaseFormat.dbConnection,
      source_type: selectSource.sourceType,
      table_name: dataBaseFormat.tableName,
      time_zone: object.campaignTimeZone,
      email_ids: dataBaseFormat.emailID,
      ...(selectSource.importType === ScheduleAndGoalsEnums.EVENT && {
        events_name: selectSource.eventSelect,
      }),
      import_type: selectSource.audienceType
        ? selectSource.audienceType
        : ScheduleAndGoalsEnums.EVENT,
    },
  };
  return payload;
};

export const capitalizeFirstLetter = (inputStr) => {
  return inputStr[0].toUpperCase() + inputStr.substring(1);
};
