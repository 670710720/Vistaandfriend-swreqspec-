# Tasks: สร้างโปรไฟล์หาเมท
- Feature: สร้างโปรไฟล์หาเมท (Create Roommate Profile)
- Spec ID: SPEC-RMP-001
- อ้างอิง: [plan.md](./plan.md)
- วันที่: 2026-11-20

สรุป:
- มี 5 เฟส รวม 16 task
- Q-05 ตอบแล้ว; T-13 และ T-14 ทำตามสัญญา API ที่ทีมยืนยัน
- การตรวจ integration ว่าผลค้นหา UC-04 เปลี่ยนตามสถานะยังต้องทำแยก โดยไม่แก้ระบบค้นหาใน task นี้
- เฟสแรกที่ลองสร้างและส่งโปรไฟล์ได้คือเฟส 2 หลังเฟสฐานข้อมูลและ API เสร็จ และรายละเอียดระบบยืนยันตัวตน/จัดเก็บรูปได้รับการกำหนด

ลำดับงานในไฟล์นี้เป็นฐานข้อมูล → API → หน้าจอ ตามที่ทีมระบุ โดยส่วนหน้าจอเดิมเป็นงานที่มีอยู่แล้วและรอทีมตรวจ ไม่ได้หมายความว่าเชื่อมต่อ backend แล้ว

## เฟส 0: ฐานข้อมูลโปรไฟล์

### T-01 เตรียมการเชื่อมต่อ SQLite
- รองรับ: FR-RMP-08, CON-DATA-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-02
- ไฟล์ที่แตะ: `backend/app/database.py`, `backend/app/main.py`, `backend/tests/test_database.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: แอปสร้างการเชื่อมต่อ SQLite และเปิด session สำหรับงานโปรไฟล์ได้ โดย test การเชื่อมต่อผ่าน
- สถานะ: เสร็จ

### T-02 สร้างโมเดลข้อมูลโปรไฟล์และสถานะเริ่มต้น
- รองรับ: FR-RMP-03, FR-RMP-04, FR-RMP-08, FR-RMP-11, CON-PROFILE-01, CON-DATA-01, CON-DISCOVER-01
- ตรวจด้วย: AC-RMP-05B
- ไฟล์ที่แตะ: `backend/app/models/roommate_profile.py`, `backend/app/database.py`, `backend/tests/test_roommate_profile_model.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: โมเดลแทนข้อมูลโปรไฟล์และเจ้าของตาม plan ได้ และโปรไฟล์ใหม่มีสถานะเริ่มต้น "ไม่เปิด" โดยไม่กำหนดวิธีเก็บรูปแทนทีม
- สถานะ: เสร็จ

#### จุดตรวจเฟส 0
- test ที่ต้องผ่านทั้งหมด: `cd backend && pytest -v` รวม `test_database.py` และ `test_roommate_profile_model.py`
- เปิดระบบ: `cd backend && uvicorn app.main:app --reload`
- คนลองเองตาม FR-RMP-08:
  Given ฐานข้อมูล SQLite พร้อมใช้งาน
  When เริ่มแอป backend และตรวจการเชื่อมต่อฐานข้อมูล
  Then backend เชื่อมต่อ SQLite ได้และโมเดลโปรไฟล์พร้อมใช้งาน
- ยังขาด: T-02 ยืนยันโมเดลและสถานะเริ่มต้นเท่านั้น; การบันทึกผ่าน API และผลลัพธ์การค้นหายังไม่อยู่ในเฟส 0

## เฟส 1: API สร้างและตรวจสอบโปรไฟล์

### T-03 รวมกฎข้อมูลโปรไฟล์ไว้ใน backend config
- รองรับ: FR-RMP-03, FR-RMP-04, FR-RMP-05, CON-DATA-01, CON-VALID-01, CON-ROOM-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-04
- ไฟล์ที่แตะ: `backend/app/config.py`, `backend/tests/test_profile_config.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: ค่าจากตาราง "ค่าที่ตั้งได้" ใน plan.md อยู่ใน config พร้อมคอมเมนต์อ้าง ID โดยไม่มีค่าซ้ำฝังใน validation
- สถานะ: เสร็จ

### T-04 ตรวจข้อมูลที่ส่งเข้า API ก่อนสร้างโปรไฟล์
- รองรับ: FR-RMP-05, FR-RMP-06, FR-RMP-07, CON-DATA-01, CON-VALID-01, CON-REL-01, CON-ROOM-01
- ตรวจด้วย: AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A
- ไฟล์ที่แตะ: `backend/app/roommate_profiles.py`, `backend/app/config.py`, `backend/tests/test_roommate_profile_validation.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: API ปฏิเสธข้อมูลที่ขาดหรือผิดตาม spec, ส่งรายละเอียด validation ให้หน้าจอได้ และ validation tests ของ AC-RMP-02A/03/04/04A ผ่าน
- สถานะ: เสร็จ

