# Integration Contract Checklist — Feature 006

เอกสารนี้รวบรวมข้อกำหนดและรายการที่ต้องยืนยันก่อนเชื่อม Feature 006 กับ Feature อื่น
อ้างอิง spec เจ้าของข้อมูลเป็นแหล่งความจริง และไม่กำหนด endpoint, payload, schema,
รูปแบบ ID หรือสถานะเพิ่มเติมจากที่ spec ระบุ

## วิธีอ่านสถานะ

- **CONFIRMED** — พฤติกรรมหรือข้อมูลนี้ระบุไว้ใน spec แล้ว ไม่ได้หมายความว่าเจ้าของยืนยัน API contract แล้ว
- **PENDING** — ต้องให้เจ้าของ Feature ยืนยันความหมายหรือข้อตกลงการเชื่อมต่อ
- **BLOCKED** — ยังเชื่อมต่อหรือยืนยันผลจริงไม่ได้ เพราะไม่มี contract หรือระบบจริงที่จำเป็น

สถานะในเอกสารนี้อิงหลักฐานจาก spec และ source code ที่มีใน repository ปัจจุบัน
การเปลี่ยน PENDING/BLOCKED เป็น CONFIRMED ต้องมีหลักฐานการยืนยันจากเจ้าของ Feature

## สรุปสถานะ

| Contract | เจ้าของ Requirement/เหตุการณ์ตาม spec | Provider owner (ถ้ามี) | สถานะ Integration | หลักฐาน |
|---|---|---|---|---|
| Authentication | ยังไม่พบ Feature เจ้าของ Authentication โดยเฉพาะ | — | **PENDING** | spec กำหนดว่าต้องเข้าสู่ระบบ แต่ไม่กำหนดวิธีตรวจสอบหรือ ID contract |
| Profile | Feature 001; การแก้ไขสถานะอยู่ใน Feature 002/010 | — | **PENDING** | กำหนดเจ้าของและการเปิดค้นหา แต่ยังไม่มี ID mapping และคำศัพท์สถานะกลาง |
| Search | Feature 004 | — | **PENDING** | กำหนดเงื่อนไขการค้นหา/เลือกโปรไฟล์ แต่ไม่กำหนด result contract |
| Match | Feature 007 เปลี่ยนผลตอบรับเป็นจับคู่สำเร็จ; Feature 008 แสดงสถานะ; Feature 009 ยกเลิก | — | **BLOCKED** | ไม่มี Match data contract หรือ checker จริงให้ Feature 006 ใช้ |
| Cancellation | Feature 009; Feature 008 แสดงสถานะคำขอ | — | **BLOCKED** | พฤติกรรมยกเลิกระบุไว้ แต่ไม่มี contract สำหรับตรวจผลหลังยกเลิก |
| Notification | Feature 006/007/009/010 เป็นเจ้าของ Requirement/เหตุการณ์ | ยังไม่ทราบ | **BLOCKED** | มี internal protocol และ retry logic แต่ไม่มี Notification provider จริง |
| Backend/Database | ไม่ได้ระบุเจ้าของกลางใน spec | — | **BLOCKED** | ไม่มี API runtime หรือ persistence ถาวรที่ Feature 006 ใช้ร่วมได้ |

## 1. Authentication — current user

- **เจ้าของ:** ยังไม่พบ Feature ที่เป็นเจ้าของ Authentication โดยเฉพาะ
- **CONFIRMED ใน spec:** ต้องเข้าสู่ระบบก่อนส่งคำขอหรือจัดการข้อมูลที่เกี่ยวข้อง
  ([001: CON-AUTH-01](../001-roommate-profile/spec.md),
  [004: CON-SRS-01](../004-search-roommate/spec.md),
  [006: CON-RRS-01, NFR-RRS-01](./spec.md),
  [007: CON-SRR-01](../007-respond-roommate-request/spec.md),
  [008: CON-MSS-01](../008-match-status/spec.md),
  [009: CON-CCM-01](../009-cancle-match/spec.md),
  [010: CON-CRS-01](../010-close-roommate-status/spec.md))
