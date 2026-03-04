import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json()

            if (res.ok) {
                login(data.token, data.admin)
                navigate('/admin')
            } else {
                setError(data.error || 'Login failed')
            }
        } catch {
            setError('Server is not reachable')
        }
        setLoading(false)
    }

    return (
        <div className="admin-login">
            <div className="login-card">
                <h1>🏫 Admin Login</h1>
                <p className="subtitle">ધોતા પેકેન્દ્ર સ્કૂલ — Admin Panel</p>

                {error && <div className="error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                        {loading ? '⏳ Logging in...' : '🔐 Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
