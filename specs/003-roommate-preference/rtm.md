# RTM: ระบุความต้องการหาเมท
อ้างอิง: spec.md SPEC-RPS-003 Draft v3 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2026-11-19 18:12 | test: 48 backend ผ่าน / 60 frontend ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-RPS-01 | AC-RPS-01 | T-04, T-05 | frontend/src/App.jsx: ไม่มีเมนู/route ความต้องการ; frontend/src/pages/RoommatePreferencePage.jsx: component | 0 test AC-RPS-01 ที่ใช้สถานะใช้ได้จริง, TC-RPS-01-2 ผ่านใน Vitest แต่ยังไม่ผ่านเมนูจริง | ช่องโหว่ |
| FR-RPS-02 | AC-RPS-01 | T-04, T-05 | frontend/src/pages/RoommatePreferencePage.jsx: RoommatePreferencePage | TC-RPS-01-2 ผ่านบางส่วน; ไม่มี test ที่เลือกเมนูจาก App | ช่องโหว่ |
| FR-RPS-03 | AC-RPS-02 | T-06, T-07 | backend/app/roommate_preferences.py: receive_preference_for_owner; frontend/src/pages/RoommatePreferencePage.jsx: submit | test_AC_RPS_02_accepts_preference_selection_and_additional_text ผ่าน; มีข้อเชื่อม API จริงที่ยังไม่มี endpoint | ช่องโหว่ |
| FR-RPS-04 | AC-RPS-03, AC-RPS-04 | T-14, T-15, T-16 | backend/app/roommate_preferences.py: validate_required_preference_fields, receive_preference_for_owner | test_AC_RPS_03_rejects_missing_required_fields_without_saving และ test_AC_RPS_04_saves_valid_preference_and_boundary_limits ผ่าน | ช่องโหว่ |
| FR-RPS-05 | AC-RPS-03 | T-14, T-15 | frontend/src/pages/RoommatePreferencePage.jsx: submit; backend/app/roommate_preferences.py: receive_preference_for_owner | test_AC_RPS_03_requires_room_type_and_capacity และ test_AC_RPS_03_rejects_missing_one_required_field ผ่าน | ช่องโหว่ |
| FR-RPS-06 | AC-RPS-04, AC-RPS-04A, AC-RPS-04B | T-16, T-17, T-18, T-19 | backend/app/roommate_preferences.py: save_validated_preference_for_owner, RoommatePreferenceStore.update_for_owner | test_AC_RPS_04_saves_valid_preference_and_boundary_limits ผ่าน; T-18/T-19 ยังพร้อมทำ | ยังไม่ถึง |
| FR-RPS-07 | AC-RPS-04 | T-17 | frontend/src/pages/RoommatePreferencePage.jsx: submit/submitted | test AC-RPS-04 ใน frontend แสดง role status แต่ไม่ assert ข้อมูลที่บันทึกครบถ้วน | ช่องโหว่ |
| FR-RPS-08 | AC-RPS-05 | T-20 | backend/app/services/roommate_preference_match.py: ไม่มีการเชื่อม RoommatePreferenceStore; backend/app/roommate_preferences.py: เก็บ in-memory | ไม่มี test ที่ตรวจข้อมูลความต้องการถูกใช้ค้นหาและจับคู่ทันที | ช่องโหว่ |
| FR-RPS-09 | AC-RPS-02A, AC-RPS-02B, AC-RPS-02C, AC-RPS-04B | T-08, T-10, T-12, T-13, T-19 | backend/app/roommate_preferences.py: validate_room_capacity, validate_additional_text | test AC-RPS-02A/02B/02C และขอบเขต frontend ผ่าน; ยังไม่มี save-failure/atomic test | ช่องโหว่ |
| NFR-RPS-01 | AC-RPS-06 | T-21 | backend/app/middleware/auth_guard.py: require_authenticated_user; ไม่มีการใช้ guard ใน preference endpoint | ไม่มี test AC-RPS-06; owner_id รับจาก payload โดยไม่ผูก auth | ช่องโหว่ |
| NFR-RPS-02 | AC-RPS-03 | T-14, T-15 | backend/app/roommate_preferences.py: validate_required_preference_fields | test_AC_RPS_03_rejects_missing_required_fields_without_saving และ frontend AC-RPS-03 ผ่าน | ช่องโหว่ |
| NFR-RPS-03 | AC-RPS-08 | T-23 | ไม่มีโค้ดระบบหรือผลผู้ใช้ | ไม่มี test; ทดสอบจริงยังไม่ทำ | ยังไม่ถึง |
| CON-RPS-01 | AC-RPS-01, AC-RPS-06 | T-03, T-04, T-21 | backend/app/middleware/auth_guard.py: require_authenticated_user; ไม่มี preference endpoint | ไม่มี test เชื่อมเข้าสู่ระบบกับหน้า/menu preference | ช่องโหว่ |
| CON-RPS-02 | AC-RPS-01, AC-RPS-07 | T-03, T-04, T-22 | backend/app/sample_profiles.py: ข้อมูล has_profile; ไม่มี UI redirect | ไม่มี test AC-RPS-07 | ช่องโหว่ |
| CON-RPS-03 | AC-RPS-02A | T-01, T-08, T-14, T-16 | backend/app/roommate_preferences.py: validate_required_preference_fields, validate_room_capacity | AC-RPS-02A และ AC-RPS-03/04 test ผ่าน; endpoint จริงยังไม่มี | ช่องโหว่ |
| CON-RPS-04 | AC-RPS-03 | T-14, T-16 | backend/app/roommate_preferences.py: receive_preference_for_owner | test_AC_RPS_03_rejects_missing_required_fields_without_saving ผ่าน | ช่องโหว่ |
| CON-RPS-05 | AC-RPS-04A | T-02, T-18, T-21 | backend/app/roommate_preferences.py: update_for_owner มี แต่ไม่มี HTTP/API caller | ไม่มี test ผลการแก้ข้อมูลของเจ้าของ | ยังไม่ถึง |
| CON-RPS-06 | AC-RPS-02B | T-01, T-08, T-10 | backend/app/roommate_preferences.py: validate_room_capacity | test_AC_RPS_02A_accepts_valid_and_boundary_room_capacity และ test_AC_RPS_02B_rejects_incompatible_capacity_without_saving ผ่าน | ครบ |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| frontend/src/api/client.js: saveRoommatePreference | FR-RPS-03, FR-RPS-06 | ไม่ครบ | เรียก `/api/roommate-preferences` แต่ไม่มี route/backend endpoint ที่รับและตอบ route นี้ |
| frontend/src/pages/RoommatePreferencePage.jsx: RoommatePreferencePage.submit | FR-RPS-03, FR-RPS-04, FR-RPS-05, FR-RPS-07 | ไม่ครบ | มีหน้า/validation และ status success แต่ไม่ได้เชื่อม App/menu/profile และไม่แสดงข้อมูลที่บันทึกแล้ว |
| backend/app/roommate_preferences.py: receive_preference_for_owner/save_validated_preference_for_owner | FR-RPS-04, FR-RPS-06, CON-RPS-03, CON-RPS-04 | บางส่วน | validation และ in-memory storage ทำงานในฟังก์ชัน แต่ไม่มี HTTP endpoint เชื่อมผู้ใช้ |
| backend/app/models/roommate_preference.py: RoommatePreference | FR-RPS-06, FR-RPS-07, FR-RPS-08 | บางส่วน | มี 6 หัวข้อและ owner_id แต่ไม่มี mapping endpoint/persistence/search |
| backend/app/roommate_preferences.py: RoommatePreferenceStore.update_for_owner | FR-RPS-06, CON-RPS-05 | ไม่ครบ | มี method แก้เฉพาะเจ้าของ แต่ไม่มี caller/API ทดสอบ AC-RPS-04A |
| backend/app/middleware/auth_guard.py: require_authenticated_user | CON-RPS-01, NFR-RPS-01 | ไม่ครบ | guard มีอยู่สำหรับ search/profile ส่วนอื่น แต่ preference receive/save ไม่เรียก guard และ payload ใส่ owner_id ได้ |
| backend/app/services/roommate_preference_match.py: get_preference_value/matches_roommate_preference | FR-RPS-08, AC-RPS-05 | ไม่ครบ | อ่าน attribute ของ profile ที่เป็น sleep_behavior/cleanliness/sleep_time; ไม่อ่าน RoommatePreferenceStore และไม่ครอบ room occupants/type/additional text |
| frontend/src/App.jsx: App | FR-RPS-01, FR-RPS-02, CON-RPS-02 | ไม่ครบ | ไม่มี import/menu/route สำหรับ RoommatePreferencePage |
| backend/app/sample_profiles.py: get_sample_owner_preference/get_sample_missing_profile_user_id | CON-RPS-01, CON-RPS-02 | ตรงสำหรับข้อมูลตัวอย่าง | ไม่ใช่การตรวจสิทธิ์/แหล่ง profile runtime จริง |

