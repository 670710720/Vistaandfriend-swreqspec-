# Tasks: สร้างโปรไฟล์หาเมท
- Feature: สร้างโปรไฟล์หาเมท (Create Roommate Profile)
- Spec ID: SPEC-RMP-001
- อ้างอิง: [plan.md](./plan.md)
- วันที่: 2026-10-13

สรุป:
- มี 5 เฟส รวม 5 task
- มี 0 task ที่รอ Open Questions (Q-01 ถึง Q-03 ตอบแล้วใน spec.md)
- ไม่มีเฟสที่ทำให้ระบบลองใช้งานจริงได้ตาม plan v1 เพราะแผนนี้กำหนดงานปรับปรุงเอกสาร spec เท่านั้น ไม่ได้กำหนดงานพัฒนา frontend/backend

> ขอบเขตของ tasks ชุดนี้เป็นการแตกงานจาก plan.md เท่านั้น ไม่ใช่แผน implement AC ในระบบ การทบทวน AC ในตารางตรวจความครบหมายถึงตรวจเอกสารและ traceability ไม่ใช่ยืนยันว่าพฤติกรรมในระบบผ่าน AC

## เฟส 0: ตรวจข้อมูลโปรไฟล์และ validation ที่ใช้อ้างอิง (FR-RMP-03, FR-RMP-04, FR-RMP-05)

### T-01 ตรวจความสอดคล้องของข้อมูลและ validation
- รองรับ: FR-RMP-03, FR-RMP-04, FR-RMP-05, CON-DATA-01, CON-VALID-01, CON-ROOM-01, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A
- ตรวจด้วย: AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A
- ไฟล์ที่แตะ: specs/001-roommate-profile/spec.md
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ส่วนข้อมูลโปรไฟล์และ validation ใน spec.md แยกพฤติกรรมการนอนของเจ้าของออกจากความต้องการของเมท และตรวจเทียบกับสเปก UC-02 และ UC-03 โดยไม่เพิ่มหรือลดกฎที่ไม่มีแหล่งอ้างอิง
- สถานะ: เสร็จ รอทีมตรวจ

#### จุดตรวจเฟส 0
- test ที่ต้องผ่านทั้งหมด: ไม่มี code test ตาม plan.md; ตรวจความสอดคล้องของข้อมูลและ validation ใน spec.md กับ FR-RMP-03, FR-RMP-04, FR-RMP-05
- เปิดระบบ: ไม่มีคำสั่งเปิดระบบใน plan.md; เฟสนี้เป็นงานเอกสาร
- คนลองเองตาม AC-RMP-02:
  Given ตรวจข้อความข้อมูลโปรไฟล์และกฎ validation ใน spec.md
  When เทียบพฤติกรรมการนอนกับสเปก UC-03 และฟิลด์/validation กับสเปก UC-02
  Then ระบุได้ชัดว่าพฤติกรรมการนอนเป็นของเจ้าของโปรไฟล์ และกฎข้อมูลไม่ขัดกับฟีเจอร์ที่อ้างอิง
- ยังขาด: ไม่มีคำถามเปิดที่ยังไม่ได้คำตอบ; ไม่ได้ทดสอบพฤติกรรมใน frontend/backend ในเฟสเอกสารนี้

## เฟส 1: ปรับ requirements และ AC เรื่องข้อมูลโปรไฟล์ (AC-RMP-01 ถึง AC-RMP-04A)

