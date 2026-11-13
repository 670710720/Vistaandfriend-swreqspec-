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

## 2026-11-12
- คำสั่ง: ปรับเฉพาะ test cases ของ AC-RMP ตามรายการที่ทีมให้ โดยไม่เขียนโค้ด test และไม่เลื่อนสถานะเป็น “ใช้ได้”
- ขอบเขตไฟล์: เพิ่มบันทึกนี้ใน `prompt-log.md` ตามคำยืนยันของทีม และแก้ `specs/001-roommate-profile/test-cases.md` เท่านั้น
- คำถาม/คำตอบ: แจ้งความขัดแย้งระหว่างคำสั่งห้ามแตะไฟล์อื่นกับการขอให้บันทึก prompt-log.md; ทีมยืนยันให้แก้ test-cases.md และ prompt-log.md
- ผลการแก้: แทน TC-RMP-02-3, 02A-3, 03-3, 04-3 ด้วยสถานการณ์ที่ระบุ; ปรับ TC-RMP-01-3 เป็นรอ Q-04; ลบแถวซ้ำ/ขัดแย้งตามคำสั่ง; ปรับ TC-RMP-05A-2, TC-RMP-04A-3 และ TC-RMP-07-1 ถึง 07-3; อัปเดตการตรวจด้วยเป็น vitest และทำแถวตรวจการบันทึกข้อมูลเป็นรอ Q-07
- แถวที่ต้องรอคำตอบ: TC-RMP-01-3 รอ Q-04, TC-RMP-02-3 รอ Q-06 และแถวตรวจการบันทึกข้อมูลรอ Q-07
- ข้อสังเกตที่ไม่สร้างแถวทดแทน: การลบ TC-RMP-01-2 ทำให้ AC-RMP-01 ไม่มีแถวขอบ; การลบ TC-RMP-01A-3 ทำให้ AC-RMP-01A ไม่มีแถวทางผิด; การลบ TC-RMP-02A-2 ทำให้ AC-RMP-02A ไม่มีแถวขอบ; การลบ TC-RMP-08-2 และ TC-RMP-08-3 ทำให้ AC-RMP-08 ไม่มีแถวขอบและทางผิด
- ผล test: ไม่ได้เขียนหรือรันโค้ด test ตามคำสั่งทีม
- สิ่งที่ต้องให้ทีมกำหนดก่อน: backend ใช้ interface/ชั้นใดสำหรับตรวจข้อมูลห้องและป้องกันการสร้างโปรไฟล์เมื่อข้อมูลผิด แล้วระบุสัญญานี้ในแผนหรือจัดเตรียม backend implementation/fixture ให้ทดสอบได้

## 2026-11-12
- คำสั่ง: `/plan specs/001-roommate-profile/spec.md`
- คำถาม/คำตอบ: ทีมยืนยันให้บันทึกคำตอบ Q-04 ว่าพาไปหน้าเข้าสู่ระบบพร้อมเตือนว่าต้องเข้าสู่ระบบ; Q-06 ไม่มีตัวเลือก “อื่น ๆ” และไม่ให้เลือก “ไม่มีพฤติกรรมดังกล่าว” ร่วมกับตัวเลือกอื่น; Q-07 ใช้ SQLite และมี backend; Q-05 ยังคงไม่มีคำตอบ
- ผลการแก้: บันทึกคำตอบ Q-04, Q-06 และ Q-07 ใน `specs/001-roommate-profile/spec.md`, คง Q-05 ค้าง และร่าง `specs/001-roommate-profile/plan.md` ครบหัวข้อเทคโนโลยี โมเดลข้อมูล API/หน้าจอ Constraints ค่าที่ตั้งได้ แผนทดสอบครบ AC ลำดับงาน และสิ่งที่ยังไม่ทำ
- ข้อจำกัดที่บันทึกในแผน: ไม่มี shared constraints หรือ mockup HTML และไม่มี UI ID ใน spec; ไม่สร้าง ID ใหม่; ตำแหน่ง/วิธีเปิดสถานะและการปิดกลับยังรอ Q-05
- ผล test: ไม่ได้รัน เนื่องจากเป็นการปรับเอกสารและไม่มีโค้ดเปลี่ยน

## 2026-11-12
- คำสั่ง: `/tasks specs/001-roommate-profile/spec.md`
- ผลการแก้: แทนที่ `specs/001-roommate-profile/tasks.md` เดิมซึ่งไม่ตรงกับ plan v4 ด้วย breakdown 14 เฟส 25 task ครอบคลุม AC, Constraints และ FR พร้อมจุดตรวจรายเฟสและรายการ Open Questions
- งานที่รอคำตอบ: 4 task ของ Q-05 (T-22 ถึง T-25); แยกเฉพาะงานเปิดสถานะ/ปิดสถานะออกจากส่วนสถานะเริ่มต้นที่ทำได้
- ประเด็นที่ยังต้องชี้แจงก่อนเริ่ม: วิธีตรวจว่ามีโปรไฟล์ก่อนแสดงแบบฟอร์มใน AC-RMP-01A ยังไม่มีใน plan จึงไม่กำหนด endpoint แทนทีม; การค้นหาจริงใน AC-RMP-06/08 ต้องตรวจร่วมกับ UC-04
- งานที่ยากที่สุด: T-18/T-19 การรับมือบันทึกล้มเหลวและ retry โดยไม่เหลือข้อมูลบางส่วนหรือสร้างโปรไฟล์ซ้ำ (NFR-REL-01)
- AC ที่ทดสอบยาก: AC-RMP-07 ต้องมีผู้ใช้ใหม่ 5 คนจริง; วิธีทดสอบแบบย่อที่ยังรักษาเกณฑ์คือให้ผู้ทดสอบ 5 คนทดลองทีละคนในสภาพแวดล้อมเดียวกัน โดยไม่รับคำแนะนำ แล้วบันทึกผลว่าผ่านอย่างน้อย 4 คน ทั้งนี้ทีมต้องยืนยันวิธีจัดการทดสอบเอง
- ผล test: ไม่ได้รัน เพราะแก้เฉพาะเอกสาร; ตรวจ `git diff --check` แล้วผ่าน
- สถานะ: ยังไม่เริ่มทำ task หรือเขียนโค้ด

