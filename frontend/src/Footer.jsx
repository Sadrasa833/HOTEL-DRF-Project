function Footer() {
    return (
        <footer>
            <div className="east-footer-newsletter">
                <h2 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>EAST COSMOS NEWSLETTER</h2>
                <h3 style={{ fontSize: '22px', fontWeight: '400', margin: '0 0 20px 0' }}>We'll keep you up to date!</h3>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '14px', lineHeight: '1.8' }}>
                    با ثبت‌نام در خبرنامه هتل ما، از جدیدترین تخفیف‌ها، رویدادهای رستوران و امکانات جدید باخبر شوید.
                </p>
                
                <div className="east-newsletter-inputs">
                    <input type="email" placeholder="ایمیل شما *" />
                    <input type="text" placeholder="نام" />
                    <input type="text" placeholder="نام خانوادگی" />
                </div>
                <button className="east-btn-gold-outline" style={{ background: '#111', color: '#cda46f', marginTop: '0' }}>عضویت در خبرنامه</button>
            </div>

            <div className="east-footer-dark">
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h1 style={{ color: '#cda46f', margin: '0 0 15px 0', letterSpacing: '4px', fontSize: '32px' }}>SADRA<span style={{color: '#fff', fontWeight: 300}}>HOTEL</span></h1>
                    <p style={{ fontSize: '14px', lineHeight: '2' }}>
                        ایران، تهران، خیابان فرشته<br/>
                        پلاک ۳۱، ساختمان لاکچری ایست
                    </p>
                    <p style={{ color: '#cda46f', fontWeight: 'bold' }}>+98 21 1234 5678</p>
                    <p>info@east-hotel.ir</p>
                </div>
                
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ color: '#fff', marginBottom: '20px' }}>Discover</h4>
                    <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.5', fontSize: '14px' }}>
                        <li style={{ cursor: 'pointer' }}>سوالات متداول (FAQs)</li>
                        <li style={{ cursor: 'pointer' }}>مسیرها و پارکینگ</li>
                        <li style={{ cursor: 'pointer' }}>فرصت‌های شغلی</li>
                        <li style={{ cursor: 'pointer' }}>ارتباط با مدیریت</li>
                    </ul>
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                    <h4 style={{ color: '#fff', marginBottom: '20px' }}>east Cosmos</h4>
                    <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.5', fontSize: '14px' }}>
                        <li style={{ cursor: 'pointer' }}>Clouds - Heaven's Bar</li>
                        <li style={{ cursor: 'pointer' }}>Coast by east Hamburg</li>
                        <li style={{ cursor: 'pointer' }}>Coast by east Mallorca</li>
                    </ul>
                </div>
            </div>

            <div className="east-footer-bottom">
                <span>© ۲۰۲۶ تمامی حقوق محفوظ است.</span>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <span style={{ cursor: 'pointer' }}>حریم خصوصی</span>
                    <span style={{ cursor: 'pointer' }}>شرایط و قوانین</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;