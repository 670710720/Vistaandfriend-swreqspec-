# Requirements Traceability Matrix (RTM): ติดต่อ/แชทกับรูมเมท
- Feature: ติดต่อ/แชทกับรูมเมท (Chat with Roommate) | Spec ID: SPEC-CHAT-005 | Use case: UC-05
- อ้างอิง: spec.md (Draft v6), tasks.md (ปรับ 2569-11-14), test-cases.md (อ้าง spec v5), plan.md
- ปรับล่าสุด: 2569-11-14 | เจ้าของ: ทีม vista and friend
- ทิศทางการตาม: Source (SRS/Q) → Requirement → AC → Task → Test/TC → ผล verify

## วิธีอ่านและความหมายของสถานะ
- **Impl** = สถานะ implement ตามที่ tasks.md รายงาน: `เสร็จ` = implement แล้ว, `รอ` = ยังไม่ได้ทำเพราะขาดคน/คำตอบ, `—` = ไม่เกี่ยว
- **Verify** = ผลตรวจ /verify เทียบ spec v5: `ยังไม่ verify` = ยังไม่มีผลรัน test จริงบันทึกไว้ในไฟล์นี้; ห้ามเปลี่ยนเป็น `ผ่าน` จนกว่าจะรัน test และใส่หลักฐาน (วันที่ + คำสั่ง + ผลลัพธ์) ในส่วน E
- **TC** = test case ใน test-cases.md; **Test จริง** = ชื่อ test ที่ tasks.md ระบุว่าอยู่ในโค้ด (ตั้งชื่อตาม AC)
- RTM นี้สร้างจากเอกสาร ไม่ได้ตรวจจากซอร์สโค้ดโดยตรง ชื่อ test ที่ไม่ตรงกับในโค้ดจริงให้แก้ที่ตารางนี้

## สรุปภาพรวม (ณ 2569-11-14)
| รายการ | จำนวน | หมายเหตุ |
|---|---|---|
| FR | 16 | ทุกข้อมีอย่างน้อย 1 AC และ 1 task |
| Constraint | 10 | CON-TECH-01 ผูก AC-CHAT-10 ที่ยังรอ Q-08 |
| NFR | 6 | NFR-PERF-01 และ NFR-USE-01 ยังไม่มีหลักฐานรับรอง |
| AC | 22 | เพิ่ม AC-CHAT-01A, AC-CHAT-10 (v5) และ AC-CHAT-07C (v6) |
| Task | 11 | T-01 ถึง T-09 implement แล้ว; T-10 รอผู้ทดลอง; T-11 รอ Q-08 |
| TC | 78 | 74 ร่าง, 4 รอ (TC-CHAT-02A-2, 02B-3, 02C-5 รอ Q-11; TC-CHAT-10-1 รอค่า N ของ Q-08) |
| Q ตอบแล้ว | 10 | Q-01 ถึง Q-07, Q-09, Q-10, Q-12 (Q-01 เลื่อนเป็น CR-01; Q-08 ตอบบางส่วน) |
| Q ยังค้าง | 2 | Q-08 ส่วนค่า N และ Q-11 (ต้องดูค่าจริงในโค้ด) |
| ผล verify ที่ผ่านแล้วจริง | 0 | ยังไม่ได้รัน /verify |

## A. Requirement → AC → Task → TC

