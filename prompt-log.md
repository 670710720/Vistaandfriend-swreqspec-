## 2026-10-13
- คำสั่ง: `/testcases AC-RMP-01 specs/001-roommate-profile/`
- โหมด: ร่าง
- TC ID: TC-RMP-01-1, TC-RMP-01-2, TC-RMP-01-3
- ผล test: ไม่ได้รัน เนื่องจากโหมดร่างห้ามเขียนโค้ด test
- ประเด็นที่ spec ไม่ได้บอก: กรณีนักศึกษายังไม่ได้เข้าสู่ระบบ ไม่ได้ระบุว่าหน้าจอต้องแสดงหรือซ่อนแบบฟอร์ม หรือแสดงข้อความใด

## 2026-10-13
- คำสั่ง: `/testcases AC-RMP-01, AC-RMP-01A, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A, AC-RMP-05, AC-RMP-05A, AC-RMP-05B, AC-RMP-06, AC-RMP-07, AC-RMP-08 specs/001-roommate-profile/`
- โหมด: ร่าง (ครอบคลุมทุก AC ใน SPEC-RMP-001)
- TC ID ที่เพิ่ม: TC-RMP-01A-1, TC-RMP-01A-2, TC-RMP-01A-3, TC-RMP-02-1, TC-RMP-02-2, TC-RMP-02-3, TC-RMP-02A-1, TC-RMP-02A-2, TC-RMP-02A-3, TC-RMP-03-1, TC-RMP-03-2, TC-RMP-03-3, TC-RMP-04-1, TC-RMP-04-2, TC-RMP-04-3, TC-RMP-04A-1, TC-RMP-04A-2, TC-RMP-04A-3, TC-RMP-05-1, TC-RMP-05-2, TC-RMP-05-3, TC-RMP-05A-1, TC-RMP-05A-2, TC-RMP-05A-3, TC-RMP-05B-1, TC-RMP-05B-2, TC-RMP-05B-3, TC-RMP-06-1, TC-RMP-06-2, TC-RMP-06-3, TC-RMP-07-1, TC-RMP-07-2, TC-RMP-07-3, TC-RMP-07-4, TC-RMP-08-1, TC-RMP-08-2, TC-RMP-08-3
- ผล test: ไม่ได้รัน เนื่องจากโหมดร่างห้ามเขียนโค้ด test
- ประเด็นที่ spec ไม่ได้บอก: ผลเมื่อไม่ได้อยู่ในหน้าแบบฟอร์มสำหรับ AC-RMP-02, 02A, 03, 04 และ 04A; สถานะ/การค้นพบเมื่อสร้างโปรไฟล์ไม่สำเร็จสำหรับ AC-RMP-05B; ผลลองใหม่หรือข้อมูลบางส่วนเมื่อ validation ไม่ผ่านสำหรับ AC-RMP-05A; การเปิดสถานะ/ผลค้นหาเมื่อไม่มีโปรไฟล์สำหรับ AC-RMP-06; เกณฑ์ประเมินผู้ทดสอบที่เคยใช้ฟังก์ชันหรือมีผู้ทดสอบไม่ครบ 5 คนสำหรับ AC-RMP-07; ผลค้นหาเมื่อไม่มีโปรไฟล์สำหรับ AC-RMP-08

## 2026-10-13
- คำสั่ง: `/testcases AC-ERP-01 specs/002-edit-roommate-profile/`
- โหมด: ร่าง
- TC ID: TC-ERP-01-1, TC-ERP-01-2, TC-ERP-01-3, TC-ERP-01-4
- ผล test: ไม่ได้รัน เนื่องจากโหมดร่างห้ามเขียนโค้ด test
- ประเด็นที่ spec ไม่ได้บอก: พฤติกรรมเมื่อยังไม่ได้เข้าสู่ระบบและเลือกเมนู "โปรไฟล์" ว่าต้องแสดงหรือปฏิเสธการแสดงข้อมูลโปรไฟล์

## 2026-10-13
- คำสั่ง: `/testcases AC-ERP-01, AC-ERP-02, AC-ERP-02A, AC-ERP-02B, AC-ERP-03, AC-ERP-04, AC-ERP-04A, AC-ERP-05, AC-ERP-06, AC-ERP-07, AC-ERP-07A, AC-ERP-08 specs/002-edit-roommate-profile/`
- โหมด: ร่าง (ครอบคลุมทุก AC ใน SPEC-ERP-002)
- TC ID ที่เพิ่ม: TC-ERP-02-1, TC-ERP-02-2, TC-ERP-02-3, TC-ERP-02A-1, TC-ERP-02A-2, TC-ERP-02A-3, TC-ERP-02B-1, TC-ERP-02B-2, TC-ERP-02B-3, TC-ERP-03-1, TC-ERP-03-2, TC-ERP-03-3, TC-ERP-04-1, TC-ERP-04-2, TC-ERP-04-3, TC-ERP-04A-1, TC-ERP-04A-2, TC-ERP-04A-3, TC-ERP-04A-4, TC-ERP-05-1, TC-ERP-05-2, TC-ERP-05-3, TC-ERP-06-1, TC-ERP-06-2, TC-ERP-06-3, TC-ERP-07-1, TC-ERP-07-2, TC-ERP-07-3, TC-ERP-07A-1, TC-ERP-07A-2, TC-ERP-07A-3, TC-ERP-08-1, TC-ERP-08-2, TC-ERP-08-3, TC-ERP-08-4, TC-ERP-08-5
- ผล test: ไม่ได้รัน เนื่องจากโหมดร่างห้ามเขียนโค้ด test
- ประเด็นที่ spec ไม่ได้บอก: ผลการยืนยันนอก flow แก้ไขโปรไฟล์สำหรับ AC-ERP-03; ข้อความ/การลองใหม่เมื่อข้อมูลไม่ครบหรือไม่ถูกต้องและการบันทึกล้มเหลวสำหรับ AC-ERP-04A; การเข้าเมนูโดยไม่เข้าสู่ระบบสำหรับ AC-ERP-06; ผลค้นหาหลังถูกปฏิเสธการแก้ไขโปรไฟล์ผู้อื่นสำหรับ AC-ERP-07; ผลค้นหาเมื่อการแก้ไขไม่สำเร็จสำหรับ AC-ERP-07A; เกณฑ์ประเมินผู้ทดสอบที่เคยใช้ฟังก์ชันหรือมีผู้ทดสอบไม่ครบ 5 คนสำหรับ AC-ERP-08

## 2026-10-13
- คำสั่ง: `/testcases AC-RPS-01, AC-RPS-02, AC-RPS-02A, AC-RPS-02B, AC-RPS-02C, AC-RPS-03, AC-RPS-04, AC-RPS-04A, AC-RPS-04B, AC-RPS-05, AC-RPS-06, AC-RPS-07, AC-RPS-08 specs/003-roommate-preference/`
- โหมด: ร่าง (ครอบคลุมทุก AC ใน SPEC-RPS-003)
- TC ID ที่เสนอ: TC-RPS-01-1, TC-RPS-01-2, TC-RPS-01-3, TC-RPS-01-4, TC-RPS-02-1, TC-RPS-02-2, TC-RPS-02-3, TC-RPS-02A-1, TC-RPS-02A-2, TC-RPS-02A-3, TC-RPS-02B-1, TC-RPS-02B-2, TC-RPS-02B-3, TC-RPS-02C-1, TC-RPS-02C-2, TC-RPS-02C-3, TC-RPS-02C-4, TC-RPS-03-1, TC-RPS-03-2, TC-RPS-03-3, TC-RPS-04-1, TC-RPS-04-2, TC-RPS-04-3, TC-RPS-04-4, TC-RPS-04A-1, TC-RPS-04A-2, TC-RPS-04A-3, TC-RPS-04B-1, TC-RPS-04B-2, TC-RPS-04B-3, TC-RPS-05-1, TC-RPS-05-2, TC-RPS-05-3, TC-RPS-06-1, TC-RPS-06-2, TC-RPS-06-3, TC-RPS-07-1, TC-RPS-07-2, TC-RPS-07-3, TC-RPS-08-1, TC-RPS-08-2, TC-RPS-08-3, TC-RPS-08-4, TC-RPS-08-5
- ผล test: ไม่ได้รัน เนื่องจากโหมดร่างห้ามเขียนโค้ด test
- ประเด็นที่ spec ไม่ได้บอก: การเข้าถึงเมนูโดยไม่เข้าสู่ระบบสำหรับ AC-RPS-01 และ AC-RPS-07; การเลือก/บันทึกข้อมูลนอกหน้าความต้องการสำหรับ AC-RPS-02, 02A, 02B, 02C และ 03; การแก้ไขเมื่อไม่มีข้อมูลความต้องการเดิมสำหรับ AC-RPS-04A; ข้อความและการลองใหม่เมื่อ validation ไม่ผ่านพร้อมกับการบันทึกล้มเหลวสำหรับ AC-RPS-04B; การใช้ข้อมูลที่ยังบันทึกไม่สำเร็จในการค้นหาสำหรับ AC-RPS-05; เกณฑ์ประเมินผู้ทดสอบที่เคยใช้ฟังก์ชันหรือมีผู้ทดสอบไม่ครบ 5 คนสำหรับ AC-RPS-08