## 2026-11-12
- คำสั่ง: `/testcases specs/001-roommate-profile/spec.md`
- ขอบเขต: ผู้ใช้ระบุไฟล์ spec แต่ไม่ได้ระบุ AC ID; เมื่อไม่ได้รับคำตอบเพิ่มเติม จึงตรวจทุก AC ใน spec
- โหมด/ผล: test-cases.md มี 32 แถว ครบ AC ที่ระบุ; มี 13 แถวสถานะ "ร่าง", 18 แถวสถานะ "รอ Q-xx" และ 1 แถวสถานะ "ใช้ได้" จึงไม่เพิ่มหรือแก้ test case และไม่เปลี่ยนสถานะใด
- test ที่อนุมัติแล้ว: TC-RMP-04A-2 มี test ชื่อ `test_TC_RMP_04A_2_accepts_fan_room_capacity_limit` อยู่แล้ว; รันเฉพาะ test นี้จาก `frontend/` ผ่าน (1 passed, 7 skipped)
- ผล test อื่น: ไม่ได้เขียนหรือรัน เนื่องจากแถวที่เหลือยังเป็น "ร่าง" หรือ "รอ Q-xx"; ต้องให้ทีมตรวจแถวและเปลี่ยนสถานะเป็น "ใช้ได้" ก่อน
- ขอบเขตไฟล์ที่แก้: เพิ่มบันทึกนี้ใน `prompt-log.md` เท่านั้น; ไม่แก้ `test-cases.md` หรือโค้ด test

## 2026-11-12
- คำสั่ง: `/tasks specs/001-roommate-profile/spec.md` (แก้รอบที่ 1 ตามคำสั่งล่าสุด)
- ผลการแก้: เขียน `specs/001-roommate-profile/tasks.md` ใหม่เป็น 5 เฟส 14 task เรียงฐานข้อมูล → API → หน้าจอ → usability → งานรอ Q-05 และเพิ่มตาราง traceability ของ AC, Constraints และ FR
- สถานะ frontend เดิม: ทำ task T-07 เป็น "เสร็จ รอทีมตรวจ" ตามคำสั่ง โดยระบุไฟล์โค้ดเดิมและ 8 tests; ไม่ได้ถือว่าเชื่อม backend หรือผ่านการตรวจรับจากทีมแล้ว
- ข้อค้นพบ: frontend มีตัวเลือก "อื่น ๆ" และยังไม่บังคับตัวเลือก "ไม่มีพฤติกรรมดังกล่าว" ให้เลือกเดี่ยว ซึ่งขัดกับคำตอบ Q-06; แยก T-08 เพื่อแก้ให้ตรง spec โดยไม่แก้โค้ดในรอบนี้
- งานรอ Open Question: T-13 และ T-14 รอ Q-05; งาน T-02, T-06, T-09 และ T-11 รอรายละเอียดทางเทคนิคเรื่องวิธีเก็บรูป, authentication และ API ตรวจโปรไฟล์เดิม ซึ่ง plan ยังไม่กำหนดและไม่ได้เพิ่ม Q ID
- ผล test: ไม่ได้รัน เพราะแก้เฉพาะเอกสาร; baseline ที่ตรวจไว้ก่อนหน้านี้มี frontend 8 tests ผ่าน ส่วน backend pytest เก็บได้ 0 tests และจบด้วย exit code 5

- เหตุผลที่แก้รอบนี้: breakdown เดิมไม่สอดคล้องคำสั่งให้แตกงานโค้ดเรียงฐานข้อมูล/API/หน้าจอ และไม่ได้สะท้อนสถานะ frontend ที่มีอยู่จริงกับข้อจำกัดที่ยังไม่ระบุใน plan

## 2026-11-12
- คำสั่ง: `/testcases specs/001-roommate-profile/test-cases.md`
- ขอบเขต: ผู้ใช้ระบุ path ของ test-cases.md แต่ไม่ได้ระบุ AC ID; เมื่อไม่ได้รับคำตอบเพิ่มเติม จึงตรวจทุก AC ในไฟล์
- โหมด/ผล: ตรวจ 32 แถว: 13 ร่าง, 18 รอ Q-xx และ 1 ใช้ได้; แถวที่ใช้ได้คือ TC-RMP-04A-2 และมี test ในโค้ดอยู่แล้ว จึงไม่มี test ใหม่ที่ต้องเขียน
- ผล test: `cd frontend && npm test` ผ่าน 8/8 tests; ไม่ได้รัน backend เพราะไม่มีแถวที่อนุมัติสำหรับ backend และไม่มี backend tests
- การแก้ไข: เพิ่มเฉพาะบันทึกนี้ใน `prompt-log.md`; ไม่แก้ `test-cases.md`, สถานะแถว หรือโค้ด test

## 2026-11-12
- คำสั่ง: `/verify specs/001-roommate-profile/test-cases.md`
- ขอบเขต: ตรวจ spec Draft v4, plan, tasks, test-cases, RTM เดิม, AGENTS.md, source ทั้งหมดที่มีใน `frontend/src/`, tests ทั้งหมดใน `frontend/src/__tests__/` และตรวจว่าไม่มี `backend/app/`, `backend/tests/`, shared constraints หรือ mockups
- ผล test: `cd frontend && npm test` ผ่าน 8/8; `cd backend && pytest -v` พบ 0 tests และจบด้วย exit code 5 (ไม่มี test ไม่ใช่ test fail)
- RTM: อัปเดตตารางตามรอย requirement 21 แถว: ครบ 1, ยังไม่ถึง 9, รอ Q-05 3, ช่องโหว่ 8
- ข้อค้นพบคงค้าง: F-02 (คงข้อความทีมตัดสินเดิม), F-06 (ยังมีตัวเลือก "อื่น ๆ" และไม่บังคับตัวเลือก "ไม่มีพฤติกรรมดังกล่าว" ให้เลือกเดี่ยว ขัด Q-06), F-07 (test AC-RMP-02A/04A ยัง assert ไม่ครบและขาดกรณีห้องแอร์ 5 คน)
- ขอบเขตไฟล์ที่แก้: `specs/001-roommate-profile/rtm.md` และเพิ่มบันทึกนี้ต่อท้าย `prompt-log.md`; ไม่แก้ spec, plan, tasks, test cases, source code หรือ tests

## 2026-11-12
- คำสั่ง: `/plan specs/001-roommate-profile/spec.md`
- ผลการปรับ: ทบทวนและเขียน `specs/001-roommate-profile/plan.md` ใหม่ให้ตรงกับ spec Draft v4 ครบ 8 หัวข้อ รวมตาราง Constraints ทั้ง 7 ข้อ, ค่าที่ตั้งได้, แผนทดสอบครบ 13 AC และลำดับงาน 8 ขั้น
- Open Questions: คัดลอก Q-01 ถึง Q-07 ตาม spec; คง Q-05 เป็นคำถามที่ยังไม่ได้คำตอบและไม่กำหนดวิธีเปิด/ปิดสถานะเอง
- สิ่งที่ระบุเป็นการเลือกทางเทคนิค: React (Vite), FastAPI, Vitest และ pytest ไม่ได้มาจาก spec; SQLite มาจากคำตอบ Q-07
- สิ่งที่ยังต้องให้ทีมกำหนดก่อน implement: วิธีส่ง/จัดเก็บรูป, แหล่ง identity/authentication และสัญญาตรวจโปรไฟล์เดิม; ไม่สร้าง Q-ID เพิ่ม
- ขอบเขต: แก้เฉพาะ `specs/001-roommate-profile/plan.md` และเพิ่มบันทึกนี้ท้าย `prompt-log.md`; ไม่แก้ spec, tasks, RTM, source หรือ tests; ไม่รันทดสอบเพราะเป็นเอกสารเท่านั้น

