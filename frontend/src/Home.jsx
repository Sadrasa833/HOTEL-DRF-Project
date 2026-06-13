import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const BASE_URL = 'http://127.0.0.1:8000';

const getFullImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/800x600?text=بدون+تصویر';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
};

function Home() {
    const [rooms, setRooms] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roomsRes, galleryRes] = await Promise.all([
                    api.get('rooms/'),
                    api.get('gallery/')
                ]);
                setRooms(roomsRes.data);
                setGallery(galleryRes.data);
                
                const urls = galleryRes.data?.map(img => getFullImageUrl(img.image)) || [];
                setImageUrls(urls);
                
                setTimeout(() => setLoading(false), 800);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const openLightbox = (index) => { 
        setLightboxIndex(index); 
        setIsLightboxOpen(true); 
        document.body.style.overflow = 'hidden'; 
    };
    
    const closeLightbox = () => { 
        setIsLightboxOpen(false); 
        document.body.style.overflow = 'auto'; 
    };
    
    const navigateLightbox = (direction) => { 
        const total = imageUrls.length; 
        setLightboxIndex((lightboxIndex + direction + total) % total); 
    };

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

    const heroImage = imageUrls.length > 0 ? imageUrls[0] : 'https://images.unsplash.com/photo-1542314831-c6a4d14d8387?auto=format&fit=crop&w=1920&q=80';

    return (
        <>
            <div className="luxury-hero animate-fade-up" style={{ backgroundImage: `url(${heroImage})`, margin: '0', borderRadius: '0', height: '80vh' }}>
                <div className="luxury-hero-overlay"></div>
                <div className="luxury-hero-content">
                    <h1 className="luxury-title" style={{ color: '#fff' }}>تجربه یک اقامت فراموش‌نشدنی</h1>
                    <p className="luxury-subtitle" style={{ color: '#cda46f' }}>تلفیقی از هنر، آرامش و معماری مدرن</p>
                </div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
                
                {!loading && gallery.length > 1 && (
                    <div className="glass-container animate-fade-up" style={{ marginTop: '-80px', marginBottom: '60px', padding: '30px' }}>
                        <h2 style={{ color: '#f0f0f0', borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '22px', marginTop: 0 }}>گوشه‌ای از زیبایی‌های هتل</h2>
                        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', marginTop: '20px' }}>
                            {gallery.slice(1).map((img, index) => (
                                <img 
                                    key={img.id} 
                                    src={getFullImageUrl(img.image)} 
                                    alt={img.title} 
                                    onClick={() => openLightbox(index + 1)}
                                    style={{ height: '180px', minWidth: '280px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', cursor: 'pointer', transition: 'all 0.3s ease' }} 
                                    onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.filter = 'brightness(1.1)'; }}
                                    onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'brightness(1)'; }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <h2 style={{ marginBottom: '10px', color: '#f0f0f0', borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '26px' }}>
                    سوئیت‌ها و اتاق‌های مجلل
                </h2>
                
                <div className="east-room-container" style={{ marginBottom: '60px' }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#888', fontSize: '18px', padding: '50px' }}>⏳ در حال آماده‌سازی اطلاعات هتل...</p>
                    ) : (
                        rooms.map((room, index) => {
                            const amenitiesList = room.amenities ? room.amenities.split('،') : [];
                            const coverImage = getFullImageUrl(room.images.find(img => img.is_main)?.image || room.images[0]?.image);

                            return (
                                <div key={room.id} className="east-room-row animate-fade-up" style={{ animationDelay: `${0.1 * index}s` }}>
                                    
                                    <div className="east-room-content">
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '2.2rem', color: '#ffffff', fontWeight: '900', letterSpacing: '1px' }}>
                                            اتاق {room.room_number}
                                        </h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                            <span style={{ color: '#cda46f', fontWeight: 'bold', fontSize: '18px' }}>
                                                {room.room_type_display}
                                            </span>
                                            <span style={{ color: '#666' }}>|</span>
                                            <span style={{ color: '#fff', fontSize: '18px' }}>
                                                {Number(room.price_per_night).toLocaleString()} <span style={{fontSize:'12px', color:'#888'}}>تومان / شب</span>
                                            </span>
                                        </div>
                                        
                                        <p style={{ fontSize: '15px', color: '#a0a0a0', lineHeight: '2', margin: '0 0 25px 0' }}>
                                            {room.description || "تجربه‌ای بی‌نظیر از آرامش و لوکس بودن. مجهز به کامل‌ترین خدمات رفاهی برای اقامتی رویایی در قلب شهر."}
                                        </p>
                                        
                                        <div style={{ marginTop: 'auto' }}>
                                            <span style={{ color: '#fff', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>امکانات ویژه:</span>
                                            <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.8', margin: 0 }}>
                                                {amenitiesList.join('  |  ')}
                                            </p>
                                        </div>
                                        
                                        <button onClick={() => navigate(`/book/${room.id}`)} className="east-btn-gold-outline">
                                            بررسی ظرفیت و رزرو
                                        </button>
                                    </div>

                                    <div className="east-room-image-box">
                                        <img src={coverImage} alt={room.room_type_display} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {isLightboxOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, cursor: 'zoom-out' }} onClick={(e) => { if(e.target === e.currentTarget) closeLightbox(); }}>
                    <button onClick={closeLightbox} style={{ position: 'absolute', top: '30px', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '40px', cursor: 'pointer', opacity: '0.7' }}>&times;</button>
                    {imageUrls.length > 1 && <button onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }} style={{ position: 'absolute', left: '40px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '50px', cursor: 'pointer', width: '70px', height: '70px', borderRadius: '50%' }}>&#10094;</button>}
                    
                    <img src={imageUrls[lightboxIndex]} alt="نمای بزرگ" style={{ maxWidth: '90%', maxHeight: '90%', boxShadow: '0 0 50px rgba(0,0,0,0.8)', borderRadius: '8px' }} onClick={(e) => e.stopPropagation()} />
                    
                    {imageUrls.length > 1 && <button onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }} style={{ position: 'absolute', right: '40px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '50px', cursor: 'pointer', width: '70px', height: '70px', borderRadius: '50%' }}>&#10095;</button>}
                    <div style={{ position: 'absolute', bottom: '30px', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '15px', fontSize: '14px', fontWeight: 'bold' }}>
                        {Number(lightboxIndex + 1).toLocaleString('fa-IR')} از {Number(imageUrls.length).toLocaleString('fa-IR')}
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;