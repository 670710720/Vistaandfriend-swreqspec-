# RTM: สร้างโปรไฟล์หาเมท
อ้างอิง: [spec.md](./spec.md) Draft v4 | [tasks.md](./tasks.md) | [test-cases.md](./test-cases.md)
สร้างด้วย /verify เมื่อ 2026-11-12 04:11 UTC | test: frontend 8 ผ่าน 0 ไม่ผ่าน; backend 0 collected, exit code 5 (ไม่มี test)

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-RMP-01 | AC-RMP-01 | T-07 (เสร็จ รอทีมตรวจ), T-11 (รอรายละเอียด authentication/profile check) | `frontend/src/App.jsx`: `App` | `test_AC_RMP_01_open_profile_form` ผ่าน; ตรวจเปิดฟอร์มเท่านั้น | ยังไม่ถึง |
| FR-RMP-02 | AC-RMP-01 | T-07 (เสร็จ รอทีมตรวจ), T-11 (รอรายละเอียด authentication/profile check) | `frontend/src/App.jsx`: `App` | `test_AC_RMP_01_open_profile_form` ผ่าน; ตรวจหัวข้อแบบฟอร์ม | ยังไม่ถึง |
| FR-RMP-03 | AC-RMP-02 | T-07 (เสร็จ รอทีมตรวจ) | `frontend/src/App.jsx`: controlled inputs, `update` | `test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior` ผ่าน; assert ค่าฟิลด์ที่จำเป็นและพฤติกรรมที่เลือก | ครบ |
| FR-RMP-04 | AC-RMP-02 | T-07 (เสร็จ รอทีมตรวจ), T-08 (พร้อมทำ) | `frontend/src/App.jsx`: `toggleSleepBehavior`; `frontend/src/config.js`: `sleepBehaviors` | `test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior` ผ่าน; แต่มีตัวเลือก "อื่น ๆ" และไม่บังคับ "ไม่มีพฤติกรรมดังกล่าว" ให้เลือกเดี่ยว (F-06) | ช่องโหว่ |
| FR-RMP-05 | AC-RMP-02A, AC-RMP-03, AC-RMP-04 | T-04 (พร้อมทำ), T-07 (เสร็จ รอทีมตรวจ), T-10 (พร้อมทำ) | `frontend/src/profileValidation.js`: `validateProfile`; `frontend/src/App.jsx`: `validate` | `test_AC_RMP_02A_accept_valid_profile_values`, `test_AC_RMP_03_requires_missing_profile_fields`, `test_AC_RMP_04_and_04A_reject_invalid_profile_values` ผ่าน; ยังไม่ครอบคลุมการตรวจใน API | ยังไม่ถึง |
| FR-RMP-06 | AC-RMP-03 | T-04 (พร้อมทำ), T-07 (เสร็จ รอทีมตรวจ), T-10 (พร้อมทำ) | `frontend/src/profileValidation.js`: required fields; `frontend/src/App.jsx`: `FieldError` | `test_AC_RMP_03_requires_missing_profile_fields` ผ่าน; ไม่ยืนยันว่าไม่มีการสร้าง/บันทึกข้อมูล (F-02) | ช่องโหว่ |
| FR-RMP-07 | AC-RMP-04, AC-RMP-04A | T-04 (พร้อมทำ), T-07 (เสร็จ รอทีมตรวจ), T-10 (พร้อมทำ) | `frontend/src/profileValidation.js`: `validateProfile`; `frontend/src/App.jsx`: `FieldError` | `test_AC_RMP_04_and_04A_reject_invalid_profile_values`, `test_TC_RMP_04A_1_rejects_fan_room_over_capacity`, `test_TC_RMP_04A_3_rejects_fan_room_below_capacity` ผ่าน; ไม่ยืนยันการไม่บันทึก (F-02) | ช่องโหว่ |
| FR-RMP-08 | AC-RMP-05, AC-RMP-05A | T-01–T-05 (ฐานข้อมูล/API ยังไม่เสร็จ), T-09 (รอรายละเอียดรูปและ authentication) | ไม่พบ persistence ใน `frontend/src/` หรือ `backend/app/` | ไม่มี test การบันทึกในโค้ด | ยังไม่ถึง |
| FR-RMP-09 | AC-RMP-05 | T-05 (พร้อมทำ), T-09 (รอรายละเอียดรูปและ authentication) | ไม่พบการสร้างโปรไฟล์หรือข้อความยืนยันการบันทึก; ข้อความใน `App` ยืนยันเพียงผล validation | ไม่มี test การสร้างสำเร็จในโค้ด | ยังไม่ถึง |
| FR-RMP-10 | AC-RMP-06 | T-13, T-14 (รอ Q-05); การค้นหาจริงเป็น UC-04 นอกขอบเขต | ไม่พบโค้ดสถานะเผยแพร่หรือการค้นหา | `test_TC_RMP_06_1_profile_appears_after_enabled_search`, `test_TC_RMP_06_2_search_visibility_changes_with_status` เป็นแผนทดสอบโดยคน; ไม่มีผลทดสอบ | รอ Q-05 |
| FR-RMP-11 | AC-RMP-05B, AC-RMP-06, AC-RMP-08 | T-02, T-05 (ยังไม่เสร็จ), T-13, T-14 (รอ Q-05) | ไม่พบการบันทึกสถานะหรือควบคุมสถานะในโค้ด | ไม่มี test สถานะในโค้ด; test ของ AC-RMP-05B/06/08 ยังไม่รัน | รอ Q-05 |
| NFR-SEC-01 | AC-RMP-01, AC-RMP-01A | T-06, T-11 (รอสัญญา authentication/profile check) | `frontend/src/App.jsx`: `App` เปิดฟอร์มโดยไม่มี auth guard | ไม่มี test ตรวจการเข้าสู่ระบบ | ยังไม่ถึง |
| NFR-REL-01 | AC-RMP-03, AC-RMP-04, AC-RMP-05A | T-05, T-10 (พร้อมทำ) | ไม่มี persistence/transaction ใน frontend หรือ backend | test validation ไม่ตรวจข้อมูลที่บันทึกหลัง failure (F-02) | ช่องโหว่ |
| NFR-USE-01 | AC-RMP-07 | T-12 (พร้อมทำ) | ไม่มีผลทดลอง usability ในโค้ดหรือเอกสารผลการทดลองที่ตรวจพบ | `test_TC_RMP_07_1/2/3` วางแผนให้ทดสอบกับคน; ไม่มีผลทดลอง | ยังไม่ถึง |
| CON-AUTH-01 | AC-RMP-01, AC-RMP-01A | T-06, T-09, T-11 (รอสัญญา authentication) | `frontend/src/App.jsx`: `App`; ไม่พบ backend | ไม่มี test auth | ยังไม่ถึง |
| CON-PROFILE-01 | AC-RMP-01A | T-02, T-06, T-11 (T-02 รอวิธีเก็บรูป; T-06/T-11 รอรายละเอียดทางเทคนิค) | ไม่พบการตรวจโปรไฟล์เดิมใน frontend หรือ backend | ไม่มี test `AC-RMP-01A` ในโค้ด | ยังไม่ถึง |
| CON-DATA-01 | AC-RMP-03 | T-02, T-03, T-04, T-08 | `frontend/src/profileValidation.js`: required fields และ sleep behavior; พฤติกรรม sleep ยังมีตัวเลือกต้องห้ามตาม F-06 | `test_AC_RMP_03_requires_missing_profile_fields` ผ่าน; ไม่ตรวจการไม่บันทึก (F-02) | ช่องโหว่ |
| CON-VALID-01 | AC-RMP-02A, AC-RMP-04 | T-03, T-04, T-07, T-08, T-10 | `frontend/src/config.js`: `PROFILE_CONFIG`; `frontend/src/profileValidation.js`: `validateProfile`; มีค่าพฤติกรรมการนอนขัด Q-06 (F-06) | `test_AC_RMP_02A_accept_valid_profile_values` ตรวจเพียง status; ไม่ assert ไม่มี error/กดปุ่มได้; AC-RMP-04A ยังไม่ครอบคลุมห้องแอร์ 5 คน (F-07) | ช่องโหว่ |
| CON-REL-01 | AC-RMP-03, AC-RMP-04 | T-04, T-05, T-10 | ไม่พบ persistence ที่ใช้ยืนยันว่าไม่มีข้อมูลบางส่วน | test ตรวจ error แต่ไม่ตรวจผลข้อมูลที่บันทึก (F-02) | ช่องโหว่ |
| CON-ROOM-01 | AC-RMP-04A | T-03, T-04, T-07, T-10 | `frontend/src/config.js`: `roomOccupants`; `frontend/src/profileValidation.js`: room bounds | `test_TC_RMP_04A_1_rejects_fan_room_over_capacity`, `test_TC_RMP_04A_2_accepts_fan_room_capacity_limit`, `test_TC_RMP_04A_3_rejects_fan_room_below_capacity` ผ่าน; ไม่ตรวจ no-save และไม่มีกรณีห้องแอร์ 5 คน (F-02, F-07) | ช่องโหว่ |
| CON-DISCOVER-01 | AC-RMP-05B, AC-RMP-06, AC-RMP-08 | T-02, T-05, T-13, T-14 (ส่วนการเปิดสถานะรอ Q-05) | ไม่พบสถานะเริ่มต้นหรือการควบคุมการเผยแพร่ในโค้ด | ไม่มี test สถานะในโค้ด | รอ Q-05 |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/App.jsx`: `App` และปุ่มเปิดฟอร์ม | FR-RMP-01, FR-RMP-02, AC-RMP-01 | ตรงบางส่วน | เปิดฟอร์มได้; ไม่ตรวจ login/โปรไฟล์เดิม ซึ่งยังรอ task ตามข้อสรุปเดิมของทีม (F-03) |
| `frontend/src/App.jsx`: `update`, input/select handlers | FR-RMP-03, CON-DATA-01 | ตรงบางส่วน | รับข้อมูลที่จำเป็นและข้อมูลเสริมใน state; ยังไม่มีการส่งหรือบันทึก |
| `frontend/src/App.jsx`: `toggleSleepBehavior` และส่วน render sleep options | FR-RMP-04, CON-DATA-01, CON-VALID-01 | ไม่ตรง | แสดง "อื่น ๆ" และเลือก "ไม่มีพฤติกรรมดังกล่าว" ร่วมกับตัวเลือกอื่นได้ (F-06) |
| `frontend/src/App.jsx`: `validate`, `FieldError` และปุ่ม submit | FR-RMP-05, FR-RMP-06, FR-RMP-07, CON-VALID-01, CON-REL-01 | ตรงบางส่วน | แสดง validation errors แต่ไม่สร้างโปรไฟล์หรือพิสูจน์การไม่บันทึก |
| `frontend/src/profileValidation.js`: `validateProfile` | FR-RMP-05, FR-RMP-06, FR-RMP-07, CON-DATA-01, CON-VALID-01, CON-ROOM-01 | ตรงบางส่วน | ตรวจ required fields, อายุ, ตัวเลือก, รูป, เบอร์โทรและจำนวนผู้พัก; ไม่ปฏิเสธ "อื่น ๆ" หรือพฤติกรรมที่เลือกขัดกัน |
| `frontend/src/config.js`: `PROFILE_CONFIG` | FR-RMP-03, FR-RMP-04, CON-DATA-01, CON-VALID-01, CON-ROOM-01 | ตรงบางส่วน | ค่าช่วงอายุ/รูป/โทรศัพท์/ห้องสัมพันธ์กับ spec; sleep options มี "อื่น ๆ" เพิ่มเกิน spec (F-06) |
| `frontend/src/main.jsx`: `createRoot` | ไม่มี FR โดยตรง | เป็น bootstrap | mount `App`; ไม่เพิ่มพฤติกรรม feature |
| `frontend/src/index.css` | ไม่มี FR โดยตรง | ไม่ขัดกับ spec ที่ตรวจได้ | นำเข้า Tailwind CSS เท่านั้น |
| `frontend/src/__tests__/setup.test.jsx`, `frontend/src/__tests__/profile-form.test.jsx` | AC-RMP-01, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A | ตรงบางส่วน | 8 tests ผ่าน; ข้อจำกัดของ assertions อยู่ใน F-02 และ F-07 |
| `backend/app/`, `backend/tests/` | FR-RMP-05 ถึง FR-RMP-11, NFR-REL-01 | ไม่มีไฟล์ | ไม่พบ backend application หรือ tests; pytest เก็บ test ไม่พบ (0 collected, exit code 5) |

ตรวจตัวเลข/ข้อมูลย้อนกลับ: ค่าช่วงอายุ, ขนาดรูป, จำนวนหลักโทรศัพท์, จำนวนผู้พัก, ตัวเลือกคณะ/เพศ/ชั้นปี และ social channels อยู่ใน `frontend/src/config.js` ตาม spec; ไม่พบ log, API request/response หรือการรับข้อมูลระบุตัวตนใน source ที่ตรวจ

## 3. ข้อค้นพบ
ข้อค้นพบคงค้าง: F-02, F-06, F-07. F-01, F-03, F-04 และ F-05 เป็นประวัติในหัวข้อ "แก้แล้ว" ด้านล่าง

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-02 | test อ่อน | `frontend/src/__tests__/profile-form.test.jsx`: tests ของ AC-RMP-03, AC-RMP-04 และ TC-RMP-04A-1, TC-RMP-04A-3 | AC-RMP-03, AC-RMP-04, AC-RMP-04A, NFR-REL-01, CON-REL-01, CON-ROOM-01 | test ตรวจ error/ไม่มี success status หรือ error จาก pure validator แต่ไม่ตรวจผลในข้อมูลว่าระบบไม่สร้าง/ไม่บันทึกโปรไฟล์ตาม Then; ปัจจุบันไม่มี persistence/backend ให้ตรวจ และทีมให้พักจนกว่าจะกำหนดแนวทางใน plan/constraints | พักไว้จนทีมระบุแนวทาง persistence/backend ใน plan/constraints; ยังไม่ implement โดยไม่เดาเทคโนโลยี |
| F-06 | ละเมิด Constraint | `frontend/src/config.js`: `PROFILE_CONFIG.sleepBehaviors`; `frontend/src/App.jsx`: sleep options; `frontend/src/profileValidation.js`: `validateProfile` | FR-RMP-04, CON-DATA-01, CON-VALID-01, คำตอบ Q-06 | โค้ดยังแสดงและรับตัวเลือก "อื่น ๆ" ทั้งที่ spec ระบุว่าไม่มี และ validation ยอมให้เลือก "ไม่มีพฤติกรรมดังกล่าว" ร่วมกับตัวเลือกอื่น ทั้งที่ Q-06 กำหนดให้เป็นตัวเลือกเดี่ยว | |
| F-07 | test อ่อน | `frontend/src/__tests__/profile-form.test.jsx`: `test_AC_RMP_02A_accept_valid_profile_values`, tests ของ AC-RMP-04A | AC-RMP-02A, AC-RMP-04A, CON-VALID-01, CON-ROOM-01 | test AC-RMP-02A ตรวจเพียง status text ไม่ assert ว่าไม่มีข้อความผิดพลาดทุกช่องหรือปุ่มยืนยันกดได้; tests ของ AC-RMP-04A ตรวจเฉพาะห้องพัดลม 0/4 คนและไม่ครอบคลุมห้องแอร์ 5 คนตาม AC | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| F-01 | แก้ test AC-RMP-02 ให้กรอกข้อมูลและ assert ค่าที่รับจริง รวมถึง checkbox พฤติกรรมการนอน | `test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior` ผ่าน; frontend รวม 8 tests ผ่าน |
| F-03 | ทีมตัดสินว่าไม่ใช่ปัญหาใน prototype ที่ยังไม่เปิดใช้งานจริง; รอ task implement | คำตอบทีมในขั้น verify; สถานะ CON-AUTH-01, CON-PROFILE-01 และ NFR-SEC-01 เป็น "ยังไม่ถึง" |
| F-04 | ลบ `frontend/src/api/client.js` ซึ่งมี endpoints booking ที่ไม่ใช้ใน roommate feature | ค้นไม่พบ import/usage; frontend tests 8 tests ผ่านหลังลบ |
| F-05 | แทนกรณีนอกหน้าแบบฟอร์มด้วยกรณีผู้พักห้องพัดลม 0 คน และเพิ่ม test ตาม TC-RMP-04A-3 | `test_TC_RMP_04A_3_rejects_fan_room_below_capacity` ผ่าน; test cases ไม่อ้าง Q-04 |