### T-02 ปรับ requirements, assumptions และ acceptance criteria ให้ชัดเจน
- รองรับ: FR-RMP-01, FR-RMP-02, FR-RMP-03, FR-RMP-04, FR-RMP-05, FR-RMP-06, FR-RMP-07, CON-AUTH-01, CON-PROFILE-01, CON-DATA-01, CON-VALID-01, CON-REL-01, CON-ROOM-01, AC-RMP-01, AC-RMP-01A, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A
- ตรวจด้วย: AC-RMP-01, AC-RMP-01A, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A
- ไฟล์ที่แตะ: specs/001-roommate-profile/spec.md
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: requirements, assumptions, open questions และ AC ที่เกี่ยวข้องอธิบายข้อกำหนดข้อมูลจำเป็น การตรวจข้อมูล และกรณีผิดพลาดสอดคล้องกัน โดยไม่สร้าง ID ใหม่หรือกำหนดพฤติกรรมนอก spec
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 1
- test ที่ต้องผ่านทั้งหมด: ไม่มี code test ตาม plan.md; ตรวจความสอดคล้องระหว่าง FR-RMP-01 ถึง FR-RMP-07 กับ AC-RMP-01, AC-RMP-01A, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04 และ AC-RMP-04A
- เปิดระบบ: ไม่มีคำสั่งเปิดระบบใน plan.md; เฟสนี้เป็นงานเอกสาร
- คนลองเองตาม AC-RMP-03:
  Given อ่าน AC-RMP-03 และข้อกำหนดข้อมูลจำเป็นใน spec.md
  When ตรวจว่ากรณีข้อมูลไม่ครบเชื่อมกับ FR-RMP-06 และ CON-REL-01
  Then เอกสารระบุการแจ้งให้นักศึกษากรอกข้อมูลที่จำเป็นและไม่สร้างโปรไฟล์ โดยไม่มีผลลัพธ์อื่นที่ spec ไม่ได้กำหนด
- ยังขาด: ไม่มีคำถามเปิดที่ยังไม่ได้คำตอบ; ยังไม่มีงาน implement AC ใน tasks ชุดนี้

## เฟส 2: กำหนดสถานะเผยแพร่และการค้นพบโปรไฟล์ในเอกสาร (AC-RMP-05, AC-RMP-05A, AC-RMP-05B, AC-RMP-06, AC-RMP-08)

### T-03 ปรับข้อกำหนดสถานะเผยแพร่และการค้นพบโปรไฟล์
- รองรับ: FR-RMP-08, FR-RMP-09, FR-RMP-10, FR-RMP-11, CON-DISCOVER-01, AC-RMP-05, AC-RMP-05A, AC-RMP-05B, AC-RMP-06, AC-RMP-08
- ตรวจด้วย: AC-RMP-05, AC-RMP-05A, AC-RMP-05B, AC-RMP-06, AC-RMP-08
- ไฟล์ที่แตะ: specs/001-roommate-profile/spec.md
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: requirements, assumptions, open questions และ AC ระบุแยกการสร้างโปรไฟล์ออกจากการเปิดสถานะค้นหา โดยโปรไฟล์ใหม่เริ่ม "ไม่เปิด" และค้นพบได้เมื่อเจ้าของเปิดสถานะตาม CON-DISCOVER-01
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 2
- test ที่ต้องผ่านทั้งหมด: ไม่มี code test ตาม plan.md; ตรวจความสอดคล้องระหว่าง FR-RMP-08 ถึง FR-RMP-11, CON-DISCOVER-01 และ AC-RMP-05, AC-RMP-05A, AC-RMP-05B, AC-RMP-06, AC-RMP-08
- เปิดระบบ: ไม่มีคำสั่งเปิดระบบใน plan.md; เฟสนี้เป็นงานเอกสาร
- คนลองเองตาม AC-RMP-05B:
  Given อ่าน AC-RMP-05B และ CON-DISCOVER-01
  When ตรวจสถานะเริ่มต้นของโปรไฟล์หลังสร้างสำเร็จและเงื่อนไขการเปิดเผย
  Then เอกสารระบุสถานะ "ไม่เปิด" จนกว่าเจ้าของจะเปิดสถานะ และไม่กล่าวว่าโปรไฟล์ค้นพบได้ก่อนหน้านั้น
- ยังขาด: ไม่มีคำถามเปิดที่ยังไม่ได้คำตอบ; ยังไม่ได้ทดสอบการบันทึกหรือการค้นหาในระบบจริง

## เฟส 3: ปรับตาราง Traceability ให้ครอบคลุม FR และ AC (AC-RMP-01 ถึง AC-RMP-08)

