# Task Breakdown: ติดต่อ/แชทกับรูมเมท
- Feature: ติดต่อ/แชทกับรูมเมท (Chat with Roommate)
- Spec ID: SPEC-CHAT-005
- อ้างอิง: [spec.md](./spec.md), [plan.md](./plan.md)
- วันที่: 2026-11-13

- มี 6 เฟส รวม 10 task ตามคำขอ; ไม่มี task ที่รอ Open Question เพราะ Q-01 ถึง Q-06 ตอบแล้ว
- เฟสแรกที่ลองใช้งานเป็นชิ้นได้คือเฟส 1: เลือกคู่สนทนาและเปิดประวัติ
- plan.md ปัจจุบันเป็นแผนปรับเอกสาร ไม่ใช่แผนเทคนิค; แตกงานจาก spec โดยตรงตามที่ทีมยืนยัน และอิงโครงสร้างไฟล์ที่มีอยู่ ไม่เพิ่มระบบนอก scope
- Python/FastAPI, React/Vite และ SQLAlchemy เป็นเทคโนโลยีที่มีอยู่ใน repository; ทีมเลือกเอง ไม่ได้มาจาก spec

## เฟส 0: ฐานราก

### T-01 รวมค่ากำหนดและเตรียมฐานทดสอบ
- รองรับ: CON-DATA-01, CON-TECH-01, CON-REL-01, FR-CHAT-13, FR-CHAT-14, FR-CHAT-16, NFR-PERF-01, NFR-USE-01, NFR-REL-01, ASM-03
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-01
- ไฟล์ที่แตะ: `backend/app/config.py`, `frontend/src/config.js`, `backend/app/main.py`, `backend/app/models/chat_message.py`, `backend/app/repositories/chat_repository.py`, `backend/tests/test_chat_backend_smoke.py`, `frontend/src/api/client.test.js`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: ค่าจาก spec อยู่ใน config พร้อม comment อ้าง ID และ `test_feature_config_values`, `test_chat_repository_persists_messages_for_multiple_pairs`, `test_chat_pair_concurrency_and_latency_smoke` ผ่าน; ผล load เป็น smoke test ไม่ใช่การรับรองจำนวน concurrent ที่ยังไม่ระบุ
- สถานะ: เสร็จ

#### จุดตรวจเฟส 0
- test ที่ต้องผ่านทั้งหมด: `test_feature_config_values`, `test_chat_repository_persists_messages_for_multiple_pairs`, `test_chat_pair_concurrency_and_latency_smoke`
- เปิดระบบ: `cd backend && uvicorn app.main:app --reload`; `cd frontend && npm run dev`
- คนลองเอง:
  Given ใช้ฐานข้อมูลทดสอบแยกจากข้อมูลใช้งาน
  When รัน tests ของ Backend และ Frontend
  Then config ถูกโหลดและข้อความของหลายคู่ถูกบันทึกแยกกัน
- ยังขาด: จำนวนผู้ใช้พร้อมกันสำหรับรับรอง NFR-PERF-01 ยังไม่ระบุ

## เฟส 1: เลือกคู่สนทนา เปิดประวัติ และตรวจสิทธิ์ (AC-CHAT-01, AC-CHAT-05, AC-CHAT-06, AC-CHAT-07, AC-CHAT-07A)

### T-02 ทำ API เลือก/เปิดแชทและอ่านประวัติอย่างปลอดภัย
- รองรับ: FR-CHAT-01, FR-CHAT-02, FR-CHAT-08, FR-CHAT-12, CON-AUTH-01, CON-PRIV-01, CON-CHAT-01, NFR-SEC-01, NFR-REL-01
- ตรวจด้วย: AC-CHAT-01, AC-CHAT-05, AC-CHAT-06, AC-CHAT-07, AC-CHAT-07A
  - AC-CHAT-01: `test_AC_CHAT_01_selects_student_and_opens_history`
  - AC-CHAT-05: `test_AC_CHAT_05_loads_persisted_history`
  - AC-CHAT-06: `test_AC_CHAT_06_denies_nonparticipant_history`
  - AC-CHAT-07: `test_AC_CHAT_07_rejects_ineligible_recipient_with_reason`
  - AC-CHAT-07A: `test_AC_CHAT_07A_allows_searchable_recipient`
