import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function Restaurant() {
    const [activeTab, setActiveTab] = useState('restaurant');
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('menu/')
           .then(res => {
               setMenuItems(res.data);
               setLoading(false);
           })
           .catch(err => {
               console.error("خطا در دریافت منو:", err);
               setLoading(false);
           });
    }, []);

    const restaurantMenu = menuItems.filter(item => item.category === 'restaurant');
    const barMenu = menuItems.filter(item => item.category === 'bar');

    const renderMenuItem = (item) => (
        <div key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px', marginBottom: '20px', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '15px' }}>
                <h4 style={{ color: '#cda46f', margin: 0, fontSize: '18px', fontWeight: '800' }}>{item.name}</h4>
                <div style={{ flex: 1, borderBottom: '1px dashed rgba(255,255,255,0.2)', position: 'relative', top: '-6px' }}></div>
                <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '16px' }}>
                    {Number(item.price).toLocaleString()} <span style={{fontSize: '12px', color: '#888'}}>تومان</span>
                </span>
            </div>
            {item.description && (
                <p style={{ color: '#a0a0a0', fontSize: '14px', margin: '10px 0 0 0', lineHeight: '1.6' }}>{item.description}</p>
            )}
        </div>
    );

    return (
        <>
            <div className="glass-container" style={{ maxWidth: '1000px', padding: '0', overflow: 'hidden' }}>
                
                <div className="luxury-hero animate-fade-up" style={{ 
                    backgroundImage: `url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1920&q=80')`,
                    height: '40vh',
                    marginBottom: '0',
                    borderRadius: '0'
                }}>
                    <div className="luxury-hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, #1c1c1e 100%)' }}></div>
                    <div className="luxury-hero-content">
                        <h1 className="luxury-title" style={{ color: '#fff' }}>رستوران و لانژ بار</h1>
                        <p className="luxury-subtitle" style={{ color: '#cda46f' }}>طعم‌هایی که در خاطره می‌مانند</p>
                    </div>
                </div>

                <div style={{ backgroundColor: '#1c1c1e', padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
                        <button 
                            onClick={() => setActiveTab('restaurant')}
                            style={{ 
                                background: 'none', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s',
                                color: activeTab === 'restaurant' ? '#cda46f' : '#666',
                                textShadow: activeTab === 'restaurant' ? '0 0 15px rgba(205, 164, 111, 0.4)' : 'none'
                            }}
                        >
                            🍽️ منوی رستوران
                        </button>
                        <span style={{ color: '#333', fontSize: '20px' }}>|</span>
                        <button 
                            onClick={() => setActiveTab('bar')}
                            style={{ 
                                background: 'none', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s',
                                color: activeTab === 'bar' ? '#cda46f' : '#666',
                                textShadow: activeTab === 'bar' ? '0 0 15px rgba(205, 164, 111, 0.4)' : 'none'
                            }}
                        >
                            🍸 بار و نوشیدنی‌ها
                        </button>
                    </div>

                    <div className="animate-fade-up" key={activeTab}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
                            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                {loading ? (
                                    <p style={{ textAlign: 'center', color: '#888' }}>در حال دریافت منو از سرور...</p>
                                ) : (
                                    activeTab === 'restaurant' 
                                        ? (restaurantMenu.length > 0 ? restaurantMenu.map(renderMenuItem) : <p style={{color:'#666', textAlign:'center'}}>آیتمی یافت نشد.</p>) 
                                        : (barMenu.length > 0 ? barMenu.map(renderMenuItem) : <p style={{color:'#666', textAlign:'center'}}>آیتمی یافت نشد.</p>)
                                )}
                            </div>
                            
                            <div style={{ padding: '30px', background: 'linear-gradient(145deg, #222224, #1a1a1c)', borderRadius: '16px', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                                <h3 style={{ color: '#fff', fontSize: '22px', margin: '0 0 15px 0' }}>ساعات کاری</h3>
                                <p style={{ color: '#a0a0a0', fontSize: '15px', lineHeight: '2' }}>
                                    <strong>صبحانه:</strong> ۰۷:۰۰ الی ۱۰:۳۰<br/>
                                    <strong>ناهار:</strong> ۱۳:۰۰ الی ۱۶:۰۰<br/>
                                    <strong>شام و بار:</strong> ۱۹:۰۰ الی ۲۴:۰۰
                                </p>
                                <hr style={{ borderTop: '1px solid #333', width: '50%', margin: '20px auto' }} />
                                <p style={{ color: '#cda46f', fontSize: '14px' }}>برای مهمانان مقیم هتل، هزینه‌های رستوران و بار می‌تواند مستقیماً روی فاکتور اتاق شارژ شود.</p>
                                <button onClick={() => navigate('/')} className="btn-premium" style={{ marginTop: '20px', width: '80%', alignSelf: 'center' }}>
                                    بازگشت به لابی هتل
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Restaurant;