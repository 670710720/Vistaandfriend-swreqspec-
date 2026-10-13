# RTM: สร้างโปรไฟล์หาเมท
อ้างอิง: [spec.md](./spec.md) Draft v3 | [tasks.md](./tasks.md) | [test-cases.md](./test-cases.md)
สร้างด้วย /verify เมื่อ 2026-10-13 16:14 UTC | test: 7 ผ่าน 0 ไม่ผ่าน; backend pytest ไม่พบ test (0 collected, exit 5)

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-RMP-01 | AC-RMP-01 | T-02 (พร้อมทำ) | `frontend/src/App.jsx`: `App` เปิดแบบฟอร์มจากปุ่ม | `test_AC_RMP_01_open_profile_form` (ผ่าน) | ยังไม่ถึง |
| FR-RMP-02 | AC-RMP-01 | T-02 (พร้อมทำ) | `frontend/src/App.jsx`: `App` render แบบฟอร์ม | `test_AC_RMP_01_open_profile_form` (ผ่าน) | ยังไม่ถึง |
| FR-RMP-03 | AC-RMP-02 | T-01 (เสร็จ รอทีมตรวจ), T-02 (พร้อมทำ) | `frontend/src/App.jsx`: input fields และ `update` | `test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior` (ผ่าน แต่ตรวจเพียงการมี controls) | ช่องโหว่ |
| FR-RMP-04 | AC-RMP-02 | T-01 (เสร็จ รอทีมตรวจ), T-02 (พร้อมทำ) | `frontend/src/App.jsx`: sleep behavior checkboxes และ `toggleSleepBehavior` | `test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior` (ผ่าน แต่ไม่ได้ลองกรอก/ตรวจค่าที่รับ) | ช่องโหว่ |
| FR-RMP-05 | AC-RMP-02A, AC-RMP-03, AC-RMP-04 | T-01 (เสร็จ รอทีมตรวจ), T-02 (พร้อมทำ) | `frontend/src/profileValidation.js`: `validateProfile`; `frontend/src/App.jsx`: `validate` | `test_AC_RMP_02A_accept_valid_profile_values`, `test_AC_RMP_03_requires_missing_profile_fields`, `test_AC_RMP_04_and_04A_reject_invalid_profile_values` (ผ่าน; ตรวจ validation บางส่วน) | ช่องโหว่ |
| FR-RMP-06 | AC-RMP-03 | T-01 (เสร็จ รอทีมตรวจ), T-02 (พร้อมทำ) | `frontend/src/profileValidation.js`: ตรวจ required fields; `frontend/src/App.jsx`: `FieldError` | `test_AC_RMP_03_requires_missing_profile_fields` (ผ่าน; ไม่ตรวจว่าข้อมูลไม่ถูกบันทึก) | ช่องโหว่ |
| FR-RMP-07 | AC-RMP-04 | T-01 (เสร็จ รอทีมตรวจ), T-02 (พร้อมทำ) | `frontend/src/profileValidation.js`: ตรวจค่าและสร้าง error; `frontend/src/App.jsx`: `FieldError` | `test_AC_RMP_04_and_04A_reject_invalid_profile_values` (ผ่าน; ตรวจอายุ/โทรศัพท์และไม่มี status) | ช่องโหว่ |
| FR-RMP-08 | AC-RMP-05, AC-RMP-05A | T-03 (พร้อมทำ) | ไม่พบการบันทึกโปรไฟล์ใน frontend หรือ backend | ไม่มี test ในโค้ด (task ยังไม่ทำ) | ยังไม่ถึง |
| FR-RMP-09 | AC-RMP-05 | T-03 (พร้อมทำ) | ไม่พบการสร้างโปรไฟล์หรือข้อความสำเร็จ; มีเพียงข้อความว่า "สามารถดำเนินการยืนยันการสร้างโปรไฟล์ได้" | ไม่มี test ในโค้ด (task ยังไม่ทำ) | ยังไม่ถึง |
| FR-RMP-10 | AC-RMP-06 | T-03 (พร้อมทำ) | ไม่พบฟังก์ชันค้นหาโปรไฟล์ | ไม่มี test ในโค้ด (task ยังไม่ทำ) | ยังไม่ถึง |
| FR-RMP-11 | AC-RMP-05B, AC-RMP-06, AC-RMP-08 | T-03 (พร้อมทำ) | ไม่พบการบันทึกหรือเปิดสถานะค้นหา | ไม่มี test ในโค้ด (task ยังไม่ทำ) | ยังไม่ถึง |
| NFR-SEC-01 | AC-RMP-01, AC-RMP-01A (ไม่มี AC เฉพาะกรณีไม่ login) | T-02 (พร้อมทำ) | `frontend/src/App.jsx`: `App` แสดงเมนูโดยไม่มี session/auth guard | ไม่มี test ตรวจการ login | ยังไม่ถึง |
| NFR-REL-01 | AC-RMP-03, AC-RMP-04, AC-RMP-05A | T-01 (เสร็จ รอทีมตรวจ), T-02 (พร้อมทำ) | `frontend/src/profileValidation.js`: validation; ไม่พบ persistence transaction | `test_AC_RMP_03_requires_missing_profile_fields`, `test_AC_RMP_04_and_04A_reject_invalid_profile_values` ผ่าน แต่ไม่มีการตรวจสถานะข้อมูลที่บันทึก | ช่องโหว่ |
| NFR-USE-01 | AC-RMP-07 | T-04, T-05 (พร้อมทำ) | `frontend/src/App.jsx`: แบบฟอร์มต้นแบบ; ยังไม่มีผลการทดสอบ usability กับผู้ใช้ | ไม่มี test/usability result (task ยังไม่ทำ) | ยังไม่ถึง |
| CON-AUTH-01 | AC-RMP-01 (Given login), AC-RMP-01A | T-02 (พร้อมทำ) | `frontend/src/App.jsx`: `App` เปิดแบบฟอร์มได้โดยไม่มีการตรวจ login | ไม่มี test ตรวจกรณีไม่ login | ยังไม่ถึง |
| CON-PROFILE-01 | AC-RMP-01A | T-02 (พร้อมทำ) | ไม่พบการตรวจว่าผู้ใช้มีโปรไฟล์เดิมหรือไม่ | ไม่มี test `AC-RMP-01A` ในโค้ด | ยังไม่ถึง |
| CON-DATA-01 | AC-RMP-03 | T-01 (เสร็จ รอทีมตรวจ), T-02 (พร้อมทำ) | `frontend/src/profileValidation.js`: `requiredFields` และ validation พฤติกรรมการนอน | `test_AC_RMP_03_requires_missing_profile_fields` ผ่าน; ไม่ตรวจว่าข้อมูลไม่ถูกบันทึก | ช่องโหว่ |
| CON-VALID-01 | AC-RMP-02A, AC-RMP-04 | T-01 (เสร็จ รอทีมตรวจ), T-02 (พร้อมทำ) | `frontend/src/profileValidation.js`: `validateProfile`; ค่าอยู่ใน `frontend/src/config.js` | `test_AC_RMP_02A_accept_valid_profile_values`, `test_AC_RMP_04_and_04A_reject_invalid_profile_values` ผ่าน; ครอบคลุม valid path และ invalid บางค่า | ช่องโหว่ |
| CON-REL-01 | AC-RMP-03, AC-RMP-04 | T-01 (เสร็จ รอทีมตรวจ), T-02 (พร้อมทำ) | ไม่มีการสร้าง/บันทึกโปรไฟล์ให้ยืนยันว่าไม่มีข้อมูลบางส่วน | tests ตรวจเพียง error และไม่มี status ในหน้า; ไม่ได้ตรวจข้อมูลที่บันทึก | ช่องโหว่ |
| CON-ROOM-01 | AC-RMP-04A | T-01 (เสร็จ รอทีมตรวจ), T-02 (พร้อมทำ) | `frontend/src/config.js`: `roomOccupants`; `frontend/src/profileValidation.js`: room bounds; `frontend/src/App.jsx`: ตัวเลือกจำนวนผู้พัก | `test_TC_RMP_04A_1_rejects_fan_room_over_capacity`, `test_TC_RMP_04A_2_accepts_fan_room_capacity_limit` ผ่าน; เคสแรกตรวจเฉพาะ error จาก validator ไม่ได้ตรวจการไม่บันทึก | ช่องโหว่ |
| CON-DISCOVER-01 | AC-RMP-05B, AC-RMP-06, AC-RMP-08 | T-03 (พร้อมทำ) | ไม่พบข้อมูลสถานะหรือการค้นหาโปรไฟล์ | ไม่มี test ในโค้ด (task ยังไม่ทำ) | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| `frontend/src/App.jsx`: `App` และปุ่มเปิดฟอร์ม | FR-RMP-01, FR-RMP-02, AC-RMP-01 | ตรงบางส่วน | เปิดฟอร์มได้ แต่ไม่มีการตรวจ login หรือโปรไฟล์เดิม (F-03) |
| `frontend/src/App.jsx`: `update`, `toggleSleepBehavior`, field handlers | FR-RMP-03, FR-RMP-04, CON-DATA-01 | ตรงบางส่วน | รับค่าบนหน้าจอและเลือกพฤติกรรมได้; ไม่มีการส่ง/บันทึกข้อมูล |
| `frontend/src/App.jsx`: `validate`, `FieldError` | FR-RMP-05, FR-RMP-06, FR-RMP-07, CON-VALID-01, CON-REL-01 | ตรงบางส่วน | แสดง error และสถานะข้อมูลผ่าน validation; ยังไม่มีการสร้างโปรไฟล์ |
| `frontend/src/profileValidation.js`: `validateProfile` | FR-RMP-05, FR-RMP-06, FR-RMP-07, CON-DATA-01, CON-VALID-01, CON-ROOM-01 | ตรงกับกฎที่ตรวจใน spec | ตรวจ required fields, อายุ, ตัวเลือก, รูป, โทรศัพท์, ห้อง และพฤติกรรมการนอน |
| `frontend/src/config.js`: `PROFILE_CONFIG` | CON-DATA-01, CON-VALID-01, CON-ROOM-01 | ตรงกับค่าที่ระบุ | อายุ, ขนาด/ชนิดรูป, เบอร์โทร, จำนวนผู้พัก และตัวเลือกอยู่ใน config |
| `frontend/src/api/client.js`: `getSlots` (`GET /slots`) | ไม่มี FR-RMP | ไม่เกี่ยวกับ feature นี้ | endpoint เกี่ยวกับ slots/packageCode ไม่ได้อ้างใน FR หรือ plan ของ roommate (F-04) |
| `frontend/src/api/client.js`: `createBooking` (`POST /bookings`) | ไม่มี FR-RMP | ไม่เกี่ยวกับ feature นี้ | endpoint สร้าง booking ไม่ได้อ้างใน FR หรือ plan ของ roommate (F-04) |
| `frontend/src/main.jsx`: `createRoot` | ไม่มี FR โดยตรง | เป็น bootstrap | mount `App`; ไม่เพิ่มพฤติกรรมของ feature |
| `frontend/src/index.css` | ไม่มี FR โดยตรง | ไม่ขัดกับ spec ที่ตรวจได้ | นำเข้า Tailwind CSS เท่านั้น |
| `backend/app/`, `backend/tests/` | ไม่มี | ไม่มีไฟล์ | มีเพียง `requirements.txt` และ `pytest.ini`; ไม่พบ backend application หรือ tests |

