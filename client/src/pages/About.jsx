function About() {
    return (
        <div>
            <div className="page-header">
                <h1>ℹ️ શાળા વિશે</h1>
                <p>ધોતા પેકેન્દ્ર સ્કૂલ - ઉજ્જવળ ભવિષ્યનું ઘડતર</p>
            </div>

            <section className="section">
                <div className="section-container">
                    <div className="section-header animate-fade-in-up">
                        <h2>🏫 અમારો પરિચય</h2>
                        <div className="section-divider"></div>
                    </div>

                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <p className="animate-fade-in-up delay-1" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '2' }}>
                            ધોતા પેકેન્દ્ર સ્કૂલ નો સ્થાપના ગ્રામીણ વિસ્તારના બાળકોને ઉત્તમ શિક્ષણ
                            પ્રદાન કરવાના ઉમદા ઉદ્દેશ્ય સાથે કરવામાં આવી છે. અમારી શાળા વિદ્યાર્થીઓના
                            સર્વાંગી વિકાસ માટે પ્રતિબદ્ધ છે - શૈક્ષણિક ઉત્કૃષ્ટતા, નૈતિક મૂલ્યો,
                            રમતગમત અને સાંસ્કૃતિક પ્રવૃત્તિઓ દ્વારા.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="stats-grid mt-4">
                        <div className="stat-card animate-bounce-in delay-1">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">વિદ્યાર્થીઓ</div>
                        </div>
                        <div className="stat-card animate-bounce-in delay-2">
                            <div className="stat-number">30+</div>
                            <div className="stat-label">શિક્ષકો</div>
                        </div>
                        <div className="stat-card animate-bounce-in delay-3">
                            <div className="stat-number">20+</div>
                            <div className="stat-label">વર્ષોનો અનુભવ</div>
                        </div>
                        <div className="stat-card animate-bounce-in delay-4">
                            <div className="stat-number">95%</div>
                            <div className="stat-label">પાસ ટકાવારી</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="section" style={{ background: 'rgba(108, 53, 222, 0.03)' }}>
                <div className="section-container">
                    <div className="about-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        <div className="about-card animate-fade-in-left delay-1" style={{ textAlign: 'left', padding: '40px' }}>
                            <span className="icon">🎯</span>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>અમારું ધ્યેય (Vision)</h3>
                            <p style={{ lineHeight: '1.9' }}>
                                દરેક બાળકને ગુણવત્તાયુક્ત શિક્ષણ ઉપલબ્ધ કરાવવું અને તેમને
                                સમાજમાં જવાબદાર નાગરિક તરીકે તૈયાર કરવા. અમે માનીએ છીએ કે
                                દરેક બાળક અનન્ય છે અને તેના વિકાસ માટે વ્યક્તિગત ધ્યાન આપવું જોઈએ.
                            </p>
                        </div>
                        <div className="about-card animate-fade-in-right delay-2" style={{ textAlign: 'left', padding: '40px' }}>
                            <span className="icon">🌟</span>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>અમારું મિશન (Mission)</h3>
                            <p style={{ lineHeight: '1.9' }}>
                                આધુનિક શિક્ષણ પદ્ધતિ, ટેકનોલોજી અને ભારતીય સંસ્કૃતિના
                                મૂલ્યોને ભેળવીને એક સંપૂર્ણ શિક્ષણ વ્યવસ્થા ઊભી કરવી.
                                વિદ્યાર્થીઓમાં ક્રિટીકલ થિંકિંગ, સર્જનાત્મકતા અને નેતૃત્વ ગુણો
                                વિકસાવવા.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Facilities */}
            <section className="section">
                <div className="section-container">
                    <div className="section-header animate-fade-in-up">
                        <h2>🏗️ અમારી સુવિધાઓ</h2>
                        <p>વિદ્યાર્થીઓ માટે આધુનિક સુવિધાઓ</p>
                        <div className="section-divider"></div>
                    </div>

                    <div className="about-cards">
                        <div className="about-card animate-fade-in-up delay-1">
                            <span className="icon">💻</span>
                            <h3>કમ્પ્યુટર લેબ</h3>
                            <p>આધુનિક કમ્પ્યુટર્સ અને ઈન્ટરનેટ સુવિધા</p>
                        </div>
                        <div className="about-card animate-fade-in-up delay-2">
                            <span className="icon">📚</span>
                            <h3>પુસ્તકાલય</h3>
                            <p>5000+ પુસ્તકો સાથે સમૃદ્ધ પુસ્તકાલય</p>
                        </div>
                        <div className="about-card animate-fade-in-up delay-3">
                            <span className="icon">🔬</span>
                            <h3>વિજ્ઞાન પ્રયોગશાળા</h3>
                            <p>ભૌતિક, રસાયણ અને જીવવિજ્ઞાન લેબ</p>
                        </div>
                        <div className="about-card animate-fade-in-up delay-4">
                            <span className="icon">⚽</span>
                            <h3>રમત મેદાન</h3>
                            <p>ક્રિકેટ, ફૂટબોલ અને કબડ્ડી મેદાન</p>
                        </div>
                        <div className="about-card animate-fade-in-up delay-5">
                            <span className="icon">🎨</span>
                            <h3>કળા ખંડ</h3>
                            <p>ચિત્ર, સંગીત અને નૃત્ય માટે</p>
                        </div>
                        <div className="about-card animate-fade-in-up delay-6">
                            <span className="icon">🚌</span>
                            <h3>વાહન સુવિધા</h3>
                            <p>સલામત અને વિશ્વસનીય સ્કૂલ બસ સેવા</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About
