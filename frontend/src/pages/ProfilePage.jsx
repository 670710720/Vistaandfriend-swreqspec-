// รองรับ FR-ERP-07, FR-ERP-08, FR-ERP-09, NFR-ERP-04, AC-ERP-04, AC-ERP-07, AC-ERP-07A
export default function ProfilePage({ profile, successMessage }) {
  const visibility = profile?.isSearchable ?? profile?.is_searchable ?? false
  const visibilityLabel = visibility ? 'แสดงในผลการค้นหา' : 'ไม่แสดงในผลการค้นหา'
  const socialEntries = Object.entries(profile?.social ?? {})

  return (
    <section aria-labelledby="profile-summary-heading" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <h2 id="profile-summary-heading" className="mb-4 text-2xl font-bold text-slate-900">โปรไฟล์ของฉัน</h2>

      {successMessage && (
        <div aria-live="polite" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="status">
          {successMessage}
        </div>
      )}

      <div className="space-y-3 text-sm text-slate-700">
        <p>
          <span className="font-medium text-slate-900">ชื่อ:</span> {profile?.name ?? 'ไม่ระบุ'}
        </p>
        <p>
          <span className="font-medium text-slate-900">คณะ:</span> {profile?.faculty ?? 'ไม่ระบุ'}
        </p>
        <p>
          <span className="font-medium text-slate-900">ชั้นปี:</span> {profile?.academicYear ?? profile?.academic_year ?? 'ไม่ระบุ'}
        </p>
        <p>
          <span className="font-medium text-slate-900">สถานะการค้นหา:</span>{' '}
          <span className={visibility ? 'text-emerald-700' : 'text-slate-500'}>{visibilityLabel}</span>
        </p>

        {socialEntries.length > 0 && (
          <div className="pt-3">
            <p className="mb-2 font-medium text-slate-900">ช่องทางโซเชียล</p>
            <ul className="space-y-1">
              {socialEntries.map(([channel, value]) => (
                <li key={channel}>
                  <span className="font-medium text-slate-700">{channel}</span>: {value || '—'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