- ไฟล์ที่แตะ: `backend/app/controllers/chat_controller.py`, `backend/app/main.py`, `backend/app/repositories/chat_repository.py`, `backend/app/services/chat_service.py`, `backend/tests/test_chat_backend_smoke.py`, `backend/tests/test_chat_start_access.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: tests ของ AC ทั้งห้าผ่าน; ปฏิเสธผู้ไม่มีสิทธิ์พร้อมเหตุผล และจำกัดประวัติไว้เฉพาะคู่สนทนา โดยใช้ boundary ที่มีอยู่และไม่สร้าง Authentication หรือ UC-04
- สถานะ: เสร็จ

### T-03 เชื่อมรายการสนทนาและหน้าต่างแชทกับ API
- รองรับ: FR-CHAT-01, FR-CHAT-02, FR-CHAT-08, FR-CHAT-12, CON-AUTH-01, CON-CHAT-01
- ตรวจด้วย: AC-CHAT-01, AC-CHAT-05, AC-CHAT-07, AC-CHAT-07A
  - AC-CHAT-01: `test_AC_CHAT_01_ui_selects_contact_and_shows_history`
  - AC-CHAT-05: `test_AC_CHAT_05_ui_reopens_persisted_history`
  - AC-CHAT-07: `test_AC_CHAT_07_ui_displays_start_denial_reason`
  - AC-CHAT-07A: `test_AC_CHAT_07A_ui_opens_allowed_recipient`
- API/integration tests: `test_chat_list_requires_authenticated_identity_and_contact_provider`, `test_demo_chat_list_open_and_history_use_backend_api`, `test_demo_mode_is_rejected_outside_development`
- ไฟล์ที่แตะ: `backend/app/controllers/chat_controller.py`, `backend/app/main.py`, `backend/app/services/chat_contact_provider.py`, `backend/tests/test_chat_list.py`, `frontend/src/App.jsx`, `frontend/src/api/client.js`, `frontend/src/api/client.test.js`, `frontend/src/pages/ChatListPage.jsx`, `frontend/src/pages/ChatPage.jsx`, `frontend/src/__tests__/chat-roommate-ui.test.jsx`, `frontend/vite.config.js`
- แบบหน้าจอ: UI-CHT-01 `mockups/UI-CHT-01-chat.html`
- ต้องทำหลัง: T-02 (ผู้รับผิดชอบอนุมัติข้าม Dependency Gate สำหรับ T-03 เท่านั้น)
- เสร็จเมื่อ: tests ของ API และ UI ผ่าน; Demo แสดงรายชื่อจาก Backend, เรียกเปิดแชทก่อนอ่านประวัติ, แสดงเหตุผลเมื่อถูกปฏิเสธ, ไม่ใช้ sample fallback และไม่เปิด composer ในเส้นทางสาธิต
- สถานะ: เสร็จ

#### จุดตรวจเฟส 1
- test ที่ต้องผ่านทั้งหมด: `test_AC_CHAT_01_selects_student_and_opens_history`, `test_AC_CHAT_05_loads_persisted_history`, `test_AC_CHAT_06_denies_nonparticipant_history`, `test_AC_CHAT_07_rejects_ineligible_recipient_with_reason`, `test_AC_CHAT_07A_allows_searchable_recipient`, `test_chat_list_requires_authenticated_identity_and_contact_provider`, `test_demo_chat_list_open_and_history_use_backend_api`, `test_demo_mode_is_rejected_outside_development`, `test_AC_CHAT_01_ui_selects_contact_and_shows_history`, `test_AC_CHAT_05_ui_reopens_persisted_history`, `test_AC_CHAT_07_ui_displays_start_denial_reason`, `test_AC_CHAT_07A_ui_opens_allowed_recipient` และ tests จากเฟส 0
- เปิดระบบ: `cd backend && uvicorn app.main:app --reload`; `cd frontend && npm run dev`
- คนลองเองตาม AC-CHAT-01:
  Given มีคู่สนทนาที่ได้รับอนุญาตและมีประวัติ
  When เลือกคู่สนทนาใน sidebar
  Then หน้าต่างแชทเปิดและแสดงประวัติของคู่นั้น
- ยังขาด: Authentication provider และรายชื่อจาก UC-04 ยังไม่เชื่อม; ทดสอบผ่าน boundary เท่านั้น

## เฟส 2: ส่งข้อความ ตรวจข้อความ และจัดการการส่งล้มเหลว (AC-CHAT-02, AC-CHAT-02C, AC-CHAT-03, AC-CHAT-04, AC-CHAT-04A)

### T-04 ทำ API ส่งข้อความ บันทึกข้อมูล และคืนผลล้มเหลวอย่างถูกต้อง
- รองรับ: FR-CHAT-03, FR-CHAT-04, FR-CHAT-05, FR-CHAT-06, FR-CHAT-07, FR-CHAT-13, CON-DATA-01, CON-REL-01
- ตรวจด้วย: AC-CHAT-02, AC-CHAT-02C, AC-CHAT-03, AC-CHAT-04
  - AC-CHAT-02: `test_AC_CHAT_02_persists_sender_receiver_and_time`
  - AC-CHAT-02C: `test_AC_CHAT_02C_rejects_empty_and_over_limit_text`
  - AC-CHAT-03: `test_AC_CHAT_03_recipient_sees_sent_message`
  - AC-CHAT-04: `test_AC_CHAT_04_failed_message_is_not_shown_as_sent`
- ไฟล์ที่แตะ: `backend/app/models/chat_message.py`, `backend/app/main.py`, `backend/app/repositories/chat_repository.py`, `backend/app/services/chat_service.py`, `backend/tests/test_chat_backend_smoke.py`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02
- เสร็จเมื่อ: tests ของ AC ทั้งสี่ผ่าน; API บันทึกผู้ส่ง ผู้รับ เวลา ปฏิเสธข้อความว่าง/เกินกำหนด และไม่คืนผลสำเร็จเมื่อส่งหรือลงบันทึกล้มเหลว
- สถานะ: เสร็จ

### T-05 ทำ UI ส่งข้อความและแสดงสถานะตามผล API
- รองรับ: FR-CHAT-03, FR-CHAT-05, FR-CHAT-06, FR-CHAT-07, FR-CHAT-13, FR-CHAT-14, CON-REL-01, NFR-REL-02
- ตรวจด้วย: AC-CHAT-02, AC-CHAT-02C, AC-CHAT-03, AC-CHAT-04, AC-CHAT-04A
  - AC-CHAT-02: `test_AC_CHAT_02_ui_sends_confirmed_message`
  - AC-CHAT-02C: `test_AC_CHAT_02C_ui_rejects_invalid_text`
  - AC-CHAT-03: `test_AC_CHAT_03_ui_loads_received_message`
  - AC-CHAT-04: `test_AC_CHAT_04_ui_reports_failure_and_allows_retry`
  - AC-CHAT-04A: `test_AC_CHAT_04A_ui_shows_final_failure_and_manual_retry`
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/pages/ChatPage.jsx`, `frontend/src/pages/ChatListPage.jsx`, `frontend/src/__tests__/chat-roommate-ui.test.jsx`, `frontend/src/api/client.test.js`
- แบบหน้าจอ: UI-CHT-01 `mockups/UI-CHT-01-chat.html`
- ต้องทำหลัง: T-04
- เสร็จเมื่อ: tests ของ AC ทั้งห้าผ่าน; UI แสดงข้อความสำเร็จเมื่อ API ยืนยันเท่านั้น, แจ้งเหตุผลเมื่อผิดพลาด, ให้ลองใหม่ และลองซ้ำอัตโนมัติไม่เกินค่าจาก config โดยไม่เพิ่มข้อความล้มเหลวเป็นข้อความสำเร็จ
- สถานะ: เสร็จ

