import { useState, useEffect } from 'react'

function Notices() {
    const [notices, setNotices] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedNotice, setSelectedNotice] = useState(null)

    useEffect(() => {
        fetch('/api/notices')
            .then(r => r.json())
            .then(data => { setNotices(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    return (
        <div>
            <div className="page-header">
                <h1>📢 સૂચનાઓ</h1>
                <p>વાલીઓ અને વિદ્યાર્થીઓ માટે ખાસ સૂચનાઓ</p>
            </div>

            <section className="section">
                <div className="section-container">
                    {loading ? (
                        <div className="loading"><div className="spinner"></div></div>
                    ) : notices.length > 0 ? (
                        <div className="notice-list">
                            {notices.map((notice, i) => (
                                <div
                                    key={notice.id}
                                    className={`notice-item animate-fade-in-left delay-${(i % 6) + 1}`}
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
                </div>
            </section>

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
        </div>
    )
}

export default Notices