### T-05 บันทึกโปรไฟล์แบบ atomic และป้องกันข้อมูลซ้ำจากการลองใหม่
- รองรับ: FR-RMP-08, FR-RMP-09, FR-RMP-11, CON-REL-01, CON-DISCOVER-01, NFR-REL-01
- ตรวจด้วย: AC-RMP-05, AC-RMP-05A, AC-RMP-05B
- ไฟล์ที่แตะ: `backend/app/roommate_profiles.py`, `backend/app/models/roommate_profile.py`, `backend/tests/test_roommate_profile_api.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02, T-04
- เสร็จเมื่อ: ข้อมูลที่ผ่าน validation ถูกบันทึกให้เจ้าของ พร้อมสถานะเริ่มต้น "ไม่เปิด"; กรณีบันทึกล้มเหลวไม่เหลือข้อมูลบางส่วน และการลองใหม่สำเร็จแล้วมีโปรไฟล์เดียว
- สถานะ: เสร็จ

### T-06 ตรวจตัวตนเจ้าของและการมีโปรไฟล์เดิมใน API
- รองรับ: FR-RMP-01, FR-RMP-08, CON-AUTH-01, CON-PROFILE-01, NFR-SEC-01
- ตรวจด้วย: AC-RMP-01A
- ไฟล์ที่แตะ: `backend/app/roommate_profiles.py`, `backend/app/main.py`, `backend/tests/test_roommate_profile_auth.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02, T-05
- เสร็จเมื่อ: API ผูกโปรไฟล์กับนักศึกษาที่ผ่านการยืนยันตัวตนและปฏิเสธการสร้างโปรไฟล์ที่สอง โดยไม่รับ student_id จากข้อมูลที่ผู้ใช้กำหนดเอง
- สถานะ: เสร็จ (ใช้ `request.state.user_id` จาก trusted middleware; production provider ยังไม่เชื่อม)

#### จุดตรวจเฟส 1
- test ที่ต้องผ่านทั้งหมด: `cd backend && pytest -v` รวม tests ของ T-03 ถึง T-06
- เปิดระบบ: `cd backend && uvicorn app.main:app --reload`
- คนลองเองตาม AC-RMP-05:
  Given ส่งข้อมูลโปรไฟล์ที่ครบและถูกต้องผ่าน API ด้วยตัวตนที่ผ่านการยืนยัน
  When เรียก API สร้างโปรไฟล์
  Then backend บันทึกโปรไฟล์และส่งผลการสร้างสำเร็จ
- หมายเหตุ: T-02/T-06 และรูปแบบรับ/จัดเก็บรูปมี implementation แล้ว; ก่อนใช้งาน production ต้องเชื่อม trusted upstream authentication provider ที่เติม `request.state.user_id`

## เฟส 2: หน้าจอสร้างและตรวจข้อมูลโปรไฟล์

### T-07 ตรวจรับหน้าจอ แบบฟอร์ม validation และ tests ที่มีอยู่
- รองรับ: FR-RMP-01, FR-RMP-02, FR-RMP-03, FR-RMP-04, FR-RMP-05, FR-RMP-06, FR-RMP-07
- ตรวจด้วย: AC-RMP-01, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A
- ไฟล์ที่แตะ: `frontend/src/App.jsx`, `frontend/src/profileValidation.js`, `frontend/src/config.js`, `frontend/src/__tests__/profile-form.test.jsx`, `frontend/src/__tests__/setup.test.jsx`
- แบบหน้าจอ: ไม่มี mockup; ไม่มี UI ID ใน spec
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: โค้ดหน้าจอและ tests เดิม 8 tests ผ่านการตรวจรับจากทีม; งานนี้ยังไม่ถือว่าเชื่อม API หรือได้รับการอนุมัติข้อกำหนด
- สถานะ: เสร็จ

