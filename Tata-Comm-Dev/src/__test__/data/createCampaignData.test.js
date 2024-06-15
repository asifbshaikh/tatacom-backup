import { describe, expect, it } from '@jest/globals';
import {
  userBehaviorFilterOptions,
  filterConditionOptions,
  filterByUsersButtonLists,
  selectExecutedFilterOptions,
  userPropertyFilterOptions,
  customSegmentFilterOptions,
  userAffinityFilterOptions,
  selectAudienceRadioOptions,
  dummyOptionsNumber,
  selectHeaderOptions,
  selectTriggereRadioOptions,
  sendMessageBestTimeRadioOptions,
  userBestTimeNotAvailableRadioOptions,
  sendInUserTimeZoneRadioList,
  oneTimeRadioLists,
  periodicRadioLists,
  periodicEndsRadioLists,
  periodicMonthlyRadioLists,
  scheduleCampaignOneTimeBtnList,
  scheduleCampaignPeriodicBtnList,
  scheduleCampaignEventTriggeredBtnList,
  weekDaysList,
  testSmsCampaignOptions,
  CampaignContentTypeOptions,
} from '../../data/createCampaignData';

describe('userBehavior DropDown options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(userBehaviorFilterOptions)).toBe(true);
    expect(userBehaviorFilterOptions.length).toBeGreaterThan(0);

    userBehaviorFilterOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('value');
    });
  });
});

describe('userProperty DropDown options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(userPropertyFilterOptions)).toBe(true);
    expect(userPropertyFilterOptions.length).toBeGreaterThan(0);

    userPropertyFilterOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('value');
    });
  });
});

describe('customSegment DropDown options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(customSegmentFilterOptions)).toBe(true);
    expect(customSegmentFilterOptions.length).toBeGreaterThan(0);

    customSegmentFilterOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('value');
    });
  });
});

describe('userAffinity DropDown options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(userAffinityFilterOptions)).toBe(true);
    expect(userAffinityFilterOptions.length).toBeGreaterThan(0);

    userAffinityFilterOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('value');
    });
  });
});

describe('SelectAudience Radiooptions', () => {
  it('should export array of object', () => {
    expect(Array.isArray(selectAudienceRadioOptions)).toBe(true);
    expect(selectAudienceRadioOptions.length).toBeGreaterThan(0);

    selectAudienceRadioOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('filter combination options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(filterConditionOptions)).toBe(true);
    expect(filterConditionOptions.length).toBeGreaterThan(0);

    filterConditionOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('buttons to filter users options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(filterByUsersButtonLists)).toBe(true);
    expect(filterByUsersButtonLists.length).toBeGreaterThan(0);

    filterByUsersButtonLists.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('selected executed filter options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(selectExecutedFilterOptions)).toBe(true);
    expect(selectExecutedFilterOptions.length).toBeGreaterThan(0);

    selectExecutedFilterOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('users mobile number dropdown options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(dummyOptionsNumber)).toBe(true);
    expect(dummyOptionsNumber.length).toBeGreaterThan(0);

    dummyOptionsNumber.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('Select header options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(selectHeaderOptions)).toBe(true);
    expect(selectHeaderOptions.length).toBeGreaterThan(0);

    selectHeaderOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('Select trigger radio options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(selectTriggereRadioOptions)).toBe(true);
    expect(selectTriggereRadioOptions.length).toBeGreaterThan(0);

    selectTriggereRadioOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('send at best time radio options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(sendMessageBestTimeRadioOptions)).toBe(true);
    expect(sendMessageBestTimeRadioOptions.length).toBeGreaterThan(0);

    sendMessageBestTimeRadioOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('user best time not available radio options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(userBestTimeNotAvailableRadioOptions)).toBe(true);
    expect(userBestTimeNotAvailableRadioOptions.length).toBeGreaterThan(0);

    userBestTimeNotAvailableRadioOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('send in user timezone radio options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(sendInUserTimeZoneRadioList)).toBe(true);
    expect(sendInUserTimeZoneRadioList.length).toBeGreaterThan(0);

    sendInUserTimeZoneRadioList.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('one time radio options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(oneTimeRadioLists)).toBe(true);
    expect(oneTimeRadioLists.length).toBeGreaterThan(0);

    oneTimeRadioLists.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('periodic radio options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(periodicRadioLists)).toBe(true);
    expect(periodicRadioLists.length).toBeGreaterThan(0);

    periodicRadioLists.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('periodic ends radio options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(periodicEndsRadioLists)).toBe(true);
    expect(periodicEndsRadioLists.length).toBeGreaterThan(0);

    periodicEndsRadioLists.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('periodic monthly radio options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(periodicMonthlyRadioLists)).toBe(true);
    expect(periodicMonthlyRadioLists.length).toBeGreaterThan(0);

    periodicMonthlyRadioLists.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('schedule one time btn list', () => {
  it('should export array of object', () => {
    expect(Array.isArray(scheduleCampaignOneTimeBtnList)).toBe(true);
    expect(scheduleCampaignOneTimeBtnList.length).toBeGreaterThan(0);

    scheduleCampaignOneTimeBtnList.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('schedule periodic btn list', () => {
  it('should export array of object', () => {
    expect(Array.isArray(scheduleCampaignPeriodicBtnList)).toBe(true);
    expect(scheduleCampaignPeriodicBtnList.length).toBeGreaterThan(0);

    scheduleCampaignPeriodicBtnList.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('event trigger btn list', () => {
  it('should export array of object', () => {
    expect(Array.isArray(scheduleCampaignEventTriggeredBtnList)).toBe(true);
    expect(scheduleCampaignEventTriggeredBtnList.length).toBeGreaterThan(0);

    scheduleCampaignEventTriggeredBtnList.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('weekdays list', () => {
  it('should export array of object', () => {
    expect(Array.isArray(weekDaysList)).toBe(true);
    expect(weekDaysList.length).toBeGreaterThan(0);

    weekDaysList.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
    });
  });
});
describe('sms campaign options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(testSmsCampaignOptions)).toBe(true);
    expect(testSmsCampaignOptions.length).toBeGreaterThan(0);

    testSmsCampaignOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('value');
    });
  });
});
describe('campaign content type options', () => {
  it('should export array of object', () => {
    expect(Array.isArray(CampaignContentTypeOptions)).toBe(true);
    expect(CampaignContentTypeOptions.length).toBeGreaterThan(0);

    CampaignContentTypeOptions.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('value');
    });
  });
});
