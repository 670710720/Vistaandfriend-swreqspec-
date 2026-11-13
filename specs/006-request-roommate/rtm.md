
# RTM: ส่งคำขอเป็นเมท (Feature 006 — Request Roommate)

อ้างอิง: [spec.md](./spec.md) SPEC-RRS-006 Draft v3 | [tasks.md](./tasks.md) | [test-cases.md](./test-cases.md) | [integration-contract.md](./integration-contract.md)

ตรวจด้วย `/verify` เมื่อ 2026-11-13 22:34 (repository timezone)

ผลทดสอบจริง: Backend 23 passed, 3 skipped, 0 failed | Frontend 18 passed, 5 test files, 0 failed

## สถานะและขอบเขตหลักฐาน

- **PASS / ครบ:** มี implementation และ test ผ่านที่ยืนยันพฤติกรรมตาม AC ในระดับที่ระบุ
- **FAIL / ช่องโหว่:** implementation หรือ test ขัด/ไม่ครบ requirement
- **BLOCKED:** ต้องอาศัยระบบหรือ contract ภายนอกที่ยังไม่มี
- **NOT VERIFIED / ยังไม่ถึง:** task ยังไม่ทำหรือยังไม่มีหลักฐานทดสอบเพียงพอ
- ผล PASS ของ unit/UI component ไม่ยืนยันการทำงานแบบ end-to-end
- ไม่พบ `specs/000-shared/`; จึงไม่มี shared constraints เพิ่มเติม

## 1. ตามรอยไปข้างหน้า (Requirement → AC → Task → Code → Test → Mockup)

