import { PROFILE_CONFIG } from './config.js'

// รองรับ FR-RMP-05, FR-RMP-06, FR-RMP-07 และ CON-DATA-01, CON-VALID-01, CON-ROOM-01
export function validateProfile(values) {
  const errors = {}

  const requiredFields = [
    ['nickname', 'กรุณากรอกชื่อเล่น'],
    ['age', 'กรุณากรอกอายุ'],
    ['gender', 'กรุณาเลือกเพศ'],
    ['faculty', 'กรุณาเลือกคณะ'],
    ['academicYear', 'กรุณาเลือกชั้นปี'],
    ['profileImage', 'กรุณาเลือกรูปโปรไฟล์'],
    ['phone', 'กรุณากรอกเบอร์โทรศัพท์'],
    ['roomType', 'กรุณาเลือกรูปแบบห้องพัก'],
    ['occupants', 'กรุณาเลือกจำนวนผู้พัก'],
  ]

  for (const [field, message] of requiredFields) {
    if (!values[field]) errors[field] = message
  }

  if (values.age) {
    const age = Number(values.age)
    if (
      !Number.isInteger(age) ||
      age < PROFILE_CONFIG.age.min ||
      age > PROFILE_CONFIG.age.max
    ) {
      errors.age = `อายุต้องอยู่ระหว่าง ${PROFILE_CONFIG.age.min}–${PROFILE_CONFIG.age.max} ปี`
    }
  }

  if (values.gender && !PROFILE_CONFIG.genders.includes(values.gender)) {
    errors.gender = 'กรุณาเลือกเพศจากรายการที่กำหนด'
  }

  if (values.faculty && !PROFILE_CONFIG.faculties.includes(values.faculty)) {
    errors.faculty = 'กรุณาเลือกคณะจากรายการที่กำหนด'
  }

  if (values.academicYear && !PROFILE_CONFIG.academicYears.includes(values.academicYear)) {
    errors.academicYear = 'กรุณาเลือกชั้นปีจากรายการที่กำหนด'
  }

  if (values.profileImage) {
    if (!PROFILE_CONFIG.image.allowedTypes.includes(values.profileImage.type)) {
      errors.profileImage = 'รูปโปรไฟล์ต้องเป็นไฟล์ JPG หรือ PNG'
    } else if (values.profileImage.size > PROFILE_CONFIG.image.maxSizeBytes) {
      errors.profileImage = `รูปโปรไฟล์ต้องมีขนาดไม่เกิน ${PROFILE_CONFIG.image.maxSizeMegabytes} MB`
    }
  }

  if (values.phone) {
    const digits = values.phone.replace(/[\s-]/g, '')
    if (!/^\d+$/.test(digits) || digits.length !== PROFILE_CONFIG.phone.digits) {
      errors.phone = `เบอร์โทรศัพท์ต้องมีตัวเลข ${PROFILE_CONFIG.phone.digits} หลัก`
    }
  }

  if (values.roomType && values.occupants) {
    const room = PROFILE_CONFIG.roomOccupants[values.roomType]
    const occupants = Number(values.occupants)
    if (!room || occupants < room.min || occupants > room.max) {
      errors.occupants = 'จำนวนผู้พักไม่สอดคล้องกับรูปแบบห้อง'
    }
  }

  if (!values.sleepBehaviors.length) {
    errors.sleepBehaviors = 'กรุณาเลือกพฤติกรรมการนอนอย่างน้อยหนึ่งรายการ'
  }

  if (values.sleepBehaviors.includes('อื่น ๆ') && !values.otherSleepBehavior.trim()) {
    errors.otherSleepBehavior = 'กรุณาระบุพฤติกรรมการนอนเพิ่มเติม'
  }

  return errors
}