#### จุดตรวจเฟส 2
- test ที่ต้องผ่านทั้งหมด: `test_AC_CHAT_02_persists_sender_receiver_and_time`, `test_AC_CHAT_02C_rejects_empty_and_over_limit_text`, `test_AC_CHAT_03_recipient_sees_sent_message`, `test_AC_CHAT_04_failed_message_is_not_shown_as_sent`, `test_AC_CHAT_02_ui_sends_confirmed_message`, `test_AC_CHAT_02C_ui_rejects_invalid_text`, `test_AC_CHAT_03_ui_loads_received_message`, `test_AC_CHAT_04_ui_reports_failure_and_allows_retry`, `test_AC_CHAT_04A_ui_shows_final_failure_and_manual_retry` และ tests จากเฟสก่อนหน้า
- เปิดระบบ: `cd backend && uvicorn app.main:app --reload`; `cd frontend && npm run dev`
- คนลองเองตาม AC-CHAT-02:
  Given เปิดบทสนทนาที่ส่งข้อความได้
  When พิมพ์ข้อความและกดส่ง
  Then ข้อความถูกบันทึกพร้อมผู้ส่ง ผู้รับ และเวลาส่ง
- ยังขาด: spec ไม่กำหนดช่วงห่างของ retry; ไม่กำหนด backoff เพิ่มเอง