| ID | AC | Task | Implementation และหลักฐาน | Test (ผลจริง) | Mockup | สถานะ |
|---|---|---|---|---|---|---|
| FR-RRS-01 | AC-RRS-01 | T-02, T-04 | `frontend/src/pages/RequestRoommatePage.jsx`: เลือกโปรไฟล์จาก props | `test_AC_RRS_01_selects_profile_and_submits_request_form` ผ่าน; ทดสอบ callback ไม่ใช่การเริ่ม validation/backend จริง | `mockup/roommate-request.html`:98,124,150 มี radio `data-req` | **FAIL** — Component ไม่ได้ mount ใน `App.jsx` และไม่มีแหล่งผลลัพธ์โปรไฟล์จริง |
| FR-RRS-02 | AC-RRS-01 | T-02 | `RequestRoommatePage.jsx`: `handleSubmit`; `frontend/src/api/client.js`: `createRoommateRequest` | Frontend AC-RRS-01 ผ่านด้วย mock callback; Backend `test_AC_RRS_01` ผ่านเฉพาะ service | `mockup/roommate-request.html`:183 ปุ่ม `data-req` | **FAIL** — POST ไม่มี backend route/runtime ที่รับจริง |
| FR-RRS-03 | AC-RRS-02 | T-01, T-03 | `backend/app/services/request_roommate_service.py`: `is_receiver_available`, `can_submit_request`; model: `normalize_receiver_status` | `test_AC_RRS_02`, `test_missing_receiver_status_is_rejected` ผ่าน เฉพาะค่าที่ส่งเข้ามา | `mockup/roommate-request.html`:104-105 แสดงสถานะตัวอย่าง | **FAIL** — ตรวจค่า status จาก caller ไม่ได้อ่านสถานะผู้รับจาก Profile provider |
| FR-RRS-04 | AC-RRS-03 | T-01, T-03 | `backend/app/repositories/roommate_request_repository.py`: `find_pending_by_sender_receiver`; service: `has_pending_request` | `test_AC_RRS_03`, `test_AC_RRS_06` ผ่านใน in-memory repository | — | **PASS** — ตรวจพบ pending ซ้ำในขอบเขต in-memory |
| FR-RRS-05 | AC-RRS-04 | T-05 | `RequestRoommateService.create_request`; `InMemoryRoommateRequestRepository.add` | `test_AC_RRS_04` ผ่าน ยืนยัน pending และมี record ใน memory | — | **BLOCKED** — ไม่มี persistent store หรือ API runtime; ไม่ใช่หลักฐานการบันทึกถาวร |
| FR-RRS-06 | AC-RRS-04, AC-RRS-04A, AC-RRS-11 | T-05, T-06 | `RequestRoommateService.notify_recipient`; `backend/app/services/notification_service.py` | `test_AC_RRS_04A`, `test_AC_RRS_11` ผ่านเมื่อ inject in-memory service | `mockup/notifications.html`:216-238 แสดงตัวอย่างแจ้งเตือน | **FAIL** — default `NullNotificationService` คืน success แม้ไม่ได้ส่งจริง (F-02) |
| FR-RRS-07 | AC-RRS-04, AC-RRS-04A | T-01, T-05, T-07, T-08 | `RoommateRequest.status`; `frontend/src/pages/RoommateRequestListPage.jsx` แสดง label | `test_AC_RRS_04`, `test_AC_RRS_04A`, `test_AC_RRS_10_displays_all_request_statuses_from_real_request_data` ผ่าน | `mockup/request-list.html`:102-128 | **PASS** — ยืนยัน pending และแสดงสถานะใน component; ยังไม่ใช่ end-to-end |
| FR-RRS-08 | AC-RRS-05 | T-03, T-09 | `RequestRoommateService.can_submit_request` ปฏิเสธ status ที่ไม่ active | `test_AC_RRS_05`, `test_missing_receiver_status_is_rejected` ผ่านจาก input ที่กำหนดใน test | `mockup/roommate-request.html`:104-105 เป็น static data | **FAIL** — ไม่มีการอ่านสถานะจริงและ Client ตั้ง default เป็น active (F-03) |
| FR-RRS-09 | AC-RRS-06, AC-RRS-13, AC-RRS-13A | T-03, T-09, T-10 | ตรวจ pending ใน repository; `has_active_match` ใช้ injected checker และปฏิเสธเมื่อไม่ทราบผล | `test_AC_RRS_06` ผ่าน; AC-RRS-13/13A ไม่มี test ที่ผ่านจริง; `test_AC_RRS_13A` skipped | — | **BLOCKED** — Match data contract/provider จาก Feature 007/008/009 ไม่มีใน repo |
| FR-RRS-10 | AC-RRS-09 | T-01, T-04 | `backend/app/validators/request_guard.py`: `ensure_not_self_request` | `test_AC_RRS_09` ผ่าน โดยยืนยัน exception และ assert ว่าจำนวนคำขอไม่เพิ่มขึ้น | — | **PASS** — unit test ยืนยันว่าการส่งคำขอให้ตนเองถูกปฏิเสธและไม่มี record ใหม่; ยังไม่ใช่หลักฐาน end-to-end |
| FR-RRS-11 | AC-RRS-10 | T-07 | `frontend/src/pages/RoommateRequestListPage.jsx`: status normalization/render | `test_AC_RRS_10_displays_all_request_statuses_from_real_request_data`, `test_AC_RRS_10_displays_pending_status_when_request_is_waiting_for_response` ผ่าน | `mockup/request-list.html`:102-128 แสดง 4 สถานะตัวอย่าง | **PASS** — component แสดงสถานะที่กำหนด; API/data จริงยัง BLOCKED |
| FR-RRS-12 | AC-RRS-11 | T-05, T-06 | `frontend/src/pages/NotificationsPage.jsx`; `frontend/src/components/RoommateRequestDetail.jsx` | `test_AC_RRS_11_displays_request_notification_list_and_detail` ผ่าน แต่ไม่ assert รูปโปรไฟล์หรือเวลา | `mockup/notifications.html`:216-238 มี SVG, ชื่อ, เวลา และรายละเอียด | **FAIL** — UI จริงแสดงอักษรย่อแทนรูปโปรไฟล์; ข้อมูลเวลา/รูปไม่ถูกตรวจ (F-04) |
| FR-RRS-13 | AC-RRS-04A, AC-RRS-11A | T-05, T-06, T-12 | `RequestRoommateService.notify_recipient`; `NotificationsPage` และ `RoommateRequestDetail` | `test_AC_RRS_04A`, `test_AC_RRS_11A_retries_three_times_and_keeps_request_pending` ผ่านเมื่อ inject failure | `notifications.html` ไม่มี failure state แยก | **BLOCKED** — failure path unit-tested แต่ runtime ใช้ default ที่รายงาน success และไม่มี provider จริง (F-02) |
| FR-RRS-14 | AC-RRS-04, AC-RRS-04B | T-01, T-02, T-11 | `backend/app/validators/request_validator.py`; `frontend/src/api/client.js`: Unicode code-point length; component validates input | `test_AC_RRS_04B`, `test_AC_RRS_04B_accepts_exactly_500_unicode_code_points`, `test_AC_RRS_04B_accepts_request_without_message` ผ่าน; FE 500/501 tests ผ่าน | `mockup/roommate-request.html`:178-181 มี textarea/maxlength | **PASS (unit scope)** — ยืนยันการส่งคำขอโดยไม่ระบุข้อความและขีดจำกัด 500 ตัวอักษร; ยังไม่ใช่หลักฐาน end-to-end |
| FR-RRS-15 | AC-RRS-06A | T-09 | ปัจจุบัน `can_submit_request` แล้วแยก `repository.add`; ไม่พบ transaction/lock | `test_AC_RRS_06A` ทดสอบ duplicate ที่มีอยู่ก่อน ไม่ได้จำลองการเปลี่ยนสถานะระหว่างเปิดหน้ากับยืนยัน | — | **NOT VERIFIED** — T-09 ยัง “พร้อมทำ”; atomic recheck ยังไม่มีหลักฐาน |
| FR-RRS-16 | AC-RRS-11A | T-05, T-12 | `backend/app/services/notification_retry_service.py`: `send_request_notification`; `backend/app/config.py`: `MAX_NOTIFICATION_RETRIES` | `test_AC_RRS_11A_retries_three_times_and_keeps_request_pending`, `test_AC_RRS_11A_stops_retrying_after_notification_succeeds` ผ่าน; ยืนยันครั้งแรก + retry สูงสุด 3 ครั้ง | — | **BLOCKED** — retry orchestration ผ่าน unit test แต่ Notification provider จริงไม่มี |
| NFR-RRS-01 | AC-RRS-07 | T-04 | `RequestGuard.ensure_authenticated`; service เรียกเฉพาะเมื่อมี `auth_checker` | `test_AC_RRS_07` skipped | — | **BLOCKED** — ไม่มี Authentication implementation/contract; sender ID ที่ไม่ว่างอย่างเดียวไม่ยืนยันการ login |
| NFR-RRS-02 | AC-RRS-05, AC-RRS-06, AC-RRS-06A | T-03, T-09 | service ปฏิเสธผู้รับ inactive และ pending ซ้ำใน memory | AC-RRS-05/06 tests ผ่านระดับ unit; ไม่มี runtime/store จริง | — | **FAIL** — ป้องกันได้เฉพาะใน-memory flow ยังไม่มี API/persistence ที่บังคับใช้จริง |
| NFR-RRS-03 | AC-RRS-14 | T-13 | ไม่มี usability study/result ใน repo | ไม่มี user-study test; `test-cases.md` ระบุวิธีทดสอบด้วยคน | — | **NOT VERIFIED** — T-13 ยัง “พร้อมทำ”; ไม่มีผลผู้ใช้ 5 คน |
| NFR-RRS-04 | AC-RRS-13A | T-03, T-09, T-10 | `has_active_match` ผ่าน injected checker; fail-closed เมื่อไม่มี checker | `test_AC_RRS_13A` skipped; unit checker test ใช้ test double | — | **BLOCKED** — Match/Cancellation contracts จาก Feature อื่นยังไม่มี |
| NFR-RRS-05 | AC-RRS-06B | T-14 | ไม่มี lock/transaction/unique constraint; repository เป็น in-memory list | ไม่มี concurrency test file/test; AC-RRS-06B ยังไม่มีผล | — | **NOT VERIFIED** — T-14 ยัง “พร้อมทำ”; concurrent duplicate protection ยังไม่ผ่านการพิสูจน์ |
| CON-RRS-01 | AC-RRS-07 | T-04 | `RequestGuard.ensure_authenticated` ใช้ optional checker; ถ้าไม่มี ตรวจเพียง sender ID ไม่ว่าง | Backend AC-RRS-07 skipped | — | **BLOCKED** — Authentication provider/contract ไม่มี |
| CON-RRS-02 | AC-RRS-01, AC-RRS-12 | T-02, T-04 | `RequestGuard.ensure_profile_exists` ใช้ optional checker; UI แสดงข้อความเมื่อ profiles ว่าง | FE `test_AC_RRS_12_requires_profile_before_requesting_roommate` ผ่านเฉพาะข้อความ; Backend AC-RRS-12 skipped | — | **BLOCKED** — ไม่มี Profile provider; FE ไม่มี flow นำไปหน้าสร้างโปรไฟล์ |
| CON-RRS-03 | AC-RRS-02, AC-RRS-05 | T-01, T-03 | `is_receiver_available(receiver_status)` ตรวจค่า input | `test_AC_RRS_02`, `test_AC_RRS_05` ผ่านด้วยข้อมูลป้อนเข้า | `roommate-request.html`:104-105 เป็นตัวอย่าง | **BLOCKED** — สถานะไม่มาจาก authoritative Profile source; mapping ของค่า status ยังไม่ยืนยัน |
| CON-RRS-04 | AC-RRS-02, AC-RRS-03, AC-RRS-06A | T-03 | มีการตรวจ string status/คำขอใน memory; ไม่มี lookup ว่าผู้รับมีอยู่จริง | `test_missing_receiver_status_is_rejected`; ไม่มี test ตรวจ recipient existence | — | **BLOCKED** — ไม่พบ Profile/User source; implementation ไม่ตรวจการมีอยู่จริงของผู้รับ |
| CON-RRS-05 | AC-RRS-03, AC-RRS-06, AC-RRS-06B | T-01, T-03, T-09, T-14 | repository ค้น pending ตาม sender/receiver; ไม่มี atomic storage | `test_AC_RRS_03`, `test_AC_RRS_06` ผ่านเฉพาะ sequential memory tests | — | **NOT VERIFIED** — ส่วน atomic/race ยังรอ T-09/T-14 |
| CON-RRS-06 | AC-RRS-05, AC-RRS-06, AC-RRS-06A | T-01, T-03, T-09 | service ปฏิเสธ inactive/duplicate ก่อน add ใน memory | `test_AC_RRS_05`, `test_AC_RRS_06` ผ่านระดับ unit | — | **BLOCKED** — ยังไม่มี data source/atomic persistence จริง |
| CON-RRS-07 | AC-RRS-08 | T-03, T-07 | repository แยก query pending ต่อ receiver; service ไม่จำกัดจำนวนผู้ส่ง | `test_AC_RRS_08` ผ่านและตรวจจำนวน 2 requests | `request-list.html` มีรายการหลายรายการตัวอย่าง | **PASS** — รองรับผู้ส่งหลายคนใน unit/in-memory scope |
| CON-RRS-08 | AC-RRS-09 | T-01, T-04 | `RequestGuard.ensure_not_self_request` เปรียบเทียบ sender/receiver | `test_AC_RRS_09` ผ่าน โดยยืนยัน exception และ assert ว่าจำนวนคำขอไม่เพิ่มขึ้น | — | **PASS (unit scope)** — ยืนยันว่าคำขอที่ส่งให้ตนเองถูกปฏิเสธและไม่มี record ใหม่ |
| CON-RRS-09 | AC-RRS-15 | T-07, T-08 | ไม่มี expiry/cleanup; request คงอยู่ใน repository | `test_AC_RRS_15_pending_request_remains_pending_after_time_passes` ผ่าน | `request-list.html` แสดง pending | **PASS** — ไม่มีการหมดอายุอัตโนมัติใน implementation ปัจจุบัน |
| CON-RRS-10 | AC-RRS-04, AC-RRS-04B | T-01, T-02, T-11 | `backend/app/config.py`: 500; backend validator และ frontend code-point guard | Backend/Frontend 500 และ 501 tests ผ่าน; `test_AC_RRS_04B_accepts_request_without_message` ผ่านใน service unit test | `roommate-request.html`:178-181 | **PASS (unit scope)** — ยืนยันขีดจำกัด 500 ตัวอักษรและการส่งคำขอโดยไม่ระบุข้อความ; ยังไม่มีหลักฐาน end-to-end |
| CON-RRS-11 | AC-RRS-06A, AC-RRS-06B | T-09, T-14 | ไม่พบ transaction/lock; check และ add เป็นคนละขั้น | ไม่มี test ที่จำลอง race; `test_AC_RRS_06A` ไม่ได้จำลองสถานะเปลี่ยนก่อนยืนยัน | — | **NOT VERIFIED** — T-09/T-14 ยังไม่เสร็จ |
| CON-RRS-12 | AC-RRS-13A | T-03, T-09, T-10 | `has_active_match` รับ optional checker; ไม่มี contract/provider ใน runtime | checker unit tests ผ่าน; `test_AC_RRS_13A` skipped | — | **BLOCKED** — ยังไม่มี Match/Cancellation data contract จริง |

