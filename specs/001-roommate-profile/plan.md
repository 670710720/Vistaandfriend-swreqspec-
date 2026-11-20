# แผน: สร้างโปรไฟล์หาเมท

อ้างอิง: [spec.md](./spec.md) SPEC-RMP-001 Draft v7

## 1. สรุปแนวทาง

นักศึกษาที่เข้าสู่ระบบและยังไม่มีโปรไฟล์เลือกเมนูเพื่อเปิดแบบฟอร์มสร้างโปรไฟล์หาเมท (FR-RMP-01, FR-RMP-02, CON-AUTH-01, CON-PROFILE-01)
แบบฟอร์มรับข้อมูลจำเป็นและข้อมูลเสริม รวมถึงพฤติกรรมการนอนของเจ้าของโปรไฟล์ (FR-RMP-03, FR-RMP-04)
ตรวจข้อมูลในหน้าจอและ backend ก่อนอนุญาตให้บันทึก พร้อมแจ้งข้อผิดพลาดที่แก้ไขได้ (FR-RMP-05, FR-RMP-06, FR-RMP-07, CON-DATA-01, CON-VALID-01, CON-ROOM-01)
เมื่อข้อมูลถูกต้อง บันทึกโปรไฟล์ใน SQLite โดยไม่ทิ้งข้อมูลบางส่วนเมื่อผิดพลาด และแจ้งผลสำเร็จ (FR-RMP-08, FR-RMP-09, CON-REL-01, NFR-REL-01, Q-07)
กำหนดสถานะเริ่มต้นเป็น "ไม่เปิด"; เจ้าของเปิด/ปิดสถานะได้หลังสร้างโปรไฟล์ผ่าน API และหน้าจอ ส่วนผลค้นหาจริงยังเป็นความรับผิดชอบของ UC-04 (FR-RMP-10, FR-RMP-11, CON-DISCOVER-01, Q-05)

## 2. เทคโนโลยีที่ใช้

| สิ่งที่เลือก | มาจาก | หมายเหตุ |
|---|---|---|
| React (Vite) | ทีมเลือกเอง ไม่ได้มาจาก spec | ค่าเริ่มต้นตามแนวทางรายวิชา; ใช้หน้าจอแบบฟอร์มและผล validation (FR-RMP-01 ถึง FR-RMP-07, FR-RMP-09) |
| Python FastAPI | ทีมเลือกเอง ไม่ได้มาจาก spec | ค่าเริ่มต้นตามแนวทางรายวิชา; รับ ตรวจ และบันทึกข้อมูลผ่าน backend (FR-RMP-05 ถึง FR-RMP-09) |
| SQLite | Q-07 (ตอบแล้ว) | Spec ระบุให้ใช้ SQLite ผ่าน backend (ASM-03) |
| Vitest | ทีมเลือกเอง ไม่ได้มาจาก spec | มี frontend tests อยู่แล้ว; ใช้ทดสอบหน้าจอและ validation ตาม AC โดยสถานะ test cases ต้องให้ทีมตรวจเอง |
| pytest | ทีมเลือกเอง ไม่ได้มาจาก spec | มีการตั้งค่า pytest ใน backend; ใช้ทดสอบการเชื่อมต่อฐานข้อมูล, validation และ API ตาม AC |

Production ยังคงต้องใช้ trusted upstream middleware ที่ใส่ `request.state.user_id`; สำหรับการทดลองในเครื่อง หน้า `/login` เก็บเฉพาะ username ใน `sessionStorage` และส่ง `X-Demo-User-ID` ไปยัง API โปรไฟล์ โดย backend จะตั้ง `request.state.user_id` จาก header นี้ได้เฉพาะเมื่อ `APP_ENV=development` และ `ROOMMATE_DEMO_AUTH_ENABLED=true` เท่านั้น; ห้ามเปิด flag นี้ใน production และไม่ส่ง/เก็บ password (CON-AUTH-01, ASM-05). `POST /api/roommate-profiles` รับ parts `profileData`/`profileImage`, `GET /api/roommate-profiles/me` ตอบ `{ "hasProfile": boolean }` และ `PATCH /api/roommate-profiles/me/search-visibility` เปลี่ยนสถานะของเจ้าของปัจจุบัน (CON-PROFILE-01, FR-RMP-03, FR-RMP-08, FR-RMP-11).

