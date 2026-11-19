# RTM: สร้างโปรไฟล์หาเมท
อ้างอิง: [spec.md](./spec.md) Draft v4 | [tasks.md](./tasks.md) | [test-cases.md](./test-cases.md)
สร้างด้วย /verify เมื่อ 2026-11-19 14:44 UTC | test: Frontend 105 ผ่าน 0 ไม่ผ่าน; Backend ยังรัน test ไม่ได้เพราะ collection error 4 จุด (เก็บได้ 65 items)

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-RMP-01 | AC-RMP-01 | T-07 (เสร็จ), T-11 (รอ contract authentication/profile check) | `frontend/src/App.jsx`: `App`, onOpenProfile | `test_AC_RMP_01_open_profile_form` ผ่าน; ทดสอบเปิดฟอร์มเท่านั้น ไม่ตรวจ login/โปรไฟล์เดิม | ยังไม่ถึง |
| FR-RMP-02 | AC-RMP-01 | T-07 (เสร็จ), T-11 (รอ contract authentication/profile check) | `frontend/src/App.jsx`: render แบบฟอร์ม | `test_AC_RMP_01_open_profile_form` ผ่าน; ตรวจหัวข้อแบบฟอร์ม | ยังไม่ถึง |
| FR-RMP-03 | AC-RMP-02 | T-07 (เสร็จ), T-08 (เสร็จ) | `frontend/src/App.jsx`: controlled inputs, `update`; `frontend/src/config.js`: `PROFILE_CONFIG` | `test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior` ผ่าน; ตรวจค่าฟิลด์และตัวเลือกพฤติกรรมที่กรอก | ครบ |
| FR-RMP-04 | AC-RMP-02 | T-07 (เสร็จ), T-08 (เสร็จ) | `frontend/src/App.jsx`: `toggleSleepBehavior`; `frontend/src/config.js`: sleep options | `test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior`, `test_AC_RMP_02A_rejects_invalid_sleep_behavior_selections` ผ่าน; ตรวจ "อื่น ๆ", คำอธิบาย และตัวเลือกพิเศษแบบเลือกเดี่ยว | ครบ |
| FR-RMP-05 | AC-RMP-02A, AC-RMP-03, AC-RMP-04 | T-04/T-10 (พร้อมทำ), T-07/T-08 (เสร็จ) | `frontend/src/profileValidation.js`: `validateProfile`; `frontend/src/App.jsx`: `validate` | `test_AC_RMP_02A_accept_valid_profile_values`, `test_AC_RMP_03_requires_missing_profile_fields`, `test_AC_RMP_04_and_04A_reject_invalid_profile_values` ผ่าน; AC-RMP-02A assertions ยังไม่ตรวจทุก Then (F-07); ไม่มี validation endpoint สำหรับสร้างโปรไฟล์ | ช่องโหว่ |
| FR-RMP-06 | AC-RMP-03 | T-04/T-10 (พร้อมทำ), T-07/T-08 (เสร็จ) | `frontend/src/profileValidation.js`: required fields; `frontend/src/App.jsx`: `FieldError` | `test_AC_RMP_03_requires_missing_profile_fields`, `test_AC_RMP_03_requires_other_sleep_description` ผ่าน; ไม่ตรวจว่าไม่มีการสร้าง/บันทึกข้อมูล (F-02) | ช่องโหว่ |
| FR-RMP-07 | AC-RMP-04, AC-RMP-04A | T-04/T-10 (พร้อมทำ), T-07/T-08 (เสร็จ) | `frontend/src/profileValidation.js`: `validateProfile`; `frontend/src/App.jsx`: `FieldError` | `test_AC_RMP_04_and_04A_reject_invalid_profile_values`, `test_TC_RMP_04A_1_rejects_fan_room_over_capacity`, `test_TC_RMP_04A_3_rejects_fan_room_below_capacity` ผ่าน; ไม่ตรวจ no-save (F-02); AC-RMP-04A ไม่ครอบคลุมห้องแอร์ 5 คน (F-07) | ช่องโหว่ |
| FR-RMP-08 | AC-RMP-05, AC-RMP-05A | T-01/T-03/T-04/T-05 (พร้อมทำ), T-09 (รอรายละเอียดรูปและ auth), T-10 (พร้อมทำ) | ไม่พบการสร้างหรือ persistence โปรไฟล์ใน `frontend/src/` หรือ `backend/app/` | ไม่มี test การบันทึกโปรไฟล์; Backend suite เก็บไม่ได้เพราะ `python-multipart` หาย | ยังไม่ถึง |
| FR-RMP-09 | AC-RMP-05 | T-05 (พร้อมทำ), T-09 (รอรายละเอียดรูปและ auth) | ไม่พบข้อความสำเร็จจากการบันทึกโปรไฟล์; `App.validate` แสดงเฉพาะผล validation | ไม่มี test การสร้างสำเร็จ | ยังไม่ถึง |
| FR-RMP-10 | AC-RMP-06 | T-13/T-14 (รอ Q-05); การค้นหาจริงอยู่ UC-04 นอกขอบเขต | ไม่พบสถานะเผยแพร่ของโปรไฟล์ UC-01 ในโค้ด | `test_TC_RMP_06_1_profile_appears_after_enabled_search`, `test_TC_RMP_06_2_search_visibility_changes_with_status` เป็นแผนทดสอบกับคน; ไม่มีผลทดสอบ | รอ Q-05 |
| FR-RMP-11 | AC-RMP-05B, AC-RMP-06, AC-RMP-08 | T-02/T-05 (พร้อมทำ), T-13/T-14 (รอ Q-05) | ไม่พบการสร้างสถานะเริ่มต้น "ไม่เปิด" หรือจุดควบคุมสถานะในโปรไฟล์ UC-01 | ไม่มี test สถานะเริ่มต้น/เปลี่ยนสถานะ | รอ Q-05 |
| NFR-SEC-01 | AC-RMP-01, AC-RMP-01A | T-06/T-11 (รอ contract authentication/profile check) | `frontend/src/hooks/useAuth.js`: `useAuth`; ไม่มี identity provider สำหรับ UC-01 | ไม่มี test authentication ของการสร้างโปรไฟล์ | ยังไม่ถึง |
| NFR-REL-01 | AC-RMP-03, AC-RMP-04, AC-RMP-05A | T-05/T-10 (พร้อมทำ) | ไม่พบ persistence/transaction ของการสร้างโปรไฟล์ | test validation ไม่ตรวจผลข้อมูลที่บันทึกเมื่อ failure (F-02) | ช่องโหว่ |
| NFR-USE-01 | AC-RMP-07 | T-12 (พร้อมทำ) | ไม่มีหลักฐานทดลองกับผู้ใช้จริง | `test_TC_RMP_07_1/2/3` ระบุการทดลองกับคน; ยังไม่มีผล | ยังไม่ถึง |
| CON-AUTH-01 | AC-RMP-01, AC-RMP-01A | T-06/T-09/T-11 (รอสัญญา authentication) | `frontend/src/App.jsx`: `App`; `useAuth` ใช้สถานะ localStorage; ไม่พบ identity/auth provider ของ UC-01 | ไม่มี test authentication ของการสร้างโปรไฟล์ | ยังไม่ถึง |
| CON-PROFILE-01 | AC-RMP-01A | T-02/T-06/T-11 (T-02 รอวิธีเก็บรูป; T-06/T-11 รอรายละเอียดทางเทคนิค) | ไม่พบการตรวจโปรไฟล์เดิมก่อนเปิดฟอร์มหรือสร้าง | ไม่มี test `AC-RMP-01A` ในโค้ด | ยังไม่ถึง |
| CON-DATA-01 | AC-RMP-02, AC-RMP-03 | T-02/T-03/T-04/T-08 (T-02/T-04 พร้อมทำ; T-08 เสร็จ) | `frontend/src/profileValidation.js`: required fields และ sleep behavior | `test_AC_RMP_03_requires_missing_profile_fields`, `test_AC_RMP_03_requires_other_sleep_description` ผ่าน; ไม่ตรวจว่าไม่สร้าง/บันทึกข้อมูล (F-02) | ช่องโหว่ |
| CON-VALID-01 | AC-RMP-02A, AC-RMP-04 | T-03/T-04/T-07/T-08/T-10 (T-03/T-04/T-10 พร้อมทำ; T-07/T-08 เสร็จ) | `frontend/src/config.js`: `PROFILE_CONFIG`; `frontend/src/profileValidation.js`: `validateProfile` | AC-RMP-02A ไม่ assert ว่าไม่มี error ทุกช่องและปุ่มยืนยันกดได้; ไม่มีกรณีห้องแอร์ 5 คนใน AC-RMP-04A tests (F-07) | ช่องโหว่ |
| CON-REL-01 | AC-RMP-03, AC-RMP-04 | T-04/T-05/T-10 (พร้อมทำ) | ไม่พบ persistence ที่ยืนยันว่าไม่เหลือข้อมูลบางส่วน | test ตรวจ error แต่ไม่ตรวจข้อมูลที่บันทึก (F-02) | ช่องโหว่ |
| CON-ROOM-01 | AC-RMP-04A | T-03/T-04/T-07/T-10 (T-03/T-04/T-10 พร้อมทำ; T-07 เสร็จ) | `frontend/src/config.js`: `roomOccupants`; `frontend/src/profileValidation.js`: room bounds | `test_TC_RMP_04A_1`, `test_TC_RMP_04A_2`, `test_TC_RMP_04A_3` ผ่าน; ไม่มี test ห้องแอร์ 5 คนและไม่มีการตรวจ no-save (F-02, F-07) | ช่องโหว่ |
| CON-DISCOVER-01 | AC-RMP-05B, AC-RMP-06, AC-RMP-08 | T-02/T-05 (พร้อมทำ), T-13/T-14 (รอ Q-05) | ไม่พบสถานะเริ่มต้นหรือควบคุมการเผยแพร่สำหรับโปรไฟล์ UC-01 | ไม่มี test สถานะ; การค้นหาจริงเป็น UC-04 | รอ Q-05 |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/App.jsx`: เมนูสร้างโปรไฟล์และ render form ใน `App` | FR-RMP-01, FR-RMP-02, AC-RMP-01 | ตรงบางส่วน | เปิดฟอร์มได้; ไม่ตรวจ login/โปรไฟล์เดิมและไม่มีการนำไปหน้า login; T-11 ยังรอ contract |
| `frontend/src/App.jsx`: `update`, input/select handlers | FR-RMP-03, CON-DATA-01 | ตรงบางส่วน | ค่าฟิลด์ถูกเก็บใน state และแสดงกลับ; ยังไม่ส่งหรือบันทึก |
| `frontend/src/App.jsx`: `toggleSleepBehavior`, sleep options และช่องคำอธิบาย | FR-RMP-04, CON-DATA-01, CON-VALID-01, Q-06 | ตรง | มี "อื่น ๆ" พร้อมคำอธิบายบังคับ; "ไม่มีพฤติกรรมดังกล่าว" เลือกเดี่ยวตามคำตอบ Q-06 |
| `frontend/src/App.jsx`: `validate`, `FieldError` | FR-RMP-05, FR-RMP-06, FR-RMP-07, CON-VALID-01 | ตรงบางส่วน | แสดง validation errors; ไม่มีปุ่มยืนยันการสร้าง/การเรียก API จึงยังพิสูจน์การไม่บันทึกไม่ได้ (F-02) |
| `frontend/src/profileValidation.js`: `validateProfile` | FR-RMP-05, FR-RMP-06, FR-RMP-07, CON-DATA-01, CON-VALID-01, CON-ROOM-01, Q-06 | ตรงบางส่วน | ตรวจ required fields, อายุ, ตัวเลือก, ชนิด/ขนาดรูป, โทรศัพท์, ห้อง และ Q-06; เป็น frontend validation เท่านั้น |
| `frontend/src/config.js`: `PROFILE_CONFIG` และ sleep constants | FR-RMP-03, FR-RMP-04, CON-DATA-01, CON-VALID-01, CON-ROOM-01 | ตรง | ค่าที่เกี่ยวกับ UC-01 อยู่ใน frontend config; ไม่พบ config สร้างโปรไฟล์ใน `backend/app/config.py` |
| `frontend/src/hooks/useAuth.js`: `useAuth` | CON-AUTH-01, NFR-SEC-01 | ยังยืนยันไม่ได้ | ใช้ localStorage/ค่าเริ่มต้นสำหรับ UI state; ไม่ใช่หลักฐาน identity provider หรือการยืนยันตัวตนจริง; T-11 ยังรอ contract |
| `frontend/src/main.jsx`: `createRoot`; `frontend/src/index.css` | ไม่มี FR โดยตรง | ไม่ขัดกับ spec ที่ตรวจได้ | bootstrap React และนำเข้า Tailwind เท่านั้น |
| `frontend/src/api/client.js`: `searchRoommates`; `SearchRoommatePage`, `SearchFiltersForm`, `SearchResultsList` | FR-SRS-* (UC-04) | ไม่ใช่ UC-01 | การค้นหาจริงเป็น UC-04 ตามข้อยกเว้นใน spec UC-01; ไม่ใช่ implementation ของ FR-RMP-10 |
| `frontend/src/pages/ProfileDetailPage.js`, `ProfileCard`; `/profile-detail/{profile_user_id}` | FR-SRS-04, FR-SRS-06, CON-SRS-06 (UC-04) | ไม่ใช่ UC-01 | แสดงรายละเอียดโปรไฟล์ค้นหา; API ไม่ใช่ API สร้างโปรไฟล์ |
| `frontend/src/pages/ProfileEditPage.jsx`, `ProfileForm.jsx`, `ProfilePage.jsx`; `backend/app/profile_model.py`, `profile_service.py`, `profile_update.py`, `profile_validation.py` | FR-ERP-* (UC-02) | อยู่นอกขอบเขต UC-01 | เป็นการดู/แก้ไขโปรไฟล์เดิม ไม่ใช่การสร้างโปรไฟล์ |
| `frontend/src/pages/RequestRoommatePage.jsx`, `RoommateRequestListPage.jsx`, `NotificationsPage.jsx`, `RoommateRequestDetail.jsx`; roommate request service/API | FR-RRS-* (UC-03) | อยู่นอกขอบเขต UC-01 | เป็นคำขอ/การแจ้งเตือนรูมเมท ไม่ใช่การสร้างโปรไฟล์ |
| `frontend/src/pages/ChatListPage.jsx`, `ChatPage.jsx`; `frontend/src/api/client.js`: chat API functions | FR-CHAT-* (UC-05) | อยู่นอกขอบเขต UC-01 | UI เรียก API backend สำหรับ chat ซึ่งแยกจาก UC-01 |
| `backend/app/controllers/chat_controller.py`: `GET /api/chat/list`, `POST /api/chat/open` | FR-CHAT-01/02/08/12, CON-AUTH-01, CON-CHAT-01 | อยู่นอกขอบเขต UC-01 | API ของ UC-05; ไม่พบ endpoint สร้างโปรไฟล์ |
| `backend/app/main.py`: `POST /api/chat/messages`, `POST /api/chat/messages/with-attachment`, `POST /api/chat/messages/{message_id}/read`, `GET /api/chat/messages`, `GET /api/chat/attachments/{attachment_id}` | FR-CHAT-* และ CON-CHAT-* | อยู่นอกขอบเขต UC-01 | endpoints ของ UC-05; ไม่มี `POST /api/roommate-profiles` ตามข้อเสนอทางเทคนิคใน plan UC-01 |
| `backend/app/api/search.py`: `POST /search-roommates` | FR-SRS-* (UC-04) | อยู่นอกขอบเขต UC-01 | การค้นหาจริงตาม UC-04 ไม่ใช่การบันทึกโปรไฟล์ |
| `backend/app/api/profile_detail.py`: `GET /profile-detail/{profile_user_id}` | FR-SRS-04/06 (UC-04) | อยู่นอกขอบเขต UC-01 | คืนรายละเอียดโปรไฟล์ค้นหา ไม่ใช่ API สร้างโปรไฟล์ |
| `backend/app/main.py`: `GET /health` | ไม่มี FR ใน UC-01 | ไม่เกี่ยวกับ UC-01 | endpoint สุขภาพของ backend; ไม่ได้ใช้โดยหน้า/ฟังก์ชันสร้างโปรไฟล์ |
| `backend/app/` ที่เหลือ: โมเดล, service, repository และ config | FR-RMP-08 ถึง FR-RMP-11 | ไม่พบ implementation UC-01 | พบโค้ด UC-02/04/05 แต่ไม่พบ model, persistence, validation API หรือ discovery state สำหรับการสร้างโปรไฟล์ |
| `frontend/src/__tests__/profile-form.test.jsx`, `setup.test.jsx` | AC-RMP-01, AC-RMP-02, AC-RMP-02A, AC-RMP-03, AC-RMP-04, AC-RMP-04A | ตรงบางส่วน | 105 tests ผ่านทั้งหมดใน Frontend; ช่องว่างของ assertion ใน AC-RMP-03/04/04A และ AC-RMP-02A ตาม F-02/F-07 |
| `frontend/src/__tests__/*`, `frontend/src/api/client.test.js`, `backend/tests/*` ที่เหลือ | FR-SRS-*, FR-RRS-*, FR-ERP-*, FR-CHAT-* | เป็น test ของ UC อื่น | อ่านครบ; Backend test suite ยังรันไม่ได้จาก collection error ไม่ใช่หลักฐานการผ่าน |

ตรวจตัวเลข/ข้อมูลย้อนกลับ: ค่าอายุ รูป เบอร์โทรศัพท์ จำนวนผู้พัก ตัวเลือก และ sleep rules สำหรับ UI อยู่ใน `frontend/src/config.js` ตาม plan; ไม่พบการเก็บข้อมูลสร้างโปรไฟล์, API request/response, log หรือการรับ identity สำหรับ UC-01. ไม่มี `specs/000-shared/` และไม่มีโฟลเดอร์ mockup ของฟีเจอร์นี้; spec ระบุว่าไม่มี UI ID/mockup.

## 3. ข้อค้นพบ
ข้อค้นพบคงค้าง: F-02, F-07, F-08. ย้าย F-06 ไป "แก้แล้ว" หลังยืนยันโค้ดตามคำตอบ Q-06; F-01, F-03, F-04 และ F-05 เป็นประวัติในหัวข้อ "แก้แล้ว" ด้านล่าง

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-02 | test อ่อน | `frontend/src/__tests__/profile-form.test.jsx`: tests ของ AC-RMP-03, AC-RMP-04 และ TC-RMP-04A-1, TC-RMP-04A-3 | AC-RMP-03, AC-RMP-04, AC-RMP-04A, NFR-REL-01, CON-REL-01, CON-ROOM-01 | test ตรวจ error/ไม่มี success status หรือ error จาก pure validator แต่ไม่ตรวจผลในข้อมูลว่าระบบไม่สร้าง/ไม่บันทึกโปรไฟล์ตาม Then; ปัจจุบันไม่มี persistence/backend ให้ตรวจ และทีมให้พักจนกว่าจะกำหนดแนวทางใน plan/constraints | พักไว้จนทีมระบุแนวทาง persistence/backend ใน plan/constraints; ยังไม่ implement โดยไม่เดาเทคโนโลยี |
| F-07 | test อ่อน | `frontend/src/__tests__/profile-form.test.jsx`: `test_AC_RMP_02A_accept_valid_profile_values`, tests ของ AC-RMP-04A | AC-RMP-02A, AC-RMP-04A, CON-VALID-01, CON-ROOM-01 | test AC-RMP-02A ตรวจเพียง status text ไม่ assert ว่าไม่มีข้อความผิดพลาดทุกช่องหรือปุ่มยืนยันกดได้; tests ของ AC-RMP-04A ตรวจเฉพาะห้องพัดลม 0/4 คนและไม่ครอบคลุมห้องแอร์ 5 คนตาม AC | |
| F-08 | test case ล้าสมัย | `specs/001-roommate-profile/test-cases.md`: TC-RMP-01-3, TC-RMP-02-3 และ TC-RMP-03-* ถึง TC-RMP-05A-* | คำตอบ Q-04, Q-06, Q-07; AC-RMP-01, AC-RMP-02 ถึง AC-RMP-05A | test-cases ยังระบุสถานะ "รอ Q-04", "รอ Q-06" และ "รอ Q-07" ทั้งที่ spec ตอบคำถามเหล่านี้แล้ว; TC-RMP-02-3 ยังไม่สะท้อนว่าการเลือกตัวเลือกพิเศษร่วมกันต้องถูกปฏิเสธตามคำตอบ Q-06. ไม่แก้ test-cases ตามขอบเขต /verify | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| F-01 | แก้ test AC-RMP-02 ให้กรอกข้อมูลและ assert ค่าที่รับจริง รวมถึง checkbox พฤติกรรมการนอน | `test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior` ผ่าน; Frontend รวม 105 tests ผ่าน |
| F-03 | ทีมตัดสินว่าไม่ใช่ปัญหาใน prototype ที่ยังไม่เปิดใช้งานจริง; รอ task implement | คำตอบทีมในขั้น verify; สถานะ CON-AUTH-01, CON-PROFILE-01 และ NFR-SEC-01 เป็น "ยังไม่ถึง" |
| F-04 | ลบ `frontend/src/api/client.js` ซึ่งมี endpoints booking ที่ไม่ใช้ใน roommate feature | ค้นไม่พบ import/usage; Frontend tests ผ่าน |
| F-05 | แทนกรณีนอกหน้าแบบฟอร์มด้วยกรณีผู้พักห้องพัดลม 0 คน และเพิ่ม test ตาม TC-RMP-04A-3 | `test_TC_RMP_04A_3_rejects_fan_room_below_capacity` ผ่าน; test cases ไม่อ้าง Q-04 |
| F-06 | ปรับ Q-06 และโค้ดให้มี "อื่น ๆ" พร้อมคำอธิบายบังคับ และให้ "ไม่มีพฤติกรรมดังกล่าว" เลือกเดี่ยว | `test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior`, `test_AC_RMP_02A_rejects_invalid_sleep_behavior_selections`, `test_AC_RMP_03_requires_other_sleep_description` ผ่าน; `cd frontend && npm test` ผ่าน 105 tests |
