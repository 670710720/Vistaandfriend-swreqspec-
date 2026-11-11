import ProfileForm from '../components/ProfileForm.jsx'
import SuccessToast from '../components/SuccessToast.jsx'
import ValidationMessage from '../components/ValidationMessage.jsx'

// รองรับ CON-ERP-03, CON-ERP-04, CON-ERP-05, CON-ERP-06, CON-ERP-07, FR-ERP-03, FR-ERP-04, FR-ERP-05, FR-ERP-06, FR-ERP-09, NFR-ERP-01, NFR-ERP-02, AC-ERP-02, AC-ERP-02A, AC-ERP-02B, AC-ERP-03, AC-ERP-04A, AC-ERP-04, AC-ERP-07, AC-ERP-07A
export default function ProfileEditPage({
  profile,
  validationErrors = {},
  saveError = '',
  saveSuccess = false,
  successMessage = 'แก้ไขโปรไฟล์สำเร็จ',
  onSave,
}) {
  const errorEntries = Object.values(validationErrors || {}).filter(Boolean)

  return (
    <section aria-labelledby="edit-profile-heading" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <h2 id="edit-profile-heading" className="mb-6 text-2xl font-bold text-slate-900">แก้ไขโปรไฟล์หาเมท</h2>

      {saveSuccess && (
        <SuccessToast
          message="ข้อมูลโปรไฟล์ของคุณถูกบันทึกและพร้อมแสดงผลตามสถานะเปิดให้ค้นหา"
          title={successMessage}
        />
      )}

      {errorEntries.length > 0 && (
        <ValidationMessage
          errors={errorEntries}
          title="ข้อมูลไม่ครบหรือไม่ถูกต้อง"
        />
      )}

      {saveError && (
        <ValidationMessage
          message={saveError}
          title="การบันทึกข้อมูลล้มเหลว"
          tone="warning"
        />
      )}

      <ProfileForm profile={profile} onSubmit={onSave} />
    </section>
  )
}
