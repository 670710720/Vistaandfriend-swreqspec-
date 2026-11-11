# RTM: ค้นหาเมท
อ้างอิง: spec.md Draft v2 (ส่วน UI ระบุ v3) | tasks.md | test-cases.md Draft v3
สร้างด้วย /verify เมื่อ 2026-11-11 18:48 UTC | test: 70 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| FR-SRS-01 | AC-SRS-01 | T-03,T-04 | frontend/src/navigation/sidebar.js:Sidebar; frontend/src/App.jsx:App | test_AC_SRS_01_user_sees_search_menu_and_can_open_search_page (ผ่าน); TC-SRS-01-1 ถึง -4 ไม่มี test ชื่อตามตาราง | ช่องโหว่ F-11 |
| FR-SRS-02 | AC-SRS-01 | T-03,T-04 | frontend/src/pages/SearchRoommatePage.js:SearchRoommatePage; frontend/src/components/SearchFiltersForm.js:SearchFiltersForm | test_AC_SRS_01_search_page_renders_filters_and_submit_button (ผ่าน); TC-SRS-01-1 ถึง -4 ไม่มี test ชื่อตามตาราง | ช่องโหว่ F-11 |
| FR-SRS-03 | AC-SRS-02, AC-SRS-03C, AC-SRS-03D | T-07,T-11,T-12,T-14 | frontend/src/components/SearchFiltersForm.js:SearchFiltersForm; backend/app/services/search_roommate.py:_matches_filter | test_AC_SRS_02_form_tracks_all_search_filters_before_submit และ test_TC_SRS_03C_* / test_TC_SRS_03D_* (ผ่าน แต่ไม่ครอบคลุมหลายค่าต่อฟิลด์) | ช่องโหว่ F-06,F-11 |
| FR-SRS-04 | AC-SRS-03, AC-SRS-03C, AC-SRS-03D, AC-SRS-03E | T-01,T-08,T-11,T-13,T-15 | backend/app/api/search.py:search_roommates; backend/app/services/search_roommate.py:query_roommates | test_TC_SRS_03A/B/C/D/E_* และ test_AC_SRS_03C_* (ผ่าน; ไม่มีการทดสอบหลายค่าต่อฟิลด์หรือ tie-break updated_at) | ช่องโหว่ F-05,F-06,F-07,F-11 |
| FR-SRS-05 | AC-SRS-03, AC-SRS-03C | T-08,T-09,T-12 | frontend/src/components/SearchResultsList.js:SearchResultsList; backend/app/services/filter_logic.py:filter_profiles_by_mode | test_AC_SRS_03_search_page_displays_results_as_cards และ test_TC_SRS_03C_* (ผ่าน; ไม่มีคะแนนจริงจาก API) | ช่องโหว่ F-08,F-11 |
| FR-SRS-06 | AC-SRS-04 | T-17,T-18 | backend/app/api/profile_detail.py:get_profile_detail; frontend/src/pages/ProfileDetailPage.js:ProfileDetailPage | test_AC_SRS_04_opens_profile_detail_with_allowed_fields_only และ test_TC_SRS_04_1/_2 (ผ่านแบบแยกส่วน; ไม่มีการเลือกจากผลค้นหาเพื่อเปิดหน้านี้) | ช่องโหว่ F-03,F-04 |
| FR-SRS-07 | AC-SRS-05 | T-19,T-20 | backend/app/services/search_roommate.py:query_roommates; frontend/src/components/SearchResultsList.js:SearchResultsList | test_TC_SRS_05_1/_2/_3 (ผ่าน) | ครบ |
| FR-SRS-08 | AC-SRS-03E | T-15,T-16 | frontend/src/pages/SearchRoommatePage.js:handleSubmit/requestSearch; backend/app/services/search_roommate.py:pagination | test_TC_SRS_03E_1/_4 (ผ่าน) | ครบ |
| FR-SRS-09 | AC-SRS-03E | T-15,T-16 | backend/app/config.py:SEARCH_RESULTS_PER_PAGE; backend/app/services/search_roommate.py:pagination | test_TC_SRS_03E_2/_3 (ผ่าน) | ครบ |
| CON-SRS-01 | AC-SRS-06 | T-05 | backend/app/middleware/auth_guard.py:require_authenticated_user; frontend/src/App.jsx:App | test_AC_SRS_06_rejects_search_requests_without_authenticated_user และ test_TC_SRS_06_1 (ผ่านเฉพาะกรณีไม่มี ID/สถานะ UI) | ช่องโหว่ F-02 |
| CON-SRS-02 | AC-SRS-01, AC-SRS-07 | T-06 | frontend/src/pages/SearchRoommatePage.js:hasProfileForUser; backend/app/services/profile_status.py:has_roommate_profile | test_TC_SRS_07_1/_2/_3 (ผ่านแบบจำลอง; ตรวจปลายทางสร้างโปรไฟล์เพียง hash) | ช่องโหว่ F-09 |
| CON-SRS-03 | AC-SRS-02, AC-SRS-03, AC-SRS-03B | T-01,T-02,T-07 | backend/app/services/search_roommate.py:SearchRoommateService; frontend/src/pages/SearchRoommatePage.js:requestSearch | test_TC_SRS_03B_* และ test_AC_SRS_03* (ผ่านกับข้อมูลตัวอย่าง) | ช่องโหว่ F-05 |
| CON-SRS-04 | AC-SRS-03A, AC-SRS-03B | T-01,T-10 | backend/app/services/search_roommate.py:_searchable_profiles | test_TC_SRS_03A_* และ test_TC_SRS_03B_* (ผ่าน) | ครบ |
| CON-SRS-05 | AC-SRS-05 | T-19,T-20 | backend/app/services/search_roommate.py:query_roommates; frontend/src/components/SearchResultsList.js:SearchResultsList | test_TC_SRS_05_1/_2 (ผ่าน) | ครบ |
| CON-SRS-06 | AC-SRS-03A, AC-SRS-03B, AC-SRS-04 | T-02,T-10,T-17,T-18 | backend/app/services/search_roommate.py:_searchable_profiles; backend/app/services/profile_detail.py:get_profile_detail | test_TC_SRS_03A/B_* และ test_AC_SRS_04_* (ผ่านกับ boolean ในข้อมูลตัวอย่าง; ไม่ยืนยันการเปิดโดยเจ้าของ) | ช่องโหว่ F-05 |
| CON-SRS-07 | AC-SRS-03A, AC-SRS-03B | T-02,T-10 | backend/app/services/search_roommate.py:_searchable_profiles | test_TC_SRS_03A_* และ test_TC_SRS_03B_* (ผ่าน) | ครบ |
| CON-SRS-08 | AC-SRS-03D | T-02,T-13,T-14 | backend/app/services/roommate_preference_match.py:matches_roommate_preference; frontend/src/components/SearchFiltersForm.js:SearchFiltersForm | test_TC_SRS_03D_1/_2/_3 (ผ่าน) | ครบ |
| NFR-SRS-01 | AC-SRS-06 | T-03,T-04,T-05 | backend/app/middleware/auth_guard.py:require_authenticated_user; frontend/src/hooks/useAuth.js:useAuth | test_AC_SRS_06_* และ test_TC_SRS_06_* (ผ่านเฉพาะสถานะจำลอง; ดู F-02) | ช่องโหว่ F-02 |
| NFR-SRS-02 | AC-SRS-03, AC-SRS-03D, AC-SRS-03E | T-01,T-08,T-13,T-15 | backend/app/services/search_roommate.py:SearchRoommateService; backend/app/services/filter_logic.py:filter_profiles_by_mode | test_TC_SRS_03C/D/E_* (ผ่านบนข้อมูล fixture; ไม่ยืนยันแหล่งข้อมูลจริงหรือ tie-break) | ช่องโหว่ F-05,F-07 |
| NFR-SRS-03 | AC-SRS-08 | T-21 | docs/test/search-roommate-usability.md:สคริปต์และแบบบันทึกผล | ไม่มีผลทดสอบผู้เข้าร่วมจริง; แบบฟอร์มยังว่าง | ช่องโหว่ F-10 |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| backend/app/api/search.py:POST /search-roommates | FR-SRS-04,FR-SRS-05,FR-SRS-08,FR-SRS-09,CON-SRS-01,CON-SRS-03,CON-SRS-04 | บางส่วน | ค้นและแบ่งหน้าได้ แต่รับตัวตนจาก request, ใช้ข้อมูล fixture และ response model ส่ง phone_number |
| backend/app/api/profile_detail.py:GET /profile-detail/{profile_user_id} | FR-SRS-06,CON-SRS-06 | บางส่วน | คืน phone_number เป็น null แต่ส่ง social_links ทั้งชุดโดยไม่จำกัดช่องทางที่อนุญาต |
| backend/app/middleware/auth_guard.py:require_authenticated_user | CON-SRS-01,NFR-SRS-01 | ไม่ตรง | ตรวจเพียง current_user_id ที่ไม่ว่าง ไม่ตรวจ session/token หรือยืนยันตัวผู้ใช้ |
| backend/app/services/search_roommate.py:SearchRoommateService.__init__/_build_seed_profiles | CON-SRS-03,CON-SRS-04,CON-SRS-06,CON-SRS-08,NFR-SRS-02 | ไม่ครบ | ใช้โปรไฟล์ตัวอย่างที่เขียนคงที่ใน service; loader JSON แยกต่างหากไม่ได้ถูกเรียกจาก service |
| backend/app/services/search_roommate.py:query_roommates/_searchable_profiles/_normalize_filters/_matches_filter/pagination | FR-SRS-03,FR-SRS-04,FR-SRS-07,FR-SRS-08,FR-SRS-09,CON-SRS-04 ถึง CON-SRS-08 | บางส่วน | เงื่อนไขเดี่ยว, exclusion และ page size ทำงาน; list หลายค่าไม่รองรับ |
| backend/app/services/filter_logic.py:matches_filter/filter_profiles_by_mode | FR-SRS-03,FR-SRS-04,FR-SRS-05 | บางส่วน | AND/OR และจัดอันดับคะแนนทำงาน แต่ไม่ tie-break ด้วย updated_at และไม่ส่งคะแนนต่อให้ API |
| backend/app/services/roommate_preference_match.py:get_preference_value/matches_roommate_preference | CON-SRS-08 | ตรงบางส่วน | อ่านค่าจาก preference fields ที่กำหนด; schema เริ่มต้นเป็นข้อมูลตัวอย่างในหน่วยความจำ |
| backend/app/services/profile_status.py:has_roommate_profile; backend/app/seeds/search_roommate_seed.py:load_seed_profiles | CON-SRS-02,CON-SRS-03 | ไม่เชื่อมต่อ | มี helper และ JSON loader แต่หน้า search ใช้รายชื่อ user คงที่ และ service สร้าง seed ของตนเอง |
| frontend/src/navigation/sidebar.js:Sidebar; frontend/src/hooks/useAuth.js:useAuth; frontend/src/App.jsx:App | FR-SRS-01,CON-SRS-01,NFR-SRS-01 | บางส่วน | เมนูและสถานะ login จำลองมีอยู่; App ใช้ user-1 ตายตัวและเริ่มต้น logged-in |
| frontend/src/pages/SearchRoommatePage.js:SearchRoommatePage/requestSearch/handleSubmit/hasProfileForUser | FR-SRS-01 ถึง FR-SRS-05,FR-SRS-08,FR-SRS-09,CON-SRS-02 | บางส่วน | ส่งตัวกรองและ reset หน้าได้; จำกัดผู้มีโปรไฟล์ด้วย static list และ shortcut เปลี่ยน hash อย่างเดียว |
| frontend/src/components/SearchFiltersForm.js:SearchFiltersForm | FR-SRS-02,FR-SRS-03,CON-SRS-03,CON-SRS-08 | บางส่วน | มีตัวกรองที่ระบุ แต่แต่ละ field รับค่าเดี่ยว ไม่รองรับการเลือกหลายค่า |
| frontend/src/components/SearchResultsList.js:SearchResultsList | FR-SRS-05,FR-SRS-06,FR-SRS-07,FR-SRS-09 | ไม่ครบ | แสดงรายการ/ข้อความว่าง/pagination แต่รายการไม่มี action เปิดโปรไฟล์; แสดง index แทน match count เมื่อ API ไม่ส่งคะแนน |
| frontend/src/pages/ProfileDetailPage.js:ProfileDetailPage; frontend/src/components/ProfileCard.js:ProfileCard | FR-SRS-06 | บางส่วน | component แสดงข้อมูลและซ่อนเบอร์บนหน้า แต่ไม่มีการเชื่อมจากผลค้นหา; แสดง social_links ทุก key |
| frontend/src/routes.js:getViewComponent; frontend/src/api/client.js:searchRoommates | FR-SRS-01,FR-SRS-04,FR-SRS-06 | ไม่ครบ | route profile เป็น null และ client มีเฉพาะ search API ไม่มี profile-detail flow |
| frontend/src/App.jsx:ฟอร์มสร้างโปรไฟล์; frontend/src/profileValidation.js:validateProfile | ไม่มีใน SPEC-SRS-004 | ไม่ตรงขอบเขต | เป็นความสามารถสร้าง/ตรวจสอบโปรไฟล์หาเมท ซึ่งอยู่ใน Out of scope ของฟีเจอร์นี้ (UC-01) |