### T-08 ปรับตัวเลือกพฤติกรรมการนอนให้ตรงคำตอบ Q-06
- รองรับ: FR-RMP-04, CON-DATA-01, CON-VALID-01
- ตรวจด้วย: AC-RMP-02, AC-RMP-02A
- ไฟล์ที่แตะ: `frontend/src/App.jsx`, `frontend/src/profileValidation.js`, `frontend/src/config.js`, `frontend/src/__tests__/profile-form.test.jsx`
- แบบหน้าจอ: ไม่มี mockup; ไม่มี UI ID ใน spec
- ต้องทำหลัง: T-07
- เสร็จเมื่อ: มีตัวเลือก "อื่น ๆ" ซึ่งต้องกรอกคำอธิบายเมื่อเลือก และเลือก "ไม่มีพฤติกรรมดังกล่าว" ร่วมกับตัวเลือกอื่นไม่ได้ โดย tests ยืนยันกฎจาก Q-06
- สถานะ: เสร็จ

### T-09 เชื่อมการยืนยันแบบฟอร์มกับ API สร้างโปรไฟล์
- รองรับ: FR-RMP-08, FR-RMP-09, CON-AUTH-01
- ตรวจด้วย: AC-RMP-05
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/App.jsx`, `frontend/src/__tests__/profile-form.test.jsx`
- แบบหน้าจอ: ไม่มี mockup; ไม่มี UI ID ใน spec
- ต้องทำหลัง: T-05, T-06, T-08
- เสร็จเมื่อ: หน้าจอส่งข้อมูลผ่าน API จริงและแสดงผลสำเร็จเมื่อ API บันทึกโปรไฟล์สำเร็จ โดย test ใช้ client จำลอง
- สถานะ: เสร็จ รอทีมตรวจ

### T-10 แสดง validation errors และให้ลองส่งข้อมูลใหม่
- รองรับ: FR-RMP-05, FR-RMP-06, FR-RMP-07, FR-RMP-08, CON-DATA-01, CON-VALID-01, CON-REL-01, CON-ROOM-01, NFR-REL-01
- ตรวจด้วย: AC-RMP-03, AC-RMP-04, AC-RMP-04A, AC-RMP-05A
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/App.jsx`, `frontend/src/__tests__/profile-form.test.jsx`
- แบบหน้าจอ: ไม่มี mockup; ไม่มี UI ID ใน spec
- ต้องทำหลัง: T-04, T-05, T-08
- เสร็จเมื่อ: หน้าจอแสดงข้อผิดพลาดจาก API ที่ช่องที่เกี่ยวข้อง ไม่แสดงผลสำเร็จเมื่อบันทึกผิดพลาด และให้ลองส่งใหม่ได้โดยไม่แสดงความสำเร็จซ้ำหรือสร้างโปรไฟล์ซ้ำ
- สถานะ: เสร็จ รอทีมตรวจ

### T-11 แสดงผลเมื่อมีโปรไฟล์แล้วและนำผู้ใช้ที่ยังไม่เข้าสู่ระบบไปหน้าเข้าสู่ระบบ
- รองรับ: FR-RMP-01, FR-RMP-02, CON-AUTH-01, CON-PROFILE-01, NFR-SEC-01
- ตรวจด้วย: AC-RMP-01A
- ไฟล์ที่แตะ: `backend/app/roommate_profiles.py`, `backend/tests/test_roommate_profile_auth.py`, `frontend/src/api/client.js`, `frontend/src/api/client.test.js`, `frontend/src/App.jsx`, `frontend/src/__tests__/setup.test.jsx`, `frontend/src/__tests__/profile-form.test.jsx`
- แบบหน้าจอ: ไม่มี mockup; ไม่มี UI ID ใน spec
- ต้องทำหลัง: T-06, T-09
- เสร็จเมื่อ: API `GET /api/roommate-profiles/me` คืน `{hasProfile: boolean}` สำหรับ identity ที่ยืนยันแล้วและ 401 เมื่อไม่มี identity; เมนูไม่เปิดแบบฟอร์มเมื่อมีโปรไฟล์เดิม; ผู้ใช้ที่ยังไม่เข้าสู่ระบบได้รับคำเตือนแล้วไป `/login` ตาม Q-04
- สถานะ: เสร็จ รอทีมตรวจ