**สรุปสถานะ 33 IDs:** PASS 9 | FAIL 7 | BLOCKED 12 | NOT VERIFIED 5

(PASS 5 FR + 4 CON; FAIL 6 FR + 1 NFR; BLOCKED 4 FR + 2 NFR + 6 CON; NOT VERIFIED 1 FR + 2 NFR + 2 CON)

## 2. ตามรอยย้อนกลับ (Code → Requirement)

| Code (file:symbol) | อ้าง ID | ตรงกับ Spec หรือไม่ | หมายเหตุ |
|---|---|---|---|
| `backend/app/models/roommate_request.py:normalize_status`, `RoommateRequest` | FR-RRS-05, FR-RRS-07, FR-RRS-11, FR-RRS-14, CON-RRS-05, CON-RRS-10 | บางส่วน | เก็บสถานะและจำกัด message; `normalize_receiver_status` มี alias หลายค่าโดยยังไม่มี canonical status mapping จาก Profile owner (F-03) |
| `backend/app/repositories/roommate_request_repository.py:find_pending_by_sender_receiver`, `add` | FR-RRS-04, CON-RRS-05, CON-RRS-07 | ตรงใน memory | list เป็น in-memory เท่านั้น; ไม่มี persistence/atomic guarantee |
| `backend/app/services/request_roommate_service.py:can_submit_request`, `create_request`, `submit_request` | FR-RRS-03 ถึง FR-RRS-09, FR-RRS-13, FR-RRS-15, CON-RRS-03 ถึง CON-RRS-07, CON-RRS-11/12 | บางส่วน | ใช้ข้อมูล/Checker ที่ inject; ไม่มี Profile lookup หรือ transaction; Match fail-closed เมื่อ checker หาย |
| `backend/app/validators/request_guard.py:ensure_authenticated`, `ensure_profile_exists`, `ensure_not_self_request` | CON-RRS-01/02/08, FR-RRS-10, NFR-RRS-01 | บางส่วน | Auth/Profile checker เป็น optional; หากไม่ inject จะไม่ยืนยันเจ้าของระบบจริง |
| `backend/app/validators/request_validator.py:validate_roommate_request_message_length`; `backend/app/config.py` | FR-RRS-14, CON-RRS-10 | ตรงใน unit scope | ขีดจำกัดมาจาก config และใช้ Python code-point length |
| `backend/app/services/notification_service.py:NullNotificationService.send_request_notification` | FR-RRS-06, FR-RRS-13 | **ขัดกับข้อกำหนด** | คืน success=True พร้อมข้อความ “notification not configured” และ attempts=0 โดยไม่มีการส่ง (F-02) |
| `backend/app/services/notification_retry_service.py:send_request_notification` | FR-RRS-16 | ตรงใน unit scope | ส่งครั้งแรกและ retry ได้สูงสุด 3 ครั้ง; ไม่ใช่ Provider จริง |
| `backend/app/controllers/roommate_request_controller.py:submit_request` | FR-RRS-02, FR-RRS-05 ถึง FR-RRS-07 | บางส่วน | มี controller method แต่ไม่มี route/runtime ที่เรียกใช้ |
| `frontend/src/api/client.js:createRoommateRequest` | FR-RRS-02, FR-RRS-14 | **ขัด/ไม่มีการเชื่อมจริง** | POST `/api/roommate-requests` ไม่มี Backend route; เมื่อ `fetch` ไม่มี คืน success-shaped fallback; receiver status default เป็น active (F-01/F-02/F-03) |
| `frontend/src/pages/RequestRoommatePage.jsx:RequestRoommatePage`, `handleSubmit` | FR-RRS-01/02/14, CON-RRS-02/10 | บางส่วน | เลือกจาก props และเรียก callback; ใช้ sender ID default `current-student`; ไม่มี profile/search flow จากระบบจริง |
| `frontend/src/App.jsx:App` | — | ไม่เชื่อม Feature 006 | ไม่ได้ import/mount RequestRoommatePage, NotificationsPage หรือ RoommateRequestListPage; หน้าหลักที่ mount เป็น Feature 001 |
| `frontend/src/pages/NotificationsPage.jsx:NotificationsPage`; `RoommateRequestDetail.jsx` | FR-RRS-06/12/13 | **ไม่ครบ** | ใช้ initials แทน profile image; missing status ถูกแสดงเป็นแจ้งเตือนสำเร็จ; fallback text/time ไม่ได้มาจาก contract (F-02/F-04) |
| `frontend/src/pages/RoommateRequestListPage.jsx:RoommateRequestListPage` | FR-RRS-11, CON-RRS-07/09 | ตรงใน component scope | แสดงสถานะจาก props; ไม่ได้ดึงรายการจริงจาก API |
| `frontend/src/__tests__/*` และ `backend/tests/test_roommate_request.py` | AC ที่ระบุในชื่อ tests | บางส่วน | test cases `TC-RRS-*` ยังเป็น “ร่าง”; ไม่มี concurrency test หรือผล usability |
| `specs/006-request-roommate/mockup/*.html` | FR-RRS-01/02/03/08/11/12/14 | ใช้เป็นหลักฐานภาพเท่านั้น | Static/mock data; ไม่พิสูจน์ implementation หรือ integration; `roommate-request.html` มีช่องค้นหา UC-04 ซึ่ง Out of scope (F-06) |

