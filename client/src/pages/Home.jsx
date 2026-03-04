import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API = '/api'

function Home() {
    const [events, setEvents] = useState([])
    const [notices, setNotices] = useState([])
    const [loading, setLoading] = useState(true)
    const [showContact, setShowContact] = useState(false)
    const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const [submitting, setSubmitting] = useState(false)
    const [selectedNotice, setSelectedNotice] = useState(null)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        Promise.all([
            fetch(`${API}/events`).then(r => r.json()).catch(() => []),
            fetch(`${API}/notices`).then(r => r.json()).catch(() => [])
        ]).then(([eventsData, noticesData]) => {
            setEvents(Array.isArray(eventsData) ? eventsData.slice(0, 3) : [])
            setNotices(Array.isArray(noticesData) ? noticesData.slice(0, 4) : [])
            setLoading(false)
        })
    }, [])

    const handleContactSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactForm)
            })
            const data = await res.json()
            if (res.ok) {
                setToast({ type: 'success', message: '✅ તમારો સંદેશ સફળતાપૂર્વક મોકલાયો!' })
                setContactForm({ name: '', email: '', phone: '', subject: '', message: '' })
                setTimeout(() => setShowContact(false), 2000)
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
            {/* Hero Section */}
            <section className="hero">
                <div className="particles">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                '--x': `${(Math.random() - 0.5) * 300}px`,
                                '--y': `${(Math.random() - 0.5) * 300}px`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 5}s`,
                                width: `${3 + Math.random() * 6}px`,
                                height: `${3 + Math.random() * 6}px`,
                            }}
                        />
                    ))}
                </div>

                <div className="hero-content">
                    <div className="hero-badge">🎓 ગુણવત્તાયુક્ત શિક્ષણ</div>
                    <h1>ધોતા પેકેન્દ્ર સ્કૂલ</h1>
                    <p>
                        અમારી શાળા દરેક વિદ્યાર્થીને ઉત્તમ શિક્ષણ, નૈતિક મૂલ્યો અને સર્વાંગી વિકાસ
                        પ્રદાન કરવા માટે સમર્પિત છે. અમે ઉજ્જવળ ભવિષ્ય ઘડીએ છીએ.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/events" className="btn btn-primary">📅 ઇવેન્ટ્સ જુઓ</Link>
                        <Link to="/about" className="btn btn-outline">ℹ️ વધુ જાણો</Link>
                        <button className="btn btn-secondary" onClick={() => setShowContact(true)}>📧 સંપર્ક કરો</button>
                    </div>
                </div>

                <div className="hero-scroll">
                    <div className="mouse">
                        <div className="wheel"></div>
                    </div>
                    <span>નીચે સ્ક્રોલ કરો</span>
                </div>
            </section>

            {/* About Brief */}
            <section className="section">
                <div className="section-container">
                    <div className="section-header animate-fade-in-up">
                        <h2><span className="section-icon">🏫</span> અમારી શાળા વિશે</h2>
                        <p>ધોતા પેકેન્દ્ર સ્કૂલ એ ગુણવત્તાયુક્ત શિક્ષણનું કેન્દ્ર છે</p>
                        <div className="section-divider"></div>
                    </div>

                    <div className="about-cards">
                        <div className="about-card animate-fade-in-up delay-1">
                            <span className="icon">📚</span>
                            <h3>ઉત્તમ શિક્ષણ</h3>
                            <p>અનુભવી શિક્ષકો દ્વારા ગુણવત્તાયુક્ત શિક્ષણ</p>
                        </div>
                        <div className="about-card animate-fade-in-up delay-2">
                            <span className="icon">🏆</span>
                            <h3>ઉત્કૃષ્ટ પરિણામો</h3>
                            <p>દર વર્ષે શ્રેષ્ઠ બોર્ડ પરિણામો</p>
                        </div>
                        <div className="about-card animate-fade-in-up delay-3">
                            <span className="icon">🎯</span>
                            <h3>સર્વાંગી વિકાસ</h3>
                            <p>શૈક્ષણિક, રમતગમત અને સાંસ્કૃતિક ક્ષેત્રે ઉત્કૃષ્ટ</p>
                        </div>
                        <div className="about-card animate-fade-in-up delay-4">
                            <span className="icon">💻</span>
                            <h3>આધુનિક સુવિધાઓ</h3>
                            <p>કમ્પ્યુટર લેબ, લાઈબ્રેરી અને રમત મેદાન</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Events */}
            <section className="section" style={{ background: 'rgba(108, 53, 222, 0.03)' }}>
                <div className="section-container">
                    <div className="section-header animate-fade-in-up">
                        <h2><span className="section-icon">📅</span> આગામી ઇવેન્ટ્સ</h2>
                        <p>શાળાના આગામી કાર્યક્રમો અને પ્રવૃત્તિઓ</p>
                        <div className="section-divider"></div>
                    </div>

                    {loading ? (
                        <div className="loading"><div className="spinner"></div></div>
                    ) : events.length > 0 ? (
                        <div className="card-grid">
                            {events.map((event, i) => (
                                <div key={event.id} className={`card animate-fade-in-up delay-${i + 1}`}>
                                    {event.image_url && (
                                        <div className="card-image-wrapper">
                                            <img src={event.image_url} alt={event.title} className="card-image" />
                                            <div className="card-overlay"></div>
                                        </div>
                                    )}
                                    <div className="card-body">
                                        <h3>{event.title}</h3>
                                        <p>{event.description?.substring(0, 120)}...</p>
                                        <div className="card-meta">
                                            <span>📅 {new Date(event.event_date).toLocaleDateString('gu-IN')}</span>
                                            {event.location && <span>📍 {event.location}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📅</div>
                            <p>હાલમાં કોઈ ઇવેન્ટ્સ ઉપલબ્ધ નથી</p>
                        </div>
                    )}

                    {events.length > 0 && (
                        <div className="text-center mt-4">
                            <Link to="/events" className="btn btn-outline">બધા ઇવેન્ટ્સ જુઓ →</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Latest Notices */}
            <section className="section">
                <div className="section-container">
                    <div className="section-header animate-fade-in-up">
                        <h2><span className="section-icon">📢</span> તાજેતરની સૂચનાઓ</h2>
                        <p>વાલીઓ અને વિદ્યાર્થીઓ માટે ખાસ સૂચનાઓ</p>
                        <div className="section-divider"></div>
                    </div>

                    {loading ? (
                        <div className="loading"><div className="spinner"></div></div>
                    ) : notices.length > 0 ? (
                        <div className="notice-list">
                            {notices.slice(0, 6).map((notice, i) => (
                                <div
                                    key={notice.id}
                                    className={`notice-item animate-fade-in-up delay-${(i % 3) + 1}`}
                                    onClick={() => setSelectedNotice(notice)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="notice-header">
                                        <h3>{notice.title}</h3>
                                        <span className={`badge badge-${notice.priority}`}>
                                            {notice.priority === 'urgent' ? '🔴 તાત્કાલિક' :
                                                notice.priority === 'high' ? '🟠 મહત્વપૂર્ણ' :
                                                    notice.priority === 'medium' ? '🟢 સામાન્ય' : '🔵 ઓછું'}
                                        </span>
                                    </div>
                                    <div className="notice-content">
                                        <p>{notice.content}</p>
                                    </div>
                                    <div className="notice-date">
                                        <span>📅 પ્રકાશિત: {new Date(notice.published_at).toLocaleDateString('gu-IN')}</span>
                                        {notice.expires_at && (
                                            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#ff9800' }}>
                                                ⏳ {new Date(notice.expires_at).toLocaleDateString('gu-IN')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📢</div>
                            <p>હાલમાં કોઈ સૂચનાઓ ઉપલબ્ધ નથી</p>
                        </div>
                    )}

                    {notices.length > 0 && (
                        <div className="text-center mt-4">
                            <Link to="/notices" className="btn btn-outline">બધી સૂચનાઓ જુઓ →</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="section" style={{ background: 'rgba(0, 212, 170, 0.03)' }}>
                <div className="section-container text-center">
                    <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '16px', color: 'var(--text-primary)' }}>
                        🤝 અમારો સંપર્ક કરો
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 32px', fontSize: '1.1rem' }}>
                        કોઈ પ્રશ્ન છે? અમને સંપર્ક કરો, અમે મદદ કરવા તૈયાર છીએ!
                    </p>
                    <button className="btn btn-primary" onClick={() => setShowContact(true)}>📧 સંપર્ક કરો</button>
                </div>
            </section>

            {/* Floating Contact Button */}
            <button
                className="floating-contact-btn"
                onClick={() => setShowContact(true)}
                title="સંપર્ક કરો"
            >
                📧
            </button>

            {/* Contact Form Popup */}
            {showContact && (
                <div className="modal-overlay" onClick={() => setShowContact(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '20px' }}>📧 સંપર્ક કરો</h2>
                        <form onSubmit={handleContactSubmit}>
                            <div className="form-group">
                                <label>તમારું નામ *</label>
                                <input type="text" value={contactForm.name}
                                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                                    placeholder="તમારું પૂરું નામ લખો" required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group">
                                    <label>ઈમેઈલ</label>
                                    <input type="email" value={contactForm.email}
                                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                                        placeholder="example@email.com" />
                                </div>
                                <div className="form-group">
                                    <label>ફોન નંબર</label>
                                    <input type="tel" value={contactForm.phone}
                                        onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                                        placeholder="+91 98765 43210" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>વિષય *</label>
                                <input type="text" value={contactForm.subject}
                                    onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                                    placeholder="તમારા સંદેશનો વિષય" required />
                            </div>
                            <div className="form-group">
                                <label>સંદેશ *</label>
                                <textarea value={contactForm.message}
                                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                                    placeholder="તમારો સંદેશ અહીં લખો..." required
                                    style={{ minHeight: '100px' }}></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowContact(false)}>બંધ કરો</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? '⏳ મોકલી રહ્યા છીએ...' : '📨 સંદેશ મોકલો'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notice Detail Popup */}
            {selectedNotice && (
                <div className="modal-overlay" onClick={() => setSelectedNotice(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>📢 સૂચના વિગત</h2>
                            <span className={`badge badge-${selectedNotice.priority}`}>
                                {selectedNotice.priority === 'urgent' ? '🔴 તાત્કાલિક' :
                                    selectedNotice.priority === 'high' ? '🟠 મહત્વપૂર્ણ' :
                                        selectedNotice.priority === 'medium' ? '🟢 સામાન્ય' : '🔵 ઓછું'}
                            </span>
                        </div>

                        <div className="notice-modal-content" style={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' }}>
                            <h3 style={{ marginBottom: '15px', color: 'var(--primary)' }}>{selectedNotice.title}</h3>
                            <div style={{ lineHeight: '1.6', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                                {selectedNotice.content}
                            </div>
                        </div>

                        <div className="notice-modal-footer" style={{ borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="notice-date" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                <span>📅 પ્રકાશિત: {new Date(selectedNotice.published_at).toLocaleDateString('gu-IN')}</span>
                            </div>
                            <button type="button" className="btn btn-outline" onClick={() => setSelectedNotice(null)}>બંધ કરો</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
        </div>
    )
}

export default Home
