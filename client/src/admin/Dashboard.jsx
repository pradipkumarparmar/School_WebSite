import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../App'

function Dashboard() {
    const { token } = useContext(AuthContext)
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/contacts/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [token])

    return (
        <div className="admin-main">
            <div className="admin-header">
                <h1>📊 Dashboard</h1>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : (
                <>
                    <div className="dashboard-stats">
                        <div className="stat-box animate-fade-in-up delay-1">
                            <div className="stat-icon events">📅</div>
                            <div className="stat-info">
                                <h3>{stats?.events || 0}</h3>
                                <p>Total Events</p>
                            </div>
                        </div>
                        <div className="stat-box animate-fade-in-up delay-2">
                            <div className="stat-icon notices">📢</div>
                            <div className="stat-info">
                                <h3>{stats?.notices || 0}</h3>
                                <p>Total Notices</p>
                            </div>
                        </div>
                        <div className="stat-box animate-fade-in-up delay-3">
                            <div className="stat-icon gallery">🖼️</div>
                            <div className="stat-info">
                                <h3>{stats?.gallery || 0}</h3>
                                <p>Gallery Items</p>
                            </div>
                        </div>
                        <div className="stat-box animate-fade-in-up delay-4">
                            <div className="stat-icon contacts">📧</div>
                            <div className="stat-info">
                                <h3>{stats?.contacts || 0}</h3>
                                <p>Messages ({stats?.unreadContacts || 0} unread)</p>
                            </div>
                        </div>
                    </div>

                    <div className="about-cards" style={{ marginTop: '40px' }}>
                        <div className="about-card animate-fade-in-up delay-3">
                            <span className="icon">⚡</span>
                            <h3>Quick Actions</h3>
                            <p>Use the sidebar to manage events, notices, gallery, and contact messages.</p>
                        </div>
                        <div className="about-card animate-fade-in-up delay-4">
                            <span className="icon">🔐</span>
                            <h3>Security</h3>
                            <p>All admin actions are protected with JWT authentication.</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Dashboard