## 2026-11-13
- คำสั่ง: `/task specs/005-chat-roommate` (ผู้ใช้ยืนยันให้แตก implementation tasks จาก spec โดยตรง ไม่แก้ plan.md)
- ผลลัพธ์: สร้าง `specs/005-chat-roommate/tasks.md` เป็น 20 เฟส 37 task ครอบคลุม AC 19 ข้อ, Constraints 9 ข้อ และ FR 16 ข้อ
- ข้อค้นพบ: Q-01 ถึง Q-06 ตอบครบ; Q-01 ต้องการ in-app และ push notifications แต่ไม่มี FR/AC จึงไม่สร้าง task; ระบุ integration gaps เรื่อง Authentication, UC-04, production storage และภาระ concurrent
- ตรวจเอกสาร: ตรวจช่องบังคับและ traceability; ไม่รันทดสอบเพราะสร้างเอกสารเท่านั้น
- ขอบเขต: แก้เฉพาะ `specs/005-chat-roommate/tasks.md` และเพิ่มบันทึกนี้ท้าย `prompt-log.md`; ไม่แก้ spec, plan, mockup หรือโค้ด

## 2026-11-13
- คำสั่ง: แก้ `/tasks specs/005-chat-roommate/tasks.md` รอบที่ 1 ตามคำขอให้ลดจำนวน T เหลือ 10 และเน้นงาน UI
- ผลการแก้: รวม breakdown จาก 37 เหลือ 10 task ใน 6 เฟส; รวม AC ที่เกี่ยวข้องไว้ใน vertical slices และคง UI task, ตาราง AC/Constraint/FR และ integration gaps
- ข้อกำหนดที่คงไว้: ครอบคลุม AC ทั้ง 19 ข้อ; ไม่เพิ่ม task แจ้งเตือนจาก Q-01 เพราะไม่มี FR/AC; ไม่แก้ `spec.md`, `plan.md`, mockup หรือโค้ด
- ผลตรวจ: ไม่รัน tests เพราะแก้เฉพาะเอกสาร; ตรวจความครบของ task และ traceability หลังแก้

## 2026-11-13
- คำสั่ง: `/implement T-01 specs/005-chat-roommate/tasks.md`
- ผลการทำ: เพิ่มค่ากำหนด Feature 005 ใน Backend/Frontend config และให้ `ChatMessageCreate` ใช้ค่าความยาวข้อความจาก config; เพิ่ม tests สำหรับ config, การบันทึกหลายคู่สนทนา, และ smoke test concurrency/latency
- ไฟล์โค้ดที่แก้: `backend/app/config.py` (สร้าง), `frontend/src/config.js`, `backend/app/models/chat_message.py`, `backend/tests/test_chat_backend_smoke.py`, `frontend/src/api/client.test.js`
- ไฟล์ `backend/app/main.py` และ `backend/app/repositories/chat_repository.py` ตามรายการ T-01 ไม่ต้องแก้ เพราะโครงสร้างเดิมเปิดให้สร้างฐานทดสอบและแยกประวัติหลายคู่ได้อยู่แล้ว; ยืนยันด้วย tests
- ผล test: `cd backend && pytest -q tests/test_chat_backend_smoke.py` ผ่าน 4 tests (มี Starlette deprecation warning); `cd frontend && npm test -- src/api/client.test.js` ผ่าน 9 tests; `git diff --check` ผ่าน
- เรื่องที่ถามแทนการเดา: `plan.md` ยังไม่ใช่แผนเทคนิค จึงถามก่อนเรื่อง stack; ทีมอนุญาตให้ใช้ stack ที่มีใน repository เดิม และไม่มีการตัดสินใจ requirement เพิ่ม
- หมายเหตุ: concurrency/latency เป็น smoke test สองคู่สนทนาตาม T-01 ไม่ใช่การรับรอง performance ภายใต้จำนวนผู้ใช้พร้อมกันที่ยังไม่ระบุ
- สถานะ T-01: เสร็จ รอทีมตรวจ; ไม่เริ่ม T-02

## 2026-11-13
- ข้อสังเกตหลัง implement T-01: `frontend/src/api/client.js` ยังมี `MESSAGE_RULES.maxLength` เป็นค่า 2000; ไม่แก้ใน T-01 เพราะไฟล์นี้ไม่อยู่ในรายการไฟล์ที่แตะของ T-01 แต่ระบุไว้ใน T-05 ซึ่งควรเชื่อมค่ากับ `CHAT_CONFIG`

## 2026-11-13
- การตรวจและอนุมัติ T-01: ผู้รับผิดชอบและผู้มีอำนาจตัดสินใจ Feature Chat Roommate ยืนยันตรวจผลจากรายงานและอนุมัติ T-01 แล้ว ไม่ต้องรอการตรวจจากทีมเพิ่มเติม
- ปรับสถานะ T-01 ใน `specs/005-chat-roommate/tasks.md` เป็น "เสร็จ" ตามการอนุมัติ; ไม่แก้ task อื่นหรือไฟล์ source, tests และ mockup

## 2026-11-13
- คำสั่ง: `/implement T-02 specs/005-chat-roommate/tasks.md`
- ผลการทำ: เพิ่ม identity boundary แบบ fail-closed โดยอ่าน `request.state.user_id` จาก trusted upstream middleware; เปิดแชทและส่งข้อความได้เฉพาะเมื่อ sender ตรงกับ principal และอ่านประวัติได้เฉพาะเมื่อ principal เป็นผู้ส่งหรือผู้รับ
- ขอบเขต: ไม่สร้าง Authentication, token/provider หรือ UC-04; tests ใช้ test-only middleware เพื่อ inject principal; runtime จะปฏิเสธคำขอด้วย 401 จนกว่าจะเชื่อม trusted middleware ภายนอก
- ไฟล์โค้ดที่แก้: `backend/app/controllers/chat_controller.py`, `backend/app/main.py`, `backend/tests/test_chat_backend_smoke.py`, `backend/tests/test_chat_start_access.py`
- ไฟล์ `backend/app/repositories/chat_repository.py` และ `backend/app/services/chat_service.py` ไม่ต้องแก้ เพราะ repository มี query แบบคู่สนทนาอยู่แล้ว และ service มี profile-eligibility boundary อยู่แล้ว
- ผล test: `cd backend && pytest -q` ผ่าน 10 tests (มี Starlette deprecation warning); `git diff --check` ผ่าน
- ประเด็นที่ถามแทนการเดา: หลังพบว่าไม่มี auth provider ขออนุมัติแนวทาง; ผู้รับผิดชอบอนุมัติให้เพิ่มเฉพาะ identity boundary ที่รับ principal จาก middleware ภายนอก
- สถานะ T-02: เสร็จ รอทีมตรวจ; ไม่เริ่ม T-03