## 3. ข้อค้นพบ
ทีมตัดสิน: เว้นว่างเพื่อให้ทีมพิจารณา

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-01 | ละเมิดข้อจำกัดการเปิดเผยข้อมูล | backend/app/api/search.py:SearchRoommateResponse.from_profile | ข้อกำหนดใน spec เรื่องไม่เปิดเผยเบอร์โทรศัพท์ | Search response schema มี phone_number และแปลง profile ทั้งชุด ทำให้เบอร์โทรจริงถูกส่งถึง client ในผลค้นหา แม้ UI ไม่แสดง | |
| F-02 | ละเมิด Constraint | backend/app/middleware/auth_guard.py:require_authenticated_user; frontend/src/App.jsx:App | CON-SRS-01, NFR-SRS-01 | Backend ถือว่า ID string ใด ๆ ที่ไม่ว่างคือผู้ใช้ที่ยืนยันตัวตนแล้ว; ฝั่ง App ใช้สถานะจำลองและส่ง user-1 คงที่ จึงยังไม่บังคับว่าเป็นนักศึกษาที่ login จริง | |
| F-03 | FR ทำงานไม่ครบ | frontend/src/components/SearchResultsList.js; frontend/src/routes.js; frontend/src/api/client.js | FR-SRS-06, AC-SRS-04, UI-SRS-02/03 | รายการผลค้นหาไม่มีปุ่ม/action เลือกโปรไฟล์, route profile เป็น null และไม่มี client เรียก profile-detail; ProfileDetailPage ถูกทดสอบแยกแต่เปิดจาก flow ค้นหาไม่ได้ | |
| F-04 | ละเมิด Constraint | backend/app/services/profile_detail.py:get_profile_detail; frontend/src/components/ProfileCard.js:ProfileCard | ข้อกำหนดข้อมูลที่อนุญาตให้เปิดเผย | ส่งและ render social_links ทุก key โดยไม่จำกัด Facebook, Instagram, LINE, TikTok; หากข้อมูลมีช่องทางหรือ field อื่นก็จะเปิดเผยทั้งที่ spec สั่งซ่อนข้อมูลนอก allowlist | |
| F-05 | ข้อมูลไม่ใช่ข้อมูลระบบจริง | backend/app/services/search_roommate.py:SearchRoommateService; backend/app/seeds/search_roommate_seed.py:load_seed_profiles | CON-SRS-03, CON-SRS-06, NFR-SRS-02 | API ใช้รายการโปรไฟล์ตัวอย่างที่ hard-code ใน _build_seed_profiles; JSON loader ไม่ถูกเรียกใช้งาน จึงไม่ค้นจากข้อมูลโปรไฟล์/สถานะ/ความต้องการที่มีจริงหรือยืนยันว่าเจ้าของเป็นผู้เปิดสถานะ | |
| F-06 | กติกาตัวกรองไม่ครบ | frontend/src/components/SearchFiltersForm.js; backend/app/services/search_roommate.py:_matches_filter; backend/app/services/filter_logic.py:matches_filter | FR-SRS-03, FR-SRS-04, ASM-SRS-06 | UI รับค่าได้ค่าเดียวต่อ field และ backend เปรียบเทียบด้วย equality/แปลง int; การระบุหลายค่าต่อ field ตาม spec ไม่ได้ใช้กติกา “ตรงอย่างน้อยหนึ่งค่า” และบางค่าทำให้ค้นหาไม่ตรงหรือแปลงค่าไม่ได้ | |
| F-07 | การเรียงผลลัพธ์ไม่ครบ | backend/app/services/filter_logic.py:filter_profiles_by_mode; backend/app/services/search_roommate.py:SearchRoommateProfile | FR-SRS-04, FR-SRS-05, ASM-SRS-07 | เมื่อจำนวน match เท่ากัน sort ใช้เฉพาะจำนวน match และ model ไม่มี updated_at จึงไม่เรียงตาม updated_at ล่าสุดตาม spec; ไม่มี test กรณีคะแนนเท่ากัน | |
| F-08 | UI ไม่ตรงข้อกำหนด | backend/app/api/search.py:SearchRoommateResponse; frontend/src/components/SearchResultsList.js:SearchResultsList | UI-SRS-02 | UI กำหนดให้แสดงจำนวนเงื่อนไขที่ตรง แต่ API ไม่คืน match_count และ UI แสดง “ลำดับที่ N” แทนเมื่อไม่มี field นี้ | |
| F-09 | ละเมิด Constraint | frontend/src/pages/SearchRoommatePage.js:hasProfileForUser; frontend/src/App.jsx:App | CON-SRS-02, AC-SRS-07, UI-SRS-04 | การตรวจโปรไฟล์อิงรายชื่อ user-1 ถึง user-4 ที่เขียนคงที่ ไม่เรียก helper/backend; ปุ่มสร้างโปรไฟล์เปลี่ยน hash เป็น #create-profile แต่ App ไม่ฟัง hash จึงไม่เปิดทางลัดจริง | |
| F-10 | AC ไม่มีผลทดสอบ | docs/test/search-roommate-usability.md; specs/004-search-roommate/test-cases.md:TC-SRS-08-1 ถึง -5 | NFR-SRS-03, AC-SRS-08 | มีสคริปต์แต่ตารางผล 5 คนยังว่าง ไม่มีหลักฐานว่าทดสอบนักศึกษาที่ไม่เคยใช้จริงหรือผ่านเกณฑ์ 4/5 | |
| F-11 | AC ไม่มี test / test อ่อน | backend/tests, frontend/src/__tests__; specs/004-search-roommate/test-cases.md | AC-SRS-01, AC-SRS-02, AC-SRS-03 | ไม่พบ test ตามชื่อที่อนุมัติสำหรับ TC-SRS-01-1 ถึง -4, TC-SRS-02-1/-2 และ TC-SRS-03-1 ถึง -3; test_AC_SRS_02 ตรวจเพียงบาง field และ test_AC_SRS_03 ฝั่ง UI ใช้ mock response จึงไม่ทดสอบการค้นหาจริงตามแถว | |
| F-12 | mockup เกิน spec | specs/004-search-roommate/mockups/UI-SRS-01/02/03/05 | ขอบเขตตัวกรองและข้อมูลที่อนุญาตใน spec | มีงบประมาณ ทำเล/พื้นที่ และการสูบบุหรี่ในตัวกรอง/ผล/รายละเอียด/คำแนะนำ ทั้งที่ไม่อยู่ในรายการ FR และ note ของ spec ระบุว่าตัวอย่างเหล่านี้ไม่ใช่ requirement; ให้ทีมยืนยัน mockup ไม่ควรนับเป็นฟังก์ชันที่ขาด | |
| F-13 | ของแถม — อยู่ใน Out of scope | frontend/src/App.jsx:ฟอร์มสร้างโปรไฟล์; frontend/src/profileValidation.js:validateProfile | Out of scope: การสร้างโปรไฟล์หาเมท (UC-01) | มี UI และ validation สำหรับสร้างโปรไฟล์รวมอยู่ในโค้ดฟีเจอร์ค้นหา แม้ T-06 ต้องมีเพียงทางลัดไปหน้าสร้างโปรไฟล์; ความสามารถสร้างโปรไฟล์เองอยู่นอกขอบเขต SPEC-SRS-004 | |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