## 2026-10-13
- คำสั่ง: `/testcases AC-SRS-01, AC-SRS-02, AC-SRS-03, AC-SRS-03A, AC-SRS-03B, AC-SRS-03C, AC-SRS-03D, AC-SRS-03E, AC-SRS-04, AC-SRS-05, AC-SRS-06, AC-SRS-07, AC-SRS-08 specs/004-search-roommate/`
- โหมด: ร่าง (ครอบคลุมทุก AC ใน SPEC-SRS-004)
- TC ID ที่เสนอ: TC-SRS-01-1, TC-SRS-01-2, TC-SRS-01-3, TC-SRS-01-4, TC-SRS-02-1, TC-SRS-02-2, TC-SRS-02-3, TC-SRS-03-1, TC-SRS-03-2, TC-SRS-03-3, TC-SRS-03A-1, TC-SRS-03A-2, TC-SRS-03A-3, TC-SRS-03B-1, TC-SRS-03B-2, TC-SRS-03B-3, TC-SRS-03C-1, TC-SRS-03C-2, TC-SRS-03C-3, TC-SRS-03D-1, TC-SRS-03D-2, TC-SRS-03D-3, TC-SRS-03E-1, TC-SRS-03E-2, TC-SRS-03E-3, TC-SRS-03E-4, TC-SRS-04-1, TC-SRS-04-2, TC-SRS-04-3, TC-SRS-05-1, TC-SRS-05-2, TC-SRS-05-3, TC-SRS-06-1, TC-SRS-06-2, TC-SRS-06-3, TC-SRS-07-1, TC-SRS-07-2, TC-SRS-07-3, TC-SRS-08-1, TC-SRS-08-2, TC-SRS-08-3, TC-SRS-08-4, TC-SRS-08-5
- ผล test: ไม่ได้รัน เนื่องจากโหมดร่างห้ามเขียนโค้ด test
- ประเด็นที่ spec ไม่ได้บอก: การรับ/ปฏิเสธตัวกรองนอกหน้าค้นหาสำหรับ AC-SRS-02; ผลเมื่อตั้งหลายตัวกรองแต่ไม่เลือก AND/OR สำหรับ AC-SRS-03C; การเลือกโปรไฟล์นอกผลค้นหาสำหรับ AC-SRS-04; การแสดงข้อความไม่พบผลเมื่อมีรายการตรงเงื่อนไขสำหรับ AC-SRS-05; การแจ้งกรณีไม่มีโปรไฟล์ก่อนเข้าสู่ระบบสำหรับ AC-SRS-07; เกณฑ์ประเมินผู้ทดสอบที่เคยใช้การค้นหาหรือมีผู้ทดสอบไม่ครบ 5 คนสำหรับ AC-SRS-08

## 2026-10-13
- คำสั่ง: `/testcases AC-CHAT-01, AC-CHAT-02, AC-CHAT-02C, AC-CHAT-02A, AC-CHAT-02B, AC-CHAT-03, AC-CHAT-03A, AC-CHAT-03B, AC-CHAT-04, AC-CHAT-05, AC-CHAT-06, AC-CHAT-07, AC-CHAT-07A, AC-CHAT-07B, AC-CHAT-04A, AC-CHAT-03C, AC-CHAT-03D, AC-CHAT-08, AC-CHAT-09 specs/005-chat-roommate/`
- โหมด: ร่าง (ครอบคลุมทุก AC ใน SPEC-CHAT-005)
- TC ID ที่เสนอ: TC-CHAT-01-1, TC-CHAT-01-2, TC-CHAT-01-3, TC-CHAT-01-4, TC-CHAT-02-1, TC-CHAT-02-2, TC-CHAT-02-3, TC-CHAT-02C-1, TC-CHAT-02C-2, TC-CHAT-02C-3, TC-CHAT-02C-4, TC-CHAT-02A-1, TC-CHAT-02A-2, TC-CHAT-02A-3, TC-CHAT-02B-1, TC-CHAT-02B-2, TC-CHAT-02B-3, TC-CHAT-03-1, TC-CHAT-03-2, TC-CHAT-03-3, TC-CHAT-03A-1, TC-CHAT-03A-2, TC-CHAT-03A-3, TC-CHAT-03B-1, TC-CHAT-03B-2, TC-CHAT-03B-3, TC-CHAT-04-1, TC-CHAT-04-2, TC-CHAT-04-3, TC-CHAT-05-1, TC-CHAT-05-2, TC-CHAT-05-3, TC-CHAT-06-1, TC-CHAT-06-2, TC-CHAT-06-3, TC-CHAT-07-1, TC-CHAT-07-2, TC-CHAT-07-3, TC-CHAT-07A-1, TC-CHAT-07A-2, TC-CHAT-07A-3, TC-CHAT-07A-4, TC-CHAT-07A-5, TC-CHAT-07B-1, TC-CHAT-07B-2, TC-CHAT-07B-3, TC-CHAT-07B-4, TC-CHAT-04A-1, TC-CHAT-04A-2, TC-CHAT-04A-3, TC-CHAT-03C-1, TC-CHAT-03C-2, TC-CHAT-03C-3, TC-CHAT-03D-1, TC-CHAT-03D-2, TC-CHAT-03D-3, TC-CHAT-08-1, TC-CHAT-08-2, TC-CHAT-08-3, TC-CHAT-09-1, TC-CHAT-09-2, TC-CHAT-09-3, TC-CHAT-09-4, TC-CHAT-09-5
- ผล test: ไม่ได้รัน เนื่องจากโหมดร่างห้ามเขียนโค้ด test
- ประเด็นที่ spec ไม่ได้บอก: การส่งข้อความ/ไฟล์โดยไม่มีหน้าต่างแชทเปิดสำหรับ AC-CHAT-02, 02C, 02A และ 02B; การแสดงข้อความที่ไม่มีไฟล์แนบในประวัติสำหรับ AC-CHAT-03A; สถานะ Read ของข้อความที่อยู่นอกหน้าจอสำหรับ AC-CHAT-03B; การเปิดแชทเมื่อไม่มีประวัติเดิมสำหรับ AC-CHAT-05; การแสดงหน้าต่าง/แจ้งเตือนเมื่อไม่ล็อกอินสำหรับ AC-CHAT-01 และ 07A; การกลับมาอนุญาตส่งข้อความในแชทเดิมเมื่อทั้งสองฝ่ายพร้อมอีกครั้งสำหรับ AC-CHAT-07B; การแสดง retry เมื่อส่งครั้งแรกสำเร็จสำหรับ AC-CHAT-04A; เกณฑ์ประเมินผู้ทดสอบที่เคยใช้แชทหรือมีผู้ทดสอบไม่ครบ 5 คนสำหรับ AC-CHAT-09

