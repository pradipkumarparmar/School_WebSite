import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../App'

function ManageContacts() {
    const { token } = useContext(AuthContext)
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)
    const [toast, setToast] = useState(null)

    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

    const fetchContacts = () => {
        fetch('/api/contacts', { headers })
            .then(r => r.json())
            .then(data => { setContacts(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(() => { fetchContacts() }, [])

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3000)
    }

    const markAsRead = async (id) => {
        try {
            await fetch(`/api/contacts/${id}/read`, { method: 'PUT', headers })
            fetchContacts()
        } catch { }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this message?')) return
        try {
            const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE', headers })
            if (res.ok) { showToast('success', '✅ Message deleted!'); fetchContacts(); setSelected(null) }
        } catch { showToast('error', 'Delete failed') }
    }

    return (
        <div className="admin-main">
            <div className="admin-header">
                <h1>📧 Messages</h1>
                <span className="badge badge-high">{contacts.filter(c => !c.is_read).length} unread</span>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Name</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(contact => (
                                <tr key={contact.id} style={{ background: !contact.is_read ? 'rgba(108, 53, 222, 0.05)' : 'transparent', cursor: 'pointer' }}
                                    onClick={() => { setSelected(contact); if (!contact.is_read) markAsRead(contact.id) }}>
                                    <td>{contact.is_read ? '📭' : '📬'}</td>
                                    <td style={{ fontWeight: !contact.is_read ? '600' : '400' }}>{contact.name}</td>
                                    <td>{contact.subject}</td>
                                    <td>{new Date(contact.created_at).toLocaleDateString()}</td>
                                    <td className="actions">
                                        <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(contact.id) }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {contacts.length === 0 && (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No messages yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Message Detail Modal */}
            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>📧 {selected.subject}</h2>
                        <div style={{ marginBottom: '20px' }}>
                            <p><strong>From:</strong> {selected.name}</p>
                            {selected.email && <p><strong>Email:</strong> {selected.email}</p>}
                            {selected.phone && <p><strong>Phone:</strong> {selected.phone}</p>}
                            <p><strong>Date:</strong> {new Date(selected.created_at).toLocaleString()}</p>
                        </div>
                        <div style={{
                            background: 'var(--bg-glass)',
                            padding: '20px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-glass)',
                            lineHeight: '1.8',
                            color: 'var(--text-secondary)'
                        }}>
                            {selected.message}
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Delete</button>
                            <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
        </div>
    )
}

export default ManageContacts