## 3. ข้อค้นพบ
จัดคำถามให้ทีมพิจารณา 3 กอง: (ก) ความครบของ test F-01–F-02, (ข) constraint ของการเข้าใช้ F-03, (ค) ขอบเขต/คำถามเปิด F-04–F-05
ทีมตัดสิน: ให้ทีมเลือก "แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา" พร้อมเหตุผล; เว้นว่างระหว่างรอคำตอบ

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-01 | test อ่อน | `frontend/src/__tests__/profile-form.test.jsx`: `test_AC_RMP_02_profile_form_accepts_required_fields_and_sleep_behavior` | AC-RMP-02, FR-RMP-03, FR-RMP-04 | test ตรวจเพียงว่ามี controls ไม่ได้กรอกข้อมูลหรือยืนยันว่าฟอร์มรับค่าที่ป้อน แม้ test ผ่าน จึงยังไม่ตรวจ Then เรื่อง "ระบบรับข้อมูลที่นักศึกษากรอก" โดยตรง | แก้ test ให้กรอกข้อมูลและ assert ค่าที่รับจริง |
| F-02 | test อ่อน | `frontend/src/__tests__/profile-form.test.jsx`: tests ของ AC-RMP-03, AC-RMP-04 และ TC-RMP-04A-1 | AC-RMP-03, AC-RMP-04, AC-RMP-04A, NFR-REL-01, CON-REL-01, CON-ROOM-01 | test ตรวจ error/ไม่มี success status หรือ error จาก pure validator แต่ไม่ตรวจผลในข้อมูลว่าระบบไม่สร้าง/ไม่บันทึกโปรไฟล์ตาม Then; ปัจจุบันไม่มี persistence/backend ให้ตรวจ | แก้โค้ด/เพิ่ม persistence และทดสอบว่าไม่มีการบันทึกเมื่อ validation ไม่ผ่าน |
| F-03 | ละเมิด Constraint | `frontend/src/App.jsx`: `App` แสดงปุ่มสร้างโปรไฟล์และเปิดฟอร์มโดยไม่มี login/session หรือ existing-profile guard | CON-AUTH-01, CON-PROFILE-01, NFR-SEC-01, AC-RMP-01A | จากโค้ดปัจจุบันผู้ใช้ทุกคนเปิดฟอร์มได้; ไม่มีการตรวจว่าเข้าสู่ระบบแล้วหรือมีโปรไฟล์อยู่แล้ว ทั้งนี้ tasks ปัจจุบันยังเป็นงานเอกสารและไม่ได้กำหนดงาน implement ส่วนนี้ | ไม่ใช่ปัญหา — เป็น prototype ที่ยังไม่เปิดใช้งานจริง; รอ task implement |
| F-04 | โค้ดไม่มี FR | `frontend/src/api/client.js`: `getSlots`, `createBooking` | ขอบเขตสร้างโปรไฟล์หาเมทใน spec.md และ plan.md | มี endpoint `/slots` และ `/bookings` พร้อม fields สำหรับ booking แต่ไม่พบการใช้งานจาก roommate UI และไม่มี FR/task ใน feature นี้รองรับ เป็นโค้ดนอก feature | แยก/ลบออกจากขอบเขต roommate และ trace ให้ feature ที่ถูกต้อง |
| F-05 | เดา Q-xx | `specs/001-roommate-profile/test-cases.md`: TC-RMP-04A-3 | AC-RMP-04A | แถวทดสอบอ้าง Q-04 และตั้งสถานะ "รอ Q-04" แต่ใน `spec.md` มีเพียง Q-01 ถึง Q-03 | ยกเลิก TC-RMP-04A-3 เพราะอยู่นอกพฤติกรรมที่ AC ระบุ; ต้องปรับแถว test cases ในงานแยก (ไม่ได้แก้ใน /verify) |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