## 2026-10-13
- คำสั่ง: `/testcases AC-RRS-01, AC-RRS-02, AC-RRS-03, AC-RRS-04, AC-RRS-04A, AC-RRS-05, AC-RRS-06, AC-RRS-06A, AC-RRS-07, AC-RRS-08, AC-RRS-09, AC-RRS-10, AC-RRS-11, AC-RRS-12, AC-RRS-13, AC-RRS-13A, AC-RRS-04B, AC-RRS-11A, AC-RRS-15, AC-RRS-14 specs/006-request-roommate/`
- โหมด: ร่าง (ครอบคลุมทุก AC ใน SPEC-RRS-006)
- TC ID ที่เสนอ: TC-RRS-01-1, TC-RRS-01-2, TC-RRS-01-3, TC-RRS-01-4, TC-RRS-02-1, TC-RRS-02-2, TC-RRS-02-3, TC-RRS-03-1, TC-RRS-03-2, TC-RRS-03-3, TC-RRS-04-1, TC-RRS-04-2, TC-RRS-04-3, TC-RRS-04-4, TC-RRS-04A-1, TC-RRS-04A-2, TC-RRS-04A-3, TC-RRS-04A-4, TC-RRS-05-1, TC-RRS-05-2, TC-RRS-05-3, TC-RRS-06-1, TC-RRS-06-2, TC-RRS-06-3, TC-RRS-06-4, TC-RRS-06A-1, TC-RRS-06A-2, TC-RRS-06A-3, TC-RRS-06A-4, TC-RRS-07-1, TC-RRS-07-2, TC-RRS-07-3, TC-RRS-08-1, TC-RRS-08-2, TC-RRS-08-3, TC-RRS-08-4, TC-RRS-09-1, TC-RRS-09-2, TC-RRS-09-3, TC-RRS-10-1, TC-RRS-10-2, TC-RRS-10-3, TC-RRS-10-4, TC-RRS-10-5, TC-RRS-10-6, TC-RRS-11-1, TC-RRS-11-2, TC-RRS-11-3, TC-RRS-11-4, TC-RRS-12-1, TC-RRS-12-2, TC-RRS-12-3, TC-RRS-12-4, TC-RRS-13-1, TC-RRS-13-2, TC-RRS-13-3, TC-RRS-13-4, TC-RRS-13A-1, TC-RRS-13A-2, TC-RRS-13A-3, TC-RRS-04B-1, TC-RRS-04B-2, TC-RRS-04B-3, TC-RRS-04B-4, TC-RRS-11A-1, TC-RRS-11A-2, TC-RRS-11A-3, TC-RRS-11A-4, TC-RRS-15-1, TC-RRS-15-2, TC-RRS-15-3, TC-RRS-14-1, TC-RRS-14-2, TC-RRS-14-3, TC-RRS-14-4, TC-RRS-14-5
- ผล test: ไม่ได้รัน เนื่องจากโหมดร่างห้ามเขียนโค้ด test
- ประเด็นที่ spec ไม่ได้บอก: การตรวจคำขอเดิมหลังผู้รับไม่ active สำหรับ AC-RRS-03; สถานะการแจ้งเตือนเมื่อคำขอไม่ถูกบันทึกสำหรับ AC-RRS-04A; ความหมายของ retry เมื่อสำเร็จระหว่างรอบและกรณีไม่เริ่ม retry สำหรับ AC-RRS-11A; รายการแจ้งเตือนเมื่อไม่มีคำขอใหม่สำหรับ AC-RRS-11; การจัดการรายการคำขอว่างสำหรับ AC-RRS-10; การไม่หมดอายุของคำขอที่ไม่ pending สำหรับ AC-RRS-15; เกณฑ์ประเมินผู้ทดสอบที่เคยใช้ฟังก์ชันหรือมีผู้ทดสอบไม่ครบ 5 คนสำหรับ AC-RRS-14

## 2026-10-13
- คำสั่ง: `/testcases AAC-SRR /007-respond-roommate-request testcase จาก ac ทั้งหมด`
- โหมด: ร่าง (ครอบคลุม AC-SRR ทั้ง 16 ข้อใน SPEC-SRR-007)
- TC ID ที่เสนอ: TC-SRR-01-1, TC-SRR-01-2, TC-SRR-01-3, TC-SRR-01-4, TC-SRR-02-1, TC-SRR-02-2, TC-SRR-02-3, TC-SRR-03-1, TC-SRR-03-2, TC-SRR-03-3, TC-SRR-03-4, TC-SRR-03A-1, TC-SRR-03A-2, TC-SRR-03A-3, TC-SRR-04-1, TC-SRR-04-2, TC-SRR-04-3, TC-SRR-04-4, TC-SRR-05-1, TC-SRR-05-2, TC-SRR-05-3, TC-SRR-05A-1, TC-SRR-05A-2, TC-SRR-05A-3, TC-SRR-06-1, TC-SRR-06-2, TC-SRR-06-3, TC-SRR-07-1, TC-SRR-07-2, TC-SRR-07-3, TC-SRR-08-1, TC-SRR-08-2, TC-SRR-08-3, TC-SRR-08-4, TC-SRR-08A-1, TC-SRR-08A-2, TC-SRR-08A-3, TC-SRR-08B-1, TC-SRR-08B-2, TC-SRR-08B-3, TC-SRR-08C-1, TC-SRR-08C-2, TC-SRR-08C-3, TC-SRR-09-1, TC-SRR-09-2, TC-SRR-09-3, TC-SRR-10-1, TC-SRR-10-2, TC-SRR-10-3, TC-SRR-11-1, TC-SRR-11-2, TC-SRR-11-3
- ผล test: ไม่ได้รัน เนื่องจากโหมดร่างห้ามเขียนโค้ด test
- ประเด็นที่ spec ไม่ได้บอก: การแสดงหน้าคำขอเมื่อยังไม่เข้าสู่ระบบหรือไม่มีคำขอรอสำหรับ AC-SRR-01; การเลือกผลนอกหน้ารายละเอียดสำหรับ AC-SRR-02; พฤติกรรมเมื่อยังไม่เข้าสู่ระบบและเมื่อผลยังไม่สำเร็จสำหรับ AC-SRR-03, AC-SRR-04, AC-SRR-07; การแจ้งเตือนเมื่อยังไม่ตอบสำเร็จหรือไม่มีการเปลี่ยนแปลงสำหรับ AC-SRR-05, AC-SRR-05A; การทำซ้ำผลเดิมสำหรับ AC-SRR-08; ลำดับ atomic เมื่อผู้กระทำไม่ใช่ผู้รับสำหรับ AC-SRR-08A; รายละเอียดกฎ UC-09 ที่ต้องตรวจใน AC-SRR-08B; เกณฑ์หรือการจัดการผลทดสอบที่ไม่ผ่านสำหรับ AC-SRR-09; ความหมายของจำนวน retry ว่านับรวมการส่งครั้งแรกหรือไม่และการแจ้งเมื่อ retry สำเร็จสำหรับ AC-SRR-11

