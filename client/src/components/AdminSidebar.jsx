import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'

function AdminSidebar() {
    const { admin, logout } = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const isActive = (path) => location.pathname === path ? 'active' : ''

    const handleLogout = () => {
        logout()
        navigate('/admin/login')
    }

    return (
        <>
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? '✕' : '☰'}
            </button>

            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>🏫 Admin Panel</h2>
                    <p>Welcome, {admin?.username || 'Admin'}</p>
                </div>

                <ul className="sidebar-nav">
                    <li>
                        <Link to="/admin" className={isActive('/admin')} onClick={() => setSidebarOpen(false)}>
                            <span className="nav-icon">📊</span> Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/events" className={isActive('/admin/events')} onClick={() => setSidebarOpen(false)}>
                            <span className="nav-icon">📅</span> Manage Events
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/notices" className={isActive('/admin/notices')} onClick={() => setSidebarOpen(false)}>
                            <span className="nav-icon">📢</span> Manage Notices
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/gallery" className={isActive('/admin/gallery')} onClick={() => setSidebarOpen(false)}>
                            <span className="nav-icon">🖼️</span> Manage Gallery
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/contacts" className={isActive('/admin/contacts')} onClick={() => setSidebarOpen(false)}>
                            <span className="nav-icon">📧</span> Messages
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/parents" className={isActive('/admin/parents')} onClick={() => setSidebarOpen(false)}>
                            <span className="nav-icon">👨‍👩‍👧</span> Parents (SMS)
                        </Link>
                    </li>
                    <li style={{ marginTop: '20px', borderTop: '1px solid var(--border-glass)', paddingTop: '8px' }}>
                        <Link to="/" onClick={() => setSidebarOpen(false)}>
                            <span className="nav-icon">🌐</span> View Website
                        </Link>
                    </li>
                    <li>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ color: '#ff4444' }}>
                            <span className="nav-icon">🚪</span> Logout
                        </a>
                    </li>
                </ul>
            </aside>
        </>
    )
}

export default AdminSidebar
