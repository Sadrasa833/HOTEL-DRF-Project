import { useNavigate } from 'react-router-dom';

function About() {
    const navigate = useNavigate();

    return (
        <div style={{ color: '#fff', paddingTop: '40px', paddingBottom: '80px' }}>
            <div className="luxury-hero" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80')`, height: '50vh' }}>
                <div className="luxury-hero-overlay"></div>
                <div className="luxury-hero-content">
                    <h1 className="luxury-title">داستان ما، فلسفه‌ی ما</h1>
                    <p className="luxury-subtitle">مقصدی برای آنان که به دنبال خاص‌ترین‌ها هستند</p>
                </div>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
                <h2 style={{ color: '#cda46f', fontSize: '2rem', marginBottom: '30px' }}>هتل ای  فراتر از یک اقامتگاه</h2>
                <p style={{ color: '#a0a0a0', lineHeight: '2', fontSize: '1.1rem', marginBottom: '50px' }}>
                    ما در هتل ایست معتقدیم که هر سفر، یک داستان منحصربه‌فرد است. معماری ما تلفیقی از سنت‌های اصیل و مدرنیسمِ جسورانه است که در قلب شهر واقع شده. اینجا جایی است که استراحتِ شما به یک تجربه هنری تبدیل می‌شود.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '50px' }}>
                    {[
                        { title: 'طراحی بوتیک', icon: '🎨' },
                        { title: 'امکانات رفاهی VIP', icon: '💎' },
                        { title: 'غذاهای بین‌المللی', icon: '🍽️' },
                        { title: 'لوکیشن مرکزی', icon: '📍' }
                    ].map((feat, i) => (
                        <div key={i} style={{ background: '#1c1c1e', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
                            <div style={{ fontSize: '40px', marginBottom: '15px' }}>{feat.icon}</div>
                            <h4 style={{ color: '#fff', margin: 0 }}>{feat.title}</h4>
                        </div>
                    ))}
                </div>

                <button onClick={() => navigate('/')} className="east-btn-gold-outline" style={{ marginTop: '60px', padding: '15px 40px' }}>
                    مشاهده اتاق‌ها
                </button>
            </div>
        </div>
    );
}

export default About;