## 2026-10-13
- คำสั่ง: `/testcases AC-MSS /008-match-status ทำ testcase จาก ac ทั้งหมด`
- โหมด: ร่าง (ครอบคลุม AC-MSS-01, AC-MSS-02, AC-MSS-02A, AC-MSS-03, AC-MSS-04, AC-MSS-05, AC-MSS-06, AC-MSS-07, AC-MSS-07A และ AC-MSS-08 ใน SPEC-MSS-008)
- TC ID ที่เสนอ: TC-MSS-01-1, TC-MSS-01-2, TC-MSS-01-3, TC-MSS-02-1, TC-MSS-02-2, TC-MSS-02-3, TC-MSS-02A-1, TC-MSS-02A-2, TC-MSS-02A-3, TC-MSS-03-1, TC-MSS-03-2, TC-MSS-03-3, TC-MSS-04-1, TC-MSS-04-2, TC-MSS-04-3, TC-MSS-05-1, TC-MSS-05-2, TC-MSS-05-3, TC-MSS-06-1, TC-MSS-06-2, TC-MSS-06-3, TC-MSS-06-4, TC-MSS-06-5, TC-MSS-07-1, TC-MSS-07-2, TC-MSS-07-3, TC-MSS-07-4, TC-MSS-07A-1, TC-MSS-07A-2, TC-MSS-07A-3, TC-MSS-08-1, TC-MSS-08-2, TC-MSS-08-3, TC-MSS-08-4, TC-MSS-08-5
- ผล test: ไม่ได้รัน เนื่องจากโหมดร่างห้ามเขียนโค้ด test
- ประเด็นที่ spec ไม่ได้บอก: พฤติกรรม/ข้อความเมื่อดึงข้อมูลนอกหน้าสถานะ (AC-MSS-02, AC-MSS-06); เงื่อนไขขอบเขตช่วงหลังเข้าสู่ระบบ (AC-MSS-01); การตรวจลำดับเมื่อมีคำขอเดียว (AC-MSS-02A); การเลือกคำขอที่ไม่แสดงเพื่อดูรายละเอียด (AC-MSS-03); รายละเอียดการปฏิเสธกรณีไม่มีข้อมูลเดิมเมื่อดึงล้มเหลว (AC-MSS-06); วิธีปฏิเสธ/ข้อความเมื่อผู้ที่ไม่ใช่ผู้ส่งหรือคำขอที่ไม่รอการตอบรับพยายามยกเลิก (AC-MSS-07); ข้อความเมื่อพยายามดำเนินการกับรายการของผู้อื่น (AC-MSS-07A); การใช้เกณฑ์กับผู้ที่เคยใช้หน้าสถานะแล้วหรือกลุ่มไม่ครบ 5 คน (AC-MSS-08)
- หมายเหตุ: ไม่พบ tasks.md และ plan.md ไม่มีหัวข้อแผนทดสอบข้อ 6; ไม่มี specs/000-shared/ หรือ mockup สำหรับฟีเจอร์นี้
## 2026-10-13
- คำสั่ง: `/testcases AC-CCM /009-cancle-match จาก ac ทั้งหมด`
- โหมด: ร่าง (ครอบคลุม AC-CCM-01, AC-CCM-02, AC-CCM-03, AC-CCM-03D, AC-CCM-03A, AC-CCM-03B, AC-CCM-03C, AC-CCM-03E, AC-CCM-04, AC-CCM-05, AC-CCM-05A, AC-CCM-05B, AC-CCM-06 และ AC-CCM-07 ใน SPEC-CCM-009)
- TC ID ที่เสนอ: TC-CCM-01-1, TC-CCM-01-2, TC-CCM-01-3, TC-CCM-01-4, TC-CCM-02-1, TC-CCM-02-2, TC-CCM-02-3, TC-CCM-03-1, TC-CCM-03-2, TC-CCM-03-3, TC-CCM-03D-1, TC-CCM-03D-2, TC-CCM-03D-3, TC-CCM-03A-1, TC-CCM-03A-2, TC-CCM-03A-3, TC-CCM-03B-1, TC-CCM-03B-2, TC-CCM-03B-3, TC-CCM-03C-1, TC-CCM-03C-2, TC-CCM-03C-3, TC-CCM-03C-4, TC-CCM-03E-1, TC-CCM-03E-2, TC-CCM-03E-3, TC-CCM-04-1, TC-CCM-04-2, TC-CCM-04-3, TC-CCM-05-1, TC-CCM-05-2, TC-CCM-05-3, TC-CCM-05A-1, TC-CCM-05A-2, TC-CCM-05A-3, TC-CCM-05B-1, TC-CCM-05B-2, TC-CCM-05B-3, TC-CCM-06-1, TC-CCM-06-2, TC-CCM-06-3, TC-CCM-06-4, TC-CCM-07-1, TC-CCM-07-2, TC-CCM-07-3, TC-CCM-07-4, TC-CCM-07-5
- ผล test: ไม่ได้รัน เนื่องจากโหมดร่างห้ามเขียนโค้ด test
- ประเด็นที่ spec ไม่ได้บอก: ผลการเปิดหน้าเมื่อยังไม่เข้าสู่ระบบหรือไม่มีสถานะจับคู่สำเร็จ (AC-CCM-01); การเลือกยกเลิกโดยยังไม่เลือกคู่ (AC-CCM-02); การยืนยันโดยไม่มีข้อความยืนยัน (AC-CCM-03); ผลแสดงเมื่อสถานะเปลี่ยนระหว่างตรวจแบบ atomic และข้อความปฏิเสธกรณีไม่ใช่สมาชิก (AC-CCM-03D); การแจ้งเตือนเมื่อบันทึกไม่สำเร็จและรายละเอียด/ระยะเวลาการแสดงสถานะ (AC-CCM-03A); รายละเอียดการลองใหม่เมื่อบันทึกล้มเหลว (AC-CCM-03B); ผลเมื่อ retry การแจ้งเตือนสำเร็จและการแจ้งผลสำเร็จหลัง retry (AC-CCM-03C); การเปิดแชทโดยไม่มีประวัติ (AC-CCM-03E); การไม่ยืนยันโดยไม่มีข้อความยืนยัน (AC-CCM-04); การค้นหาก่อนยกเลิกสำเร็จ (AC-CCM-05); ผลค้นหาเมื่อฝ่ายหนึ่งไม่เปิดสถานะให้ค้นหา (AC-CCM-05A); การส่งคำขอเมื่อฝ่ายหนึ่งไม่เปิดสถานะให้ค้นหา (AC-CCM-05B); รายละเอียดการปฏิเสธเมื่อผู้ใช้ไม่ได้เข้าสู่ระบบหรือสถานะไม่ใช่จับคู่สำเร็จ (AC-CCM-06); การใช้เกณฑ์กับผู้มีประสบการณ์หรือจำนวนผู้ทดสอบไม่ครบ 5 คน (AC-CCM-07)
- หมายเหตุ: ไม่พบ tasks.md, test-cases.md เดิม, specs/000-shared/ หรือ mockup; plan.md ไม่มีหัวข้อแผนทดสอบข้อ 6

## 2026-10-13
- ปิด F-01 ตามคำตัดสินทีม: ปรับ `test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior` ให้กรอกข้อมูลและ assert ค่าที่ฟอร์มรับจริง (including sleep behavior); ไม่แก้ test ที่ชื่อขึ้นต้น `test_TC_`
- ผล validation: `cd frontend && npm test` ผ่าน 7 tests
- F-02 ยังรอข้อกำหนดด้าน persistence/backend; F-04 ยังรอระบุ feature ปลายทางสำหรับ API client; F-05 ต้องยกเลิก TC-RMP-04A-3 ในการแก้ test-cases รอบถัดไปตามคำตัดสินทีม

## 2026-10-13
- คำสั่ง: `/testcases AC-RMP-04A specs/001-roommate-profile` (รอบแรก: ตรวจ/ทบทวน test cases)
- AC ที่เลือก: AC-RMP-04A จาก task T-01 สถานะ "เสร็จ รอทีมตรวจ"
- TC ที่ทบทวน: TC-RMP-04A-1, TC-RMP-04A-2, TC-RMP-04A-3
- สถานะ: TC-RMP-04A-1 และ TC-RMP-04A-2 เป็น "ใช้ได้"; TC-RMP-04A-3 รอ Q-04 เพราะ spec ไม่ได้ระบุพฤติกรรมเมื่อเลือกข้อมูลนอกหน้าแบบฟอร์ม
- ผลทดสอบ mutation: เปลี่ยนขีดจำกัดห้องพัดลมจาก 3 เป็น 4 ชั่วคราว; test เดิม `test_AC_RMP_04_and_04A_reject_invalid_profile_values` จับได้ (ล้มเหลวเพราะพบตัวเลือก 4); คืนค่าโดย `git restore --worktree` จาก staged baseline เฉพาะไฟล์ แล้ว unstage ให้สถานะไฟล์เดิมเป็น untracked
- ผล test เพิ่มจาก test cases v1: test_TC_RMP_04A_1_rejects_fan_room_over_capacity และ test_TC_RMP_04A_2_accepts_fan_room_capacity_limit ผ่าน; frontend รวม 7 tests ผ่าน

## 2026-10-13
- คำสั่ง: `/verify specs/001-roommate-profile`
- ผล test: `cd frontend && npm test` ผ่าน 7 tests; `cd backend && pytest -v` ไม่พบ test (0 collected, exit code 5); ไม่มีไฟล์ใน `backend/app/` หรือ `backend/tests/`
- ผลตามรอยไปข้างหน้า: 21 แถว — ครบ 0, ยังไม่ถึง 8, รอ Q 0, ช่องโหว่ 13
- ข้อค้นพบใหม่: F-01 test AC-RMP-02 ตรวจเพียงว่ามี fields; F-02 tests ไม่ยืนยันข้อมูลว่าไม่มีการบันทึกเมื่อ validation ไม่ผ่าน; F-03 ไม่มี login/existing-profile guard; F-04 API client มี endpoints booking ที่ไม่เกี่ยวกับ roommate; F-05 TC-RMP-04A-3 อ้าง Q-04 ซึ่งยังไม่มีใน spec
- ข้อจำกัดการตรวจ: ไม่แก้โค้ด, tests, spec, plan หรือ tasks; สร้างเฉพาะ `specs/001-roommate-profile/rtm.md` และเพิ่มบันทึกนี้

### คำตัดสินของทีมหลังตรวจ
- F-01: แก้ test ให้กรอกข้อมูลและ assert ค่าที่รับจริง
- F-02: แก้โค้ด/เพิ่ม persistence และทดสอบว่าไม่มีการบันทึกเมื่อ validation ไม่ผ่าน
- F-03: ไม่ใช่ปัญหาใน prototype ที่ยังไม่เปิดใช้งานจริง; รอ task implement
- F-04: แยก/ลบออกจากขอบเขต roommate และ trace ให้ feature ที่ถูกต้อง
- F-05: ยกเลิก TC-RMP-04A-3 เพราะอยู่นอกพฤติกรรมที่ AC ระบุ; ต้องปรับตาราง test cases ในงานแยก เนื่องจาก /verify ห้ามแก้ไฟล์ดังกล่าว
- สถานะ RTM หลังคำตัดสิน: 21 แถว — ครบ 0, ยังไม่ถึง 11, รอ Q 0, ช่องโหว่ 10