## 3. โมเดลข้อมูล

| Entity | ฟิลด์หลัก | รองรับ |
|---|---|---|
| RoommateProfile | ข้อมูลอ้างอิงเจ้าของจากบริบทผู้ใช้ที่ยืนยันตัวตนแล้ว; ชื่อเล่น, อายุ, เพศ, คณะ, ชั้นปี, รูปโปรไฟล์, เบอร์โทรศัพท์, Facebook, Instagram, LINE, TikTok, ประเภทห้อง, จำนวนผู้พัก, พฤติกรรมการนอนของเจ้าของ, สถานะเปิดให้ค้นหา | FR-RMP-03, FR-RMP-04, FR-RMP-08, FR-RMP-10, FR-RMP-11; CON-AUTH-01, CON-PROFILE-01, CON-DATA-01, CON-DISCOVER-01 |

- ฟิลด์ที่จำเป็นและค่าที่อนุญาตต้องตรงกับ Profile data and validation rules ใน spec; social channels เป็นข้อมูลเสริมและรับ username หรือ URL (FR-RMP-03).
- พฤติกรรมการนอนใน entity นี้เป็นของเจ้าของเท่านั้น; ไม่รวมความต้องการเกี่ยวกับพฤติกรรมการนอนของเมทซึ่งอยู่ UC-03 (FR-RMP-04).
- สถานะเปิดให้ค้นหาต้องแยกจากการบันทึกและมีค่าเริ่มต้น "ไม่เปิด"; ตามคำตอบ Q-05 เจ้าของใช้ปุ่มหลังสร้างเพื่อเปิดและปิดกลับได้ (FR-RMP-11, CON-DISCOVER-01).
- รูปต้องผ่านชนิดและขนาดตาม spec; รูปแบบการรับและวิธีจัดเก็บรูปยังไม่ระบุ จึงไม่กำหนดเป็นไฟล์หรือข้อมูลใน SQLite แทนทีม (FR-RMP-03, CON-VALID-01).
- ไม่สร้าง entity สำหรับความต้องการรูมเมท, การค้นหา, การแก้ไขหรือลบโปรไฟล์ เพราะเป็น UC-03/UC-04/UC-02 หรืออยู่นอก scope (FR-RMP-04, FR-RMP-10).

## 4. API / หน้าจอ

### API

| Method / path | Input/output หลัก | รองรับ |
|---|---|---|
| `POST /api/roommate-profiles` | Input: multipart parts `profileData` (JSON) และ `profileImage` (file); owner มาจาก trusted identity หรือ dev-only `X-Demo-User-ID`; Output: 201 `{message}`, 422 `{errors}`, 401 เมื่อไม่มี identity, 409 เมื่อมีโปรไฟล์แล้ว | FR-RMP-03 ถึง FR-RMP-09; CON-AUTH-01, CON-PROFILE-01, CON-DATA-01, CON-VALID-01, CON-REL-01, CON-ROOM-01, NFR-REL-01 |
| `GET /api/roommate-profiles/me` | Input: trusted identity จาก middleware หรือ dev-only `X-Demo-User-ID`; Output: `{ "hasProfile": boolean }`; ตอบ 401 เมื่อไม่มี identity | FR-RMP-01, FR-RMP-02, CON-AUTH-01, CON-PROFILE-01, NFR-SEC-01 |
| `PATCH /api/roommate-profiles/me/search-visibility` | Input: trusted identity และ JSON `{"isSearchable": boolean}`; Output: 200 `{"isSearchable": boolean}`, 401 เมื่อไม่มี identity, 404 เมื่อไม่มีโปรไฟล์, 422 เมื่อ payload ไม่ถูกต้อง, 503 เมื่อบันทึกสถานะไม่สำเร็จ | FR-RMP-11; CON-AUTH-01, CON-PROFILE-01, CON-DISCOVER-01 |