- **ข้อมูลที่ Feature 006 ต้องใช้:** ตัวตนของผู้ส่งที่ผ่านการตรวจสอบแล้ว เพื่อใช้เป็นผู้กระทำการส่งคำขอ
- **PENDING — เจ้าของต้องยืนยัน:** วิธีตรวจสอบตัวตน, วิธีรับ current user จาก Backend และความหมายของ user/student ID
- **หลักฐานในโค้ด:** [RequestGuard](../../backend/app/validators/request_guard.py)
  รองรับ checker ที่ inject เข้ามา แต่ไม่ใช่ Authentication implementation จริง
- **ความเสี่ยง:** การเชื่อ ID ที่ Frontend ส่งมา หรือใช้ ID คนละ namespace อาจทำให้ส่งคำขอแทนผู้อื่น
- **สถานะ:** **PENDING**

## 2. Profile — profile, owner และสถานะหาเมท

- **เจ้าของ:** Feature 001 เป็นเจ้าของ Profile; Feature 002 แก้ไขสถานะเปิดค้นหา;
  Feature 010 ปิด/เปิดสถานะหาเมท
- **CONFIRMED ใน spec:** ผู้ใช้หนึ่งคนมีโปรไฟล์ได้หนึ่งโปรไฟล์ตาม ASM-02 ของ Feature 001;
  โปรไฟล์เริ่มต้นไม่เปิดให้ค้นหา และเจ้าของเป็นผู้เปิดสถานะ
  ([001: CON-DISCOVER-01, FR-RMP-11](../001-roommate-profile/spec.md),
  [002: CON-ERP-07, FR-ERP-09](../002-edit-roommate-profile/spec.md),
  [010: CON-CRS-04, CON-CRS-05, CON-CRS-06, FR-CRS-05, FR-CRS-06, FR-CRS-07](../010-close-roommate-status/spec.md))
- **ข้อมูลที่ Feature 006 ต้องใช้:** โปรไฟล์ที่เลือก, ผู้ใช้เจ้าของโปรไฟล์ และสถานะล่าสุดที่ใช้ตัดสินว่าผู้รับหาเมทอยู่
  ทั้งนี้ชื่อฟิลด์ ชนิดข้อมูล และความสัมพันธ์ ID ยังไม่ได้กำหนด
- **PENDING — เจ้าของต้องยืนยัน:** การเชื่อม profile ID กับ owner user ID และค่าสถานะ canonical
- **ประเด็นที่ต้องตกลง:** Feature 001 ใช้ “ไม่เปิด” ส่วน Feature 010 ใช้ “กำลังหาเมท/ไม่กำลังหาเมท”;
  Feature 006 ระบุเพียง “สถานะหาเมท” จึงยังห้ามสมมติ mapping เอง
- **ความเสี่ยง:** สถานะหรือ ID ที่แปลความหมายต่างกันอาจทำให้ส่งคำขอไปยังโปรไฟล์ผิดคนหรือปิดสถานะแล้วแต่ยังรับคำขอได้
- **สถานะ:** **PENDING**

## 3. Search — ผลค้นหาจาก Feature 004

- **เจ้าของ:** Feature 004
- **CONFIRMED ใน spec:** ผลค้นหาแสดงเฉพาะโปรไฟล์ที่เจ้าของเปิดสถานะ ไม่แสดงโปรไฟล์ผู้ค้นหาเอง
  และผู้ใช้เลือกโปรไฟล์ที่สนใจได้; เบอร์โทรศัพท์ไม่เปิดเผยในโปรไฟล์ที่ดู
  ([004: CON-SRS-06, CON-SRS-07, FR-SRS-06, AC-SRS-04](../004-search-roommate/spec.md),
  [006: FR-RRS-01](./spec.md))
- **ข้อมูลที่ Feature 006 ต้องใช้:** การอ้างอิงโปรไฟล์ที่เลือกซึ่งทำให้ตรวจเจ้าของและสถานะล่าสุดได้
- **PENDING — เจ้าของต้องยืนยัน:** รูปแบบผลค้นหา, ตัวระบุที่ส่งต่อเมื่อเลือกโปรไฟล์ และวิธีรับสถานะล่าสุด
  โดยไม่กำหนด payload หรือชื่อฟิลด์ในเอกสารนี้
