# Plan v1: Align roommate profile specification

## Problem and approach

ตรวจสอบและปรับ [spec.md](specs/001-roommate-profile/spec.md) ให้เป็นแหล่งอ้างอิงที่สอดคล้องกับสเปกของการแก้ไขโปรไฟล์ ความต้องการหาเมท และการค้นหาเมท โดยไม่ขยายขอบเขตไปสู่การพัฒนาโค้ดหรือแก้สเปกฟีเจอร์อื่นโดยไม่จำเป็น

## Tasks

1. ตรวจสอบความสอดคล้องของข้อมูลโปรไฟล์และ validation rules กับสเปกที่เกี่ยวข้อง
2. ปรับ requirements, assumptions, open questions และ acceptance criteria ให้ระบุสถานะเผยแพร่และข้อมูลที่นำไปค้นหาได้ชัดเจน
3. ปรับ traceability ให้ครอบคลุมข้อกำหนดและ acceptance criteria ที่เพิ่มหรือแก้ไข
4. ตรวจ diff และ markdown consistency
5. Commit การเปลี่ยนแปลงของสเปกโปรไฟล์เป็น `Draft v3`

## Notes and considerations

- แยก “พฤติกรรมการนอนของเจ้าของโปรไฟล์” ออกจาก “ความต้องการเกี่ยวกับพฤติกรรมของเมท” ให้ไม่ซ้ำหรือขัดกับ UC-03
- ระบุว่าการสร้างโปรไฟล์สำเร็จไม่ทำให้โปรไฟล์ค้นพบได้ทันที แต่เจ้าของต้องเปิดสถานะก่อน
- ตรวจให้ required/optional fields และกฎ validation ตรงกับสเปกแก้ไขโปรไฟล์
- ไม่แก้ไขไฟล์ที่อยู่นอกขอบเขต และคงการเปลี่ยนแปลงเดิมใน working tree
