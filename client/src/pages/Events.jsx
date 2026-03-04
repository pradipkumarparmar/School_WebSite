import { useState, useEffect } from 'react'

function Events() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/events')
            .then(r => r.json())
            .then(data => { setEvents(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    return (
        <div>
            <div className="page-header">
                <h1>📅 ઇવેન્ટ્સ</h1>
                <p>શાળાના કાર્યક્રમો અને પ્રવૃત્તિઓ</p>
            </div>

            <section className="section">
                <div className="section-container">
                    {loading ? (
                        <div className="loading"><div className="spinner"></div></div>
                    ) : events.length > 0 ? (
                        <div className="card-grid">
                            {events.map((event, i) => (
                                <div key={event.id} className={`card animate-fade-in-up delay-${(i % 6) + 1}`}>
                                    {event.image_url && (
                                        <div className="card-image-wrapper">
                                            <img src={event.image_url} alt={event.title} className="card-image" />
                                            <div className="card-overlay"></div>
                                        </div>
                                    )}
                                    <div className="card-body">
                                        <h3>{event.title}</h3>
                                        <p>{event.description}</p>
                                        <div className="card-meta">
                                            <span>📅 {new Date(event.event_date).toLocaleDateString('gu-IN')}</span>
                                            {event.event_time && <span>⏰ {event.event_time}</span>}
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
                </div>
            </section>
        </div>
    )
}

export default Events