## 2026-11-13
- คำสั่ง: `/implement T-03 specs/005-chat-roommate/tasks.md`
- การอนุมัติขอบเขต: ผู้รับผิดชอบอนุมัติให้ข้าม Dependency Gate ของ T-02 สำหรับ T-03 และอนุมัติการเพิ่ม contact-list API กับ Development Demo Provider เพื่อทดลอง UI ได้ โดยห้ามสร้าง Authentication, ใช้ `sender_id` เป็นหลักฐานยืนยันตัวตน, แตะ Mockup หรือเริ่ม T-04
- ผลการทำ: เพิ่ม `GET /api/chat/list` ผ่าน contact provider; โหมดสาธิตเปิดได้เมื่อ `APP_ENV=development` และ `CHAT_DEMO_MODE=true` เท่านั้น โดย Backend กำหนด demo principal เอง; Frontend เรียก list, `POST /api/chat/open` แล้วจึงอ่านประวัติ และแสดงเหตุผลเมื่อถูกปฏิเสธ
- การแยก Demo/Production: ไม่มี fallback รายชื่อหรือประวัติใน Frontend; หากไม่มี provider API แจ้ง 503; เส้นทางสาธิตแสดงป้ายข้อมูลตัวอย่างและซ่อน composer; App แสดง Chat UI ได้เฉพาะ Vite development ที่ตั้ง `VITE_CHAT_DEMO_MODE=true`; Vite proxy คง prefix `/api`
- ไฟล์โค้ด/ทดสอบที่แก้หรือเพิ่ม: `backend/app/controllers/chat_controller.py`, `backend/app/main.py`, `backend/app/services/chat_contact_provider.py`, `backend/tests/test_chat_list.py`, `frontend/src/App.jsx`, `frontend/src/api/client.js`, `frontend/src/api/client.test.js`, `frontend/src/pages/ChatListPage.jsx`, `frontend/src/pages/ChatPage.jsx`, `frontend/src/__tests__/chat-roommate-ui.test.jsx`, `frontend/vite.config.js`
- เอกสารที่แก้: เพิ่ม interface clarification โดยไม่สร้าง FR/AC/ID ใน `specs/005-chat-roommate/spec.md`; ปรับขอบเขต/ไฟล์/เกณฑ์และสถานะ T-03 ใน `specs/005-chat-roommate/tasks.md`; ไม่แก้ Mockup และคงสถานะ T-02 เป็น "เสร็จ รอทีมตรวจ"
- ผลทดสอบ: `cd frontend && npm test` ผ่าน 29 tests; `cd frontend && npm run build` ผ่าน; `cd backend && pytest -q` ผ่าน 13 tests (มี Starlette deprecation warning); ทดสอบ API Demo (`list`/`open`/`history`) และ Vite proxy ได้ HTTP 200; `git diff --check` ผ่าน
- ข้อจำกัดคงเหลือ: Production ยังต้องเชื่อม trusted identity middleware และ provider รายชื่อ/สิทธิ์จาก UC-04; ไม่ได้สร้างระบบ Authentication หรือระบบ UC-04
- สถานะ T-03: เสร็จ รอทีมตรวจ; หยุดโดยไม่เริ่ม T-04

## 2026-11-13
- การตรวจและอนุมัติ T-02 และ T-03: ผู้รับผิดชอบและผู้มีอำนาจอนุมัติงาน Feature Chat Roommate ยืนยันตรวจผลจากรายงานและผลทดสอบแล้ว และอนุมัติทั้งสอง task โดยไม่ต้องรอการตรวจเพิ่มเติม
- ปรับเฉพาะสถานะ T-02 และ T-03 ใน `specs/005-chat-roommate/tasks.md` จาก "เสร็จ รอทีมตรวจ" เป็น "เสร็จ"; ไม่แก้ Source Code, Tests, Spec, Mockup หรือ Task อื่น
- คงข้อจำกัดเดิม: Production ต้องเชื่อม trusted identity middleware ซึ่งส่ง principal ผ่าน `request.state.user_id`; หากไม่มี identity context ระบบยังปฏิเสธคำขอ และยังต้องเชื่อมรายชื่อ/สิทธิ์จาก UC-04; ไม่มีการสร้าง Authentication หรือ UC-04

## 2026-11-13
- คำสั่ง: `/implement T-04 specs/005-chat-roomate/tasks.md` (ใช้ไฟล์จริง `specs/005-chat-roommate/tasks.md`)
- ผลการทำ: เพิ่มการปฏิเสธข้อความว่าง/ช่องว่างล้วน/เกินขนาดจาก config; ให้ Repository flush, สร้างผลตอบกลับ, commit และ rollback เมื่อเกิด SQLAlchemy failure; Service แปลง persistence failure เป็นข้อผิดพลาดภายในที่ไม่เผยรายละเอียด; API ส่ง HTTP 503 พร้อมข้อความทั่วไปที่ให้ลองใหม่ได้ และไม่ตอบสำเร็จ
- เวลา: เก็บ instant เป็น UTC ตามเดิม; แปลงเวลาใน response `created_at` เป็น ISO datetime เขต Asia/Bangkok ตาม ASM-03 โดยไม่เปลี่ยนชื่อ field หรือชนิดข้อมูล; เพิ่มการทดสอบความสอดคล้องระหว่างเวลาใน DB และ response
- Identity boundary: API ยังต้องได้ `request.state.user_id` จาก trusted middleware และตรวจว่า `sender_id` ตรงกับ principal; ไม่ใช้ request body เป็นหลักฐานยืนยันตัวตน
- ไฟล์โค้ด/ทดสอบที่แก้: `backend/app/models/chat_message.py`, `backend/app/main.py`, `backend/app/repositories/chat_repository.py`, `backend/app/services/chat_service.py`, `backend/tests/test_chat_backend_smoke.py`
- ผลทดสอบ: `cd backend && pytest -q` ผ่าน 18 tests (มี Starlette deprecation warning); `git diff --check` ผ่าน
- ข้อจำกัดคงเหลือ: ไม่มี Push/Real-time delivery ตามขอบเขต; Production ยังต้องเชื่อม trusted identity middleware; การแสดงเหตุผลและให้ลองใหม่ใน UI เป็นงาน T-05
- สถานะ T-04: เสร็จ รอทีมตรวจ; ไม่เริ่ม T-05

