// ค่าจาก SPEC-RMP-001: CON-ROOM-01, CON-DATA-01, CON-VALID-01
export const PROFILE_CONFIG = {
  age: {
    min: 18,
    max: 25,
  },
  image: {
    maxSizeMegabytes: 5,
    maxSizeBytes: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png'],
  },
  phone: {
    digits: 10,
  },
  roomOccupants: {
    airConditioned: { min: 1, max: 4 },
    fan: { min: 1, max: 3 },
  },
  genders: ['หญิง', 'ชาย'],
  faculties: [
    'วิทยาศาสตร์',
    'เภสัชศาสตร์',
    'วิศวกรรมศาสตร์',
    'อักษรศาสตร์',
    'มัณฑนศิลป์',
    'ศิลปกรรม',
    'ศึกษาศาสตร์',
    'จิตรกรรม',
  ],
  academicYears: ['1', '2', '3', '4', '5 ขึ้นไป'],
  sleepBehaviors: ['กรน', 'กัดฟัน', 'นอนดิ้น', 'ไม่มีพฤติกรรมดังกล่าว', 'อื่น ๆ'],
  socialChannels: ['Facebook', 'Instagram', 'LINE', 'TikTok'],
}