## เฟส 3: ส่ง ตรวจ แสดง และควบคุมอายุไฟล์แนบ (AC-CHAT-02A, AC-CHAT-02B, AC-CHAT-03A, AC-CHAT-03C, AC-CHAT-03D, AC-CHAT-08)

### T-06 ทำ API และ storage boundary สำหรับไฟล์แนบ
- รองรับ: FR-CHAT-09, FR-CHAT-11, FR-CHAT-16, CON-CHAT-02, CON-CHAT-04, CON-PRIV-01, NFR-SEC-02
- ตรวจด้วย: AC-CHAT-02A, AC-CHAT-02B, AC-CHAT-03A, AC-CHAT-03C, AC-CHAT-03D, AC-CHAT-08
  - AC-CHAT-02A: `test_AC_CHAT_02A_sends_one_supported_file_with_message`
  - AC-CHAT-02B: `test_AC_CHAT_02B_rejects_multiple_or_unsupported_files`
  - AC-CHAT-03A: `test_AC_CHAT_03A_history_returns_related_attachment`
  - AC-CHAT-03C: `test_AC_CHAT_03C_downloads_attachment_within_retention`
  - AC-CHAT-03D: `test_AC_CHAT_03D_hides_expired_file_but_keeps_message`
  - AC-CHAT-08: `test_AC_CHAT_08_denies_nonparticipant_attachment`
- ตรวจเสริมจาก Code Review: `test_AC_CHAT_02B_rejects_missing_attachment`, `test_AC_CHAT_02B_rejects_file_signature_mismatch`, `test_AC_CHAT_02B_rejects_spoofed_mime_type`, `test_attachment_metadata_failure_removes_unattached_file`, `test_attachment_cleanup_failure_returns_safe_error_and_logs_orphan`
- ขอบเขตเวลา: AC-CHAT-03C ระบุ "ยังไม่เกิน 30 วัน" จึงอนุญาตเมื่อครบ 30 วันพอดี; `test_AC_CHAT_03C_downloads_attachment_within_retention` ตรวจว่าหลังจากนั้น 1 microsecond ไม่สามารถดาวน์โหลดได้
- ไฟล์ที่แตะ: `backend/app/models/chat_attachment.py`, `backend/app/controllers/chat_controller.py`, `backend/app/main.py`, `backend/app/repositories/chat_repository.py`, `backend/app/services/attachment_storage.py`, `backend/app/config.py`, `backend/tests/test_chat_attachments.py`, `backend/requirements.txt`
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-01, T-04
- เสร็จเมื่อ: tests ของ AC ทั้งหกผ่าน; ตรวจชนิด/จำนวน/ขนาด, บันทึก metadata, จำกัดสิทธิ์ดาวน์โหลด และปิดการเข้าถึงไฟล์เมื่อพ้น retention โดยไม่ลบข้อมูลข้อความ
- สถานะ: เสร็จ

### T-07 ทำ UI แนบไฟล์และแสดงไฟล์ในประวัติ
- รองรับ: FR-CHAT-09, FR-CHAT-11, FR-CHAT-16, FR-CHAT-07
- ตรวจด้วย: AC-CHAT-02A, AC-CHAT-02B, AC-CHAT-03A, AC-CHAT-03C, AC-CHAT-03D
  - AC-CHAT-02A: `test_AC_CHAT_02A_ui_sends_supported_attachment`
  - AC-CHAT-02B: `test_AC_CHAT_02B_ui_reports_invalid_attachment`
  - AC-CHAT-03A: `test_AC_CHAT_03A_ui_shows_attachment_in_history`
  - AC-CHAT-03C: `test_AC_CHAT_03C_ui_opens_attachment_within_retention`
  - AC-CHAT-03D: `test_AC_CHAT_03D_ui_hides_expired_attachment`
