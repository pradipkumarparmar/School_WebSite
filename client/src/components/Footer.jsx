import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-brand">
                    <h3>🏫 ધોતા પેકેન્દ્ર સ્કૂલ</h3>
                    <p>
                        અમારી શાળા વિદ્યાર્થીઓને ઉત્તમ શિક્ષણ અને સર્વાંગી વિકાસ પ્રદાન કરવા માટે
                        પ્રતિબદ્ધ છે. અમે દરેક બાળકના ઉજ્જવળ ભવિષ્ય માટે કાર્ય કરીએ છીએ.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>ઝડપી લિંક્સ</h4>
                    <ul>
                        <li><Link to="/">હોમ</Link></li>
                        <li><Link to="/events">ઇવેન્ટ્સ</Link></li>
                        <li><Link to="/notices">સૂચનાઓ</Link></li>
                        <li><Link to="/gallery">ગેલેરી</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>માહિતી</h4>
                    <ul>
                        <li><Link to="/about">શાળા વિશે</Link></li>
                        <li><Link to="/contact">સંપર્ક</Link></li>
                        <li><Link to="/admin">એડમિન</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>સંપર્ક</h4>
                    <ul>
                        <li>📍 ધોતા ગામ, ગુજરાત</li>
                        <li>📞 +91 98765 43210</li>
                        <li>📧 info@dhotaschool.com</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} ધોતા પેકેન્દ્ર સ્કૂલ. બધા હક્કો આરક્ષિત.</p>
            </div>
        </footer>
    )
}

export default Footer