#### จุดตรวจเฟส 2
- test ที่ต้องผ่านทั้งหมด: `cd frontend && npm test` และ `cd backend && pytest -v`; tests เดิมต้องยังผ่าน
- เปิดระบบ: `cd backend && uvicorn app.main:app --reload`; `cd frontend && npm run dev`
- คนลองเองตาม AC-RMP-05:
  Given นักศึกษาเข้าสู่ระบบและกรอกข้อมูลโปรไฟล์ครบและถูกต้อง
  When กดยืนยันการสร้างโปรไฟล์บนหน้าจอ
  Then โปรไฟล์ถูกบันทึกผ่าน API และหน้าจอแสดงข้อความว่าสร้างโปรไฟล์สำเร็จ
- ข้อจำกัดก่อนใช้งานจริง: production trusted upstream authentication provider และหน้า login ปลายทาง `/login` ยังไม่เชื่อมในแอปนี้; ทีมต้องทดสอบการนำทางร่วมกับระบบ auth จริง

## เฟส 3: ทดสอบ usability กับนักศึกษาใหม่

### T-12 ประเมินการสร้างโปรไฟล์กับนักศึกษาใหม่ 5 คน
- รองรับ: NFR-USE-01
- ตรวจด้วย: AC-RMP-07
- ไฟล์ที่แตะ: `frontend/src/App.jsx`
- แบบหน้าจอ: ไม่มี mockup; ไม่มี UI ID ใน spec
- ต้องทำหลัง: T-07, T-08, T-09, T-10
- เสร็จเมื่อ: นักศึกษาใหม่ 5 คนทดลองสร้างโปรไฟล์โดยไม่รับคำแนะนำ และบันทึกผลได้ว่าอย่างน้อย 4 คนสร้างโปรไฟล์สำเร็จ
- สถานะ: ยังไม่ครบ

#### จุดตรวจเฟส 3
- test ที่ต้องผ่านทั้งหมด: `cd frontend && npm test`; `cd backend && pytest -v`; และผลทดลอง usability ของผู้ใช้จริง
- เปิดระบบ: `cd backend && uvicorn app.main:app --reload`; `cd frontend && npm run dev`
- คนลองเองตาม AC-RMP-07:
  Given นักศึกษาที่ไม่เคยใช้ฟังก์ชันนี้จำนวน 5 คน
  When แต่ละคนสร้างโปรไฟล์หาเมทโดยไม่รับคำแนะนำ
  Then อย่างน้อย 4 คนสร้างโปรไฟล์สำเร็จ
- ยังขาด: ต้องใช้ผู้ทดสอบจริง 5 คนตาม NFR-USE-01; ไม่ลดจำนวนตัวอย่างเอง

## เฟสสุดท้าย: เปิด/ปิดสถานะให้ค้นหา

### T-13 เปิดสถานะให้ค้นหาตามมติของ Q-05
- รองรับ: FR-RMP-10, FR-RMP-11, CON-DISCOVER-01
- ตรวจด้วย: AC-RMP-06, AC-RMP-08
- ไฟล์ที่แตะ: `backend/app/models/roommate_profile.py`, `backend/app/roommate_profiles.py`, `backend/app/main.py`, `backend/tests/test_roommate_profile_discovery.py`
- แบบหน้าจอ: ไม่มี; การค้นหาจริงเป็น UC-04 นอกขอบเขตนี้
- ต้องทำหลัง: T-02, T-05
- เสร็จเมื่อ: `PATCH /api/roommate-profiles/me/search-visibility` เปลี่ยนสถานะได้เฉพาะเจ้าของโปรไฟล์ปัจจุบัน, บันทึกสถานะ, คืน 401 เมื่อไม่มี identity และ 404 เมื่อไม่มีโปรไฟล์
- สถานะ: เสร็จ รอทีมตรวจ

