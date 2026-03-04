import { useState } from 'react'

function Contact() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const [submitting, setSubmitting] = useState(false)
    const [toast, setToast] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (res.ok) {
                setToast({ type: 'success', message: '✅ તમારો સંદેશ સફળતાપૂર્વક મોકલાયો!' })
                setForm({ name: '', email: '', phone: '', subject: '', message: '' })
            } else {
                setToast({ type: 'error', message: data.error || 'કંઈક ખોટું થયું' })
            }
        } catch {
            setToast({ type: 'error', message: 'સર્વર સાથે જોડાણ થઈ શક્યું નથી' })
        }
        setSubmitting(false)
        setTimeout(() => setToast(null), 4000)
    }

    return (
        <div>
            <div className="page-header">
                <h1>📧 સંપર્ક કરો</h1>
                <p>અમને સંદેશ મોકલો, અમે જલ્દી જવાબ આપીશું</p>
            </div>

            <section className="section">
                <div className="section-container">
                    <div className="contact-grid">
                        {/* Form */}
                        <form className="contact-form animate-fade-in-left" onSubmit={handleSubmit}>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '24px', color: 'var(--primary-light)' }}>
                                📝 સંદેશ મોકલો
                            </h3>

                            <div className="form-group">
                                <label>તમારું નામ *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="તમારું પૂરું નામ લખો"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>ઈમેઈલ</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="example@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label>ફોન નંબર</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div className="form-group">
                                <label>વિષય *</label>
                                <input
                                    type="text"
                                    value={form.subject}
                                    onChange={e => setForm({ ...form, subject: e.target.value })}
                                    placeholder="તમારા સંદેશનો વિષય"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>સંદેશ *</label>
                                <textarea
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    placeholder="તમારો સંદેશ અહીં લખો..."
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
                                {submitting ? '⏳ મોકલી રહ્યા છીએ...' : '📨 સંદેશ મોકલો'}
                            </button>
                        </form>

                        {/* Info */}
                        <div className="contact-info animate-fade-in-right">
                            <div className="contact-info-card">
                                <div className="info-icon">📍</div>
                                <div>
                                    <h4>સરનામું</h4>
                                    <p>ધોતા ગામ, તાલુકા, જિલ્લો, ગુજરાત - 000000</p>
                                </div>
                            </div>

                            <div className="contact-info-card">
                                <div className="info-icon">📞</div>
                                <div>
                                    <h4>ફોન</h4>
                                    <p>+91 98765 43210</p>
                                    <p>+91 12345 67890</p>
                                </div>
                            </div>

                            <div className="contact-info-card">
                                <div className="info-icon">📧</div>
                                <div>
                                    <h4>ઈમેઈલ</h4>
                                    <p>info@dhotaschool.com</p>
                                    <p>admin@dhotaschool.com</p>
                                </div>
                            </div>

                            <div className="contact-info-card">
                                <div className="info-icon">⏰</div>
                                <div>
                                    <h4>શાળા સમય</h4>
                                    <p>સોમ - શનિ: 8:00 AM - 4:00 PM</p>
                                    <p>રવિવાર: બંધ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    )
}

export default Contact