## 2026-11-13
- การตรวจและอนุมัติ T-04: ผู้รับผิดชอบและผู้มีอำนาจอนุมัติงาน Feature Chat Roommate ยืนยันตรวจรายงานและอนุมัติผล T-04 แล้ว
- เปลี่ยนเฉพาะสถานะ T-04 ใน `specs/005-chat-roommate/tasks.md` จาก "เสร็จ รอทีมตรวจ" เป็น "เสร็จ"; ไม่แก้ Source Code, Tests, Spec, Mockup หรือ Task อื่น และไม่เริ่ม T-05

## 2026-11-13
- คำสั่ง: `/implement T-05 specs/005-chat-roommate/tasks.md`
- ผลการทำ: UI โหลดประวัติจาก History API, จัดตำแหน่งข้อความตาม sender ที่ Backend ส่งกลับ, เรียก POST เพื่อส่งข้อความ และแสดงเป็นข้อความสำเร็จหลัง API ยืนยันเท่านั้น; เมื่อส่งล้มเหลวแสดงเหตุผลและให้ลองใหม่ พร้อม retry อัตโนมัติตาม `CHAT_CONFIG.automaticRetryLimit` โดยไม่เพิ่ม delay
- ตรวจข้อความว่างและความยาวตาม Backend; ไม่ใช้ mock messages ใน production และใช้ mock เฉพาะ Frontend tests
- ไฟล์โค้ด/ทดสอบที่แก้: `frontend/src/api/client.js`, `frontend/src/pages/ChatPage.jsx`, `frontend/src/pages/ChatListPage.jsx`, `frontend/src/__tests__/chat-roommate-ui.test.jsx`, `frontend/src/api/client.test.js`
- ผลทดสอบ: `cd frontend && npm test` ผ่าน 36 tests; `cd frontend && npm run build` ผ่าน; `git diff --check` ผ่าน
- ระหว่างรันทดสอบทั้งหมดพบ test ส่งข้อความเริ่มก่อน History API เสร็จ จึงปรับ test ให้รอข้อความประวัติปรากฏก่อนส่ง และรันทดสอบทั้งหมดซ้ำจนผ่าน
- ไม่พบข้อกำหนดที่ต้องเดา; ไม่แก้ Spec, Mockup, Backend หรือ task อื่น และไม่เริ่ม T-06
- ข้อจำกัดคงเหลือ: Production ยังต้องเชื่อม trusted identity middleware และ UC-04 contact/profile provider ตามข้อจำกัดจาก T-02/T-03; ไม่เพิ่ม retry delay เพราะ Spec ไม่กำหนด
- สถานะ T-05: เสร็จ รอทีมตรวจ

## 2026-11-13
- คำสั่ง: ให้หน้าเว็บที่เปิดด้วย `npm run dev` แสดง Chat Roommate เป็นหน้าเริ่มต้นบน branch `319`
- การตัดสินใจ: ผู้รับผิดชอบอนุมัติให้ Chat เป็นค่าเริ่มต้นเฉพาะ Vite development และปรับ clarification ใน spec; production คงหน้าโปรไฟล์เดิม
- สาเหตุ: `App.jsx` ต้องมี `VITE_CHAT_DEMO_MODE=true` จึงแสดง Chat แต่ `npm run dev` ไม่ได้ตั้งค่านี้; `main.jsx` mount `App` โดยตรงและ Vite proxy `/api` มีอยู่แล้ว
- การแก้ไข: ให้ dev mode แสดง Chat โดยปริยายและรองรับ `VITE_CHAT_DEMO_MODE=false` เพื่อ opt out; จำกัดการเปลี่ยนหน้าด้วย `MODE=development`; ปรับ clarification ใน `spec.md` และเพิ่ม tests สำหรับ default/opt out โดยไม่แตะ backend, routing, task status หรือ T-06
- ไฟล์ที่แก้: `frontend/src/App.jsx`, `frontend/src/__tests__/chat-roommate-ui.test.jsx`, `specs/005-chat-roommate/spec.md`, `prompt-log.md`
- ผลตรวจ: `cd frontend && npm test -- --cache=false` ผ่าน 38 tests; `cd frontend && npm run build` ผ่าน; `git diff --check` ผ่าน; ทดสอบ Vite `/` ได้ HTTP 200 และเรียก Chat List, Open Chat, History ผ่าน Vite proxy ได้ HTTP 200
- ข้อจำกัด: ตรวจหน้าและ API integration ผ่าน dev server แต่ไม่มีการตรวจภาพหน้าเว็บด้วย browser screenshot ในรอบนี้

## 2026-11-13
- การอนุมัติ T-05: ผู้รับผิดชอบ Feature ยืนยันอนุมัติผล T-05
- เปลี่ยนเฉพาะสถานะ T-05 ใน `specs/005-chat-roommate/tasks.md` จาก "เสร็จ รอทีมตรวจ" เป็น "เสร็จ"; ไม่แก้ source code หรือ task อื่น
- Preflight T-06: สถานะ "พร้อมทำ"; dependencies T-01 และ T-04 เป็น "เสร็จ"; แต่ตรวจพบว่า `python-multipart` ไม่มีใน environment และไม่มีใน `backend/requirements.txt` ซึ่งจำเป็นสำหรับรับ multipart upload ของ AC-CHAT-02A/02B
- หยุดก่อน Implement T-06 ตามข้อควรระวังของผู้ใช้; ไม่ติดตั้ง dependency และไม่แก้ไฟล์นอกขอบเขตโดยไม่ได้รับอนุมัติ; T-06 ยังคง "พร้อมทำ" และไม่ได้เริ่ม T-07

## 2026-11-13
- อนุมัติขยายขอบเขต T-06 ให้แก้ `backend/requirements.txt` เพื่อเพิ่ม dependency ที่จำเป็นสำหรับ Multipart File Upload
- ตรวจรูปแบบ manifest: ใช้ข้อกำหนดขั้นต่ำแบบ `package>=version` เช่น FastAPI/SQLAlchemy; environment มี FastAPI 0.162.5, Starlette 1.10.0 และ SQLAlchemy 2.1.8
- เพิ่ม `python-multipart>=0.0.18,<1.0` ใน `backend/requirements.txt` และเพิ่มไฟล์นี้ในช่อง "ไฟล์ที่แตะ" ของ T-06; เหตุผลคือ FastAPI `Request.form()` ต้องใช้ multipart parser เพื่อรองรับ AC-CHAT-02A/02B
- ดำเนิน Implement T-06 ต่อโดยคงการเปลี่ยนแปลงเดิมทั้งหมด; ไม่เริ่ม T-07