### T-14 เพิ่มจุดควบคุมสถานะในหน้าจอ; แยกทดสอบผลค้นหากับ UC-04
- รองรับ: FR-RMP-09, FR-RMP-10, FR-RMP-11, CON-DISCOVER-01, ASM-06
- ตรวจด้วย: AC-RMP-05, AC-RMP-06, AC-RMP-08
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/api/client.test.js`, `frontend/src/App.jsx`, `frontend/src/config.js`, `frontend/src/__tests__/profile-form.test.jsx`
- แบบหน้าจอ: ไม่มี mockup; ไม่มี UI ID ใน spec
- ต้องทำหลัง: T-13
- เสร็จเมื่อ: หลังบันทึกสำเร็จแสดงหน้าโปรไฟล์จากข้อมูลที่เพิ่งส่ง; เจ้าของเปิด/ปิดสถานะผ่านปุ่มที่เรียก API ได้; ไม่มีการแก้ระบบค้นหา UC-04 โดยการยืนยันผลค้นหาจริงเป็น integration test แยก
- สถานะ: เสร็จ รอทีมตรวจ
- หมายเหตุ: ทีมยังต้องทดสอบ integration กับ UC-04 แยกว่าผลค้นหาเปลี่ยนตามสถานะจริง

## ตารางตรวจความครบ: Acceptance Criteria

| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-RMP-01 | T-07 |
| AC-RMP-01A | T-06, T-11 |
| AC-RMP-02 | T-07, T-08 |
| AC-RMP-02A | T-04, T-07, T-08 |
| AC-RMP-03 | T-04, T-07, T-10 |
| AC-RMP-04 | T-04, T-07, T-10 |
| AC-RMP-04A | T-04, T-07, T-10 |
| AC-RMP-05 | T-05, T-09, T-14 |
| AC-RMP-05B | T-02, T-05, T-13 |
| AC-RMP-05A | T-05, T-10 |
| AC-RMP-06 | T-13, T-14 |
| AC-RMP-07 | T-12 |
| AC-RMP-08 | T-05, T-13, T-14 |

## ตารางตรวจความครบ: Constraints

| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-AUTH-01 | T-06, T-09, T-11, T-13 |
| CON-PROFILE-01 | T-02, T-06, T-11, T-13 |
| CON-DATA-01 | T-02, T-03, T-04, T-08 |
| CON-VALID-01 | T-03, T-04, T-07, T-08, T-10 |
| CON-REL-01 | T-04, T-05, T-10 |
| CON-ROOM-01 | T-03, T-04, T-07, T-10 |
| CON-DISCOVER-01 | T-02, T-05, T-13, T-14 |

## ตารางตรวจความครบ: Functional Requirements

| FR ID | AC ที่ตรวจ FR นี้ | เฟส |
|---|---|---|
| FR-RMP-01 | AC-RMP-01 | เฟส 2 |
| FR-RMP-02 | AC-RMP-01 | เฟส 2 |
| FR-RMP-03 | AC-RMP-02 | เฟส 0, 2 |
| FR-RMP-04 | AC-RMP-02 | เฟส 2 |
| FR-RMP-05 | AC-RMP-02A, AC-RMP-03, AC-RMP-04 | เฟส 1, 2 |
| FR-RMP-06 | AC-RMP-03 | เฟส 1, 2 |
| FR-RMP-07 | AC-RMP-04, AC-RMP-04A | เฟส 1, 2 |
| FR-RMP-08 | AC-RMP-05, AC-RMP-05A | เฟส 0, 1, 2 |
| FR-RMP-09 | AC-RMP-05 | เฟส 1, 2, เฟสสุดท้าย |
| FR-RMP-10 | AC-RMP-06 | เฟสสุดท้าย |
| FR-RMP-11 | AC-RMP-05B, AC-RMP-06, AC-RMP-08 | เฟส 0, 1, เฟสสุดท้าย |

## สิ่งที่ยังไม่ทำ: Open Questions

- Q-01 ข้อมูลใดบ้างที่เป็นข้อมูลจำเป็นสำหรับการสร้างโปรไฟล์? ตอบแล้วใน spec.md; ไม่มี task รอคำตอบ
- Q-02 ความต้องการเกี่ยวกับเมทมีข้อมูลอะไรบ้าง? ตอบแล้วใน spec.md; ไม่มี task รอคำตอบ
- Q-03 หลังจากสร้างโปรไฟล์สำเร็จ โปรไฟล์จะแสดงในผลการค้นหาทันทีหรือไม่? ตอบแล้วใน spec.md; ไม่มี task รอคำตอบ
- Q-04 ถ้านักศึกษายังไม่ได้เข้าสู่ระบบแล้วเลือกเมนูสร้างโปรไฟล์หาเมท ระบบต้องทำอะไร (พาไปหน้าเข้าสู่ระบบ / ซ่อนเมนู / แสดงข้อความ)? ตอบแล้วใน spec.md ว่าพาไปหน้า `/login` พร้อมเตือน; หน้า placeholder แสดงตาม ASM-05 และยังไม่ login จริง
- Q-05 เจ้าของเปิดสถานะให้ค้นหาที่ไหนและอย่างไร (ตอนสร้าง หรือปุ่มหลังสร้าง) และปิดกลับได้ไหม? ตอบแล้วใน spec.md: ใช้ปุ่มหลังสร้างและปิดกลับได้; T-13/T-14 ทำตามสัญญา API ที่ทีมยืนยัน
- Q-06 พฤติกรรมการนอนมีตัวเลือก "อื่น ๆ" ไหม และเลือก "ไม่มีพฤติกรรมดังกล่าว" ร่วมกับตัวเลือกอื่นได้ไหม? ตอบแล้วใน spec.md; T-08 แก้โค้ดเดิมให้ตรงคำตอบ
- Q-07 ข้อมูลโปรไฟล์เก็บที่ไหน (ฐานข้อมูลอะไร มี backend ไหม)? ตอบแล้วใน spec.md ว่าใช้ SQLite และมี backend; ไม่มี task รอคำตอบ

## ประเด็นทางเทคนิคที่ยังต้องกำหนดโดยทีม

- Production upstream authentication provider ยังไม่เชื่อม; ใช้ fake login และ dev-only identity สำหรับทดลองตาม ASM-05 ได้
- AC-RMP-06/08 ตรวจผลการค้นหาจริงร่วมกับ UC-04 ตาม Out of scope; งานใน feature นี้จำกัดที่สถานะการเผยแพร่และการเชื่อมต่อทดสอบกับ UC-04

## งานเพิ่มเติมตามมติทีม: placeholder สำหรับตรวจ redirect

### T-15 เพิ่มหน้า placeholder `/login`
- รองรับ: CON-AUTH-01, Q-04, ASM-05
- ตรวจด้วย: `test_Q04_login_placeholder_route`
- ไฟล์ที่แตะ: `frontend/src/App.jsx`, `frontend/src/pages/LoginPlaceholderPage.jsx`, `frontend/src/__tests__/login-placeholder.test.jsx`
- แบบหน้าจอ: ไม่มี mockup; ใช้ข้อความตาม ASM-05
- ต้องทำหลัง: T-11
- เสร็จเมื่อ: เมื่อเปิด `/login` แสดงหัวข้อและข้อความ placeholder ตาม ASM-05; ไม่มีฟอร์มหรือการยืนยันตัวตน และไม่เรียก API โปรไฟล์; frontend tests ผ่าน
- สถานะ: เสร็จ รอทีมตรวจ
- หมายเหตุ: พฤติกรรม placeholder นี้ถูกปรับตามมติใหม่ใน T-16

### T-16 เพิ่ม fake login สำหรับทดลองสร้างโปรไฟล์ในเครื่อง
- รองรับ: CON-AUTH-01, CON-PROFILE-01, Q-04, ASM-05
- ตรวจด้วย: `test_Q04_demo_login_accepts_nonempty_credentials`, backend tests สำหรับ dev-only identity
- ไฟล์ที่แตะ: `backend/app/main.py`, `backend/tests/test_roommate_profile_auth.py`, `frontend/src/App.jsx`, `frontend/src/api/client.js`, `frontend/src/pages/LoginPlaceholderPage.jsx` (เปลี่ยนชื่อเป็น `LoginPage.jsx`), `frontend/src/__tests__/login-placeholder.test.jsx` (เปลี่ยนชื่อเป็น `login-page.test.jsx`), `frontend/src/api/client.test.js`
- แบบหน้าจอ: ไม่มี mockup; ช่อง username/password และพฤติกรรมตาม ASM-05
- ต้องทำหลัง: T-15
- เสร็จเมื่อ: เมื่อกรอก username/password ที่ไม่ว่างแล้วกลับไป `/`; เก็บเฉพาะ username ใน session ของแท็บ; API โปรไฟล์ยอมรับ demo identity เฉพาะเมื่อ `APP_ENV=development` และ `ROOMMATE_DEMO_AUTH_ENABLED=true`; ปิด/ปฏิเสธใน environment อื่น; tests ผ่าน
- สถานะ: เสร็จ รอทีมตรวจ
- วิธีทดลองในเครื่อง: `cd backend && APP_ENV=development ROOMMATE_DEMO_AUTH_ENABLED=true uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`; อีก terminal รัน `cd frontend && npm run dev`