## 3. ข้อค้นพบ
ชนิด: ชื่อชนิดใช้ได้แก่ AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง / ของแถม / ตัวเลขฝังในโค้ด / mockup เกิน spec / ไม่ตรง mockup
ทีมตัดสิน: ช่อง "ทีมตัดสิน" คงเดิมจากรอบก่อน; หากเว้นว่างให้ทีมเติมเอง 1 บรรทัด

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-01 | โค้ดไม่มี FR | frontend/src/api/client.js: saveRoommatePreference; backend/app/ | FR-RPS-03, FR-RPS-06, FR-RPS-07 | client POST `/api/roommate-preferences` แต่ backend ไม่มี FastAPI route สำหรับ endpoint นี้ จึงไม่มีเส้นจริงจากหน้าจอไป storage | |
| F-02 | โค้ดไม่มี FR | frontend/src/App.jsx: App; frontend/src/routes.js: routes | FR-RPS-01, FR-RPS-02, CON-RPS-02 | มี RoommatePreferencePage แต่ App/routes ไม่เปิดเมนูหรือ view สำหรับฟีเจอร์นี้ ผู้ใช้ไม่สามารถเข้าหน้าได้ใน flow หลัก | |
| F-03 | ละเมิด Constraint | frontend/src/api/client.js: saveRoommatePreference; backend/app/roommate_preferences.py: receive_preference_for_owner | CON-RPS-01, CON-RPS-05, NFR-RPS-01 | owner_id รับจาก payload ที่ client ส่งมาและไม่มี auth guard ผูกเจ้าของ จึงอาจจัดการความต้องการแทนผู้อื่น | |
| F-04 | test อ่อน | frontend/src/__tests__/roommate-preference.test.jsx: test_TC_RPS_01_2_shows_options_with_existing_profile | AC-RPS-01 | test render RoommatePreferencePage ตรง ไม่ผ่านเมนู App และไม่ตรวจว่ามีการยืนยัน existing profile 1 รายการ | |
| F-05 | โค้ดไม่มี FR | backend/app/services/roommate_preference_match.py: get_preference_value/matches_roommate_preference | FR-RPS-08, AC-RPS-05 | ฟังก์ชันค้นหายังอ่าน attribute บน profile และไม่มีการเชื่อม RoommatePreferenceStore จึงไม่พิสูจน์ว่าข้อมูล RPS ถูกใช้ทันที | |
| F-06 | โค้ดไม่มี FR | frontend/src/pages/RoommatePreferencePage.jsx: submitted | FR-RPS-07 | หลังบันทึกแสดงเพียงข้อความรับข้อมูลทั่วไป ไม่แสดงข้อมูลความต้องการที่บันทึกจริง | |
| F-07 | AC ไม่มี test | AC-RPS-04A, AC-RPS-04B, AC-RPS-05, AC-RPS-06, AC-RPS-07, AC-RPS-08 | AC ที่ยังไม่มี test ในโค้ด | แถวใช้ได้ยังไม่มีหรือ task ที่ตรวจด้วยยังไม่เสร็จ จึงยังตรวจไม่ครบข้อ Then | |
| F-08 | เดา Q-xx / ไม่ครบตามโค้ด | frontend/src/api/client.js: saveRoommatePreference; backend/app/roommate_preferences.py: RoommatePreferenceStore | NFR-RPS-01, FR-RPS-06 | ไม่มี persistence/real save API/atomic failure และข้อมูลถูกเก็บใน memory ของ process จึงไม่สามารถพิสูจน์ save-failure retention หรือ persistence ได้ | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
