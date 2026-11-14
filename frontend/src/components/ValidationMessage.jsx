// รองรับ CON-ERP-03, CON-ERP-04, CON-ERP-05, FR-ERP-05, FR-ERP-06, NFR-ERP-02, AC-ERP-03, AC-ERP-04A
export default function ValidationMessage({ message = '', errors = [], title = 'ข้อมูลไม่ครบหรือไม่ถูกต้อง', tone = 'error' }) {
  const list = Array.isArray(errors) ? errors : Object.values(errors || {})
  const entries = list.filter(Boolean)
  const hasMessage = Boolean(message)

  if (!hasMessage && entries.length === 0) {
    return null
  }

  const palette = tone === 'warning'
    ? 'border-amber-200 bg-amber-50 text-amber-900'
    : 'border-red-200 bg-red-50 text-red-800'

  return (
    <div aria-live="polite" className={`mb-6 rounded-xl border p-4 ${palette}`} role="alert">
      <p className="text-sm font-semibold">{title}</p>
      {hasMessage && <p className="mt-2 text-sm">{message}</p>}
      {entries.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {entries.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