## 3. ข้อค้นพบ

ชนิดที่ใช้: โค้ดไม่มี FR / test อ่อน / mockup เกิน spec / BLOCKED integration

ช่อง “ทีมตัดสิน” เว้นว่างเพื่อให้ทีมพิจารณา

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-01 | BLOCKED integration | `frontend/src/api/client.js:createRoommateRequest`; `backend/app/controllers/roommate_request_controller.py`; `frontend/src/App.jsx:App` | FR-RRS-01/02/05 | Frontend POST ไป `/api/roommate-requests` แต่ไม่พบ `backend/app/main.py`, route หรือ persistence; หน้าของ Feature 006 ไม่ได้ mount ใน App จึงไม่มี end-to-end request flow | |
| F-02 | โค้ดไม่มี FR / ผลสำเร็จเท็จ | `backend/app/services/notification_service.py:NullNotificationService`; `frontend/src/api/client.js`; `frontend/src/components/RoommateRequestDetail.jsx` | FR-RRS-06/13/16 | Notification ที่ไม่ได้ configure ถูกคืน success; client fallback เมื่อไม่มี `fetch` ก็คืน `{ok:true}`; รายละเอียดแจ้งเตือนที่ไม่มีสถานะถูกแสดงเป็นสำเร็จ ทำให้ผล UI ไม่พิสูจน์ว่าผู้รับได้รับแจ้งเตือน | |
| F-03 | BLOCKED integration / การเดาค่า | `frontend/src/pages/RequestRoommatePage.jsx`; `frontend/src/api/client.js`; `backend/app/models/roommate_request.py:normalize_receiver_status`; `request_guard.py` | CON-RRS-01/02/03/04, FR-RRS-03/08, NFR-RRS-01 | ใช้ sender ID default, receiver status default เป็นกำลังหาเมท, รับ status จาก caller และมี checker เป็น optional; Profile/Auth owners ยังไม่มี contract. ไม่ตรวจ recipient existence จริง และ alias status ยังไม่มี canonical mapping | |
| F-04 | โค้ดไม่มี FR / test อ่อน | `frontend/src/components/RoommateRequestDetail.jsx`; `frontend/src/pages/NotificationsPage.jsx`; `frontend/src/__tests__/notifications-page.test.jsx` | FR-RRS-12, AC-RRS-11 | UI แสดง initials ไม่ใช่รูปโปรไฟล์; test ไม่ assert profile image หรือ timestamp แม้ AC กำหนดทั้งสองอย่าง | |
| F-05 | test อ่อน (เหลือบางส่วน) | `frontend/src/__tests__/request-roommate-page.test.jsx` | CON-RRS-02, AC-RRS-12 | FE `test_AC_RRS_12_requires_profile_before_requesting_roommate` ตรวจเฉพาะข้อความเมื่อไม่มีโปรไฟล์ แต่ยังไม่พิสูจน์การนำผู้ใช้ไปหน้าสร้างโปรไฟล์ | |
| F-06 | mockup เกิน spec | `specs/006-request-roommate/mockup/roommate-request.html:94` | Out of scope: UC-04; FR-RRS-01 | Mockup มีช่องค้นหา “ค้นหาคนที่สนใจ” แม้ไม่กรองจริง แต่การค้นหาเมทถูกระบุเป็น Out of scope; spec ไม่มีหมวด UI ที่อนุมัติช่องนี้ | |

