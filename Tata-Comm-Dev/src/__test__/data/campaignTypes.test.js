import { describe, expect, it } from '@jest/globals';
import smsData from '../../data/campaignTypes';

describe('sms campaign data export', () => {
  it('should export array of object', () => {
    expect(Array.isArray(smsData)).toBe(true);
    expect(smsData.length).toBeGreaterThan(0);

    smsData.forEach((item) => {
      expect(typeof item).toBe('object');
      expect(item).toHaveProperty('key');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('icon');
      expect(item).toHaveProperty('link');
    });
  });
});