การค้นหา/จับคู่จริงไม่สร้างหรือแก้ไขเป็น API ของ UC-01; UC-01 บันทึกสถานะให้เจ้าของผ่าน PATCH ส่วนการยืนยันว่าผลค้นหา UC-04 เปลี่ยนตามสถานะเป็น integration test แยก (FR-RMP-10, CON-DISCOVER-01).

### หน้าจอ

| หน้าจอ | UI ID / mockup | เนื้อหาและ FR |
|---|---|---|
| เมนูและแบบฟอร์มสร้างโปรไฟล์ | ไม่มี UI ID; ไม่มี mockup ทีมออกแบบเอง | เปิดแบบฟอร์มสำหรับนักศึกษาที่เข้าสู่ระบบและยังไม่มีโปรไฟล์; รับข้อมูลจำเป็น/เสริมและพฤติกรรมการนอนของเจ้าของ (FR-RMP-01 ถึง FR-RMP-04, CON-AUTH-01, CON-PROFILE-01) |
| Validation และยืนยันการสร้าง | ไม่มี UI ID; ไม่มี mockup ทีมออกแบบเอง | แสดงข้อความที่ช่องซึ่งต้องแก้ และอนุญาตให้ยืนยันเมื่อข้อมูลผ่าน validation (FR-RMP-05 ถึง FR-RMP-07) |
| ผลการสร้างและหน้าโปรไฟล์ | ไม่มี UI ID; ไม่มี mockup ทีมออกแบบเอง | เมื่อบันทึกสำเร็จ แสดงข้อความสำเร็จและข้อมูลจากฟอร์มที่เพิ่งส่ง โดยไม่เรียก API อ่านรายละเอียดโปรไฟล์ (FR-RMP-08, FR-RMP-09, ASM-06) |
| จุดควบคุมสถานะให้ค้นหา | ไม่มี UI ID; ไม่มี mockup | แสดงปุ่มหลังสร้าง; เรียก PATCH เพื่อเปิด/ปิดสถานะและแสดงสถานะล่าสุด (FR-RMP-11, CON-DISCOVER-01, Q-05) |
| หน้า `/login` สำหรับทดลอง | ไม่มี UI ID; ไม่มี mockup; ไม่ใช่ authentication จริง | มีช่อง username/password; รับค่าที่ไม่ว่างเพื่อทดลอง, เก็บเฉพาะ username ใน session ของแท็บ, ไม่เก็บ/ส่ง password และนำกลับ `/` เมื่อสำเร็จ (CON-AUTH-01, Q-04, ASM-05) |

กรณียังไม่เข้าสู่ระบบเมื่อเลือกเมนูสร้างโปรไฟล์ ให้แสดง browser alert "กรุณาเข้าสู่ระบบก่อนสร้างโปรไฟล์" แล้วนำทางไป `/login` ตามคำตอบ Q-04; ระบบจำลอง identity ได้เฉพาะ development ตาม ASM-05 และไม่มีผลกับ production (CON-AUTH-01). ไม่มี mockup ใน `specs/001-roommate-profile/mockups/` หรือ `specs/000-shared/mockups/`.

## 5. ตารางตรวจ Constraints

ไม่พบ `specs/000-shared/`; ตารางนี้ครอบคลุม Constraints ทั้งหมดที่ระบุใน spec ฟีเจอร์