## 2026-11-13
- คำสั่ง: `/implement T-06 specs/005-chat-roommate/tasks.md`
- ผลการทำ: เพิ่ม Attachment metadata model และ filesystem storage boundary ใช้ storage key แบบสุ่ม; เพิ่ม multipart API สำหรับ JPG/JPEG, PNG และ PDF โดยตรวจจำนวน ชนิด และขนาดจาก config; บันทึก message กับ metadata ใน transaction เดียว; History ส่ง metadata ตราบที่ยังไม่หมดอายุ และ API ดาวน์โหลดจำกัดเฉพาะคู่สนทนาพร้อมปิดการเข้าถึงเมื่อเกิน retention โดยยังคงข้อความไว้
- ไฟล์ที่แก้สำหรับ T-06: `backend/app/config.py`, `backend/app/main.py`, `backend/app/models/chat_attachment.py`, `backend/app/repositories/chat_repository.py`, `backend/app/services/attachment_storage.py`, `backend/tests/test_chat_attachments.py`, `backend/requirements.txt`
- เพิ่ม tests สำหรับ AC-CHAT-02A/02B, 03A/03C/03D และ 08 รวมขนาดสูงสุด, rejection, retention boundary, ผู้ใช้นอกบทสนทนา, storage failure และ rollback ของ metadata; ใช้ฐานข้อมูลและ storage ชั่วคราวใน tests
- ผลทดสอบ: `cd backend && pytest -q` ผ่าน 29 tests; `git diff --check` ผ่าน; มี Starlette deprecation warning จากการใช้ `TestClient` แต่ไม่มี test failure
- ข้อจำกัด: ใช้ filesystem boundary ที่ตั้งค่าได้ผ่าน `CHAT_ATTACHMENT_STORAGE_DIR`; วิธี storage/backup สำหรับ production ยังไม่กำหนดใน Spec/plan; หลังพ้น 30 วัน API ปิดการดาวน์โหลดและซ่อน metadata แต่ไม่ได้ลบ bytes ทางกายภาพตามทางเลือกที่ CON-CHAT-04 อนุญาต
- ข้อสังเกตจากการทดสอบ: การ import app หลักทำให้ `backend/chat.db` และ Python `__pycache__` เปลี่ยนตามการสร้าง schema/cache; ไม่ใช้ restore/reset หรือทิ้งการเปลี่ยนแปลงใน working tree
- สถานะ T-06: เสร็จ รอทีมตรวจ; ไม่เริ่ม T-07

## 2026-11-13
- คำสั่ง: ตรวจและแก้ไขเฉพาะ T-06 ตาม Code Review ก่อนอนุมัติ
- การแก้ไข: ตรวจ signature ของ JPEG, PNG และ PDF ให้ตรงกับนามสกุลและ MIME ที่กำหนด; ปฏิเสธ MIME ที่ไม่ตรงรวมถึง `application/octet-stream`; ตรวจกรณีไม่มีไฟล์ก่อนอ่านรายการและตอบ HTTP 422
- ขอบเขตหมดอายุ: คงพฤติกรรมให้ดาวน์โหลดได้เมื่อครบ 30 วันพอดี เนื่องจาก AC-CHAT-03C ระบุ "ยังไม่เกิน 30 วัน" และ AC-CHAT-03D ระบุ "เกิน 30 วัน"; เพิ่มการตรวจว่าหลังขอบเขต 1 microsecond API ตอบ 410 และซ่อน metadata
- Failure handling: เมื่อบันทึกฐานข้อมูลล้มเหลว ระบบพยายามลบไฟล์; หากลบสำเร็จไฟล์ไม่ค้างและ API ตอบ 503 แบบไม่เปิดเผยรายละเอียด; หาก cleanup ล้มเหลว API ยังคงตอบ 503 แบบทั่วไปและบันทึกรายละเอียดใน server log แต่ไฟล์ orphan อาจคงอยู่ เพราะยังไม่มีข้อกำหนด cleanup/retry สำหรับกรณี storage ใช้งานไม่ได้
- ไฟล์ที่แก้ในรอบ Code Review: `backend/app/main.py`, `backend/tests/test_chat_attachments.py`, `specs/005-chat-roommate/tasks.md`, `prompt-log.md`
- ผลทดสอบ: `cd backend && PYTHONDONTWRITEBYTECODE=1 pytest -q` ผ่าน 34 tests; `git diff --check` ผ่าน; มี Starlette deprecation warning จาก `TestClient`
- สถานะ T-06 คงเป็น `เสร็จ รอทีมตรวจ`; ไม่แก้ Spec, ไม่เปลี่ยนสถานะ Task อื่น และไม่เริ่ม T-07

## 2026-11-13
- การอนุมัติ T-06: ผู้รับผิดชอบและผู้ตัดสินใจอนุมัติงาน Feature ยืนยันอนุมัติ T-06 แล้ว
- เปลี่ยนเฉพาะสถานะ T-06 ใน `specs/005-chat-roommate/tasks.md` จาก `เสร็จ รอทีมตรวจ` เป็น `เสร็จ`
- ตรวจ Dependency สำหรับ T-07: T-06 เป็น `เสร็จ`, T-07 เป็น `พร้อมทำ`; เริ่ม T-07 ตามขอบเขตใน tasks.md โดยไม่เริ่ม task ถัดไป

## 2026-11-13
- คำสั่ง: `/implement T-07 specs/005-chat-roommate/tasks.md`
- ขอบเขต: ทำเฉพาะ UI/API client สำหรับแนบไฟล์และแสดงไฟล์ในประวัติ ตาม AC-CHAT-02A, AC-CHAT-02B, AC-CHAT-03A, AC-CHAT-03C และ AC-CHAT-03D; ใช้ API contract ที่ทำเสร็จใน T-06 และ UI-CHT-01 เป็น reference โดยไม่แก้ mockup
- ผลการทำ: เพิ่ม multipart `FormData` ส่งไปยัง Backend; แสดงข้อความและไฟล์เป็นสำเร็จหลัง Backend ยืนยันและส่ง metadata ที่ถูกต้องเท่านั้น; ตรวจขนาดไฟล์จาก `CHAT_CONFIG`; แสดงเหตุผลจาก Backend เมื่อไม่รองรับ; แสดงลิงก์ดาวน์โหลดจาก API ในข้อความที่เกี่ยวข้อง และไม่แสดงลิงก์เมื่อ History API คืน attachment เป็น `null`
- ไฟล์ที่แก้: `frontend/src/api/client.js`, `frontend/src/pages/ChatPage.jsx`, `frontend/src/__tests__/chat-roommate-ui.test.jsx`, `frontend/src/api/client.test.js`, `specs/005-chat-roommate/tasks.md`, `prompt-log.md`
- ผลทดสอบ: `cd frontend && npm test` ผ่าน 46 tests; `cd frontend && npm run build` ผ่าน; `git diff --check` ตรวจหลังบันทึกผล
- ข้อจำกัด: การตรวจชนิดและ signature ของไฟล์ยังเป็นหน้าที่ Backend ตาม T-06; Frontend ส่งผ่าน API จริงใน production และใช้ fetch test doubles เฉพาะใน UI/API-client tests
- สถานะ T-07: เสร็จ รอทีมตรวจ; ไม่เริ่ม T-08