### A1. Functional Requirements
| Req | ที่มา | AC | Task | TC | Impl | Verify |
|---|---|---|---|---|---|---|
| FR-CHAT-01 เลือกนักศึกษาที่ต้องการติดต่อ | UC-05 ขั้น 1 | AC-CHAT-01, AC-CHAT-07A | T-02, T-03 | TC-CHAT-01-1..3, 07A-1..2 | เสร็จ | ยังไม่ verify |
| FR-CHAT-02 เปิดหน้าต่างแชทและแสดงประวัติ | UC-05 ขั้น 2 | AC-CHAT-01 | T-02, T-03 | TC-CHAT-01-1..2 | เสร็จ | ยังไม่ verify |
| FR-CHAT-03 พิมพ์และส่งข้อความ | UC-05 ขั้น 3 | AC-CHAT-02, AC-CHAT-02C | T-04, T-05 | TC-CHAT-02-1..4, 02C-1..5 | เสร็จ | ยังไม่ verify |
| FR-CHAT-04 บันทึกข้อความพร้อมผู้ส่ง ผู้รับ เวลา | UC-05 ขั้น 4 | AC-CHAT-02 | T-04 | TC-CHAT-02-1..4 | เสร็จ | ยังไม่ verify |
| FR-CHAT-05 ส่งให้ผู้รับและแสดงในหน้าต่างแชท | UC-05 ขั้น 5 | AC-CHAT-03 | T-04, T-05 | TC-CHAT-03-1..3 | เสร็จ | ยังไม่ verify |
| FR-CHAT-06 แสดงข้อความใหม่ที่ผู้รับได้รับ | UC-05 ขั้น 6 | AC-CHAT-03 | T-04, T-05 | TC-CHAT-03-1..4 | เสร็จ | ยังไม่ verify |
| FR-CHAT-07 แจ้งเตือนเมื่อส่งไม่ได้ และไม่แสดงเป็นส่งสำเร็จ | UC-05 Exception | AC-CHAT-04 | T-04, T-05, T-07 | TC-CHAT-04-1..3 | เสร็จ | ยังไม่ verify |
| FR-CHAT-08 เปิดดูประวัติสนทนาเดิม | UC-05 ขั้น 6-7 | AC-CHAT-01, AC-CHAT-05 | T-02, T-03 | TC-CHAT-05-1..4 | เสร็จ | ยังไม่ verify |
| FR-CHAT-09 รองรับข้อความ รูป JPG/PNG และ PDF | Q-02 | AC-CHAT-02A, AC-CHAT-02B | T-06, T-07 | TC-CHAT-02A-1..3, 02B-1..5 | เสร็จ | ยังไม่ verify |
| FR-CHAT-10 สถานะ Read แยกต่อข้อความ | Q-03 | AC-CHAT-03B | T-08, T-09 | TC-CHAT-03B-1..4 | เสร็จ | ยังไม่ verify |
| FR-CHAT-11 แสดงไฟล์แนบในประวัติ | Q-02 | AC-CHAT-03A | T-06, T-07 | TC-CHAT-03A-1..3 | เสร็จ | ยังไม่ verify |
| FR-CHAT-12 แจ้งเหตุผลเมื่อไม่อนุญาตเริ่มแชท | Q-04 | AC-CHAT-07 | T-02, T-03, T-09 | TC-CHAT-07-1..3, 07B-6 | เสร็จ | ยังไม่ verify |
| FR-CHAT-13 ข้อความ ≤ 2,000 ตัวอักษร ห้ามว่าง | UC-05 ขั้น 3 | AC-CHAT-02C | T-04, T-05 | TC-CHAT-02C-1..5 (02C-5 รอ Q-11) | เสร็จ | ยังไม่ verify |
| FR-CHAT-14 ลองส่งซ้ำอัตโนมัติ ≤ 3 ครั้ง | Q-05 | AC-CHAT-04A | T-05 | TC-CHAT-04A-1..4 | เสร็จ | ยังไม่ verify |
| FR-CHAT-15 แชทเดิมอ่านอย่างเดียวเมื่อฝ่ายใดไม่พร้อมให้ค้นหา | Q-04 | AC-CHAT-07B, AC-CHAT-07C | T-08, T-09 | TC-CHAT-07B-1..6, 07C-1..2 | เสร็จ (07C ต้องตรวจในโค้ด) | ยังไม่ verify |
| FR-CHAT-16 เก็บไฟล์แนบ 30 วัน ดาวน์โหลดได้ภายในช่วงนั้น | Q-06 | AC-CHAT-03C, AC-CHAT-03D | T-06, T-07 | TC-CHAT-03C-1..3, 03D-1..2 | เสร็จ | ยังไม่ verify |

