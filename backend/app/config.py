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