## 2026-11-13
- การอนุมัติ T-07: ผู้รับผิดชอบ Feature ตรวจรายงานและอนุมัติ T-07 แล้ว
- เปลี่ยนสถานะ T-07 ใน `specs/005-chat-roommate/tasks.md` จาก `เสร็จ รอทีมตรวจ` เป็น `เสร็จ`
- Preflight T-08: T-02, T-04 และไฟล์ที่กำหนดใน task พร้อมแล้ว; AC-CHAT-03B ต้องบันทึก Read แยกต่อข้อความ ส่วน AC-CHAT-07B ต้องปฏิเสธข้อความใหม่เมื่อสถานะค้นหาของผู้เข้าร่วมฝ่ายใดไม่พร้อม
- ประเด็นก่อน Implement: `ProfileEligibilityChecker` ปัจจุบันมีเพียง `can_start_chat(sender_id, recipient_id)` และไม่มี provider ถูกตั้งค่าใน app ปกติ จึงยังไม่มีสัญญาที่ระบุวิธีตรวจสถานะค้นหาของผู้เข้าร่วมทั้งสองฝ่ายสำหรับแชทเดิม; การบังคับ fail-closed จะกระทบเส้นทางส่งข้อความ/ไฟล์แนบและ tests ที่ใช้อยู่โดยไม่มี provider
- การดำเนินการ: หยุดก่อน Implement และรอคำตัดสินเรื่องแหล่งตรวจ eligibility/พฤติกรรมเมื่อไม่มี provider; คง T-08 เป็น `พร้อมทำ` และไม่เริ่ม T-09

## 2026-11-13
- คำตอบ/อนุมัติจากผู้รับผิดชอบ: ขยาย provider boundary ให้ตรวจ `is_searchable(user_id)` แยกต่อผู้ใช้; fail-closed เมื่อ provider หาย/ไม่พร้อม/ยืนยันไม่ได้; บังคับทั้ง API ส่งข้อความและไฟล์แนบ; ประวัติยังอ่านได้; อนุมัติแก้ Spec และ tests ที่ได้รับผลกระทบ โดยไม่สร้าง Authentication หรือ UC-04
- ปรับ `specs/005-chat-roommate/spec.md` เป็น Draft v4 โดยขยาย CON-CHAT-03 และ AC-CHAT-03B/07B พร้อมระบุ History/Read API contract ที่ T-09 จะใช้; ไม่เพิ่มหรือเปลี่ยน ID
- Implement T-08: เพิ่มสถานะ `is_read` ต่อข้อความและ migration แบบเพิ่มคอลัมน์ที่ไม่ rebuild/ลบประวัติเดิม; เพิ่ม `POST /api/chat/messages/{message_id}/read` ซึ่งอนุญาตเฉพาะผู้รับและแก้ทีละข้อความ; ส่ง `is_read` ใน History API
- เพิ่ม write gate ที่ตรวจผู้ส่งและผู้รับแยกกันทั้ง API ข้อความและไฟล์แนบ; ปฏิเสธ 403 เมื่อฝ่ายใดไม่ searchable และ 503 เมื่อไม่มี provider/provider แจ้ง unavailable/ผลไม่ใช่ boolean; GET ประวัติยังไม่ขึ้นกับ provider; คง demo mode เป็น read-only
- ไฟล์ที่แก้: `backend/app/main.py`, `backend/app/models/chat_message.py`, `backend/app/repositories/chat_repository.py`, `backend/app/services/chat_service.py`, `backend/app/services/chat_contact_provider.py`, `backend/tests/test_chat_backend_smoke.py`, `backend/tests/test_chat_start_access.py`, `backend/tests/test_chat_attachments.py`, `specs/005-chat-roommate/spec.md`, `specs/005-chat-roommate/tasks.md`, `prompt-log.md`
- ผลทดสอบ: `cd backend && PYTHONDONTWRITEBYTECODE=1 pytest -q` ผ่าน 46 tests; มี Starlette deprecation warning เรื่อง `httpx`/`TestClient` แต่ไม่มี test failure
- ผลตรวจ: `git diff --check` ผ่าน; ทดสอบ migration กับฐานข้อมูลเดิมบนฐานชั่วคราวและยืนยันว่าประวัติเดิมยังอ่านได้; ไม่แก้ tests `test_TC_*`
- ข้อจำกัด/ขอบเขต: adapter จริงจาก UC-04 ยังไม่เชื่อม; จนกว่าจะมี provider ที่ทำตาม contract API จะปฏิเสธการส่งแบบ fail-closed; T-09 ยังไม่เริ่ม โดย T-08 เปิดเผย `is_read` และ Read endpoint สำหรับ T-09 เท่านั้น
- สถานะ T-08: เสร็จ รอทีมตรวจ; หยุดก่อน T-09