- **ความเสี่ยง:** profile ID อาจไม่ใช่ user ID; สถานะจากผลค้นหาที่ไม่ใช่ข้อมูลล่าสุดอาจทำให้คำขอไม่ถูกต้อง
- **สถานะ:** **PENDING**

## 4. Match — การตรวจ Match ที่ยัง active

- **เจ้าของที่เกี่ยวข้อง:** Feature 007 เปลี่ยนผลตอบรับเป็น “จับคู่สำเร็จ”;
  Feature 008 แสดงสถานะ; Feature 009 ยกเลิก Match
- **CONFIRMED ใน spec:** Feature 006 ห้ามส่งคำขอใหม่เมื่อมีการจับคู่สำเร็จจนกว่าจะยกเลิก
  ([006: CON-RRS-12, AC-RRS-13A](./spec.md));
  การตอบรับทำให้จับคู่สำเร็จ ([007: FR-SRR-05](../007-respond-roommate-request/spec.md));
  การยกเลิกต้องตรวจสมาชิกและสถานะอย่าง atomic ([009: CON-CCM-06, FR-CCM-13](../009-cancle-match/spec.md))
- **ข้อมูลที่ Feature 006 ต้องใช้:** คู่ผู้ใช้ที่ต้องตรวจ และผลการตรวจที่แยกได้ว่า Match ยัง active,
  ไม่มี Match active หรือไม่สามารถตรวจสอบได้ รูปแบบผลลัพธ์ยังไม่ได้กำหนด
- **BLOCKED:** ไม่พบ Match data contract หรือ checker จริงที่ Feature 006 เรียกใช้ได้
  ในโค้ด [RequestRoommateService](../../backend/app/services/request_roommate_service.py)
  รับ checker แบบ optional; เมื่อไม่มี contract ระบบปฏิเสธการส่งคำขอ
- **PENDING — เจ้าของต้องยืนยัน:** แหล่งข้อมูล authoritative, นิยาม “active”,
  วิธีค้นคู่ผู้ใช้ และผลเมื่อ Match service ใช้งานไม่ได้
- **ความเสี่ยง:** การถือว่า “ตรวจไม่ได้” คือ “ไม่มี Match” อาจอนุญาตคำขอผิดเงื่อนไข;
  สถานะ Request กับ Match อาจถูกปะปนกัน
- **สถานะ:** **BLOCKED**

## 5. Cancellation — ผลหลังยกเลิก Match

- **เจ้าของ:** Feature 009 เป็นเจ้าของการยกเลิก; Feature 008 เป็นเจ้าของการแสดงสถานะคำขอ
- **CONFIRMED ใน spec:** Feature 009 เปลี่ยน Match เป็น “ยกเลิก” แบบ atomic,
  แสดงสถานะยกเลิกให้ทั้งสองฝ่าย และอนุญาตให้ส่งคำขอหาคู่เดิมใหม่ได้เมื่อทั้งสองฝ่ายเปิดสถานะ
  ([009: FR-CCM-06, FR-CCM-09, FR-CCM-12, FR-CCM-13](../009-cancle-match/spec.md))
- **ข้อมูลที่ Feature 006 ต้องใช้:** ผลตรวจว่าหลัง cancellation แล้วมี Match active ระหว่างคู่นั้นหรือไม่
  โดยไม่กำหนดว่าเป็น record หรือ status field แบบใด
- **BLOCKED:** ไม่มี cancellation data contract ให้ Feature 006 ตรวจสอบผลจริงได้
- **PENDING — เจ้าของต้องยืนยัน:** ผลที่ Feature 006 ควรได้รับหลังยกเลิก และความแตกต่างระหว่าง
  “Match ถูกยกเลิก” กับ “คำขอถูกยกเลิก”
- **ประเด็นข้าม Feature:** Feature 008 ซ่อนรายการคำขอสถานะ “ยกเลิก”
  ([008: CON-MSS-06](../008-match-status/spec.md))
  ขณะที่ Feature 009 ระบุให้ทั้งสองฝ่ายเห็นสถานะ “ยกเลิก”; ต้องยืนยันว่าเป็นสถานะคนละชนิดหรือมีการแสดงผลคนละบริบท