## 4. แก้แล้ว

| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| F-05 (บางส่วน) | เพิ่ม assertion ใน `test_AC_RRS_09` ว่าจำนวนคำขอไม่เพิ่มขึ้นหลัง self-request ถูกปฏิเสธ และเพิ่ม `test_AC_RRS_04B_accepts_request_without_message` เพื่อทดสอบการส่งคำขอโดยไม่ระบุข้อความ | Backend test file `test_roommate_request.py` ผ่าน 24 passed, 3 skipped, 0 failed; ยังเหลือช่องว่าง FE AC-RRS-12 เรื่องการนำไปหน้าสร้างโปรไฟล์ |

## 5. สถานะ Tasks และ Integration

### Tasks

- **เสร็จ รอทีมตรวจ:** T-01, T-02, T-05, T-06, T-07, T-08, T-11
- **BLOCKED/ดำเนินการบางส่วน:** T-03 (Match contract), T-04 (Authentication/Profile), T-12 (Notification provider)
- **พร้อมทำ/ยังไม่ถึง:** T-09, T-10, T-13, T-14

### Integration Contract (`integration-contract.md`)

| Contract | สถานะใน Checklist | ผลต่อ RTM |
|---|---|---|
| Authentication | PENDING | AC-RRS-07 / NFR-RRS-01 ยัง BLOCKED |
| Profile | PENDING | การตรวจผู้รับ/สถานะ/เจ้าของโปรไฟล์ยัง BLOCKED |
| Search | PENDING | ยังไม่มีผลค้นหา contract; ค้นหา UC-04 ยังคง Out of scope ของ Feature 006 |
| Match | BLOCKED | AC-RRS-13A/NFR-RRS-04 ยัง BLOCKED |
| Cancellation | BLOCKED | ยังยืนยันผลหลังยกเลิก Match ไม่ได้ |
| Notification Provider | BLOCKED | retry unit test ผ่าน แต่ส่งจริงไม่ได้ยืนยัน |
| Backend/Database | BLOCKED | ไม่มี API runtime หรือ persistent store |