## 2026-11-13
- การอนุมัติ T-08: ผู้รับผิดชอบ Feature ตรวจรายงานและอนุมัติ T-08 แล้ว
- เปลี่ยนสถานะ T-08 ใน `specs/005-chat-roommate/tasks.md` จาก `เสร็จ รอทีมตรวจ` เป็น `เสร็จ`
- Preflight T-09: dependency T-08 ได้รับอนุมัติ; AC-CHAT-03B ต้องส่ง Read เฉพาะข้อความที่อยู่ในหน้าจอ; AC-CHAT-07B ต้องอ่านประวัติเดิมได้แต่ปิด composer เมื่อสมาชิกคนใดไม่ searchable
- Blocker ที่พบก่อน Implement: `ChatListPage` เรียก `openChat` และเมื่อ API ตอบ `allowed=false` จะแสดงเหตุผลโดยไม่เรียก History API; component ยังไม่ส่ง `readOnly` ให้ `ChatPage`. พฤติกรรมนี้ตรงกับ Implementation interface clarification ของ T-03 แต่ขัดกับ AC-CHAT-07B สำหรับแชทเดิม
- ขอบเขต T-09 เดิมไม่มี `ChatListPage` หรือ Backend open-chat boundary; หยุดก่อน Implement เพื่อขออนุมัติแนวทางแก้ contract/ขอบเขต โดยไม่เริ่ม T-10 และคง T-09 เป็น `พร้อมทำ`
- ได้รับอนุมัติจากผู้รับผิดชอบให้ขยาย T-09 เฉพาะการเปิดแชทเดิมแบบ Read-only เพื่อให้ AC-CHAT-07B สอดคล้องกับ T-03
- ปรับ interface clarification ใน `specs/005-chat-roommate/spec.md`: API เปิดแชทต้องคืน `allowed` และ `read_only` ชัดเจน; ห้องเดิมที่มีประวัติและไม่มีสิทธิ์ส่งคืนค่าอ่านอย่างเดียว; ห้องใหม่ที่ไม่ผ่านเงื่อนไขยังถูกปฏิเสธและ Frontend ไม่เรียก History
- ขยายรายการไฟล์ T-09 ใน `specs/005-chat-roommate/tasks.md` ให้ครอบคลุม open-chat Backend, ChatListPage และ tests ที่เกี่ยวข้อง; คง ID เดิมและไม่เริ่ม T-10
- คำสั่ง: `/implement T-09 specs/005-chat-roommate/tasks.md`
- ผล Implement: `POST /api/chat/open` แยกแชทใหม่ที่ถูกปฏิเสธจากประวัติเดิมที่เปิดอ่านอย่างเดียวด้วย `read_only`; History ยังคงตรวจ identity ของผู้เข้าร่วม; Frontend ส่ง `readOnly` ให้ `ChatPage`, ซ่อน composer/ไฟล์แนบในโหมดนี้ และเรียก Read API เฉพาะข้อความขาเข้าที่ IntersectionObserver ระบุว่าอยู่ใน viewport
- Tests เพิ่ม/ปรับ: `test_AC_CHAT_07_new_disallowed_chat_does_not_create_room_or_allow_history`, `test_AC_CHAT_07B_existing_chat_is_read_only`, `test_AC_CHAT_07B_existing_history_opens_read_only_without_provider`, `test_AC_CHAT_03B_ui_marks_only_visible_message_read`, `test_AC_CHAT_07B_ui_loads_existing_history_read_only`; ปรับ API contract tests สำหรับ `read_only`
- ไฟล์ที่แก้: `backend/app/controllers/chat_controller.py`, `backend/app/main.py`, `backend/app/repositories/chat_repository.py`, `backend/app/services/chat_service.py`, `backend/tests/test_chat_start_access.py`, `backend/tests/test_chat_list.py`, `frontend/src/api/client.js`, `frontend/src/api/client.test.js`, `frontend/src/pages/ChatListPage.jsx`, `frontend/src/pages/ChatPage.jsx`, `frontend/src/__tests__/chat-roommate-ui.test.jsx`, `specs/005-chat-roommate/spec.md`, `specs/005-chat-roommate/tasks.md`, `prompt-log.md`
- ผลทดสอบสุดท้าย: `cd backend && PYTHONDONTWRITEBYTECODE=1 pytest -q` ผ่าน 48 tests (มี Starlette deprecation warning เรื่อง httpx/TestClient); `cd frontend && npm test` ผ่าน 50 tests; `cd frontend && npm run build` ผ่าน; `git diff --check` ผ่าน
- ข้อจำกัดคงเหลือ: Production Adapter จาก UC-04 ยังไม่เชื่อม จึงยังยืนยันไม่ได้ว่า contact provider จริงจะยังคืนผู้ติดต่อที่ปิดสถานะค้นหาแต่มีประวัติเดิมให้เลือก; บันทึกติดตามใน Integration/Verify
- สถานะ T-09: เสร็จ รอทีมตรวจ; ไม่เริ่ม T-10

## 2026-11-13
- การอนุมัติ T-09: ผู้รับผิดชอบ Feature ตรวจรายงานและอนุมัติ T-09 แล้ว
- เปลี่ยนสถานะ T-09 ใน `specs/005-chat-roommate/tasks.md` จาก `เสร็จ รอทีมตรวจ` เป็น `เสร็จ`
- Preflight T-10: dependency T-03, T-05, T-07 และ T-09 อยู่สถานะ `เสร็จ`; AC-CHAT-09/NFR-USE-01 กำหนดผู้ทดลองจริง 5 คนที่ไม่เคยใช้แชท และอย่างน้อย 4 คนต้องเปิดแชทและส่งข้อความสำเร็จโดยไม่รับคำแนะนำ
- ขอบเขต T-10 ระบุให้ทดสอบกับ UI ที่มีอยู่และไม่แตะ source/test เพิ่ม; ค้นหาแล้วไม่พบ automated test `test_AC_CHAT_09_usability_threshold` ใน Backend หรือ Frontend ซึ่งสอดคล้องกับการประเมินที่ต้องใช้คนจริง
- Blocker: ยังไม่มีผู้ทดลอง 5 คนหรือผลทดสอบจริงให้ประเมิน และ Integration ของ Authentication/UC-04 ยังไม่พร้อม; Demo Provider ที่มีอยู่เป็น read-only จึงใช้แทนการทดสอบส่งข้อความจริงไม่ได้
- ไม่สร้างผลจำลองหรือแก้โค้ด/Tests เพื่อทำให้ AC ผ่าน; เปลี่ยนสถานะ T-10 เป็น `รอผู้ทดลองจริง` และหยุดโดยไม่เริ่มงานอื่น
- ข้อจำกัด Production Adapter จาก UC-04 ยังคงต้องติดตามใน Integration/Verify

## 2026-11-13
- คำตอบทีมต่อ blocker T-10: ให้รอ Authentication/UC-04 และสภาพแวดล้อมทดสอบพร้อมก่อน; ไม่มีผู้ทดลองจริง 5 คน และห้ามใช้ Demo Provider, automated tests หรือผลจำลองแทน
- คงสถานะ T-10 เป็น `รอผู้ทดลองจริง`; ไม่สร้างผลทดสอบ/หลักฐาน ไม่ลด AC และไม่แก้โค้ดหรือ Tests
- เงื่อนไขกลับมาทำ T-10: มี environment ที่เชื่อม Authentication และ UC-04 จริง พร้อมผู้เริ่มต้นจริง 5 คน; แต่ละคนทดลองเปิดแชทและส่งข้อความโดยไม่มีคำแนะนำ แล้วบันทึกผลรวมจริงแบบไม่ระบุตัวตนเพื่อตรวจเกณฑ์อย่างน้อย 4/5
- งาน T-10 พักอยู่; ไม่เริ่ม Task ถัดไป