### T-04 ปรับปรุง traceability ของข้อกำหนด
- รองรับ: FR-RMP-01, FR-RMP-02, FR-RMP-03, FR-RMP-04, FR-RMP-05, FR-RMP-06, FR-RMP-07, FR-RMP-08, FR-RMP-09, FR-RMP-10, FR-RMP-11, CON-AUTH-01, CON-PROFILE-01, CON-DATA-01, CON-VALID-01, CON-REL-01, CON-ROOM-01, CON-DISCOVER-01, AC-RMP-01, AC-RMP-01A, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A, AC-RMP-05, AC-RMP-05A, AC-RMP-05B, AC-RMP-06, AC-RMP-07, AC-RMP-08
- ตรวจด้วย: AC-RMP-01, AC-RMP-01A, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A, AC-RMP-05, AC-RMP-05A, AC-RMP-05B, AC-RMP-06, AC-RMP-07, AC-RMP-08
- ไฟล์ที่แตะ: specs/001-roommate-profile/spec.md
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: ตาราง traceability เชื่อม FR-RMP-01 ถึง FR-RMP-11 และ constraint ที่เกี่ยวข้องกับ AC ที่ตรวจได้ครบ โดยไม่มี FR หรือ AC ตกหล่นหรืออ้าง ID ที่ไม่มีใน spec
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 3
- test ที่ต้องผ่านทั้งหมด: ไม่มี code test ตาม plan.md; ตรวจตาราง traceability ว่าครอบคลุม AC ทั้ง 13 ข้อ, FR-RMP-01 ถึง FR-RMP-11 และ constraint ทั้ง 7 ข้อ
- เปิดระบบ: ไม่มีคำสั่งเปิดระบบใน plan.md; เฟสนี้เป็นงานเอกสาร
- คนลองเองตาม AC-RMP-07:
  Given ตรวจ AC-RMP-07 และ NFR-USE-01 ใน spec.md
  When ตรวจตาราง traceability ว่ามี AC-RMP-07 เชื่อมกับ NFR-USE-01
  Then เอกสารตามรอยข้อกำหนด usability ได้ครบ; การวัดผลกับนักศึกษาจริงยังไม่อยู่ในขอบเขต plan v1
- ยังขาด: ไม่มีคำถามเปิดที่ยังไม่ได้คำตอบ; AC-RMP-07 ยังต้องทดสอบกับผู้ใช้จริงเมื่อมีระบบให้ลอง

## เฟส 4: ตรวจ diff และความสอดคล้องของ Markdown (ทุก AC)

### T-05 ตรวจความครบถ้วนและส่งมอบ spec Draft v3
- รองรับ: FR-RMP-01, FR-RMP-02, FR-RMP-03, FR-RMP-04, FR-RMP-05, FR-RMP-06, FR-RMP-07, FR-RMP-08, FR-RMP-09, FR-RMP-10, FR-RMP-11, AC-RMP-01, AC-RMP-01A, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A, AC-RMP-05, AC-RMP-05A, AC-RMP-05B, AC-RMP-06, AC-RMP-07, AC-RMP-08
- ตรวจด้วย: AC-RMP-01, AC-RMP-01A, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A, AC-RMP-05, AC-RMP-05A, AC-RMP-05B, AC-RMP-06, AC-RMP-07, AC-RMP-08
- ไฟล์ที่แตะ: specs/001-roommate-profile/spec.md
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: diff ของ spec.md จำกัดอยู่ในขอบเขต plan.md, Markdown อ่านได้, ไม่มี ID หรือ traceability ขาดหาย และส่งมอบฉบับ Draft v3 ตามแผน
- สถานะ: พร้อมทำ

#### จุดตรวจเฟส 4
- test ที่ต้องผ่านทั้งหมด: ไม่มี code test ตาม plan.md; ตรวจ diff, Markdown consistency, AC/FR/Constraint traceability และ Open Questions
- เปิดระบบ: ไม่มีคำสั่งเปิดระบบใน plan.md; เฟสนี้เป็นงานเอกสาร
- คนลองเองตาม AC-RMP-01 ถึง AC-RMP-08:
  Given ตรวจ spec.md ฉบับปรับปรุงและ traceability
  When เทียบ AC ทั้ง 13 ข้อกับ requirements, constraints และผลลัพธ์ที่ระบุใน spec
  Then ไม่พบ requirement ที่ไม่มีที่มา, ID ตกหล่น หรือข้อความขัดแย้ง; การลองพฤติกรรมจริงต้องรอแผนพัฒนา frontend/backend