### A2. Constraints
| Req | AC | Task | TC | Impl | Verify |
|---|---|---|---|---|---|
| CON-AUTH-01 ต้องเข้าสู่ระบบก่อนใช้แชท | AC-CHAT-01A | T-02, T-03, T-06 | TC-CHAT-01A-1..3 | เสร็จ | ยังไม่ verify |
| CON-PRIV-01 ข้อความเข้าถึงได้เฉพาะผู้เข้าร่วม | AC-CHAT-06 | T-02, T-06, T-08 | TC-CHAT-06-1..4, 02-3 | เสร็จ | ยังไม่ verify |
| CON-DATA-01 บันทึกลงฐานข้อมูลก่อนหรือพร้อมการส่ง | AC-CHAT-02 | T-01, T-04, T-06 | TC-CHAT-02-1..4, 04-3 | เสร็จ | ยังไม่ verify |
| CON-TECH-01 รองรับหลายคู่พร้อมกัน | AC-CHAT-10 | T-01 (smoke), T-11 | TC-CHAT-10-1..2 | smoke เท่านั้น; T-11 รอ | ยังไม่ verify |
| CON-REL-01 ส่งไม่สำเร็จต้องไม่บันทึกเป็นส่งสำเร็จ | AC-CHAT-04 | T-01, T-04, T-05 | TC-CHAT-03-3, 04-1..3, 02B-5 | เสร็จ | ยังไม่ verify |
| CON-CHAT-01 ผู้เริ่มมีบัญชี ผู้รับเปิดให้ค้นหา | AC-CHAT-07A | T-02 | TC-CHAT-07A-1..5 | เสร็จ | ยังไม่ verify |
| CON-CHAT-02 ไฟล์แนบ ≤ 1 ไฟล์ต่อข้อความ | AC-CHAT-02A, AC-CHAT-02B | T-06, T-07 | TC-CHAT-02A-1, 02B-1 | เสร็จ | ยังไม่ verify |
| CON-CHAT-03 ฝ่ายใดปิดหาเมท → อ่านอย่างเดียว, fail-closed | AC-CHAT-07B, AC-CHAT-07C | T-08, T-09 | TC-CHAT-07B-1..6, 07C-1..2 | เสร็จ | ยังไม่ verify |
| CON-CHAT-04 ไฟล์แนบพ้น 30 วันต้องลบ/ดาวน์โหลดไม่ได้ | AC-CHAT-03C, AC-CHAT-03D | T-06, T-07 | TC-CHAT-03C-1..3, 03D-1..2 | เสร็จ | ยังไม่ verify |
| CON-CHAT-05 ชนิด JPG/PNG/PDF และขนาด ≤ 10 MB (ใหม่ใน v5) | AC-CHAT-02A, AC-CHAT-02B | T-01, T-06, T-07 | TC-CHAT-02A-1..2, 02B-2..4 (รอ Q-11 บางข้อ) | เสร็จ | ยังไม่ verify |

### A3. Quality Requirements
| Req | AC | Task | TC | Impl | Verify |
|---|---|---|---|---|---|
| NFR-PERF-01 ส่งข้อความ ≤ 3 วินาที | AC-CHAT-10 | T-01 (smoke), T-11 | TC-CHAT-10-1 (รอ Q-08) | smoke เท่านั้น; T-11 รอ | ยังไม่ verify (ยังไม่มีหลักฐานรับรอง) |
| NFR-SEC-01 กันผู้นอกบทสนทนาเข้าถึงข้อความ | AC-CHAT-06 | T-02 | TC-CHAT-06-1..4 | เสร็จ | ยังไม่ verify |
| NFR-SEC-02 กันผู้นอกบทสนทนาเข้าถึงข้อความ/ไฟล์แนบ | AC-CHAT-08 | T-06 | TC-CHAT-08-1..3 | เสร็จ | ยังไม่ verify |
| NFR-REL-01 ข้อความที่ส่งสำเร็จไม่สูญหาย เรียกดูย้อนหลังได้ | AC-CHAT-05 | T-01, T-02, T-03, T-08 | TC-CHAT-05-1..4, 10-2 | เสร็จ | ยังไม่ verify |
| NFR-REL-02 แสดงสถานะและเหตุผลหลัง retry ครบ 3 ครั้ง | AC-CHAT-04A | T-05 | TC-CHAT-04A-1, 04-2 | เสร็จ | ยังไม่ verify |
| NFR-USE-01 ≥ 80% ของผู้ใช้ใหม่ 5 คนส่งข้อความสำเร็จ | AC-CHAT-09 | T-10 | TC-CHAT-09-1..3 | รอผู้ทดลองจริง | ยังไม่ verify |