| Constraint ID | ถูกนำไปใช้ที่ไหนใน plan | สถานะ |
|---|---|---|
| CON-AUTH-01 | API สร้าง/ตรวจสถานะอ่าน `request.state.user_id`; UI นำผู้ใช้ที่ยังไม่ login ไป `/login`; dev demo identity เปิดได้เฉพาะด้วย environment flags ตาม ASM-05 | production ยังคงต้องเชื่อม trusted provider; demo flag ปิดโดยปริยายและถูกปฏิเสธนอก development |
| CON-PROFILE-01 | UI เรียก `GET /api/roommate-profiles/me` ก่อนเปิดแบบฟอร์ม; API สร้างยังบังคับหนึ่งโปรไฟล์ต่อเจ้าของ | ทำแล้ว |
| CON-DATA-01 | ฟิลด์จำเป็นในโมเดลและ validation ก่อนยืนยัน/บันทึก | ใช้แล้ว |
| CON-VALID-01 | ตรวจรูปแบบและค่าที่อนุญาตใน validation ฝั่ง backend; หน้าจอใช้ config ชุดเดียวกันตามค่าที่ตั้งได้ | ใช้แล้ว |
| CON-REL-01 | ไม่สร้างโปรไฟล์เมื่อ validation ไม่ผ่าน; ทดสอบ AC-RMP-03, AC-RMP-04, AC-RMP-04A | ใช้แล้ว |
| CON-ROOM-01 | เก็บขอบเขตจำนวนผู้พักตามประเภทห้องใน config และทดสอบกรณีเกิน/ต่ำกว่าช่วง | ใช้แล้ว |
| CON-DISCOVER-01 | สถานะเริ่มต้น "ไม่เปิด"; PATCH เปลี่ยนสถานะได้เฉพาะโปรไฟล์ของ identity ปัจจุบัน; UI มีปุ่มเปิด/ปิดหลังสร้าง | ใช้กับข้อมูลสถานะแล้ว; integration test กับผลค้นหา UC-04 ยังแยกดำเนินการ |

### ค่าที่ตั้งได้

ตัวเลขและกฎจาก spec ต้องรวมไว้ใน `backend/app/config.py` และ `frontend/src/config.js` เมื่อ UI ใช้ พร้อมคอมเมนต์อ้าง ID; ห้ามกระจายค่าคงที่เหล่านี้ใน logic (CON-VALID-01, CON-ROOM-01).

| ค่า | มาจาก ID | ชื่อตัวแปรและไฟล์ |
|---|---|---|
| รายการข้อมูลจำเป็นของโปรไฟล์ | CON-DATA-01, FR-RMP-03 | `PROFILE_REQUIRED_FIELDS` — `backend/app/config.py`, `frontend/src/config.js` |
| อายุจำนวนเต็ม 18–25 ปี | FR-RMP-03, CON-VALID-01 | `PROFILE_AGE_MIN`, `PROFILE_AGE_MAX` — `backend/app/config.py`, `frontend/src/config.js` |
| เพศ: หญิง, ชาย | FR-RMP-03, CON-VALID-01 | `PROFILE_GENDERS` — `backend/app/config.py`, `frontend/src/config.js` |
| คณะ: วิทยาศาสตร์, เภสัชศาสตร์, วิศวกรรมศาสตร์, อักษรศาสตร์, มัณฑนศิลป์, ศิลปกรรม, ศึกษาศาสตร์, จิตรกรรม | FR-RMP-03, CON-VALID-01 | `PROFILE_FACULTIES` — `backend/app/config.py`, `frontend/src/config.js` |
| ชั้นปี: 1, 2, 3, 4, 5 ขึ้นไป | FR-RMP-03, CON-VALID-01 | `PROFILE_YEAR_OPTIONS` — `backend/app/config.py`, `frontend/src/config.js` |
| รูป JPG/PNG ขนาดไม่เกิน 5 MB และไม่ตรวจมิติภาพ | FR-RMP-03, CON-VALID-01 | `PROFILE_IMAGE_FORMATS`, `PROFILE_IMAGE_MAX_MB`, `PROFILE_IMAGE_CHECK_DIMENSIONS` — `backend/app/config.py`, `frontend/src/config.js` |
| เบอร์โทรศัพท์ 10 หลักหลังตัดช่องว่าง/ขีดคั่น และอนุญาตให้กรอกตัวคั่น | FR-RMP-03, CON-VALID-01 | `PROFILE_PHONE_DIGITS`, `PROFILE_PHONE_SEPARATORS` — `backend/app/config.py`, `frontend/src/config.js` |
| ช่องทางเสริม Facebook, Instagram, LINE, TikTok; รับ username หรือ URL | FR-RMP-03 | `PROFILE_SOCIAL_CHANNELS`, `PROFILE_SOCIAL_INPUT_FORMATS` — `backend/app/config.py`, `frontend/src/config.js` |
| ห้องแอร์ 1–4 คน; ห้องพัดลม 1–3 คน | CON-ROOM-01 | `ROOM_OCCUPANCY_LIMITS` — `backend/app/config.py`, `frontend/src/config.js` |
| พฤติกรรมการนอน: กรน, กัดฟัน, นอนดิ้น, ไม่มีพฤติกรรมดังกล่าว, อื่น ๆ; ต้องเลือกอย่างน้อย 1 รายการ; เมื่อเลือก "อื่น ๆ" ต้องกรอกคำอธิบาย; "ไม่มีพฤติกรรมดังกล่าว" เลือกเดี่ยว | FR-RMP-04, CON-DATA-01, CON-VALID-01, Q-06 | `SLEEP_BEHAVIOR_OPTIONS`, `SLEEP_MIN_SELECTIONS`, `SLEEP_NONE_EXCLUSIVE`, `SLEEP_OTHER_REQUIRES_DESCRIPTION` — `backend/app/config.py`, `frontend/src/config.js` |
| สถานะเริ่มต้น "ไม่เปิด" | FR-RMP-11, CON-DISCOVER-01 | `PROFILE_DISCOVERY_DEFAULT` — `backend/app/config.py`, `frontend/src/config.js` |
| ผู้ทดสอบใหม่ 5 คน; อัตราสำเร็จอย่างน้อย 80% (อย่างน้อย 4 คน) | NFR-USE-01, AC-RMP-07 | `USABILITY_TEST_PARTICIPANTS`, `USABILITY_TEST_SUCCESS_RATE` — `backend/app/config.py` |

