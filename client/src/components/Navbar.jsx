import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
    }, [location])

    const isActive = (path) => location.pathname === path ? 'active' : ''

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <Link to="/" className="logo">
                    <div className="logo-icon">🏫</div>
                    <div className="logo-text">
                        <span className="school-name">ધોતા પેકેન્દ્ર સ્કૂલ</span>
                        <span className="school-tagline">સર્વાંગી શિક્ષણનું કેન્દ્ર</span>
                    </div>
                </Link>

                <div className={`menu-toggle ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <li><Link to="/" className={isActive('/')}>🏠 હોમ</Link></li>
                    <li><Link to="/events" className={isActive('/events')}>📅 ઇવેન્ટ્સ</Link></li>
                    <li><Link to="/notices" className={isActive('/notices')}>📢 સૂચનાઓ</Link></li>
                    <li><Link to="/gallery" className={isActive('/gallery')}>🖼️ ગેલેરી</Link></li>
                    <li><Link to="/about" className={isActive('/about')}>ℹ️ વિશે</Link></li>
                    <li><Link to="/contact" className={isActive('/contact')}>📧 સંપર્ક</Link></li>
                    <li><Link to="/admin" className="admin-link">⚙️ Admin</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar
