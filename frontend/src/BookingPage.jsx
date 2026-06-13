import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';

const BASE_URL = 'http://127.0.0.1:8000';
const getFullImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/900x600?text=بدون+تصویر';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
};

function BookingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [room, setRoom] = useState(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [imageUrls, setImageUrls] = useState([]);

    const isAuthenticated = !!localStorage.getItem('access');

    useEffect(() => {
        api.get(`rooms/${id}/`)
           .then(res => {
               setRoom(res.data);
               const urls = res.data.images?.map(img => getFullImageUrl(img.image)) || [];
               setImageUrls(urls);
           })
           .catch(err => console.error(err));
    }, [id]);

    const openLightbox = (index) => { setLightboxIndex(index); setIsLightboxOpen(true); document.body.style.overflow = 'hidden'; };
    const closeLightbox = () => { setIsLightboxOpen(false); document.body.style.overflow = 'auto'; };
    const navigateLightbox = (dir) => { const total = imageUrls.length; setLightboxIndex((lightboxIndex + dir + total) % total); };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigateLightbox(1);
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, lightboxIndex, imageUrls]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            await api.post('bookings/', { room: id, check_in_date: checkIn, check_out_date: checkOut });
            setIsError(false);
            setMessage(`رزرو اولیه با موفقیت ثبت شد. در حال انتقال به درگاه...`);
            setTimeout(() => navigate('/invoices'), 2500);
        } catch (err) {
            setIsError(true);
            setMessage(err.response?.data?.message || 'خطایی در ثبت رزرو رخ داد!');
        }
    };

    if (!room) return <h3 style={{ textAlign: 'center', marginTop: '100px', color: '#cda46f' }}>⏳ در حال آماده‌سازی اطلاعات اتاق...</h3>;

    const amenitiesList = room.amenities ? room.amenities.split('،') : [];
    const mainImageUrl = imageUrls[imageUrls.indexOf(getFullImageUrl(room.images?.find(img => img.is_main)?.image))] || imageUrls[0] || 'https://via.placeholder.com/900x600?text=No+Image';

    return (
        <>
            <div className="luxury-hero animate-fade-up" style={{ backgroundImage: `url(${mainImageUrl})`, margin: '0', borderRadius: '0', height: '45vh' }}>
                <div className="luxury-hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, #111111 100%)' }}></div>
                <div className="luxury-hero-content" style={{ bottom: '-30px', position: 'relative' }}>
                    <p style={{ color: '#cda46f', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '5px', fontWeight: 'bold' }}>EAST HOTEL {room.room_type_display}</p>
                    <h1 style={{ color: '#fff', fontSize: '3rem', margin: 0, textShadow: '0 5px 15px rgba(0,0,0,0.8)' }}>اتاق {room.room_number}</h1>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 10, display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '-20px', marginBottom: '80px' }}>
                
                <div className="animate-fade-up" style={{ flex: '1 1 600px', animationDelay: '0.1s' }}>
                    <div style={{ background: '#1c1c1e', padding: '40px', borderRadius: '8px', boxShadow: '0 15px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.02)' }}>
                        <h2 style={{ color: '#cda46f', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '15px' }}>جزئیات اقامتگاه</h2>
                        <p style={{ color: '#a0a0a0', lineHeight: '2', fontSize: '15px', marginBottom: '30px' }}>
                            {room.description || "این اتاق مجهز به مدرن‌ترین امکانات رفاهی و دکوراسیون استاندارد جهت راحتی اقامت شما می‌باشد. طراحی مینیمال و نورپردازی ملایم، آرامشی بی‌نظیر را برای شما به ارمغان می‌آورد."}
                        </p>
                        
                        <div style={{ marginBottom: '30px' }}>
                            <strong style={{ color: '#fff', display: 'block', marginBottom: '15px' }}>امکانات رفاهی (Room Features):</strong>
                            <p style={{ color: '#888', fontSize: '14px', lineHeight: '2', margin: 0 }}>
                                {amenitiesList.join('  |  ')}
                            </p>
                        </div>

                        {imageUrls.length > 1 && (
                            <div>
                                <strong style={{ color: '#fff', display: 'block', marginBottom: '15px' }}>گالری تصاویر:</strong>
                                <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
                                    {imageUrls.map((url, index) => (
                                        <img 
                                            key={index} src={url} alt="تصویر اتاق" onClick={() => openLightbox(index)}
                                            style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', border: '1px solid #333', transition: 'all 0.3s' }}
                                            onMouseOver={(e) => {e.target.style.borderColor = '#cda46f'; e.target.style.transform = 'scale(1.05)';}}
                                            onMouseOut={(e) => {e.target.style.borderColor = '#333'; e.target.style.transform = 'scale(1)';}}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="animate-fade-up" style={{ flex: '1 1 350px', animationDelay: '0.2s' }}>
                    <div style={{ background: 'linear-gradient(145deg, #1f1f22, #18181a)', padding: '40px', borderRadius: '8px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)', border: '1px solid #333', position: 'sticky', top: '100px' }}>
                        
                        <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px dashed #444' }}>
                            <span style={{ display: 'block', color: '#888', fontSize: '14px', marginBottom: '10px' }}>تعرفه پایه برای هر شب</span>
                            <span style={{ fontSize: '32px', fontWeight: '900', color: '#cda46f' }}>{Number(room.price_per_night).toLocaleString()}</span>
                            <span style={{ fontSize: '14px', color: '#666', marginRight: '5px' }}>تومان</span>
                        </div>

                        {isAuthenticated ? (
                            <>
                                {message && (
                                    <div style={{ padding: '15px', background: isError ? 'rgba(229, 62, 62, 0.1)' : 'rgba(205, 164, 111, 0.1)', color: isError ? '#fc8181' : '#cda46f', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: `1px solid ${isError ? '#fc8181' : '#cda46f'}` }}>
                                        {message}
                                    </div>
                                )}
                                <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <label style={{ color: '#a0a0a0', fontSize: '13px', display: 'block', marginBottom: '8px' }}>تاریخ ورود (Check-in)</label>
                                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required 
                                            style={{ width: '100%', padding: '15px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#111', color: '#fff', outline: 'none', colorScheme: 'dark', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: '#a0a0a0', fontSize: '13px', display: 'block', marginBottom: '8px' }}>تاریخ خروج (Check-out)</label>
                                        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required 
                                            style={{ width: '100%', padding: '15px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#111', color: '#fff', outline: 'none', colorScheme: 'dark', fontFamily: 'inherit', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <button type="submit" className="east-btn-gold-outline" style={{ width: '100%', padding: '16px', fontSize: '16px', marginTop: '10px' }}>
                                        تایید رزرو و پرداخت بیعانه
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔐</div>
                                <h3 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '18px' }}>ورود به حساب کاربری</h3>
                                <p style={{ color: '#888', fontSize: '14px', marginBottom: '25px', lineHeight: '1.8' }}>برای ثبت تاریخ و رزرو این اتاق زیبا، لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
                                <button onClick={() => navigate('/login')} className="east-btn-gold-outline" style={{ width: '100%' }}>
                                    ورود / ثبت‌نام
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isLightboxOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, cursor: 'zoom-out' }} onClick={(e) => { if(e.target === e.currentTarget) closeLightbox(); }}>
                    <button onClick={closeLightbox} style={{ position: 'absolute', top: '30px', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '40px', cursor: 'pointer', opacity: '0.7' }}>&times;</button>
                    {imageUrls.length > 1 && <button onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }} style={{ position: 'absolute', left: '40px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '50px', cursor: 'pointer', width: '70px', height: '70px', borderRadius: '50%' }}>&#10094;</button>}
                    <img src={imageUrls[lightboxIndex]} alt="نمای بزرگ" style={{ maxWidth: '90%', maxHeight: '90%', boxShadow: '0 0 50px rgba(0,0,0,0.8)', borderRadius: '8px' }} onClick={(e) => e.stopPropagation()} />
                    {imageUrls.length > 1 && <button onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }} style={{ position: 'absolute', right: '40px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '50px', cursor: 'pointer', width: '70px', height: '70px', borderRadius: '50%' }}>&#10095;</button>}
                    <div style={{ position: 'absolute', bottom: '30px', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '15px', fontSize: '14px', fontWeight: 'bold' }}>{Number(lightboxIndex + 1).toLocaleString('fa-IR')} از {Number(imageUrls.length).toLocaleString('fa-IR')}</div>
                </div>
            )}
        </>
    );
}

export default BookingPage;