## 2026-10-13
- คำสั่ง: `/tasks specs/001-roommate-profile`
- โหมด/ขอบเขต: แตก plan.md เป็น tasks.md สำหรับงานปรับ spec ตามที่ทีมเลือก; ไม่แตก task implement frontend/backend และไม่แก้ spec.md
- ผลลัพธ์: สร้าง specs/001-roommate-profile/tasks.md มี 5 เฟส 5 task และ 0 task รอ Q; Q-01 ถึง Q-03 ตอบแล้ว
- ข้อจำกัดที่บันทึกใน tasks.md: plan v1 เป็นแผนปรับเอกสาร spec ไม่มีเทคโนโลยี/โครงไฟล์พัฒนา ไม่มีคำสั่งเปิดระบบ และไม่มีงานที่ทำให้ลอง frontend/backend ได้จริง; จุดตรวจจึงเป็นการตรวจเอกสาร ไม่ใช่การยืนยัน AC ในระบบ
- ผล validation: ตรวจว่าตาราง AC ครบ 13 ข้อ, FR-RMP-01 ถึง FR-RMP-11 ครบ, Constraint เฉพาะฟีเจอร์ทั้ง 7 ข้อมี task รองรับ

## 2026-10-13
- คำสั่ง: `/implement T-01 specs/001-roommate-profile`
- ไฟล์ที่แก้: specs/001-roommate-profile/spec.md, specs/001-roommate-profile/tasks.md
- ผลงาน: แยกพฤติกรรมการนอนของเจ้าของโปรไฟล์ออกจากความต้องการพฤติกรรมการนอนของเมทที่ต้องการ โดยเทียบกับ UC-02 และ UC-03; เปลี่ยนคำตอบ Q-02 ตามการตัดสินใจของทีม; ทำเครื่องหมาย T-01 เป็น "เสร็จ รอทีมตรวจ"
- การถามทีม: ถามเพื่อยืนยันกรณี Q-02 ใน UC-01 ขัดกับคำอธิบายใน UC-03; ทีมยืนยันให้ยึด UC-03 และแก้ Q-02 ให้สอดคล้อง
- ผลตรวจ: ตรวจเอกสารเทียบฟิลด์ที่แก้ไขได้/validation ใน UC-02 และความหมายข้อมูลพฤติกรรมการนอนใน UC-03; ไม่มี code test สำหรับ task เอกสารนี้ จึงไม่ได้รันทดสอบ frontend/backend

## 2026-10-13
- คำสั่ง: `/testcases AC-CRS/010-close-roommate-status จาก ac ทั้งหมด`
- โหมด: ร่าง (ครอบคลุม AC-CRS-01, AC-CRS-02, AC-CRS-02A, AC-CRS-02B, AC-CRS-02C, AC-CRS-03, AC-CRS-04, AC-CRS-05, AC-CRS-06, AC-CRS-07, AC-CRS-08, AC-CRS-08A, AC-CRS-08B, AC-CRS-09, AC-CRS-10 และ AC-CRS-11 ใน SPEC-CRS-010)
- TC ID ที่เสนอ: TC-CRS-01-1 ถึง TC-CRS-01-4, TC-CRS-02-1 ถึง TC-CRS-02-3, TC-CRS-02A-1 ถึง TC-CRS-02A-3, TC-CRS-02B-1 ถึง TC-CRS-02B-3, TC-CRS-02C-1 ถึง TC-CRS-02C-3, TC-CRS-03-1 ถึง TC-CRS-03-3, TC-CRS-04-1 ถึง TC-CRS-04-3, TC-CRS-05-1 ถึง TC-CRS-05-3, TC-CRS-06-1 ถึง TC-CRS-06-3, TC-CRS-07-1 ถึง TC-CRS-07-3, TC-CRS-08-1 ถึง TC-CRS-08-3, TC-CRS-08A-1 ถึง TC-CRS-08A-3, TC-CRS-08B-1 ถึง TC-CRS-08B-3, TC-CRS-09-1 ถึง TC-CRS-09-3, TC-CRS-10-1 ถึง TC-CRS-10-4, TC-CRS-11-1 ถึง TC-CRS-11-5
- ผล test: ไม่ได้รัน เนื่องจากโหมดร่างห้ามเขียนโค้ด test
- ประเด็นที่ spec ไม่ได้บอก: การปิดสถานะโดยไม่มี session/profile (AC-CRS-01); การยืนยันโดยไม่มีข้อความยืนยัน (AC-CRS-02); การปิดสถานะเมื่อไม่มีคำขอรอ (AC-CRS-02A); ผลกรณีไม่มีคู่ที่จับคู่สำเร็จ (AC-CRS-02B); รายละเอียดการล้มเหลวที่ไม่ใช่ atomic operation (AC-CRS-02C); การแสดงโปรไฟล์เมื่อสถานะยังเปิด (AC-CRS-03); การส่งคำขอเมื่อเป้าหมายยังเปิดสถานะ (AC-CRS-04); การไม่ยืนยันเมื่อไม่มีข้อความยืนยัน (AC-CRS-05); การเปลี่ยนสถานะของเจ้าของโปรไฟล์และการเข้าถึงโดยไม่เข้าสู่ระบบ (AC-CRS-06); การเปิดสถานะซ้ำหรือไม่ยืนยันการเปิด (AC-CRS-07); แจ้งเตือนเมื่อไม่มีคำขอถูกปฏิเสธ (AC-CRS-08); ผลเมื่อแจ้งเตือนสำเร็จระหว่าง retry (AC-CRS-08A); พฤติกรรมแชทก่อนปิดสถานะ (AC-CRS-08B); ผลค้นหาเมื่อเปิดสถานะบันทึกไม่สำเร็จ (AC-CRS-09); ผลเมื่อบันทึกสำเร็จ (AC-CRS-10); การประเมินผู้มีประสบการณ์หรือกลุ่มผู้ทดสอบไม่ครบ 5 คน (AC-CRS-11)
- หมายเหตุ: ไม่พบ tasks.md, test-cases.md เดิม, specs/000-shared/ หรือ mockup; plan.md ไม่มีหัวข้อแผนทดสอบข้อ 6

## 2026-10-13
- ปิด F-01 ตามคำตัดสินทีม: ปรับ `test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior` ให้กรอกข้อมูลและ assert ค่าที่ฟอร์มรับจริง; `cd frontend && npm test` ผ่าน 7 tests; ไม่แก้ test ที่ขึ้นต้น `test_TC_`
- F-02: ทีมเลือกพักไว้จนกว่าจะระบุแนวทางใน plan/constraints ด้าน persistence/backend; ยังไม่ implement เพราะไม่มีข้อกำหนดเทคโนโลยีหรือ API และห้ามเดา/แก้ specs เอง
- F-04: ทีมยืนยันให้ลบ `frontend/src/api/client.js`; ตรวจแล้วไม่มีการ import หรือใช้งานจาก feature
- F-05: ทีมยืนยันแทน TC-RMP-04A-3 เดิมด้วยกรณีผู้พักห้องพัดลม 0 คน (ต่ำกว่าขั้นต่ำ); อัปเดตแถวและเพิ่ม test ตาม case ใหม่นี้
- ผล test หลังแทน TC-RMP-04A-3: `cd frontend && npm test` ผ่าน 8 tests (รวม test_TC_RMP_04A_3_rejects_fan_room_below_capacity)

## 2026-10-13
- คำสั่ง: `/verify specs/001-roommate-profile` (รอบ v2 หลังคำตัดสินและการปิด F-01, F-04, F-05)
- ผล test: frontend 8 ผ่าน 0 ไม่ผ่าน; backend pytest 0 collected (exit code 5, ไม่มี backend/app และ backend/tests)
- RTM: 21 แถว — ครบ 2, ยังไม่ถึง 11, รอ Q 0, ช่องโหว่ 8; คง F-02 ไว้รอทีมระบุแนวทาง persistence/backend ใน plan/constraints
- ข้อค้นพบที่ปิด/ยุติ: F-01 test AC-RMP-02 assert ข้อมูลจริงแล้ว; F-03 ทีมตัดสินว่าเป็น prototype ยังไม่เปิดใช้; F-04 ลบ API client ที่ไม่ใช้; F-05 แทน case นอก AC ด้วย fan 0 คนและ test ผ่าน

