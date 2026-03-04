import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../App'

function ManageGallery() {
    const { token } = useContext(AuthContext)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [toast, setToast] = useState(null)
    const [uploadMode, setUploadMode] = useState('url') // 'url' or 'local'
    const [form, setForm] = useState({ title: '', image_url: '', category: 'general' })
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)

    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

    const fetchGallery = () => {
        fetch('/api/gallery')
            .then(r => r.json())
            .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(() => { fetchGallery() }, [])

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
        setForm({ title: '', image_url: '', category: 'general' })
        setSelectedFile(null)
        setPreview(null)
        setUploadMode('url')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let res
            if (uploadMode === 'local') {
                if (!selectedFile) {
                    showToast('error', 'Please select an image file')
                    return
                }
                const formData = new FormData()
                formData.append('image', selectedFile)
                formData.append('title', form.title)
                formData.append('category', form.category)
                res = await fetch('/api/gallery/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                })
            } else {
                if (!form.image_url) {
                    showToast('error', 'Please enter an image URL')
                    return
                }
                res = await fetch('/api/gallery', { method: 'POST', headers, body: JSON.stringify(form) })
            }
            if (res.ok) {
                showToast('success', '✅ Image added!')
                setShowModal(false)
                resetForm()
                fetchGallery()
            } else {
                const errData = await res.json().catch(() => ({}))
                showToast('error', errData.error || 'Failed to add image')
            }
        } catch { showToast('error', 'Failed to add image') }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this image?')) return
        try {
            const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE', headers })
            if (res.ok) {
                showToast('success', '✅ Image deleted!')
                fetchGallery()
            } else {
                const errData = await res.json().catch(() => ({}))
                showToast('error', errData.error || `Delete failed (${res.status})`)
            }
        } catch (err) {
            console.error('Delete error:', err)
            showToast('error', 'Delete failed: ' + err.message)
        }
    }

    return (
        <div className="admin-main">
            <div className="admin-header">
                <h1>🖼️ Manage Gallery</h1>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true) }}>+ Add Image</button>
            </div>

            {loading ? (
                <div className="loading"><div className="spinner"></div></div>
            ) : (
                <div className="gallery-grid" style={{ gap: '20px' }}>
                    {items.map((item, i) => (
                        <div key={item.id} className={`gallery-item animate-scale-in delay-${(i % 6) + 1}`} style={{ position: 'relative' }}>
                            <img src={item.image_url} alt={item.title} />
                            <div className="gallery-overlay" style={{ opacity: 1, flexDirection: 'column', justifyContent: 'flex-end', gap: '8px' }}>
                                <h4>{item.title}</h4>
                                <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{item.category}</span>
                                <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
                                    style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, pointerEvents: 'all' }}>
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                            <div className="empty-icon">🖼️</div>
                            <p>No gallery items yet</p>
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>➕ Add Gallery Image</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title *</label>
                                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                            </div>

                            {/* Upload Mode Toggle */}
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
                                    <label>Image URL *</label>
                                    <input type="url" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Choose Image *</label>
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
                                <label>Category</label>
                                <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g., ઉત્સવ, રમત, શૈક્ષણિક" />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Image</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}
        </div>
    )
}

export default ManageGallery
