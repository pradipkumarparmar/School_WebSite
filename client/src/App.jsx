import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, createContext } from 'react'

// Public Pages
import Home from './pages/Home'
import Events from './pages/Events'
import Notices from './pages/Notices'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Contact from './pages/Contact'

// Admin Pages
import Login from './admin/Login'
import Dashboard from './admin/Dashboard'
import ManageEvents from './admin/ManageEvents'
import ManageNotices from './admin/ManageNotices'
import ManageGallery from './admin/ManageGallery'
import ManageContacts from './admin/ManageContacts'
import ManageParents from './admin/ManageParents'

// Context
import { AccessibilityProvider } from './context/AccessibilityContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminSidebar from './components/AdminSidebar'
import AccessibilityToolbar from './components/AccessibilityToolbar'

export const AuthContext = createContext()

function App() {
    const [token, setToken] = useState(sessionStorage.getItem('admin_token') || null)
    const [admin, setAdmin] = useState(JSON.parse(sessionStorage.getItem('admin_info') || 'null'))

    const login = (newToken, adminInfo) => {
        sessionStorage.setItem('admin_token', newToken)
        sessionStorage.setItem('admin_info', JSON.stringify(adminInfo))
        setToken(newToken)
        setAdmin(adminInfo)
    }

    const logout = () => {
        sessionStorage.removeItem('admin_token')
        sessionStorage.removeItem('admin_info')
        setToken(null)
        setAdmin(null)
    }

    return (
        <AuthContext.Provider value={{ token, admin, login, logout }}>
            <AccessibilityProvider>
                <Router>
                    <AccessibilityToolbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                        <Route path="/events" element={<><Navbar /><Events /><Footer /></>} />
                        <Route path="/notices" element={<><Navbar /><Notices /><Footer /></>} />
                        <Route path="/gallery" element={<><Navbar /><Gallery /><Footer /></>} />
                        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
                        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />

                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<Login />} />
                        <Route path="/admin" element={
                            token ? <div className="admin-layout"><AdminSidebar /><Dashboard /></div> : <Login />
                        } />
                        <Route path="/admin/events" element={
                            token ? <div className="admin-layout"><AdminSidebar /><ManageEvents /></div> : <Login />
                        } />
                        <Route path="/admin/notices" element={
                            token ? <div className="admin-layout"><AdminSidebar /><ManageNotices /></div> : <Login />
                        } />
                        <Route path="/admin/gallery" element={
                            token ? <div className="admin-layout"><AdminSidebar /><ManageGallery /></div> : <Login />
                        } />
                        <Route path="/admin/contacts" element={
                            token ? <div className="admin-layout"><AdminSidebar /><ManageContacts /></div> : <Login />
                        } />
                        <Route path="/admin/parents" element={
                            token ? <div className="admin-layout"><AdminSidebar /><ManageParents /></div> : <Login />
                        } />
                    </Routes>
                </Router>
            </AccessibilityProvider>
        </AuthContext.Provider>
    )
}

export default App