## 2026-10-13
- คำสั่ง: `/testcases AC-RMP-01` ครั้งที่ 1 (ยืนยัน AC-RMP-01 หลังคำขอ “AC01 ครั้งที่ 1” ไม่ระบุฟีเจอร์)
- โหมด/ผล: โหมดเขียน test ยังไม่เริ่ม เพราะ `test-cases.md` มีแถว `TC-RMP-01-1` ถึง `TC-RMP-01-3` อยู่แล้วและทุกแถวเป็น “ร่าง”; ไม่เพิ่มแถวซ้ำและไม่เขียน test
- ผล test: ไม่ได้รัน เนื่องจากต้องให้ทีมตรวจแถวและเปลี่ยนสถานะเป็น “ใช้ได้” ก่อน

## 2026-10-14
- คำสั่ง: สร้าง testcase ใน backend ตาม AC แต่ละอันของ `specs/001-roommate-profile/`
- ขอบเขตที่ยืนยัน: ทุก AC ใน feature `001-roommate-profile`
- โหมด/ผล: ไม่เพิ่ม testcase ซ้ำ เพราะตาราง `test-cases.md` มีกรณีทดสอบสำหรับ AC-RMP-01 ถึง AC-RMP-08 ครบแล้ว; ยังไม่สร้าง backend test เพราะแถวส่วนใหญ่เป็น “ร่าง”, แถว “ใช้ได้” ระบุ vitest และ `plan.md`/`tasks.md` กำหนดงานนี้เป็นการปรับเอกสารโดยไม่มี backend implementation หรือ code test
- ผล test: ไม่ได้รัน; รอทีมตรวจและอนุมัติ test cases และกำหนดขอบเขต backend testing ในแผนก่อน

## 2026-10-14
- คำสั่ง: `/implement T-01`
- ไฟล์ที่ตรวจ/แก้: specs/001-roommate-profile/spec.md
- ผล test: ไม่ได้รัน เนื่องจาก task นี้เป็นงานเอกสาร/spec-only และ repo นี้ไม่มี code test หรือ runtime สำหรับระบบโปรไฟล์หาเมท
- สรุป: ยืนยันว่าตรงตามเงื่อนไขของ T-01 โดยมีการชัดเจนว่าพฤติกรรมการนอนที่ระบุในโปรไฟล์เป็นของเจ้าของโปรไฟล์เท่านั้น และแยกจากความต้องการเกี่ยวกับพฤติกรรมการนอนของเมทที่อยู่ใน UC-03 พร้อมทั้งคงกฎ validation และ required fields ให้สอดคล้องกับ FR-RMP-03, FR-RMP-04 และ FR-RMP-05
- สิ่งที่เกือบต้องเดาแต่ถามแทน: ไม่มี; task นี้มีข้อมูลชัดเจน จึงเป็นการยืนยันความสอดคล้องของ spec แทนการเขียนโค้ด

## 2026-10-14
- คำสั่ง: `/testcases` — “ทำ testcase ที่ backend”
- คำถาม/คำตอบ: ถามว่าต้องการ AC-RMP ข้อใด; ทีมเลือก “เฉพาะ AC ที่มีสถานะ ‘ใช้ได้’ ใน test-cases.md”
- โหมด/ผล: พบแถวที่ใช้ได้ TC-RMP-04A-1 ถึง TC-RMP-04A-3 แต่มีเพียง TC-RMP-04A-1 ที่ระบุ pytest; ยังไม่เขียน backend test เพราะไม่มี `backend/app/`, `backend/tests/`, fixture หรือสัญญา API/แผนทดสอบใน `plan.md` ให้ยึด และไม่ควรสมมติ interface ของระบบ
- ผล test: ไม่ได้รัน เนื่องจากยังไม่มี backend test ที่เขียนได้อย่างไม่ต้องเดา
- สิ่งที่ต้องให้ทีมกำหนดก่อน: backend ใช้ interface/ชั้นใดสำหรับตรวจข้อมูลห้องและป้องกันการสร้างโปรไฟล์เมื่อข้อมูลผิด แล้วระบุสัญญานี้ในแผนหรือจัดเตรียม backend implementation/fixture ให้ทดสอบได้
## 2026-11-11
- คำสั่ง: `/tasks specs/004-search-roommate/spec.md`
- โหมด: tasks (สร้างแผนงานย่อยตาม spec)
- ผลลัพธ์: สร้างไฟล์ [specs/004-search-roommate/tasks.md](specs/004-search-roommate/tasks.md) สำเร็จ
- สรุป: มี 9 เฟส, 20 task, 0 task รอ Q-xx และเฟสแรกที่ใช้งานได้จริงคือ เฟส 1: เปิดหน้าและค้นหาเมทในระบบที่เข้าสู่ระบบและมีโปรไฟล์แล้ว
- ประเด็นที่ต้องติดตาม: spec v3 มีข้อคำถาม Q-SRS-01 ถึง Q-SRS-06 ที่ตอบแล้วทั้งหมด จึงไม่มี task ที่ต้องรอคำตอบจากทีม

## 2026-11-11
- คำสั่ง: `/implement T-01 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: backend/app/config.py, backend/app/services/search_roommate.py, backend/app/api/search.py, backend/tests/test_search_roommate.py
- ผล test: `cd backend && pytest -q` -> 2 passed in 0.79s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-01 โดยเพิ่ม model และ endpoint สำหรับค้นหาเมทที่กรองเฉพาะโปรไฟล์เปิดให้ค้นหาและไม่รวมโปรไฟล์ของผู้ใช้เอง พร้อมทดสอบ AC-SRS-03 และ AC-SRS-03D
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุไฟล์และ scope ชัดเจน และ spec v3 มีคำตอบครบแล้ว

## 2026-11-11
- คำสั่ง: `/implement T-02 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: backend/app/data/sample_roommate_profiles.json, backend/app/seeds/search_roommate_seed.py, backend/tests/test_search_roommate_seed.py
- ผล test: `cd backend && pytest -q tests/test_search_roommate_seed.py tests/test_search_roommate.py` -> 3 passed in 0.41s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-02 โดยเพิ่มชุดข้อมูลตัวอย่างที่มีโปรไฟล์เปิดให้ค้นหา, ปิดให้ค้นหา, เป็นตัวเอง, และมีข้อมูลความต้องการหาเมทครบตาม spec
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุให้สร้าง seed data ครบตามข้อจำกัดใน spec และไม่มีคำถามเปิดที่ค้าง

## 2026-11-11
- คำสั่ง: `/implement T-03 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: frontend/src/api/client.js, frontend/src/pages/SearchRoommatePage.js, frontend/src/__tests__/search-roommate-page.test.jsx
- ผล test: `cd frontend && npm test -- --run src/__tests__/search-roommate-page.test.jsx` -> 2 passed in 1.19s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-03 โดยสร้างหน้า Search Roommate เบื้องต้นพร้อมฟอร์มตัวกรอง, โหมด AND/OR, และการเรียก API แบบ POST ไปยัง /search-roommates พร้อมทดสอบการแสดงหน้าและการเรียก API
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องสร้างหน้าและ wiring API เบื้องต้น และไม่มี mockup หรือ Open Question ที่ค้าง

## 2026-11-11
- คำสั่ง: `/implement T-04 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: frontend/src/App.jsx, frontend/src/navigation/sidebar.js, frontend/src/routes.js, frontend/src/__tests__/search-roommate-page.test.jsx
- ผล test: `cd frontend && npm test -- --run src/__tests__/search-roommate-page.test.jsx` -> 4 passed in 1.52s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-04 โดยเพิ่มเมนู "ค้นหาเมท" ให้แสดงเฉพาะเมื่อเข้าสู่ระบบแล้ว พร้อมส่งผู้ใช้ไปยังหน้า Search Roommate และเพิ่ม test สำหรับเมนู/route และกรณีไม่ได้เข้าสู่ระบบ
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องเพิ่มเมนูและ route หลัก และไม่พบ mockup หรือ Open Question ใดที่ค้างใน spec

