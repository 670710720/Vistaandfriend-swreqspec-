
# CON-RRS-10, FR-RRS-14
MAX_ROOMMATE_REQUEST_MESSAGE_LENGTH = 500

# FR-RRS-16
MAX_NOTIFICATION_RETRIES = 3

# FR-SRS-09, AC-SRS-03E: pagination page size for search results.
SEARCH_RESULTS_PER_PAGE = 20

# FR-CHAT-13: ข้อความต้องไม่ว่างและยาวไม่เกิน 2,000 ตัวอักษร
CHAT_MESSAGE_MIN_LENGTH = 1
CHAT_MESSAGE_MAX_LENGTH = 2_000

# AC-CHAT-02A, AC-CHAT-02B, CON-CHAT-02: จำกัดไฟล์แนบต่อข้อความและขนาดไฟล์
CHAT_MAX_ATTACHMENTS_PER_MESSAGE = 1
CHAT_ATTACHMENT_MAX_SIZE_BYTES = 10 * 1024 * 1024

# FR-CHAT-09, AC-CHAT-02A and AC-CHAT-02B: permitted attachment extensions and MIME types.
CHAT_ALLOWED_ATTACHMENT_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".pdf": "application/pdf",
}

# FR-CHAT-14: จำนวนครั้งที่ลองส่งซ้ำอัตโนมัติ
CHAT_AUTOMATIC_RETRY_LIMIT = 3

# CON-CHAT-04, FR-CHAT-16: อายุการเก็บไฟล์แนบ
CHAT_ATTACHMENT_RETENTION_DAYS = 30

# NFR-PERF-01: เวลาตอบสนองสูงสุดของการส่งข้อความ
CHAT_SEND_RESPONSE_LIMIT_SECONDS = 3

# NFR-USE-01, AC-CHAT-09: เกณฑ์ทดสอบกับนักศึกษาที่ไม่เคยใช้แชท
CHAT_USABILITY_TEST_USER_COUNT = 5
CHAT_USABILITY_MIN_SUCCESS_COUNT = 4

# ASM-03: เขตเวลาที่ใช้เก็บวันและเวลาของข้อความ
CHAT_TIMEZONE = "Asia/Bangkok"

# FR-RMP-11, CON-DISCOVER-01: โปรไฟล์ใหม่ยังไม่เปิดให้ค้นหา
PROFILE_DISCOVERY_DEFAULT = False

# FR-RMP-03, CON-DATA-01: ข้อมูลจำเป็นตามฟอร์มสร้างโปรไฟล์
PROFILE_REQUIRED_FIELDS = (
    "nickname",
    "age",
    "gender",
    "faculty",
    "academicYear",
    "profileImage",
    "phone",
    "roomType",
    "occupants",
    "sleepBehaviors",
)

# FR-RMP-03, CON-VALID-01: ค่าอายุ เพศ คณะ และชั้นปีที่อนุญาต
PROFILE_AGE_MIN = 18
PROFILE_AGE_MAX = 25
PROFILE_GENDERS = ("หญิง", "ชาย")
PROFILE_FACULTIES = (
    "วิทยาศาสตร์",
    "เภสัชศาสตร์",
    "วิศวกรรมศาสตร์",
    "อักษรศาสตร์",
    "มัณฑนศิลป์",
    "ศิลปกรรม",
    "ศึกษาศาสตร์",
    "จิตรกรรม",
)
PROFILE_YEAR_OPTIONS = ("1", "2", "3", "4", "5 ขึ้นไป")

# FR-RMP-03, CON-VALID-01: ชนิดรูป ขนาด และการไม่ตรวจมิติภาพ
PROFILE_IMAGE_FORMATS = ("image/jpeg", "image/png")
PROFILE_IMAGE_MAX_MB = 5
PROFILE_IMAGE_CHECK_DIMENSIONS = False

# FR-RMP-03, CON-VALID-01: รูปแบบเบอร์โทรศัพท์
PROFILE_PHONE_DIGITS = 10
PROFILE_PHONE_SEPARATORS = (" ", "-")

# FR-RMP-03: ช่องทางโซเชียลเสริมและรูปแบบค่าที่รับ
PROFILE_SOCIAL_CHANNELS = ("Facebook", "Instagram", "LINE", "TikTok")
PROFILE_SOCIAL_INPUT_FORMATS = ("username", "url")

# CON-ROOM-01: จำนวนผู้พักที่รองรับแยกตามประเภทห้อง
ROOM_OCCUPANCY_LIMITS = {
    "airConditioned": {"min": 1, "max": 4},
    "fan": {"min": 1, "max": 3},
}

# FR-RMP-04, CON-DATA-01, CON-VALID-01, Q-06: ตัวเลือกและกฎพฤติกรรมการนอน
SLEEP_BEHAVIOR_OPTIONS = (
    "กรน",
    "กัดฟัน",
    "นอนดิ้น",
    "ไม่มีพฤติกรรมดังกล่าว",
    "อื่น ๆ",
)
SLEEP_MIN_SELECTIONS = 1
SLEEP_NONE_EXCLUSIVE = "ไม่มีพฤติกรรมดังกล่าว"
SLEEP_OTHER_REQUIRES_DESCRIPTION = "อื่น ๆ"

# NFR-USE-01, AC-RMP-07: จำนวนผู้ทดสอบและอัตราความสำเร็จขั้นต่ำ
USABILITY_TEST_PARTICIPANTS = 5
USABILITY_TEST_SUCCESS_RATE = 0.8
