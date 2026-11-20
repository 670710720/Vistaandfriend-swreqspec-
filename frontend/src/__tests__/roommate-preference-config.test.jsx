import { ROOMMATE_PREFERENCE_CONFIG } from '../config.js'

test('test_T01_roommate_preference_config_matches_spec_rules', () => {
  expect(ROOMMATE_PREFERENCE_CONFIG.roomOccupants).toEqual({
    airConditioned: { min: 1, max: 4 },
    fan: { min: 1, max: 3 },
  })
  expect(ROOMMATE_PREFERENCE_CONFIG.sleepBehaviors).toEqual([
    'กรน',
    'กัดฟัน',
    'นอนดิ้น',
    'ไม่มีพฤติกรรมดังกล่าว',
  ])
  expect(ROOMMATE_PREFERENCE_CONFIG.cleanliness).toEqual([
    'สะอาดมาก',
    'ปานกลาง',
    'ยืดหยุ่น',
  ])
  expect(ROOMMATE_PREFERENCE_CONFIG.sleepTime).toEqual([
    'ก่อน 22:00',
    '22:00–00:00',
    'หลัง 00:00',
    'ยืดหยุ่น',
  ])
  expect(ROOMMATE_PREFERENCE_CONFIG.additionalText.maxLength).toBe(500)
})