### A4. Assumptions
| ASM | เกี่ยวข้องกับ | ตรวจที่ |
|---|---|---|
| ASM-01 ผู้ติดต่อได้ต้องมีบัญชีและโปรไฟล์เปิดให้ค้นหา | CON-CHAT-01 | TC-CHAT-07A-3..4 |
| ASM-02 ต้องเข้าสู่ระบบก่อนใช้แชท | CON-AUTH-01 | TC-CHAT-01A-1 |
| ASM-03 เก็บเวลาตามเขตเวลา Asia/Bangkok | FR-CHAT-04 | TC-CHAT-02-4 |
| ASM-04 แชทไม่ใช่สัญญาเช่า/การยืนยันการจอง | ขอบเขตธุรกิจ | ไม่มี test (ไม่ใช่พฤติกรรมของระบบ) |

## B. AC → Test จริง (tasks.md) → TC

| AC | Task | Test จริงตาม tasks.md | TC | Impl | Verify |
|---|---|---|---|---|---|
| AC-CHAT-01 | T-02, T-03 | `test_AC_CHAT_01_selects_student_and_opens_history`; `test_AC_CHAT_01_ui_selects_contact_and_shows_history`; `test_demo_chat_list_open_and_history_use_backend_api` | TC-CHAT-01-1..3 | เสร็จ | ยังไม่ verify |
| AC-CHAT-01A | T-02, T-03 | `test_chat_list_requires_authenticated_identity_and_contact_provider`; `test_demo_mode_is_rejected_outside_development` | TC-CHAT-01A-1..3 | เสร็จ (ฝั่ง API); ฝั่ง UI ต้องตรวจว่าแสดงข้อผิดพลาดทั่วไป | ยังไม่ verify |
| AC-CHAT-02 | T-04, T-05 | `test_AC_CHAT_02_persists_sender_receiver_and_time`; `test_AC_CHAT_02_ui_sends_confirmed_message` | TC-CHAT-02-1..4 | เสร็จ | ยังไม่ verify |
| AC-CHAT-02C | T-04, T-05 | `test_AC_CHAT_02C_rejects_empty_and_over_limit_text`; `test_AC_CHAT_02C_ui_rejects_invalid_text` | TC-CHAT-02C-1..5 | เสร็จ | ยังไม่ verify |
| AC-CHAT-02A | T-06, T-07 | `test_AC_CHAT_02A_sends_one_supported_file_with_message`; `test_AC_CHAT_02A_ui_sends_supported_attachment` | TC-CHAT-02A-1..3 | เสร็จ | ยังไม่ verify |
| AC-CHAT-02B | T-06, T-07 | `test_AC_CHAT_02B_rejects_multiple_or_unsupported_files`; `test_AC_CHAT_02B_rejects_missing_attachment`; `test_AC_CHAT_02B_rejects_file_signature_mismatch`; `test_AC_CHAT_02B_rejects_spoofed_mime_type`; `test_attachment_metadata_failure_removes_unattached_file`; `test_attachment_cleanup_failure_returns_safe_error_and_logs_orphan`; `test_AC_CHAT_02B_ui_reports_invalid_attachment` | TC-CHAT-02B-1..5 | เสร็จ | ยังไม่ verify |
| AC-CHAT-03 | T-04, T-05 | `test_AC_CHAT_03_recipient_sees_sent_message`; `test_AC_CHAT_03_ui_loads_received_message` | TC-CHAT-03-1..4 | เสร็จ | ยังไม่ verify |
| AC-CHAT-03A | T-06, T-07 | `test_AC_CHAT_03A_history_returns_related_attachment`; `test_AC_CHAT_03A_ui_shows_attachment_in_history` | TC-CHAT-03A-1..3 | เสร็จ | ยังไม่ verify |
| AC-CHAT-03B | T-08, T-09 | `test_AC_CHAT_03B_marks_only_visible_message_read`; `test_AC_CHAT_03B_ui_marks_only_visible_message_read` | TC-CHAT-03B-1..4 | เสร็จ | ยังไม่ verify |
| AC-CHAT-04 | T-04, T-05 | `test_AC_CHAT_04_failed_message_is_not_shown_as_sent`; `test_AC_CHAT_04_ui_reports_failure_and_allows_retry` | TC-CHAT-04-1..3 | เสร็จ | ยังไม่ verify |
| AC-CHAT-04A | T-05 | `test_AC_CHAT_04A_ui_shows_final_failure_and_manual_retry` (ฝั่ง Frontend เท่านั้น) | TC-CHAT-04A-1..4 | เสร็จ | ยังไม่ verify |
| AC-CHAT-05 | T-02, T-03 | `test_AC_CHAT_05_loads_persisted_history`; `test_AC_CHAT_05_ui_reopens_persisted_history`; `test_existing_database_adds_read_column_without_losing_history` | TC-CHAT-05-1..4 | เสร็จ | ยังไม่ verify |
| AC-CHAT-06 | T-02 | `test_AC_CHAT_06_denies_nonparticipant_history` | TC-CHAT-06-1..4 | เสร็จ | ยังไม่ verify |
| AC-CHAT-07 | T-02, T-03, T-09 | `test_AC_CHAT_07_rejects_ineligible_recipient_with_reason`; `test_AC_CHAT_07_ui_displays_start_denial_reason`; `test_AC_CHAT_07_new_disallowed_chat_does_not_create_room_or_allow_history` | TC-CHAT-07-1..3 | เสร็จ | ยังไม่ verify |
| AC-CHAT-07A | T-02, T-03 | `test_AC_CHAT_07A_allows_searchable_recipient`; `test_AC_CHAT_07A_ui_opens_allowed_recipient` | TC-CHAT-07A-1..5 | เสร็จ | ยังไม่ verify |
| AC-CHAT-07B | T-08, T-09 | `test_AC_CHAT_07B_existing_chat_is_read_only`; `test_AC_CHAT_07B_existing_history_opens_read_only_without_provider`; `test_AC_CHAT_07B_missing_provider_fails_closed_but_allows_history`; `test_AC_CHAT_07B_unavailable_or_unknown_provider_fails_closed`; `test_AC_CHAT_07B_rejects_attachment_when_either_participant_is_unsearchable`; `test_AC_CHAT_07B_attachment_fails_closed_without_confirmed_provider`; `test_AC_CHAT_07B_ui_loads_existing_history_read_only` | TC-CHAT-07B-1..6 | เสร็จ | ยังไม่ verify |
| AC-CHAT-07C | T-08, T-09 | ไม่มีชื่อ test ใน tasks.md (ดู B2) | TC-CHAT-07C-1..2 | ต้องตรวจในโค้ด | ยังไม่ verify |
| AC-CHAT-03C | T-06, T-07 | `test_AC_CHAT_03C_downloads_attachment_within_retention` (ตรวจครบ 30 วันพอดีได้ และ +1 microsecond ไม่ได้); `test_AC_CHAT_03C_ui_opens_attachment_within_retention` | TC-CHAT-03C-1..3 | เสร็จ | ยังไม่ verify |
| AC-CHAT-03D | T-06, T-07 | `test_AC_CHAT_03D_hides_expired_file_but_keeps_message`; `test_AC_CHAT_03D_ui_hides_expired_attachment` | TC-CHAT-03D-1..2 | เสร็จ | ยังไม่ verify |
| AC-CHAT-08 | T-06 | `test_AC_CHAT_08_denies_nonparticipant_attachment` | TC-CHAT-08-1..3 | เสร็จ | ยังไม่ verify |
| AC-CHAT-09 | T-10 | ไม่มี automated test — ทดสอบด้วยคน | TC-CHAT-09-1..3 | รอผู้ทดลองจริง | ยังไม่ verify |
| AC-CHAT-10 | T-01 (smoke), T-11 | `test_feature_config_values`; `test_chat_repository_persists_messages_for_multiple_pairs`; `test_chat_pair_concurrency_and_latency_smoke` (smoke ไม่ใช่การรับรอง) | TC-CHAT-10-1..2 | smoke เท่านั้น; T-11 รอ Q-08 | ยังไม่ verify |