## 6. แผนทดสอบจาก Acceptance Criteria

| AC ID | ชื่อ test | ทดสอบอย่างไร |
|---|---|---|
| AC-RMP-01 | `test_AC_RMP_01` | ผู้ใช้ที่ login และยังไม่มีโปรไฟล์เลือกเมนู; ตรวจว่าแบบฟอร์มแสดง |
| AC-RMP-01A | `test_AC_RMP_01A` | ผู้ใช้มีโปรไฟล์เดิมเลือกเมนู; ตรวจว่าไม่แสดงแบบฟอร์มและมีข้อความตาม AC |
| AC-RMP-02 | `test_AC_RMP_02` | กรอกข้อมูลจำเป็น เลือก "อื่น ๆ" และกรอกคำอธิบาย; ตรวจค่าทุกช่องและตัวเลือกยังคงอยู่ |
| AC-RMP-02A | `test_AC_RMP_02A` | กรอกค่าที่ถูกต้อง รวมถึงคำอธิบายของ "อื่น ๆ" หรือเลือก "ไม่มีพฤติกรรมดังกล่าว" เดี่ยว; ตรวจว่าไม่มีข้อความผิดพลาดและปุ่ม "บันทึกข้อมูล" กดได้ |
| AC-RMP-03 | `test_AC_RMP_03` | ยืนยันข้อมูลที่จำเป็นไม่ครบหรือไม่มีคำอธิบายเมื่อเลือก "อื่น ๆ"; ตรวจข้อความแจ้งและไม่มีโปรไฟล์ถูกสร้าง |
| AC-RMP-04 | `test_AC_RMP_04` | ยืนยันข้อมูลไม่ถูกต้อง; ตรวจข้อผิดพลาด แก้ไขได้ และไม่มีโปรไฟล์ถูกสร้าง |
| AC-RMP-04A | `test_AC_RMP_04A` | ทดสอบห้องพัดลม 0/4 คนและห้องแอร์ 5 คน; ตรวจ error ที่ช่องจำนวนผู้พักและไม่มีโปรไฟล์ถูกสร้าง |
| AC-RMP-05 | `test_AC_RMP_05_saves_profile_and_shows_the_created_profile` | ส่งข้อมูลครบ/ถูกต้อง; ตรวจว่าบันทึกโปรไฟล์ แสดงข้อความสำเร็จ และแสดงหน้าโปรไฟล์จาก state ที่เพิ่งส่ง |
| AC-RMP-05B | `test_AC_RMP_05B` | สร้างโปรไฟล์; ตรวจสถานะเริ่มต้น "ไม่เปิด"; เจ้าของเปิด/ปิดสถานะได้ผ่าน PATCH ตาม Q-05; การตรวจผลค้นหาจริงแยกทดสอบกับ UC-04 |
| AC-RMP-05A | `test_AC_RMP_05A` | จำลองการบันทึกล้มเหลวและ retry; ตรวจไม่มีข้อมูลบางส่วน มีข้อความผิดพลาด ลองใหม่ได้ และไม่มีโปรไฟล์ซ้ำ |
| AC-RMP-06 | `test_AC_RMP_06_owner_can_open_and_close_profile_search_visibility` | เจ้าของเปิด/ปิดสถานะผ่าน PATCH; การตรวจผลค้นหาจริงกับ UC-04 เป็น integration test แยก |
| AC-RMP-07 | `test_AC_RMP_07` | ให้นักศึกษาใหม่ 5 คนทดลองโดยไม่รับคำแนะนำและบันทึกผล; ต้องสำเร็จอย่างน้อย 4 คน (ทดสอบกับผู้ใช้จริง) |
| AC-RMP-08 | `test_AC_RMP_08_new_profile_starts_hidden_from_search`, `test_AC_RMP_08_visibility_update_only_changes_the_authenticated_owner` | ตรวจสถานะเริ่มต้นว่า "ไม่เปิด" และเปลี่ยนสถานะได้เฉพาะเจ้าของ; ยืนยันการซ่อนจากผลค้นหาใน integration test แยกกับ UC-04 |

