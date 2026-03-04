import { useState, useEffect } from 'react'

function Gallery() {
    const [items, setItems] = useState([])
    const [categories, setCategories] = useState([])
    const [activeFilter, setActiveFilter] = useState('all')
    const [lightbox, setLightbox] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch('/api/gallery').then(r => r.json()).catch(() => []),
            fetch('/api/gallery/categories').then(r => r.json()).catch(() => [])
        ]).then(([galleryData, catData]) => {
            setItems(Array.isArray(galleryData) ? galleryData : [])
            setCategories(Array.isArray(catData) ? catData : [])
            setLoading(false)
        })
    }, [])

    const filteredItems = activeFilter === 'all'
        ? items
        : items.filter(i => i.category === activeFilter)

    return (
        <div>
            <div className="page-header">
                <h1>🖼️ ગેલેરી</h1>
                <p>શાળાના ફોટો અને દ્રશ્યો</p>
            </div>

            <section className="section">
                <div className="section-container">
                    {/* Filters */}
                    {categories.length > 0 && (
                        <div className="gallery-filters animate-fade-in-down">
                            <button
                                className={`gallery-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveFilter('all')}
                            >
                                બધું
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`gallery-filter-btn ${activeFilter === cat ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {loading ? (
                        <div className="loading"><div className="spinner"></div></div>
                    ) : filteredItems.length > 0 ? (
                        <div className="gallery-grid">
                            {filteredItems.map((item, i) => (
                                <div
                                    key={item.id}
                                    className={`gallery-item animate-scale-in delay-${(i % 6) + 1}`}
                                    onClick={() => setLightbox(item)}
                                >
                                    <img src={item.image_url} alt={item.title} />
                                    <div className="gallery-overlay">
                                        <h4>{item.title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">🖼️</div>
                            <p>હાલમાં કોઈ ફોટો ઉપલબ્ધ નથી</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {lightbox && (
                <div className="lightbox" onClick={() => setLightbox(null)}>
                    <button className="lightbox-close" onClick={() => setLightbox(null)}>×</button>
                    <img src={lightbox.image_url} alt={lightbox.title} onClick={e => e.stopPropagation()} />
                </div>
            )}
        </div>
    )
}

export default Gallery