### B2. TC ที่ยังไม่มี test จริงรองรับตาม tasks.md (ต้องเพิ่ม test หรือยืนยันว่ามีแล้วตอน /verify)
- TC-CHAT-02-3 (ผู้ที่ไม่ใช่สมาชิกส่งข้อความไม่ได้), TC-CHAT-02-4 (เวลา Asia/Bangkok)
- TC-CHAT-02A-2 และ TC-CHAT-02B-3 (ขอบ 10 MB พอดีและ +1 ไบต์ — ต้องรอ Q-11 ก่อนกำหนดตัวเลข)
- TC-CHAT-03B-4 (ผู้ส่ง/ผู้นอกเรียก API Read ไม่ได้), TC-CHAT-06-4 (เดา ID)
- TC-CHAT-04-3 (บันทึกฐานข้อมูลล้มเหลวระหว่างส่ง), TC-CHAT-05-4 (ข้อความอยู่ครบหลังรีสตาร์ท)
- TC-CHAT-03D-2 (เรียก URL ดาวน์โหลดเดิมหลังหมดอายุ), TC-CHAT-07A-4 (ผู้เริ่มแชทไม่มีบัญชี)
- TC-CHAT-10-1 (ต้องกำหนด N ตาม Q-08)
- TC ที่ผูกกับคำตอบ Q ใหม่: TC-CHAT-01A-3 (UI แสดงข้อผิดพลาดทั่วไป), 02A-3 (ไฟล์ไม่มีข้อความ), 02C-4 (ข้อความช่องว่างล้วน), 03-4 (เห็นข้อความเมื่อโหลดซ้ำ), 05-3 (ห้องว่างเมื่อไม่มีประวัติ), 07A-5 (ผู้เริ่มปิดค้นหาแต่เปิดแชทใหม่ได้ ส่งไม่ได้), 07C-1..2 (กลับมาส่งได้เมื่อทั้งสองฝ่ายเปิด)
- ถ้าพบว่ามีอยู่แล้วในโค้ด ให้ใส่ชื่อ test จริงในส่วน B และตัดรายการออกจากส่วนนี้