- **สถานะ Request และ Match ตาม spec (ยังไม่มี mapping กลาง):**

  | ข้อมูล | สิ่งที่ระบุใน spec | อ้างอิง |
  |---|---|---|
  | Request ใน Feature 006 | สถานะคำขอ: “รอการตอบรับ”, “ตอบรับ”, “ปฏิเสธ” และ “ยกเลิก” | [FR-RRS-11](./spec.md) |
  | Request ที่แสดงใน Feature 008 | แสดง “รอการตอบรับ”, “จับคู่สำเร็จ” หรือ “ปฏิเสธ”; รายการคำขอสถานะ “ยกเลิก” ไม่แสดง | [FR-MSS-03, CON-MSS-06](../008-match-status/spec.md) |
  | Match ใน Feature 009 | เมื่อยกเลิกการจับคู่ ให้เปลี่ยนสถานะการจับคู่เป็น “ยกเลิก” | [FR-CCM-06](../009-cancle-match/spec.md) |

  spec เหล่านี้ไม่ได้กำหนด mapping ระหว่างสถานะ Request กับสถานะ Match;
  ต้องให้เจ้าของ Feature ยืนยันก่อนเชื่อม โดยไม่อนุมานว่าสถานะชื่อเดียวกันเป็นข้อมูลชนิดเดียวกัน
- **ความเสี่ยง:** หากไม่มีนิยามร่วม Feature 006 อาจยังมองคู่เดิมว่า active หรืออนุญาตส่งซ้ำก่อนยกเลิกสำเร็จ
- **สถานะ:** **BLOCKED**

## 6. Notification — การส่งแจ้งเตือนและผลลัพธ์

- **เจ้าของ Requirement/เหตุการณ์:** Feature 006 สำหรับคำขอใหม่; Feature 007 สำหรับผลตอบรับ;
  Feature 009 สำหรับ cancellation; Feature 010 สำหรับการปฏิเสธคำขอเมื่อปิดสถานะ
- **Notification Provider Owner:** ยังไม่ทราบจาก spec หรือ source code ที่ตรวจ
- **CONFIRMED ใน spec:** Feature 006 ต้องแจ้งชื่อผู้ส่ง รูปโปรไฟล์ และเวลาที่ส่ง;
  เมื่อแจ้งเตือนล้มเหลว คำขอยังคง “รอการตอบรับ” พร้อมสถานะล้มเหลว และต้อง retry
  ([006: FR-RRS-06, FR-RRS-12, FR-RRS-13, FR-RRS-16, AC-RRS-11A](./spec.md)).
  Feature 007 และ 009 กำหนด in-system และ push notification
  ([007: FR-SRR-07, FR-SRR-16](../007-respond-roommate-request/spec.md),
  [009: FR-CCM-10, FR-CCM-15](../009-cancle-match/spec.md))
- **ข้อมูลที่ต้องใช้:** ผู้รับแจ้งเตือน, รายละเอียดผู้ส่ง/คำขอที่ spec ระบุ และผลส่งสำเร็จหรือล้มเหลว;
  รูปแบบข้อมูลและผลตอบกลับยังไม่ได้กำหนด
- **PENDING — เจ้าของต้องยืนยัน:** ช่องทางที่ Feature 006 ใช้, รูปแบบผลส่ง/ข้อผิดพลาด
  และความหมายจำนวน retry ให้ตรงกันทุก Feature
- **Retry logic ในโค้ด:** [NotificationRetryService](../../backend/app/services/notification_retry_service.py)
  ใช้ค่า [MAX_NOTIFICATION_RETRIES](../../backend/app/config.py) เท่ากับ 3;
  วนเรียก service ได้สูงสุด 4 ครั้ง (ครั้งแรกและ retry อีกไม่เกิน 3 ครั้ง)
- **ข้อจำกัดการส่งจริง:** retry logic เรียก NotificationService ที่ถูก inject เท่านั้น
  ไม่ได้เป็น provider หรือหลักฐานว่ามีการส่ง notification จริง; ยังไม่พบ provider จริงใน repository
- **ข้อจำกัดของ NullNotificationService:** เป็น placeholder ที่ถูกใช้เป็นค่าเริ่มต้นใน
  [RequestRoommateService](../../backend/app/services/request_roommate_service.py);
  มันคืน `success=True` แม้ข้อความระบุว่าไม่ได้ configure จึงอาจทำให้คำขอถูกทำเครื่องหมายว่าส่งแล้ว
  โดยไม่มีการส่งจริง และไม่เกิด retry