- ไฟล์ที่แตะ: `frontend/src/api/client.js`, `frontend/src/pages/ChatPage.jsx`, `frontend/src/__tests__/chat-roommate-ui.test.jsx`, `frontend/src/api/client.test.js`
- แบบหน้าจอ: UI-CHT-01 `mockups/UI-CHT-01-chat.html`
- ต้องทำหลัง: T-06
- เสร็จเมื่อ: tests ของ AC ทั้งห้าผ่าน; แนบไฟล์ผ่าน API, แจ้งกรณีไม่รองรับ, แสดงไฟล์กับข้อความที่ถูกต้อง และซ่อนไฟล์หมดอายุ
- สถานะ: เสร็จ

#### จุดตรวจเฟส 3
- test ที่ต้องผ่านทั้งหมด: `test_AC_CHAT_02A_sends_one_supported_file_with_message`, `test_AC_CHAT_02B_rejects_multiple_or_unsupported_files`, `test_AC_CHAT_03A_history_returns_related_attachment`, `test_AC_CHAT_03C_downloads_attachment_within_retention`, `test_AC_CHAT_03D_hides_expired_file_but_keeps_message`, `test_AC_CHAT_08_denies_nonparticipant_attachment`, `test_AC_CHAT_02A_ui_sends_supported_attachment`, `test_AC_CHAT_02B_ui_reports_invalid_attachment`, `test_AC_CHAT_03A_ui_shows_attachment_in_history`, `test_AC_CHAT_03C_ui_opens_attachment_within_retention`, `test_AC_CHAT_03D_ui_hides_expired_attachment` และ tests จากเฟสก่อนหน้า
- เปิดระบบ: `cd backend && uvicorn app.main:app --reload`; `cd frontend && npm run dev`
- คนลองเองตาม AC-CHAT-02A:
  Given เปิดหน้าต่างแชทและมีไฟล์ JPG, PNG หรือ PDF ที่อยู่ในข้อจำกัด
  When แนบไฟล์หนึ่งไฟล์พร้อมข้อความแล้วกดส่ง
  Then ระบบส่งและบันทึกไฟล์แนบพร้อมข้อความ
- ยังขาด: วิธีเก็บและ backup สำหรับ production ยังไม่กำหนด; ใช้ boundary ที่ไม่ผูกกับ provider

## เฟส 4: แสดง Read และบังคับโหมดอ่านอย่างเดียว (AC-CHAT-03B, AC-CHAT-07B)

### T-08 ทำ API สถานะ Read และบังคับ read-only
- รองรับ: FR-CHAT-10, FR-CHAT-15, CON-CHAT-03, CON-PRIV-01
- ตรวจด้วย: AC-CHAT-03B, AC-CHAT-07B
  - AC-CHAT-03B: `test_AC_CHAT_03B_marks_only_visible_message_read`
  - AC-CHAT-07B: `test_AC_CHAT_07B_existing_chat_is_read_only`
- ตรวจเสริม: `test_AC_CHAT_07B_missing_provider_fails_closed_but_allows_history`, `test_AC_CHAT_07B_unavailable_or_unknown_provider_fails_closed`, `test_AC_CHAT_07B_rejects_attachment_when_either_participant_is_unsearchable`, `test_AC_CHAT_07B_attachment_fails_closed_without_confirmed_provider`, `test_existing_database_adds_read_column_without_losing_history`
- ไฟล์ที่แตะ: `backend/app/models/chat_message.py`, `backend/app/controllers/chat_controller.py`, `backend/app/main.py`, `backend/app/repositories/chat_repository.py`, `backend/app/services/chat_service.py`, `backend/app/services/chat_contact_provider.py`, `backend/tests/test_chat_backend_smoke.py`, `backend/tests/test_chat_start_access.py`, `backend/tests/test_chat_attachments.py`
- Contract สำหรับ T-09: History API คืน `is_read` ต่อข้อความ; `POST /api/chat/messages/{message_id}/read` เปลี่ยน Read ได้เฉพาะข้อความของผู้รับ และ T-09 เรียกเมื่อข้อความอยู่ในหน้าจอ
- Provider contract: `is_searchable(user_id)` คืน boolean ที่ยืนยันได้; ไม่มี provider, provider error หรือผลที่ไม่ใช่ boolean ต้องปฏิเสธการส่งข้อความและไฟล์แนบแบบ fail-closed; อ่านประวัติได้ตามเดิม
- แบบหน้าจอ: ไม่มี
- ต้องทำหลัง: T-02, T-04
- เสร็จเมื่อ: tests ของ AC ทั้งสองผ่าน; Read แยกต่อข้อความและให้ผู้รับตั้งสถานะได้เฉพาะข้อความที่ระบุ; อ่านประวัติได้เสมอสำหรับสมาชิก; API ส่งข้อความปกติ/ไฟล์แนบตรวจสถานะสมาชิกทั้งสองคนและปฏิเสธเมื่อฝ่ายใดไม่ searchable หรือยืนยันสถานะไม่ได้
- ขอบเขตที่ขยายตามอนุมัติ: provider boundary และ tests ของ Attachment API ที่ได้รับผลจาก fail-closed; ปรับ `spec.md` เพื่อระบุ contract/AC เดิมให้ชัด ไม่เพิ่ม ID หรือเริ่ม T-09
- สถานะ: เสร็จ