## C. Question / Assumption → การจัดการ
| Q | คำตอบ/สถานะ | ผลต่อ spec | ผลต่อ task | ผลต่อ TC |
|---|---|---|---|---|
| Q-01 แจ้งเตือนข้อความใหม่ | ตอบแล้ว: ต้องการ In-app + Push | **ขัดกับ Out of scope** → บันทึกเป็น CR-01 (Deferred) | ไม่มี task | ไม่มี TC |
| Q-02 ไฟล์/รูปภาพ | ตอบแล้ว | FR-CHAT-09, FR-CHAT-11, CON-CHAT-02, CON-CHAT-05 | T-06, T-07 | TC-CHAT-02A/02B/03A |
| Q-03 สถานะ Read | ตอบแล้ว | FR-CHAT-10 | T-08, T-09 | TC-CHAT-03B |
| Q-04 สิทธิ์เริ่มแชท / แชทเดิมเมื่อปิดหาเมท | ตอบแล้ว | CON-CHAT-01, CON-CHAT-03, FR-CHAT-12, FR-CHAT-15 | T-02, T-03, T-08, T-09 | TC-CHAT-07, 07A, 07B |
| Q-05 retry | ตอบแล้ว | FR-CHAT-14, NFR-REL-02 | T-05 | TC-CHAT-04A |
| Q-06 อายุไฟล์แนบ | ตอบแล้ว | CON-CHAT-04, FR-CHAT-16 | T-06, T-07 | TC-CHAT-03C, 03D |
| Q-07 ผู้เริ่มแชทต้อง searchable หรือไม่ | ตอบแล้ว: ไม่ต้อง (เริ่มใหม่ตรวจเฉพาะผู้รับ; ส่งตรวจสองฝ่าย) | CON-CHAT-01 ชี้แจง | T-02, T-08 | TC-CHAT-07A-5 |
| Q-08 จำนวนผู้ใช้พร้อมกันและวิธีนับ 3 วินาที | ตอบบางส่วน: 3 วินาทีต่อการส่ง ไม่รวม retry; ค่า N ยังค้าง | NFR-PERF-01 ชี้แจง, AC-CHAT-10 | T-11 | TC-CHAT-10-1 (รอ N) |
| Q-09 แสดงข้อความ real-time หรือไม่ | ตอบแล้ว: ไม่ต้อง | FR-CHAT-06 ชี้แจง | T-05 | TC-CHAT-03-4 |
| Q-10 พฤติกรรม UI ที่ spec ไม่กำหนด (ก ถึง ง) | ตอบแล้ว: ข้อผิดพลาดทั่วไป / ห้องว่าง / ช่องว่างล้วนนับว่าว่าง / ไฟล์ต้องมีข้อความ | FR-CHAT-02, 13; AC-CHAT-01A | T-03, T-05, T-07 | TC-CHAT-01A-3, 02A-3, 02C-4, 05-3 |
| Q-11 นิยามหน่วย 10 MB และการนับตัวอักษร | ยังค้าง: ต้องดูค่าใน config/โค้ด | CON-CHAT-05, FR-CHAT-13 | T-01, T-06 | TC-CHAT-02A-2, 02B-3, 02C-5 (รอ) |
| Q-12 กลับมาส่งได้เมื่อทั้งสองฝ่ายเปิดค้นหาอีกครั้ง | ตอบแล้ว: ได้ | FR-CHAT-15 ชี้แจง, AC-CHAT-07C | T-08 | TC-CHAT-07C-1..2 |