## 2026-11-11
- คำสั่ง: `/implement T-05 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: backend/app/middleware/auth_guard.py, backend/app/api/search.py, frontend/src/hooks/useAuth.js, frontend/src/App.jsx, backend/tests/test_search_roommate.py, frontend/src/__tests__/search-roommate-page.test.jsx
- ผล test: `cd backend && pytest -q tests/test_search_roommate.py` -> 3 passed in 0.46s; `cd frontend && npm test -- --run src/__tests__/search-roommate-page.test.jsx` -> 4 passed in 0.25s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-05 โดยสร้าง auth guard ร่วมกับ hook จัดการสถานะเข้าสู่ระบบ เพื่อป้องกันการค้นหาเมทเมื่อยังไม่ได้เข้าสู่ระบบ และยืนยันด้วย test ของ AC-SRS-06 ว่าเมนูซ่อนและ API ปฏิเสธคำขอที่ไม่มีผู้ใช้ที่เข้าสู่ระบบ
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องป้องกันการเข้าถึงหน้าและตรวจสิทธิ์เข้าสู่ระบบ และไม่มี mockup หรือ Open Question ใดที่ค้างใน spec

## 2026-11-11
- คำสั่ง: `/implement T-06 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: backend/app/services/profile_status.py, frontend/src/pages/SearchRoommatePage.js, frontend/src/__tests__/search-roommate-page.test.jsx
- ผล test: `cd backend && pytest -q tests/test_search_roommate.py` -> 3 passed in 0.56s; `cd frontend && npm test -- --run src/__tests__/search-roommate-page.test.jsx` -> 5 passed in 0.33s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-06 โดยตรวจสอบว่าผู้ใช้มีโปรไฟล์หาเมทหรือไม่ หากไม่มีให้แสดงข้อความแจ้งต้องสร้างโปรไฟล์ก่อนค้นหา พร้อมปุ่มทางลัดไปหน้า Create Profile และยืนยันด้วย test ของ AC-SRS-07
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องแจ้งเมื่อยังไม่มีโปรไฟล์หาเมท และไม่มี mockup หรือ Open Question ใดที่ค้างใน spec

## 2026-11-11
- คำสั่ง: `/implement T-07 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: frontend/src/pages/SearchRoommatePage.js, frontend/src/components/SearchFiltersForm.js, frontend/src/__tests__/search-roommate-page.test.jsx
- ผล test: `cd frontend && npm test -- --run src/__tests__/search-roommate-page.test.jsx` -> 6 passed in 1.63s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-07 โดยแยกฟอร์มตัวกรองออกเป็น component ที่รับค่าและเก็บใน state แบบ real-time สำหรับทุกฟิลด์รวมถึงโหมด AND/OR ก่อนกดส่งคำค้นหา และเพิ่ม test ของ AC-SRS-02 เพื่อยืนยันว่าการแก้ไขฟิลด์และการเลือกโหมดถูกเก็บไว้ก่อน submit
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องให้ผู้ใช้กรอกและเก็บเงื่อนไขได้ก่อนกดค้นหา และไม่มี mockup หรือ Open Question ใดที่ค้างใน spec

## 2026-11-11
- คำสั่ง: `/implement T-08 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: frontend/src/pages/SearchRoommatePage.js, frontend/src/__tests__/search-roommate-page.test.jsx
- ผล test: `cd frontend && npm test -- --run src/__tests__/search-roommate-page.test.jsx` -> 7 passed in 2.00s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-08 โดยเมื่อกดค้นหา ระบบจะส่งคำค้นหาไปยัง API และแสดงผลลัพธ์ในหน้าเดียว พร้อมจัดการกรณีที่ค้นหาแล้วไม่พบผลให้แสดงข้อความว่า “ไม่พบผลการค้นหา” ตาม spec
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องส่งคำค้นหาและแสดงผลลัพธ์เริ่มต้น และไม่มี mockup หรือ Open Question ใดที่ค้างใน spec

## 2026-11-11
- คำสั่ง: `/implement T-09 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: frontend/src/components/SearchResultsList.js, frontend/src/pages/SearchRoommatePage.js, frontend/src/__tests__/search-roommate-page.test.jsx
- ผล test: `cd frontend && npm test -- --run src/__tests__/search-roommate-page.test.jsx` -> 8 passed in 1.91s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-09 โดยแยกการแสดงผลลัพธ์เป็น component รายการบัตรที่แสดงข้อมูลหลักของโปรไฟล์ เช่น ชื่อ คณะ อายุ เพศ และชั้นปี พร้อมใช้งานในหน้า Search Roommate โดยยังคงโหมดผลลัพธ์เริ่มต้นและเงื่อนไขไม่พบผลตาม spec
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ spec ระบุให้แสดงผลลัพธ์ที่ตรงเงื่อนไขแบบหลักและไม่ระบุ mockup หรือ Open Question เพิ่มเติม

## 2026-11-11
- คำสั่ง: `/implement T-10 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: backend/app/services/search_roommate.py, backend/tests/test_search_roommate.py
- ผล test: `cd backend && pytest -q tests/test_search_roommate.py` -> 4 passed in 0.66s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-10 โดยสร้าง helper สำหรับกรองผลลัพธ์ให้คงเฉพาะโปรไฟล์ที่เปิดให้ค้นหาและไม่ใช่โปรไฟล์ของผู้ค้นหาเองก่อนประมวลผลเงื่อนไขต่อ เน้นให้ตรงตาม CON-SRS-04, CON-SRS-06, CON-SRS-07 พร้อมเพิ่ม test AC-SRS-03A และ AC-SRS-03B เพื่อยืนยัน behavior ของการกรองและกรณีไม่มีตัวกรอง
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องกรองโปรไฟล์ที่ปิดและตัวเองออกก่อนและไม่มี Open Question ที่ค้างใน spec

## 2026-11-11
- คำสั่ง: `/implement T-11 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: backend/app/services/filter_logic.py, backend/app/services/search_roommate.py, backend/tests/test_search_roommate.py
- ผล test: `cd backend && pytest -q tests/test_search_roommate.py` -> 6 passed in 0.52s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-11 โดยแยกกติกา AND/OR และการจัดอันดับตามจำนวนตัวกรองที่ตรงกันออกเป็น filter_logic.py และเชื่อมกับ SearchRoommateService เพื่อให้โหมด AND ตรวจครบทุกตัวกรอง โหมด OR ตรวจอย่างน้อยหนึ่งตัวกรอง และเรียงลำดับผลลัพธ์จากตรงมากสุดก่อนตาม match count พร้อมเพิ่ม test AC-SRS-03C เพื่อยืนยันทั้งสองโหมด
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องใช้กติกา AND/OR และจัดเรียงผลตามจำนวนเงื่อนไขที่ตรงกัน โดยไม่มี Open Question ใดที่รอความชัดเจนใน spec

## 2026-11-11
- คำสั่ง: `/implement T-12 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: frontend/src/components/SearchFiltersForm.js, frontend/src/components/SearchResultsList.js, frontend/src/__tests__/search-roommate-page.test.jsx
- ผล test: `cd frontend && npm test -- --run src/__tests__/search-roommate-page.test.jsx` -> 8 passed in 1.78s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-12 โดยแสดง label และคำอธิบายโหมดค้นหาแบบ AND/OR ในฟอร์มให้เห็นชัดเจน และเพิ่ม status บนรายการผลลัพธ์เพื่อสะท้อนว่าผลลัพธ์ถูกเรียงตามจำนวนตัวกรองที่ตรงกันจากมากไปน้อย พร้อมปรับ test ให้เชื่อมกับ label ใหม่
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องแสดงโหมด AND/OR และสถานะผลลัพธ์ให้เห็นบนหน้าจอ และไม่มีกำหนด mockup หรือ Open Question เพิ่มเติม

## 2026-11-11
- คำสั่ง: `/implement T-13 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: backend/app/services/search_roommate.py, backend/app/services/roommate_preference_match.py, backend/tests/test_search_roommate.py
- ผล test: `cd backend && pytest -q tests/test_search_roommate.py` -> 7 passed in 0.55s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-13 โดยแยกการเปรียบเทียบตัวกรองพฤติกรรมการนอน ความสะอาด และเวลาเข้านอนออกเป็น helper สำหรับข้อมูลความต้องการหาเมทของเจ้าของโปรไฟล์เท่านั้น และเชื่อมกับ SearchRoommateService เพื่อให้ตัวกรอง 3 รายการทำงานจากข้อมูลความต้องการจริงตาม CON-SRS-08 พร้อมเพิ่ม test AC-SRS-03D เพื่อยืนยัน sleep_behavior, cleanliness และ sleep_time
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ spec ระบุชัดเจนว่าตัวกรอง 3 รายการต้องใช้ข้อมูลความต้องการหาเมทของเจ้าของโปรไฟล์ และไม่มี Open Question เพิ่มเติม

## 2026-11-11
- คำสั่ง: `/implement T-14 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: frontend/src/components/SearchFiltersForm.js, frontend/src/__tests__/search-roommate-page.test.jsx
- ผล test: `cd frontend && npm test -- --run src/__tests__/search-roommate-page.test.jsx` -> 9 passed in 1.98s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-14 โดยยืนยันว่าฟิลด์พฤติกรรมการนอน ความสะอาด และเวลาเข้านอนถูกแสดงบนหน้า Search Roommate และสามารถกรอกค่าแล้วส่งต่อไปยัง state ของฟอร์มเพื่อให้ backend ประมวลผลต่อไปได้ตาม FR-SRS-03 และ CON-SRS-08
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องมีตัวกรอง 3 รายการบนหน้าและเป็นข้อมูลจาก roommate preference ตาม spec