### Mockup (แยกจาก Implementation)

| ไฟล์ | ผลตรวจ Mockup | ไม่ถือเป็นหลักฐาน |
|---|---|---|
| `mockup/roommate-request.html` | มี static profile ตัวอย่าง, เลือก radio, message field, ปุ่ม; ไม่พบ JavaScript; มีช่องค้นหา UC-04 เกิน Scope (F-06) | ไม่พิสูจน์ว่ามี profile จริง, validation หรือส่งคำขอได้ |
| `mockup/notifications.html` | แสดงข้อมูลผู้ส่ง/รูป SVG/เวลา/ข้อความตัวอย่าง; ไม่พบ JavaScript; แสดง notification และ detail พร้อมกันแบบ static | ไม่พิสูจน์ว่ามี provider, เปิดรายละเอียดเมื่อกด หรือส่งถึงผู้รับ |
| `mockup/request-list.html` | แสดง 4 สถานะด้วยข้อมูลตัวอย่าง; Navbar มี 3 เมนูและไม่มีแบรนด์; ไม่พบ JavaScript | ไม่พิสูจน์ว่ารายการมาจาก API/store จริง |

## 6. ผลทดสอบและข้อสรุป

- Backend: `cd backend && pytest -v` → **23 passed, 3 skipped, 0 failed**; skipped คือ AC-RRS-07, AC-RRS-12, AC-RRS-13A
- Frontend: `cd frontend && npm test -- --no-cache` → **5 test files passed, 18 passed, 0 failed**
- Frontend tests ที่เกี่ยวข้องกับ Feature 006: `request-roommate-page.test.jsx`, `notifications-page.test.jsx`, `roommate-request-list-page.test.jsx`; อีก 2 files เป็น Feature อื่น
- test-cases ทั้งหมดใน `test-cases.md` ยังระบุสถานะ “ร่าง”; จึงไม่ถือว่าทีมรับรอง TC
- ผล Backend 24 passed, 3 skipped เป็นผลจากการทดสอบไฟล์ `test_roommate_request.py` โดยเฉพาะ ไม่ใช่ผลรัน Backend ทั้งชุด จึงยังไม่ใช้แทนผลสรุปด้านบน
- Feature 006 **ยังไม่สมบูรณ์และห้ามสรุปว่า ready สำหรับใช้งานจริง**: API/store, Auth/Profile/Search/Match/Notification integrations, atomicity/concurrency และ usability ยังไม่มีหลักฐานผ่าน