## D. ช่องว่าง การเลื่อนงาน และผลกระทบจากการเปลี่ยนแปลง

### D1. ช่องว่างที่ยังเปิดอยู่ (ต้องปิดก่อนส่งงานหรือก่อนระบุว่า verify ครบ)
| # | ช่องว่าง | ความรุนแรง | ทางปิด |
|---|---|---|---|
| G-1 | NFR-PERF-01 ไม่มีค่า N และไม่มีหลักฐานรับรอง (ปัจจุบันเป็น smoke) | สูง | ตอบ Q-08 → ทำ T-11 |
| G-2 | NFR-USE-01 / AC-CHAT-09 ยังไม่มีผลทดลองจริง | สูง | จัดผู้ทดลอง 5 คนที่ไม่เคยใช้แชท (T-10) |
| G-3 | Authentication และรายชื่อจาก UC-04 ยังเชื่อมผ่าน boundary/Demo เท่านั้น | กลาง | เชื่อมจริงก่อน T-10; ห้ามใช้ Demo Provider กับผลทดลอง |
| G-4 | Q-08 (ค่า N) และ Q-11 ยังค้าง (มี TC รอ 4 ข้อ); คำตอบของ Q-07, 09, 10, 12 ยังต้องตรวจว่าตรงกับโค้ดจริง | กลาง | เปิด config ดูค่า 10 MB/การนับตัวอักษร; ทีมกำหนด N; ตรวจพฤติกรรมตอน /verify |
| G-5 | TC ใน B2 ยังไม่ยืนยันว่ามี test จริง | กลาง | ตรวจโค้ดตอน /verify |
| G-6 | spec ยังไม่ใส่เลขข้อ SRS ในหัวไฟล์ (Source) | ต่ำ | ใส่เลขข้อให้ตรง SRS |
| G-7 | วิธีเก็บและ backup ไฟล์สำหรับ production ยังไม่กำหนด | ต่ำ (นอก AC) | ทีมเลือกก่อนใช้งานจริง |
| G-8 | Interface Clarification ใน spec ต้องตรงกับโค้ด (เช่น Demo เป็น read-only ทั้งที่ T-05 เพิ่ม UI ส่งข้อความ) | กลาง | ตรวจตอน /verify |