- **Internal contract ในโค้ด:** [NotificationService](../../backend/app/services/notification_service.py)
  เป็น Protocol ภายใน และ `NotificationResult` มี `success`, `message`, `attempts`, `request_id`;
  สิ่งนี้ยังไม่ใช่ shared contract ที่ Provider Owner ยืนยัน
- **สถานะการเชื่อมต่อ:** **BLOCKED** จนกว่าจะมี Provider Owner และ provider จริง;
  รายละเอียด shared contract ยังคง **PENDING**
- **ความเสี่ยง:** การนับ retry ไม่ตรงกันอาจทำให้จำนวนส่งรวมต่างกัน และการถือผล placeholder ว่าส่งสำเร็จจะซ่อนการแจ้งเตือนที่ไม่เกิดขึ้นจริง

## 7. Backend/Database — API และ persistence

- **เจ้าของ:** ไม่ได้ระบุเจ้าของ Backend runtime, API หรือ Database กลางใน spec
- **CONFIRMED ใน spec:** Feature 006 ต้องตรวจสถานะผู้รับและคำขอเดิมแบบ atomic
  และป้องกัน pending ซ้ำ ([006: CON-RRS-11, NFR-RRS-05, AC-RRS-06A, AC-RRS-06B](./spec.md));
  Feature 007 กำหนด atomic response transition ([007: CON-SRR-08, FR-SRR-14](../007-respond-roommate-request/spec.md));
  Feature 009 กำหนด atomic cancellation ([009: CON-CCM-06, FR-CCM-13](../009-cancle-match/spec.md));
  Feature 010 กำหนด atomic การปิดสถานะพร้อมปฏิเสธคำขอที่รอ ([010: CON-CRS-11](../010-close-roommate-status/spec.md))
- **ข้อมูลที่ต้องรองรับ:** การสร้าง/อ่านคำขอและตรวจเงื่อนไขที่กล่าวใน spec;
  endpoint, method, payload, schema, error format และ persistence technology ไม่ได้ระบุ
- **BLOCKED:** มี [RoommateRequestController](../../backend/app/controllers/roommate_request_controller.py)
  และ repository แบบ in-memory ([roommate_request_repository.py](../../backend/app/repositories/roommate_request_repository.py))
  แต่ไม่พบ runtime/route ที่เชื่อมเป็น API หรือ persistence ถาวร
- **PENDING — เจ้าของต้องยืนยัน:** เจ้าของ runtime/store, รูปแบบ API และกลไกที่รับประกัน atomicity
  ตามข้อกำหนดข้าม Feature
- **ความเสี่ยง:** หากตรวจแล้วค่อยบันทึกโดยไม่มี atomic guarantee อาจเกิดคำขอซ้ำหรือสถานะบางส่วนถูกบันทึก;
  ID/status คนละความหมายทำให้การเชื่อมข้อมูลผิดรายการ
- **สถานะ:** **BLOCKED**

## รายการยืนยันจากเจ้าของ Feature

| Contract | เจ้าของ Requirement/เหตุการณ์ | Provider owner | ผู้ยืนยัน / หลักฐาน | สถานะ |
|---|---|---|---|---|
| Authentication | ทีม/Feature Authentication (ยังไม่ระบุ) | — | ยังไม่มี | PENDING |
| Profile | Feature 001/002/010 | — | ยังไม่มี | PENDING |
| Search | Feature 004 | — | ยังไม่มี | PENDING |
| Match | Feature 007/008/009 | — | ยังไม่มี Match data contract | BLOCKED |
| Cancellation | Feature 008/009 | — | ยังไม่มี cancellation data contract | BLOCKED |
| Notification Event | Feature 006/007/009/010 ตามเหตุการณ์ | ยังไม่ทราบ | ยังไม่มี | PENDING |
| Notification Provider | ยังไม่ทราบ | ยังไม่ทราบ | ยังไม่มี provider จริง | BLOCKED |
| Backend/Database | ยังไม่ระบุ | — | ยังไม่มี runtime/persistence contract | BLOCKED |
