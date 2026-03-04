import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../App'

function ManageEvents() {
    const { token } = useContext(AuthContext)
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [toast, setToast] = useState(null)
    const [uploadMode, setUploadMode] = useState('url')
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [form, setForm] = useState({
        title: '', description: '', event_date: '', event_time: '', location: '', image_url: '', is_active: true
    })

    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

    const fetchEvents = () => {
        fetch('/api/events/all', { headers })
            .then(r => r.json())
            .then(data => { setEvents(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(() => { fetchEvents() }, [])

    const showToast = (type, message) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 3000)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const resetForm = () => {
        setForm({ title: '', description: '', event_date: '', event_time: '', location: '', image_url: '', is_active: true })
        setSelectedFile(null)
        setPreview(null)
        setUploadMode('url')
    }

    const openCreate = () => {
        setEditing(null)
        resetForm()
        setShowModal(true)
    }

    const openEdit = (event) => {
        setEditing(event)
        setForm({
            title: event.title,
            description: event.description || '',
            event_date: event.event_date?.split('T')[0] || '',
            event_time: event.event_time || '',
            location: event.location || '',
            image_url: event.image_url || '',
            is_active: event.is_active
        })
        setSelectedFile(null)
        setPreview(null)
        // If the event has a local upload, show it as preview
        if (event.image_url?.startsWith('/uploads/')) {
            setUploadMode('local')
            setPreview(event.image_url)
        } else if (event.image_url) {
            setUploadMode('url')
        } else {
            setUploadMode('url')
        }
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let res
            const useFileUpload = uploadMode === 'local' && selectedFile

            if (useFileUpload) {
                const formData = new FormData()
                formData.append('image', selectedFile)
                formData.append('title', form.title)
                formData.append('description', form.description)
                formData.append('event_date', form.event_date)
                formData.append('event_time', form.event_time)
                formData.append('location', form.location)
                formData.append('is_active', form.is_active)

                const url = editing ? `/api/events/${editing.id}/upload` : '/api/events/upload'
                const method = editing ? 'PUT' : 'POST'
                res = await fetch(url, {
                    method,
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                })
            } else {
                const url = editing ? `/api/events/${editing.id}` : '/api/events'
                const method = editing ? 'PUT' : 'POST'
                res = await fetch(url, { method, headers, body: JSON.stringify(form) })
            }

            if (res.ok) {
                showToast('success', editing ? '✅ Event updated!' : '✅ Event created!')
                setShowModal(false)
                resetForm()
                fetchEvents()
            } else {
                const errData = await res.json().catch(() => ({}))
                showToast('error', errData.error || 'Operation failed')
            }
        } catch {
            showToast('error', 'Server error')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return
        try {
            const res = await fetch(`/api/events/${id}`, { method: 'DELETE', headers })
            if (res.ok) { showToast('success', '✅ Event deleted!'); fetchEvents() }
        } catch { showToast('error', 'Delete failed') }
    }

    return (
        <div className="admin-main">
            <div className="admin-header">
                <h1>📅 Manage Events</h1>
                <button className="btn btn-primary" onClick={openCreate}>+ Add Event</button>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event.id}>
                                    <td>{event.title}</td>
                                    <td>{event.event_date?.split('T')[0]}</td>
                                    <td>{event.location || '-'}</td>
                                    <td><span className={`badge ${event.is_active ? 'badge-medium' : 'badge-low'}`}>{event.is_active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="actions">
                                        <button className="btn btn-sm btn-secondary" onClick={() => openEdit(event)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(event.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No events found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editing ? '✏️ Edit Event' : '➕ Create Event'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title *</label>
                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div className="form-group">
                                    <label>Event Date *</label>
                                    <input type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Event Time</label>
                                    <input type="time" value={form.event_time} onChange={e => setForm({ ...form, event_time: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                            </div>

                            {/* Image Source Toggle */}
                            <div className="form-group">
                                <label>Image Source</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button type="button"
                                        className={`btn btn-sm ${uploadMode === 'url' ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setUploadMode('url')}
                                        style={{ flex: 1 }}>
                                        🔗 Online URL
                                    </button>
                                    <button type="button"
                                        className={`btn btn-sm ${uploadMode === 'local' ? 'btn-primary' : 'btn-outline'}`}
                                        onClick={() => setUploadMode('local')}
                                        style={{ flex: 1 }}>
                                        📁 Local Upload
                                    </button>
                                </div>
                            </div>

                            {uploadMode === 'url' ? (
                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input type="url" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Choose Image</label>
                                    <input type="file" accept="image/*" onChange={handleFileChange}
                                        style={{
                                            padding: '14px 18px',
                                            border: '1px solid var(--border-glass)',
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'rgba(255,255,255,0.05)',
                                            color: 'var(--text-primary)',
                                            width: '100%',
                                            cursor: 'pointer'
                                        }} />
                                    {preview && (
                                        <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                                            <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="form-group">
                                <label>Status</label>
                                <select value={form.is_active ? 'true' : 'false'} onChange={e => setForm({ ...form, is_active: e.target.value === 'true' })}>
                                    <option value="true">✅ Active</option>
                                    <option value="false">❌ Inactive</option>
                                </select>
                            </div>
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

export default ManageEvents