### D2. Change Request CR-01: แจ้งเตือนข้อความใหม่ (In-app + Push)
- ที่มา: Q-01 (ตอบว่าต้องการ) ขัดกับ Out of scope ใน spec; สถานะ: เลื่อน (Deferred) ออกจาก release นี้ — ทีมต้องยืนยัน
- ผลกระทบ (Impact Analysis):
  - spec: เพิ่ม FR/AC ใหม่ (เช่น แจ้งเตือนผู้รับเมื่อมีข้อความใหม่, ผู้ใช้ปิดแจ้งเตือนได้หรือไม่) และย้ายออกจาก Out of scope
  - Requirement ที่ได้รับผลกระทบ: FR-CHAT-05/06 (ช่องทางส่งถึงผู้รับ), NFR-PERF-01 (ต้องไม่ทำให้การส่งช้าลง), NFR-SEC-01 (แจ้งเตือนห้ามเปิดเผยเนื้อหาให้ผู้นอกบทสนทนา), CON-CHAT-03 (แชท read-only ต้องไม่ส่งแจ้งเตือน?)
  - Design/โค้ด: ต้องมีบริการ push, การเก็บ device token, ตัวกลางส่ง notification; เพิ่มไฟล์ใหม่ใน Backend/Frontend
  - Task/Test: เพิ่ม task และ TC ใหม่; ต้องรัน regression ของเฟส 2 และ 4
  - ความเสี่ยง: ขอบเขตงานโตเกินเวลาของรายวิชา; แนะนำให้คงสถานะ Deferred จนกว่าอาจารย์/ทีมอนุมัติ

## E. ผล verify และหลักฐาน (กรอกเมื่อรันจริง)
| วันที่ | คำสั่ง | ผลลัพธ์ (ผ่าน/ไม่ผ่าน/จำนวน) | ผู้รัน | หมายเหตุ |
|---|---|---|---|---|
| — | `cd backend && pytest` | — | — | ยังไม่ได้รัน |
| — | `cd frontend && npx vitest run` | — | — | ยังไม่ได้รัน |
| — | แบบบันทึกผล usability 5 คน (AC-CHAT-09) | — | — | ยังไม่ได้ทดลอง |

### E1. ลำดับ /verify ที่แนะนำ
1. ปิด Q-11 (ดูค่าใน config และตัวนับตัวอักษร) และกำหนดค่า N ของ Q-08 แล้วอัปเดต spec/test-cases
2. ตรวจ spec.md Interface Clarification เทียบโค้ดจริง (endpoint, `allowed`/`read_only`, ค่า config 10 MB และ 2,000)
3. รัน pytest และ vitest ทั้งหมด บันทึกผลในส่วน E
4. ไล่ส่วน B2 เพิ่ม test ที่ขาด (ห้ามแก้ test เดิมให้ผ่านเอง ถ้าไม่ผ่านให้ตัดสินว่าโค้ดผิดหรือ AC ผิด)
5. เมื่อ TC ผ่านครบของ AC ใด ให้ติ๊ก `[x]` AC นั้นใน spec.md และเปลี่ยนสถานะ Verify ในไฟล์นี้เป็น `ผ่าน` พร้อมอ้างหลักฐาน
6. ทำ T-11 และ T-10 เป็นลำดับสุดท้าย

## F. Change Log
- 2569-11-14 (v6): ทีมตอบ Q-07, Q-09, Q-10, Q-12 และ Q-08 บางส่วน; เพิ่ม AC-CHAT-07C, TC-CHAT-07C-1..2 (แทน TC-CHAT-07B-7); TC ที่รอเหลือ 4 ข้อ
- 2569-11-14: สร้าง RTM ฉบับแรกจาก spec v5, tasks.md และ test-cases.md; ยังไม่มีผล verify