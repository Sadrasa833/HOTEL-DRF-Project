import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [receiptData, setReceiptData] = useState(null);
    const [activeInvoice, setActiveInvoice] = useState(null);
    const navigate = useNavigate();

    const fetchInvoices = () => {
        setLoading(true);
        api.get('invoices/')
           .then(res => { setInvoices(res.data); setLoading(false); })
           .catch(err => { console.error(err); setLoading(false); });
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    // ۱. پرداخت بیعانه
    const handlePayDeposit = async (id) => {
        try {
            const response = await api.post(`invoices/${id}/pay_deposit/`);
            alert(response.data.message);
            fetchInvoices();
        } catch (err) {
            alert(err.response?.data?.message || 'خطا در پرداخت بیعانه!');
        }
    };

    // ۲. محاسبه صورت‌حساب نهایی
    const handleCalculateTotal = async (id) => {
        try {
            const response = await api.get(`invoices/${id}/calculate_total/`);
            setReceiptData(response.data);
            setActiveInvoice(id);
        } catch (err) {
            alert('خطا در ارتباط با واحد حسابداری!');
        }
    };

    // ۳. تسویه نهایی و تحویل کلید
    const handleFinalCheckout = async (id) => {
        if(window.confirm('آیا از تسویه حساب نهایی و تحویل اتاق اطمینان دارید؟')) {
            try {
                const response = await api.post(`invoices/${id}/final_checkout/`);
                alert(response.data.message);
                setActiveInvoice(null);
                fetchInvoices();
            } catch (err) {
                alert(err.response?.data?.message || 'خطا در تسویه حساب!');
            }
        }
    };

    if (loading) return <h3 style={{ textAlign: 'center', marginTop: '100px', color: '#cda46f' }}>⏳ در حال دریافت صورت‌حساب‌ها...</h3>;

    return (
        <div className="glass-container animate-fade-up" style={{ maxWidth: '900px', padding: '40px', marginTop: '40px', marginBottom: '80px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#ffffff', fontSize: '24px', fontWeight: '900' }}>🧾 مدیریت فاکتورها و اقامت‌ها</h2>
                <button onClick={() => navigate('/')} className="east-btn-gold-outline" style={{ marginTop: 0, padding: '10px 20px', fontSize: '13px' }}>
                    بازگشت به لابی هتل
                </button>
            </div>

            {invoices.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '50px 0' }}>شما هنوز هیچ تاریخچه رزروی در این سیستم ندارید.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {invoices.map((invoice) => (
                        <div key={invoice.id} style={{ border: '1px solid #333', borderRadius: '4px', padding: '30px', backgroundColor: '#1c1c1e', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                            
                            {/* هدر فاکتور کاربری */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#fff', fontWeight: 'bold' }}>اتاق شماره {invoice.room_info}</h3>
                                    <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>تاریخ صدور فاکتور: {new Date(invoice.issued_at).toLocaleDateString('fa-IR')}</p>
                                </div>
                                
                                {/* برچسب وضعیت فاکتور و رزرو */}
                                <div style={{ 
                                    padding: '6px 15px', 
                                    borderRadius: '20px', 
                                    fontSize: '12px', 
                                    fontWeight: 'bold',
                                    border: '1px solid',
                                    backgroundColor: 
                                        invoice.raw_booking_status === 'pending' ? 'rgba(229, 62, 62, 0.1)' : 
                                        invoice.raw_booking_status === 'confirmed' ? 'rgba(205, 164, 111, 0.15)' : 'rgba(255,255,255,0.05)',
                                    color: 
                                        invoice.raw_booking_status === 'pending' ? '#fc8181' : 
                                        invoice.raw_booking_status === 'confirmed' ? '#cda46f' : '#888',
                                    borderColor:
                                        invoice.raw_booking_status === 'pending' ? '#e53e3e' : 
                                        invoice.raw_booking_status === 'confirmed' ? '#cda46f' : '#444'
                                }}>
                                    {invoice.booking_status_display}
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px dashed #333', margin: '20px 0' }}/>

                            {/* بخش دکمه‌های عملیاتی بر اساس جریان داده بک‌اِند */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', alignItems: 'center' }}>
                                
                                {/* حالت اول: بیعانه پرداخت نشده */}
                                {invoice.raw_booking_status === 'pending' && (
                                    <>
                                        <span style={{ color: '#fc8181', fontSize: '13px', marginLeft: 'auto', fontWeight: 'bold' }}>
                                            ⚠️ ظرفیت اتاق موقت است؛ لطفاً بیعانه را واریز کنید.
                                        </span>
                                        <button 
                                            onClick={() => handlePayDeposit(invoice.id)}
                                            className="east-btn-gold-outline"
                                            style={{ marginTop: 0, padding: '12px 25px' }}>
                                            💳 پرداخت آنلاین بیعانه
                                        </button>
                                    </>
                                )}

                                {/* حالت دوم: رزرو تایید شده و مهمان مستقر است */}
                                {invoice.raw_booking_status === 'confirmed' && (
                                    <button 
                                        onClick={() => handleCalculateTotal(invoice.id)}
                                        className="east-btn-gold-outline"
                                        style={{ marginTop: 0, padding: '12px 25px', backgroundColor: '#fff', color: '#111' }}>
                                        📋 درخواست فیش و تسویه نهایی خروج
                                    </button>
                                )}

                                {/* حالت سوم: تخلیه شده و پرونده بسته شده */}
                                {invoice.raw_booking_status === 'checked_out' && (
                                    <span style={{ color: '#555', fontWeight: 'bold', fontSize: '14px' }}>✓ این اقامت به پایان رسیده و تسویه شده است.</span>
                                )}
                            </div>

                            {/* 🔴 فیش نهایی دیجیتال (باز شدن در زیر کارت فاکتور با کلیک مسافر) */}
                            {activeInvoice === invoice.id && receiptData && invoice.raw_booking_status === 'confirmed' && (
                                <div className="animate-fade-up" style={{ marginTop: '25px', padding: '30px', backgroundColor: '#111112', borderRadius: '4px', border: '1px dashed #cda46f' }}>
                                    <h4 style={{ textAlign: 'center', marginTop: 0, color: '#cda46f', fontSize: '18px', letterSpacing: '1px' }}>صورت‌حساب نهایی تراکنش‌ها</h4>
                                    
                                    <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.5', fontSize: '14px', color: '#a0a0a0' }}>
                                        <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>هزینه اقامت پایه (تعداد شب‌ها):</span> <strong style={{color:'#fff'}}>{Number(receiptData.room_cost).toLocaleString()} تومان</strong></li>
                                        <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>هزینه خدمات و کافه رستوران اتاق:</span> <strong style={{color:'#fff'}}>{Number(receiptData.services_cost).toLocaleString()} تومان</strong></li>
                                        <li style={{ display: 'flex', justifyContent: 'space-between', color: '#81e6d9' }}><span>کد تخفیف اعمال شده:</span> <strong>- {Number(receiptData.discount_applied).toLocaleString()} تومان</strong></li>
                                        <li style={{ display: 'flex', justifyContent: 'space-between', color: '#fc8181' }}><span>مالیات بر ارزش افزوده قانونی (۹٪):</span> <strong>+ {Number(receiptData.tax_amount).toLocaleString()} تومان</strong></li>
                                        <hr style={{ borderTop: '1px solid #222', margin: '15px 0' }} />
                                        <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>مجموع کل هزینه‌ها:</span> <strong style={{color:'#fff'}}>{Number(receiptData.total_invoice_amount).toLocaleString()} تومان</strong></li>
                                        <li style={{ display: 'flex', justifyContent: 'space-between', color: '#cda46f' }}><span>کسر مبلغ بیعانه (پرداخت شده در روز اول):</span> <strong>- {Number(receiptData.deposit_paid).toLocaleString()} تومان</strong></li>
                                    </ul>
                                    
                                    <div style={{ backgroundColor: '#1c1c1e', padding: '25px', borderRadius: '4px', textAlign: 'center', marginTop: '20px', border: '1px solid #222' }}>
                                        <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '18px', fontWeight: 'normal' }}>
                                            مانده حساب نهایی جهت تسویه: <span style={{ color: '#fc8181', fontWeight: '900', fontSize: '24px', marginRight: '5px' }}>{Number(receiptData.final_payable_amount).toLocaleString()}</span> تومان
                                        </h3>
                                        <button 
                                            onClick={() => handleFinalCheckout(invoice.id)}
                                            className="east-btn-gold-outline"
                                            style={{ width: '100%', margin: 0, padding: '15px' }}>
                                            💳 تایید پرداخت آنلاین و تحویل دیجیتال کلید
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Invoices;