การตรวจเสริมของ Q-04/ASM-05: `test_Q04_demo_login_accepts_nonempty_credentials` ตรวจหน้า login และการเก็บ username ใน session ของแท็บ; backend auth tests ตรวจว่า identity header ทำงานได้เฉพาะเมื่อเปิด dev demo flag; ไม่ใช่ AC ใหม่

## 7. ลำดับงาน

1. ใช้ข้อตกลงทางเทคนิคที่ทีมยืนยัน: รูปส่งแบบ multipart และเก็บ BLOB, identity มาจาก `request.state.user_id`, และตรวจโปรไฟล์เดิมผ่าน `GET /api/roommate-profiles/me`; production identity provider ยังต้องเชื่อมก่อนใช้งานจริง (CON-AUTH-01, CON-PROFILE-01, FR-RMP-03, FR-RMP-08).
2. จัด config สำหรับค่าที่ตั้งได้ และเตรียมการเชื่อมต่อ SQLite/โมเดลโปรไฟล์ โดยเก็บข้อมูลเฉพาะโปรไฟล์เจ้าของ (FR-RMP-03, FR-RMP-04, FR-RMP-08, CON-DATA-01, Q-07).
3. ทำเมนู/แบบฟอร์มและการควบคุมการเข้าใช้ตามสถานะ login/โปรไฟล์เดิม โดยไม่เพิ่ม AC ใหม่สำหรับ Q-04 (FR-RMP-01, FR-RMP-02, CON-AUTH-01, CON-PROFILE-01).
4. ทำ validation ฝั่ง backend และเชื่อม validation ฝั่งหน้าจอให้ครอบคลุม required fields, รูปแบบข้อมูล, พฤติกรรมการนอน และจำนวนผู้พัก (FR-RMP-03 ถึง FR-RMP-07, CON-DATA-01, CON-VALID-01, CON-ROOM-01, Q-06).
5. ทำการบันทึกโปรไฟล์แบบไม่ทิ้งข้อมูลบางส่วนเมื่อผิดพลาด; ตั้งสถานะเริ่มต้นเป็น "ไม่เปิด" และป้องกันโปรไฟล์ซ้ำเมื่อลองใหม่ (FR-RMP-08, FR-RMP-11, CON-REL-01, CON-DISCOVER-01, NFR-REL-01).
6. เชื่อมผลตอบกลับ API กับหน้าจอให้แสดงผลสำเร็จ/ข้อผิดพลาดตาม AC และคงข้อมูลให้ลองใหม่เมื่อบันทึกล้มเหลว (FR-RMP-07 ถึง FR-RMP-09, AC-RMP-05, AC-RMP-05A).
7. ทำ API และปุ่มหลังสร้างสำหรับเจ้าของเปิด/ปิดสถานะตามคำตอบ Q-05; ไม่แก้ระบบค้นหา UC-04 และแยกการทดสอบ integration กับผลค้นหาออกจากงานนี้ (FR-RMP-10, FR-RMP-11, CON-DISCOVER-01, AC-RMP-06, AC-RMP-08).
8. รันทดสอบ AC-RMP-01, AC-RMP-01A, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A, AC-RMP-05, AC-RMP-05A, AC-RMP-05B, AC-RMP-06, AC-RMP-08 และทดลอง usability กับผู้ใช้ใหม่ 5 คนตาม AC-RMP-07; ต้องสำเร็จอย่างน้อย 4 คนโดยไม่รับคำแนะนำ (NFR-USE-01).