### T-09 แสดง Read และปิด composer ในแชทอ่านอย่างเดียว
- รองรับ: FR-CHAT-10, FR-CHAT-15
- ตรวจด้วย: AC-CHAT-03B, AC-CHAT-07B
  - AC-CHAT-03B: `test_AC_CHAT_03B_ui_marks_only_visible_message_read`
  - AC-CHAT-07B: `test_AC_CHAT_07B_existing_chat_is_read_only`, `test_AC_CHAT_07B_existing_history_opens_read_only_without_provider`, `test_AC_CHAT_07B_ui_loads_existing_history_read_only`
  - AC-CHAT-07: `test_AC_CHAT_07_new_disallowed_chat_does_not_create_room_or_allow_history`, `test_AC_CHAT_07_ui_displays_start_denial_reason`
- ไฟล์ที่แตะ: `backend/app/controllers/chat_controller.py`, `backend/app/main.py`, `backend/app/repositories/chat_repository.py`, `backend/app/services/chat_service.py`, `backend/tests/test_chat_start_access.py`, `backend/tests/test_chat_list.py`, `frontend/src/api/client.js`, `frontend/src/api/client.test.js`, `frontend/src/pages/ChatListPage.jsx`, `frontend/src/pages/ChatPage.jsx`, `frontend/src/__tests__/chat-roommate-ui.test.jsx`
- แบบหน้าจอ: UI-CHT-01 `mockups/UI-CHT-01-chat.html`
- ต้องทำหลัง: T-08
- เสร็จเมื่อ: tests ของ AC ทั้งสองผ่าน; เรียก Read เฉพาะข้อความที่อยู่ในหน้าจอ; ผู้เข้าร่วมอ่านประวัติเดิมได้ในโหมด read-only แต่ส่งข้อความหรือไฟล์แนบไม่ได้; ห้องใหม่ที่เปิดไม่ได้ต้องถูกปฏิเสธและไม่เรียก History API
- ขอบเขตที่ขยายตามอนุมัติ: ปรับ open-chat Backend และ Frontend เพื่อแยกห้องเดิมที่อ่านได้อย่างเดียวจากห้องใหม่ที่ไม่ได้รับอนุญาต; ปรับ interface clarification ใน `spec.md` ให้สอดคล้องกับ AC-CHAT-07B โดยไม่เพิ่มหรือเปลี่ยน ID
- สถานะ: เสร็จ

#### จุดตรวจเฟส 4
- test ที่ต้องผ่านทั้งหมด: `test_AC_CHAT_03B_marks_only_visible_message_read`, `test_AC_CHAT_07B_existing_chat_is_read_only`, `test_AC_CHAT_07B_existing_history_opens_read_only_without_provider`, `test_AC_CHAT_03B_ui_marks_only_visible_message_read`, `test_AC_CHAT_07B_ui_loads_existing_history_read_only`, `test_AC_CHAT_07_ui_displays_start_denial_reason` และ tests จากเฟสก่อนหน้า
- เปิดระบบ: `cd backend && uvicorn app.main:app --reload`; `cd frontend && npm run dev`
- คนลองเองตาม AC-CHAT-07B:
  Given มีประวัติแชทและฝ่ายใดฝ่ายหนึ่งไม่พร้อมให้ค้นหา
  When เปิดแชทเดิม
  Then อ่านประวัติได้แต่ส่งข้อความใหม่ไม่ได้
- ยังขาด: Production adapter จาก UC-04 ยังไม่เชื่อม; API ยังคง fail-closed เมื่อไม่มี provider