- ยังขาด: ไม่มีคำถามเปิดที่ยังไม่ได้คำตอบ; ไม่มีเฟสที่ทำให้ระบบลองใช้งานจริงได้ใน plan v1

## ตารางตรวจความครบ: Acceptance Criteria
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-RMP-01 | T-02, T-04, T-05 |
| AC-RMP-01A | T-02, T-04, T-05 |
| AC-RMP-02 | T-01, T-02, T-04, T-05 |
| AC-RMP-02A | T-01, T-02, T-04, T-05 |
| AC-RMP-03 | T-01, T-02, T-04, T-05 |
| AC-RMP-04 | T-01, T-02, T-04, T-05 |
| AC-RMP-04A | T-01, T-02, T-04, T-05 |
| AC-RMP-05 | T-03, T-04, T-05 |
| AC-RMP-05A | T-03, T-04, T-05 |
| AC-RMP-05B | T-03, T-04, T-05 |
| AC-RMP-06 | T-03, T-04, T-05 |
| AC-RMP-07 | T-04, T-05 |
| AC-RMP-08 | T-03, T-04, T-05 |

## ตารางตรวจความครบ: Constraints
| Constraint ID | task ที่ทำให้เป็นจริง/ตรวจความสอดคล้อง |
|---|---|
| CON-AUTH-01 | T-02, T-04 |
| CON-PROFILE-01 | T-02, T-04 |
| CON-DATA-01 | T-01, T-02, T-04 |
| CON-VALID-01 | T-01, T-02, T-04 |
| CON-REL-01 | T-01, T-02, T-04 |
| CON-ROOM-01 | T-01, T-02, T-04 |
| CON-DISCOVER-01 | T-03, T-04 |

## ตารางตรวจความครบ: Functional Requirements
| FR ID | AC ที่ตรวจ FR นี้ | เฟส |
|---|---|---|
| FR-RMP-01 | AC-RMP-01 | เฟส 1 |
| FR-RMP-02 | AC-RMP-01 | เฟส 1 |
| FR-RMP-03 | AC-RMP-02 | เฟส 0, 1 |
| FR-RMP-04 | AC-RMP-02 | เฟส 0, 1 |
| FR-RMP-05 | AC-RMP-02A, AC-RMP-03, AC-RMP-04 | เฟส 0, 1 |
| FR-RMP-06 | AC-RMP-03 | เฟส 1 |
| FR-RMP-07 | AC-RMP-04 | เฟส 1 |
| FR-RMP-08 | AC-RMP-05, AC-RMP-05A | เฟส 2 |
| FR-RMP-09 | AC-RMP-05 | เฟส 2 |
| FR-RMP-10 | AC-RMP-06 | เฟส 2 |
| FR-RMP-11 | AC-RMP-05B, AC-RMP-06, AC-RMP-08 | เฟส 2 |

## สิ่งที่ยังไม่ทำ: Open Questions
- Q-01 ข้อมูลใดบ้างที่เป็นข้อมูลจำเป็นสำหรับการสร้างโปรไฟล์? ตอบแล้วใน spec.md; ตรวจทบทวนใน T-01 และ T-02; ไม่มี task รอคำตอบ
- Q-02 ความต้องการเกี่ยวกับเมทมีข้อมูลอะไรบ้าง? ตอบแล้วใน spec.md; ตรวจทบทวนใน T-01; ไม่มี task รอคำตอบ
- Q-03 หลังจากสร้างโปรไฟล์สำเร็จ โปรไฟล์จะแสดงในผลการค้นหาทันทีหรือไม่? ตอบแล้วใน spec.md; ตรวจทบทวนใน T-03; ไม่มี task รอคำตอบ
