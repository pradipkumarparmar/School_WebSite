import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../App'

function ManageParents() {
    const { token } = useContext(AuthContext)
    const [parents, setParents] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [toast, setToast] = useState(null)
    const [search, setSearch] = useState('')
    const [form, setForm] = useState({ student_name: '', parent_name: '', phone: '', class_name: '', is_active: true })

    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

    const fetchParents = () => {
        fetch('/api/parents', { headers })
            .then(r => r.json())
            .then(data => { setParents(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(() => { fetchParents() }, [])

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3000)
    }

    const openCreate = () => {
        setEditing(null)
        setForm({ student_name: '', parent_name: '', phone: '', class_name: '', is_active: true })
        setShowModal(true)
    }

    const openEdit = (parent) => {
        setEditing(parent)
        setForm({
            student_name: parent.student_name,
            parent_name: parent.parent_name || '',
            phone: parent.phone,
            class_name: parent.class_name || '',
            is_active: parent.is_active
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = editing ? `/api/parents/${editing.id}` : '/api/parents'
        const method = editing ? 'PUT' : 'POST'
        try {
            const res = await fetch(url, { method, headers, body: JSON.stringify(form) })
            if (res.ok) {
                showToast('success', editing ? '✅ Updated!' : '✅ Parent added!')
                setShowModal(false)
                fetchParents()
            } else {
                const err = await res.json().catch(() => ({}))
                showToast('error', err.error || 'Operation failed')
            }
        } catch {
            showToast('error', 'Server error')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this parent?')) return
        try {
            const res = await fetch(`/api/parents/${id}`, { method: 'DELETE', headers })
            if (res.ok) { showToast('success', '✅ Deleted!'); fetchParents() }
        } catch { showToast('error', 'Delete failed') }
    }

    const filtered = parents.filter(p =>
        p.student_name.toLowerCase().includes(search.toLowerCase()) ||
        (p.parent_name || '').toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search) ||
        (p.class_name || '').toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="admin-main">
            <div className="admin-header">
                <h1>👨‍👩‍👧 Manage Parents</h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>📱 {parents.filter(p => p.is_active).length} Active</span>
                    <button className="btn btn-primary" onClick={openCreate}>+ Add Parent</button>
                </div>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="🔍 Search by name, phone, class..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        width: '100%', maxWidth: '400px', padding: '12px 18px',
                        border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)',
                        fontSize: '0.95rem', outline: 'none'
                    }}
                />
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Parent Name</th>
                                <th>Phone</th>
                                <th>Class</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(parent => (
                                <tr key={parent.id}>
                                    <td>{parent.student_name}</td>
                                    <td>{parent.parent_name || '-'}</td>
                                    <td>📱 {parent.phone}</td>
                                    <td>{parent.class_name || '-'}</td>
                                    <td>
                                        <span className={`badge ${parent.is_active ? 'badge-medium' : 'badge-low'}`}>
                                            {parent.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="actions">
                                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(parent)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(parent.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                    {search ? 'No results found' : 'No parents added yet'}
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editing ? '✏️ Edit Parent' : '➕ Add Parent'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group">
                                    <label>Student Name *</label>
                                    <input type="text" value={form.student_name}
                                        onChange={e => setForm({ ...form, student_name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Parent Name</label>
                                    <input type="text" value={form.parent_name}
                                        onChange={e => setForm({ ...form, parent_name: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input type="tel" value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        placeholder="9876543210" required pattern="[0-9]{10}" title="Enter 10 digit phone number" />
                                </div>
                                <div className="form-group">
                                    <label>Class</label>
                                    <input type="text" value={form.class_name}
                                        onChange={e => setForm({ ...form, class_name: e.target.value })}
                                        placeholder="e.g., 10-A" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>SMS Status</label>
                                <select value={form.is_active ? 'true' : 'false'}
                                    onChange={e => setForm({ ...form, is_active: e.target.value === 'true' })}>
                                    <option value="true">✅ Active (will receive SMS)</option>
                                    <option value="false">❌ Inactive (won't receive SMS)</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
        </div>
    )
}

export default ManageParents