## เฟส 5: ทดสอบ usability (AC-CHAT-09)

### T-10 ทดสอบงานแชทกับนักศึกษาที่ไม่เคยใช้ 5 คน
- รองรับ: NFR-USE-01
- ตรวจด้วย: AC-CHAT-09 — `test_AC_CHAT_09_usability_threshold`
- ไฟล์ที่แตะ: ไม่มี (ทดสอบกับ UI ที่ทำเสร็จแล้ว ไม่แก้ source หรือ test เพิ่ม)
- แบบหน้าจอ: UI-CHT-01 `mockups/UI-CHT-01-chat.html`
- ต้องทำหลัง: T-03, T-05, T-07, T-09
- เสร็จเมื่อ: นักศึกษาที่ไม่เคยใช้ 5 คนทดลองโดยไม่รับคำแนะนำ และอย่างน้อย 4 คนเปิดแชทและส่งข้อความสำเร็จ
- สถานะ: รอผู้ทดลองจริง

#### จุดตรวจเฟส 5
- test ที่ต้องผ่านทั้งหมด: `test_AC_CHAT_09_usability_threshold` และ tests จากเฟสก่อนหน้าทั้งหมด
- เปิดระบบ: `cd backend && uvicorn app.main:app --reload`; `cd frontend && npm run dev`
- คนลองเองตาม AC-CHAT-09:
  Given นักศึกษาที่ไม่เคยใช้ฟังก์ชันแชท 5 คน
  When ให้แต่ละคนเปิดแชทและส่งข้อความโดยไม่รับคำแนะนำ
  Then อย่างน้อย 4 คนทำสำเร็จ
- ยังขาด: Authentication/UC-04 และสภาพแวดล้อมทดสอบที่เชื่อมจริง; ผู้ทดลองจริงที่ไม่เคยใช้แชท 5 คน; ผลทดสอบจริงแบบไม่ระบุตัวตน
- กลับมาทำต่อเมื่อ: ระบบทดสอบเชื่อม Authentication และ UC-04 พร้อมใช้งาน และทีมจัดผู้ทดลอง 5 คนได้; ทดสอบโดยไม่ให้คำแนะนำ บันทึกจำนวนผู้ทำสำเร็จ/ไม่สำเร็จ และตรวจเกณฑ์อย่างน้อย 4 คนตาม AC-CHAT-09 โดยไม่ใช้ Demo Provider หรือผลจำลอง

## ตารางตรวจความครบ

### Acceptance Criteria
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-CHAT-01 | T-02, T-03 |
| AC-CHAT-02 | T-04, T-05 |
| AC-CHAT-02C | T-04, T-05 |
| AC-CHAT-02A | T-06, T-07 |
| AC-CHAT-02B | T-06, T-07 |
| AC-CHAT-03 | T-04, T-05 |
| AC-CHAT-03A | T-06, T-07 |
| AC-CHAT-03B | T-08, T-09 |
| AC-CHAT-04 | T-04, T-05 |
| AC-CHAT-05 | T-02, T-03 |
| AC-CHAT-06 | T-02 |
| AC-CHAT-07 | T-02, T-03 |
| AC-CHAT-07A | T-02, T-03 |
| AC-CHAT-07B | T-08, T-09 |
| AC-CHAT-04A | T-05 |
| AC-CHAT-03C | T-06, T-07 |
| AC-CHAT-03D | T-06, T-07 |
| AC-CHAT-08 | T-06 |
| AC-CHAT-09 | T-10 |

### Constraints
| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-AUTH-01 | T-02, T-06 |
| CON-PRIV-01 | T-02, T-06, T-08 |
| CON-DATA-01 | T-01, T-04, T-06 |
| CON-TECH-01 | T-01 |
| CON-REL-01 | T-01, T-04, T-05 |
| CON-CHAT-01 | T-02 |
| CON-CHAT-02 | T-06 |
| CON-CHAT-03 | T-08, T-09 |
| CON-CHAT-04 | T-06 |

