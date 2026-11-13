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

export const CHAT_CONFIG = {
  // FR-CHAT-13
  messageMinLength: 1,
  messageMaxLength: 2_000,
  // AC-CHAT-02A, AC-CHAT-02B, CON-CHAT-02
  maxAttachmentsPerMessage: 1,
  attachmentMaxSizeBytes: 10 * 1024 * 1024,
  // FR-CHAT-14
  automaticRetryLimit: 3,
  // CON-CHAT-04, FR-CHAT-16
  attachmentRetentionDays: 30,
  // NFR-PERF-01
  sendResponseLimitSeconds: 3,
  // NFR-USE-01, AC-CHAT-09
  usabilityTestUserCount: 5,
  usabilityMinSuccessCount: 4,
  // ASM-03
  timezone: 'Asia/Bangkok',
}
