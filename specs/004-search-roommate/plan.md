# Plan v1: Align search roommate specification

## Problem and approach

ปรับ [spec.md](spec.md) จาก Draft v2 เป็น Draft v3 ให้สอดคล้องกับโปรไฟล์หาเมทและความต้องการหาเมท พร้อมทำกติกาการรวมเงื่อนไข การจัดอันดับ การแบ่งหน้า และข้อมูลที่เปิดเผยให้ชัดเจนและทดสอบได้

## Scope decisions

- โหมด `OR` แสดงโปรไฟล์ที่ตรงอย่างน้อยหนึ่งตัวกรอง และเรียงโปรไฟล์ตามจำนวนตัวกรองที่ตรงกันจากมากไปน้อย
- ตัวกรองพฤติกรรมการนอน ความสะอาด และเวลาเข้านอนเปรียบเทียบกับข้อมูลความต้องการหาเมทของเจ้าของโปรไฟล์
- การค้นหาใหม่เริ่มที่หน้า 1 ทุกครั้ง และแสดงผลหน้าละ 20 รายการ

## Tasks

1. ตรวจสอบฟิลด์ค้นหาและแหล่งข้อมูลให้สอดคล้องกับโปรไฟล์และความต้องการหาเมท
2. ปรับกติกา AND/OR การจัดอันดับ และกรณีไม่เลือกตัวกรอง
3. ปรับ pagination, การเริ่มหน้าใหม่ และข้อมูลที่เปิดเผยในรายละเอียดโปรไฟล์
4. ปรับ requirements, acceptance criteria, assumptions และ traceability ให้สอดคล้องกับ v3 และเพิ่มการอ้างอิง UI ID กับ mockup ของแต่ละหน้าจอให้ตรงกับหมวด "หน้าจอ (UI)" ใน spec.md:
   - UI-SRS-01: ค้นหาเมทและระบุเงื่อนไข — mockups/UI-SRS-01-search-filters.html / mockups/UI-SRS-01-search-filters.png
   - UI-SRS-02: รายการผลการค้นหาและแบ่งหน้า — mockups/UI-SRS-02-search-results.html / mockups/UI-SRS-02-search-results.png
   - UI-SRS-03: รายละเอียดโปรไฟล์เมท — mockups/UI-SRS-03-profile-detail.html / mockups/UI-SRS-03-profile-detail.png
   - UI-SRS-04: ยังไม่มีโปรไฟล์หาเมท — mockups/UI-SRS-04-no-roommate-profile.html / mockups/UI-SRS-04-no-roommate-profile.png
   - UI-SRS-05: ไม่พบผลการค้นหา — mockups/UI-SRS-05-no-search-results.html / mockups/UI-SRS-05-no-search-results.png
5. ตรวจ diff และ markdown consistency แล้ว commit เป็น `Draft v3`

## Notes and considerations

- ต้องไม่ทำให้การค้นหาเปิดเผยเบอร์โทรศัพท์
- ต้องไม่แสดงโปรไฟล์ของผู้ค้นหาเอง และต้องแสดงเฉพาะโปรไฟล์ที่เจ้าของเปิดสถานะ
- ต้องรักษาขอบเขตว่า UC-04 ใช้ข้อมูลที่มีอยู่ ไม่แก้ไขข้อมูลโปรไฟล์หรือความต้องการ
- ต้องไม่แก้ไฟล์ attachment แบบ read-only และต้องคงการเปลี่ยนแปลงที่ไม่เกี่ยวข้องใน working tree