## 8. สิ่งที่ยังไม่ทำ

คำถามต่อไปนี้คัดลอกจาก spec; สำหรับข้อที่ตอบแล้วให้คงคำตอบตาม spec ส่วนใดที่ยังไม่มีคำตอบจะยังไม่สร้างจนกว่าจะได้คำตอบ

- Q-01 ข้อมูลใดบ้างที่เป็นข้อมูลจำเป็นสำหรับการสร้างโปรไฟล์?
  - ตอบแล้ว: ชื่อเล่น อายุ เพศ คณะ ชั้นปี รูปโปรไฟล์ เบอร์โทรศัพท์ ประเภทห้องพัก และพฤติกรรมการนอน
- Q-02 ความต้องการเกี่ยวกับเมทมีข้อมูลอะไรบ้าง?
  - ตอบแล้ว: ความต้องการเกี่ยวกับพฤติกรรมการนอนของเมทที่ต้องการเป็นข้อมูลเสริมและจัดเก็บใน UC-03; พฤติกรรมการนอนของผู้สร้างโปรไฟล์เป็นข้อมูลคนละส่วนที่จัดเก็บในโปรไฟล์ UC-01
- Q-03 หลังจากสร้างโปรไฟล์สำเร็จ โปรไฟล์จะแสดงในผลการค้นหาทันทีหรือไม่?
  - ตอบแล้ว: ต้องเปิดสถานะโดยเจ้าของก่อนจึงจะแสดงในผลการค้นหา
- Q-04 ถ้านักศึกษายังไม่ได้เข้าสู่ระบบแล้วเลือกเมนูสร้างโปรไฟล์หาเมท ระบบต้องทำอะไร (พาไปหน้าเข้าสู่ระบบ / ซ่อนเมนู / แสดงข้อความ)?
  - ตอบแล้ว: พาไปหน้า `/login` พร้อมเตือน; การ login ปลอมและ dev-only identity สำหรับทดลองทำตาม ASM-05 โดยไม่เป็นการยืนยันตัวตนจริง
- Q-05 เจ้าของเปิดสถานะให้ค้นหาที่ไหนและอย่างไร (ตอนสร้าง หรือปุ่มหลังสร้าง) และปิดกลับได้ไหม?
  - ตอบแล้ว: ปุ่มหลังสร้าง และ ปิดกลับได้
  - API ใช้ `PATCH /api/roommate-profiles/me/search-visibility`; การเชื่อมกับผลค้นหาจริงของ UC-04 เป็น integration test แยก
- Q-06 พฤติกรรมการนอนมีตัวเลือก "อื่น ๆ" ไหม และเลือก "ไม่มีพฤติกรรมดังกล่าว" ร่วมกับตัวเลือกอื่นได้ไหม?
  - ตอบแล้ว: มีตัวเลือก "อื่น ๆ" และต้องระบุข้อความอธิบายเมื่อเลือก; "ไม่มีพฤติกรรมดังกล่าว" ต้องเลือกเดี่ยว
- Q-07 ข้อมูลโปรไฟล์เก็บที่ไหน (ฐานข้อมูลอะไร มี backend ไหม)?
  - ตอบแล้ว: เก็บข้อมูลใน SQLite และมี backend (ต้องตรงกันทุกฟีเจอร์)

รายละเอียดที่ยังไม่ทำ: production identity provider ไม่ได้ถูกกำหนดและต้องเชื่อม trusted upstream ก่อนใช้งานจริง; dev demo identity ตาม ASM-05 ใช้เพื่อทดลองในเครื่องเท่านั้น (CON-AUTH-01).