### Functional Requirements
| FR ID | AC ที่ตรวจ FR นี้ | เฟส |
|---|---|---|
| FR-CHAT-01 | AC-CHAT-01, AC-CHAT-07A | 1 |
| FR-CHAT-02 | AC-CHAT-01 | 1 |
| FR-CHAT-03 | AC-CHAT-02, AC-CHAT-02C | 2 |
| FR-CHAT-04 | AC-CHAT-02 | 2 |
| FR-CHAT-05 | AC-CHAT-03 | 2 |
| FR-CHAT-06 | AC-CHAT-03 | 2 |
| FR-CHAT-07 | AC-CHAT-04 | 2 |
| FR-CHAT-08 | AC-CHAT-01, AC-CHAT-05 | 1 |
| FR-CHAT-09 | AC-CHAT-02A, AC-CHAT-02B | 3 |
| FR-CHAT-10 | AC-CHAT-03B | 4 |
| FR-CHAT-11 | AC-CHAT-03A, AC-CHAT-03C, AC-CHAT-03D | 3 |
| FR-CHAT-12 | AC-CHAT-07 | 1 |
| FR-CHAT-13 | AC-CHAT-02C | 2 |
| FR-CHAT-14 | AC-CHAT-04A | 2 |
| FR-CHAT-15 | AC-CHAT-07B | 4 |
| FR-CHAT-16 | AC-CHAT-03C, AC-CHAT-03D | 3 |

## สิ่งที่ยังไม่ทำ
- Q-01 ต้องการให้ระบบแจ้งเตือนเมื่อมีข้อความใหม่หรือไม่? — ตอบแล้ว: แจ้งเตือนในระบบและส่ง push notification; **ไม่มี FR/AC รองรับ จึงไม่เพิ่ม task แจ้งเตือน**
- Q-02 ต้องการให้สามารถส่งเฉพาะข้อความ หรือรองรับรูปภาพ/ไฟล์ด้วย? — ตอบแล้ว: รองรับข้อความ รูปภาพ และ PDF; JPG, PNG หรือ PDF ไม่เกิน 10 MB และไม่เกิน 1 ไฟล์ต่อข้อความ; T-06 ถึง T-07
- Q-03 ต้องการให้แสดงสถานะอ่านข้อความแล้ว (Read) หรือไม่? — ตอบแล้ว: แสดง Read แยกต่อข้อความเมื่อผู้รับเปิดหน้าต่างและข้อความอยู่ในหน้าจอ; T-08 ถึง T-09
- Q-04 ใครสามารถเริ่มแชทได้ และเมื่อโปรไฟล์ไม่พร้อมให้ค้นหาจะจัดการแชทเดิมอย่างไร? — ตอบแล้ว: ผู้ใช้ที่มีโปรไฟล์เปิดให้ค้นหาเริ่มได้; แชทเดิมเป็น read-only เมื่อฝ่ายใดปิดหาเมท; T-02 ถึง T-03 และ T-08 ถึง T-09
- Q-05 ระบบควรลองส่งข้อความซ้ำเมื่อส่งล้มเหลวกี่ครั้ง? — ตอบแล้ว: ลองซ้ำอัตโนมัติสูงสุด 3 ครั้ง แล้วให้ผู้ใช้ลองใหม่เอง; T-05
- Q-06 ไฟล์แนบควรเก็บไว้นานเท่าใด? — ตอบแล้ว: เก็บและดาวน์โหลดได้ 30 วันนับจากเวลาที่ส่งสำเร็จ; T-06 ถึง T-07

ไม่มี task ที่รอ Q-xx เพราะทุกข้อมีคำตอบแล้ว ประเด็น integration ที่ยังไม่กำหนดและไม่สร้าง Q-ID ใหม่:
- Authentication provider/แหล่ง identity จริงยังไม่ระบุ; ใช้ boundary โดยไม่สร้างระบบ Authentication
- รายชื่อและสถานะค้นหาจาก UC-04 อยู่นอก scope; รับข้อมูลผ่าน interface เท่านั้น ไม่สร้างระบบค้นหาหรือโปรไฟล์ซ้ำ
- วิธีเก็บและ backup ไฟล์สำหรับ production ยังไม่ระบุ; ต้องให้ทีมเลือกก่อนใช้งานจริง
- จำนวนผู้ใช้พร้อมกันของ NFR-PERF-01 ยังไม่ระบุ; ผลทดสอบหลายคู่เป็น smoke test ไม่ใช่การรับรอง performance เต็มรูปแบบ
- spec ไม่มีหมวด “หน้าจอ (UI)” ที่กำหนดข้อความหรือลำดับให้ตรง; UI-CHT-01 เป็น reference และ FR ใน spec เป็นหลัก