## 2026-11-11
- คำสั่ง: `/implement T-15 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: backend/app/services/search_roommate.py, backend/tests/test_search_roommate.py
- ผล test: `cd backend && pytest -q tests/test_search_roommate.py` -> 8 passed in 0.50s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-15 โดยให้ SearchRoommateService คืนผลลัพธ์ที่จำกัดหน้าแต่ละหน้า 20 รายการ และเริ่มจากหน้า 1 เสมอในทุกการค้นหาใหม่ พร้อมเพิ่ม test AC-SRS-03E เพื่อยืนยันว่าการค้นหาใหม่และ page 2 ทำงานตามเงื่อนไขการแบ่งหน้า
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ spec ระบุชัดเจนว่าการค้นหาใหม่ต้องกลับหน้า 1 และแบ่งผลหน้าละ 20 รายการ โดยไม่มี Open Question ที่ค้าง

## 2026-11-11
- คำสั่ง: `/implement T-16 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: frontend/src/components/SearchResultsList.js, frontend/src/pages/SearchRoommatePage.js, frontend/src/api/client.js, backend/app/api/search.py, frontend/src/__tests__/search-roommate-page.test.jsx
- ผล test: `cd frontend && npm test -- --run src/__tests__/search-roommate-page.test.jsx` -> 10 passed in 1.99s; `cd /workspaces/Vistaandfriend-swreqspec- && pytest backend/tests/test_search_roommate.py -q` -> 8 passed in 0.46s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-16 โดยเพิ่ม pagination control บนรายการผลลัพธ์สำหรับหน้า ก่อนหน้า/ถัดไป, ส่งค่า page ไปกับ request ของ API ทุกครั้ง, และรีเซ็ตกลับไปหน้า 1 เมื่อกดค้นหาใหม่ ตาม FR-SRS-08 และ FR-SRS-09 พร้อมให้ test AC-SRS-03E ยืนยันว่า request บนหน้าแรกเริ่มจาก page=1 และการกดถัดไปส่ง page=2 อย่างถูกต้อง
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ spec ระบุชัดเจนว่าตต้องมีการแบ่งหน้าและ reset หน้าใหม่ทุกครั้ง และไม่มี Open Question หรือ mockup ที่ค้าง

## 2026-11-11
- คำสั่ง: `/implement T-17 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: backend/app/services/profile_detail.py, backend/app/api/profile_detail.py, backend/tests/test_search_roommate.py
- ผล test: `cd /workspaces/Vistaandfriend-swreqspec- && pytest backend/tests/test_search_roommate.py -q` -> 9 passed in 0.62s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-17 โดยสร้าง API เปิดรายละเอียดโปรไฟล์ที่สนใจที่คืนข้อมูลโปรไฟล์ที่อนุญาตรวมโซเชียลยังคงไว้ แต่ไม่รวมเบอร์โทรศัพท์ และตรวจสอบว่า profile นั้นเปิดให้ค้นหาและไม่ใช่โปรไฟล์ของผู้ค้นหาเองตาม FR-SRS-06 และ CON-SRS-06 พร้อมเพิ่ม test AC-SRS-04 เพื่อยืนยัน behavior ของการเปิดข้อมูลที่อนุญาต
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องมี API สำหรับเปิดข้อมูลโปรไฟล์และเฉพาะข้อมูลที่อนุญาตเท่านั้น และไม่มี Open Question หรือ mockup ที่ค้าง

## 2026-11-11
- คำสั่ง: `/implement T-18 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: frontend/src/components/ProfileCard.js, frontend/src/pages/ProfileDetailPage.js, frontend/src/__tests__/profile-detail-page.test.jsx
- ผล test: `cd /workspaces/Vistaandfriend-swreqspec-/frontend && npm test -- --run src/__tests__/profile-detail-page.test.jsx` -> 1 passed in 1.14s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-18 โดยสร้างหน้าโปรไฟล์และ component ที่แสดงข้อมูลที่อนุญาตได้ครบถ้วน พร้อมแสดงข้อมูลโซเชียลและระบุว่าเบอร์โทรศัพท์ไม่เปิดเผยตาม FR-SRS-06 และ CON-SRS-06 เพื่อให้ผู้ใช้เห็นโปรไฟล์ที่สนใจโดยไม่เปิดเผยข้อมูลส่วนตัว
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องมีหน้าโปรไฟล์และไม่แสดงเบอร์โทรศัพท์ และไม่มี Open Question หรือ mockup ที่ค้าง

## 2026-11-11
- คำสั่ง: `/implement T-19 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: backend/app/services/search_roommate.py
- ผล test: `cd /workspaces/Vistaandfriend-swreqspec- && PYTHONPATH=backend pytest backend/tests/test_search_roommate.py -q` -> 9 passed in 0.47s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-19 โดยให้ SearchRoommateService คืนผลลัพธ์แบบลิสต์ที่มีสถานะว่างและข้อความ "ไม่พบผลการค้นหา" เมื่อไม่มีผลลัพธ์ตรงตามเงื่อนไข พร้อมยังคงรักษารูปแบบ List สำหรับ endpoint เดิมตาม FR-SRS-07 และ CON-SRS-05
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องคืนสถานะว่างพร้อมข้อความแจ้ง แต่ไม่มี Open Question หรือ mockup ที่ค้าง

## 2026-11-11
- คำสั่ง: `/implement T-20 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: frontend/src/components/SearchResultsList.js, frontend/src/pages/SearchRoommatePage.js, frontend/src/__tests__/search-roommate-page.test.jsx
- ผล test: `cd /workspaces/Vistaandfriend-swreqspec-/frontend && npm test -- --run src/__tests__/search-roommate-page.test.jsx` -> 10 passed in 2.05s
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-20 โดยแสดงข้อความ "ไม่พบผลการค้นหา" ใน UI เมื่อผลลัพธ์เป็นว่างใน SearchResultsList และจัดการให้หน้า Search Roommate แสดง empty state แบบนี้แบบสอดคล้องกับ FR-SRS-07 และ AC-SRS-05
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าต้องแสดงข้อความเมื่อผลลัพธ์ว่าง และไม่มี Open Question หรือ mockup ที่ค้าง

## 2026-11-11
- คำสั่ง: `/implement T-21 specs/004-search-roommate/tasks.md`
- โหมด: implement (ทำ task เดียวตาม tasks.md)
- ไฟล์ที่สร้าง/แก้: docs/test/search-roommate-usability.md, specs/004-search-roommate/test-cases.md, specs/004-search-roommate/tasks.md
- ผล test: `cd /workspaces/Vistaandfriend-swreqspec- && git --no-pager diff --check` -> ไม่มีข้อผิดพลาดด้าน whitespace / formatting
- สรุป: เสร็จตาม "เสร็จเมื่อ" ของ T-21 โดยจัดทำสคริปต์ทดสอบ usability สำหรับนักศึกษาที่ไม่เคยใช้ฟังก์ชัน 5 คน พร้อมแบบฟอร์มบันทึกผลและเกณฑ์ประเมินที่กำหนดให้ต้องมีผู้สำเร็จอย่างน้อย 4 จาก 5 คนโดยไม่รับคำแนะนำ ตาม NFR-SRS-03 และ AC-SRS-08; ทีมยังสามารถนำสคริปต์นี้ไปทดสอบจริงกับผู้ใช้ได้ภายหลัง
- สิ่งที่เกือบต้องเดาแต่ไม่ถาม: ไม่มี เพราะ task ระบุชัดเจนว่าเป็นสคริปต์ประเมินความสามารถใช้งาน และ spec ไม่กำหนดรายละเอียดสคริปต์ละเอียดเกินกว่านี้ จึงใช้แผนทดสอบที่สอดคล้องกับ AC-SRS-08 โดยไม่เพิ่มเงื่อนไขที่ผิดจาก spec
