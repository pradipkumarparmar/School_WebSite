import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../App'

function ManageNotices() {
    const { token } = useContext(AuthContext)
    const [notices, setNotices] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [toast, setToast] = useState(null)
    const [form, setForm] = useState({
        title: '', content: '', priority: 'medium', is_active: true, expires_at: '', share_whatsapp: true
    })

    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

    const fetchNotices = () => {
        fetch('/api/notices/all', { headers })
            .then(r => r.json())
            .then(data => { setNotices(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(() => { fetchNotices() }, [])

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3000)
    }

    const openCreate = () => {
        setEditing(null)
        setForm({ title: '', content: '', priority: 'medium', is_active: true, expires_at: '', share_whatsapp: true })
        setShowModal(true)
    }

    const openEdit = (notice) => {
        setEditing(notice)
        setForm({
            title: notice.title,
            content: notice.content,
            priority: notice.priority,
            is_active: notice.is_active,
            expires_at: notice.expires_at?.split('T')[0] || ''
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = editing ? `/api/notices/${editing.id}` : '/api/notices'
        const method = editing ? 'PUT' : 'POST'

        try {
            const res = await fetch(url, { method, headers, body: JSON.stringify(form) })
            if (res.ok) {
                showToast('success', editing ? '✅ Notice updated!' : '✅ Notice created!')
                setShowModal(false)
                fetchNotices()

                // Trigger WhatsApp Click-to-Chat functionality if checked and it's a new notice
                if (!editing && form.share_whatsapp) {
                    const priorityIcon = form.priority === 'urgent' ? '🔴' : form.priority === 'high' ? '🟠' : '🟢'
                    const text = encodeURIComponent(`*ધોતા પેકેન્દ્ર સ્કૂલ - નવી સૂચના*\n\n${priorityIcon} *${form.title}*\n\n${form.content}\n\nવધુ માહિતી માટે અમારી વેબસાઈટની મુલાકાત લો.`)
                    window.open(`https://wa.me/?text=${text}`, '_blank')
                }
            }
        } catch { showToast('error', 'Operation failed') }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this notice?')) return
        try {
            const res = await fetch(`/api/notices/${id}`, { method: 'DELETE', headers })
            if (res.ok) { showToast('success', '✅ Notice deleted!'); fetchNotices() }
        } catch { showToast('error', 'Delete failed') }
    }

    return (
        <div className="admin-main">
            <div className="admin-header">
                <h1>📢 Manage Notices</h1>
                <button className="btn btn-primary" onClick={openCreate}>+ Add Notice</button>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Priority</th>
                                <th>Active</th>
                                <th>Expires</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map(notice => (
                                <tr key={notice.id}>
                                    <td>{notice.title}</td>
                                    <td><span className={`badge badge-${notice.priority}`}>{notice.priority}</span></td>
                                    <td>{notice.is_active ? '✅' : '❌'}</td>
                                    <td>{notice.expires_at?.split('T')[0] || 'No expiry'}</td>
                                    <td className="actions">
                                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(notice)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(notice.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {notices.length === 0 && (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No notices found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editing ? '✏️ Edit Notice' : '➕ Create Notice'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title *</label>
                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Content *</label>
                                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required></textarea>
                            </div>
                            <div className="form-group">
                                <label>Priority</label>
                                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} />
                            </div>
                            {!editing && (
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', background: 'rgba(37, 211, 102, 0.1)', borderRadius: '8px', border: '1px solid rgba(37, 211, 102, 0.3)' }}>
                                        <input type="checkbox" checked={form.share_whatsapp}
                                            onChange={e => setForm({ ...form, share_whatsapp: e.target.checked })}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#25D366' }} />
                                        <span style={{ fontSize: '1.2rem' }}>💬</span>
                                        <strong>Share to WhatsApp Group after creating</strong>
                                    </label>
                                    {form.share_whatsapp && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4' }}>
                                            ✅ Expected behavior: After clicking 'Create', a new tab will open with WhatsApp Web. You can then select your School Parents group to send the message for free.
                                        </p>
                                    )}
                                </div>
                            )}
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
        </div>
    )
}

export default ManageNotices
