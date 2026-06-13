from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from .models import Room, Booking, Service, Coupon, Invoice

class HotelSystemTests(APITestCase):
    
    def setUp(self):
        """
        این متد قبل از هر تست اجرا میشه تا محیط و دیتای اولیه رو آماده کنه.
        انگار یک هتل خالی ساختیم تا توش سناریوها رو اجرا کنیم.
        """
        self.user = User.objects.create_user(username='guest_user', password='testpassword123')
        self.other_user = User.objects.create_user(username='hacker_user', password='hacker123')
        
        self.room = Room.objects.create(room_number='101', room_type='vip', price_per_night=1000000)
        self.service = Service.objects.create(name='MiniBar', price=50000, is_active=True)
        
        # کد تخفیف معتبر (منقضی میشه فردا)
        self.valid_coupon = Coupon.objects.create(
            code='OFF10', discount_percent=10, 
            valid_until=timezone.now() + timedelta(days=1), is_active=True
        )
        # کد تخفیف منقضی شده (برای تست باگ‌ها)
        self.expired_coupon = Coupon.objects.create(
            code='OLD10', discount_percent=10, 
            valid_until=timezone.now() - timedelta(days=1), is_active=True
        )

        # لاگین کردن کاربر در سیستم
        self.client.force_authenticate(user=self.user)

    def test_1_valid_booking_and_auto_invoice(self):
        """تست ۱: رزرو موفق و بررسی صدور خودکار فاکتور"""
        data = {
            "room": self.room.id,
            "check_in_date": (timezone.now() + timedelta(days=1)).strftime('%Y-%m-%d'),
            "check_out_date": (timezone.now() + timedelta(days=3)).strftime('%Y-%m-%d')
        }
        response = self.client.post('/api/bookings/', data)
        
        # ۱. آیا رزرو با موفقیت ثبت شد؟
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # ۲. آیا سیستم قیمت کل (۲ شب اقامت) رو درست حساب کرده؟ (۲ * ۱,۰۰۰,۰۰۰)
        booking = Booking.objects.get(id=response.data['id'])
        self.assertEqual(booking.total_price, 2000000)
        
        # ۳. آیا فاکتور به صورت خودکار و پنهانی ساخته شد؟
        self.assertTrue(Invoice.objects.filter(booking=booking).exists())

    def test_2_invalid_dates_booking(self):
        """تست ۲: مسافر تاریخ ورود رو بعد از خروج بزنه! (تست هوش سیستم)"""
        data = {
            "room": self.room.id,
            "check_in_date": (timezone.now() + timedelta(days=5)).strftime('%Y-%m-%d'),
            "check_out_date": (timezone.now() + timedelta(days=2)).strftime('%Y-%m-%d')
        }
        response = self.client.post('/api/bookings/', data)
        
        # سیستم باید ارور ۴۰۰ (Bad Request) بده و رزرو نکنه
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("تاریخ ورود باید قبل از تاریخ خروج باشد!", str(response.data))

    def test_3_overlapping_race_condition(self):
        """تست ۳: تست نفوذ تداخل تاریخ‌ها (غول مرحله آخر)"""
        # مسافر اول اتاق رو از فردا تا ۵ روز دیگه رزرو می‌کنه
        Booking.objects.create(
            user=self.user,
            room=self.room,
            check_in_date=(timezone.now() + timedelta(days=1)).date(),
            check_out_date=(timezone.now() + timedelta(days=5)).date(),
            total_price=4000000,
            status='confirmed'
        )

        # مسافر دوم می‌خواد دقیقاً وسط اقامت نفر اول، همون اتاق رو بگیره (روز ۳ تا ۴)
        self.client.force_authenticate(user=self.other_user)
        bad_data = {
            "room": self.room.id,
            "check_in_date": (timezone.now() + timedelta(days=3)).strftime('%Y-%m-%d'),
            "check_out_date": (timezone.now() + timedelta(days=4)).strftime('%Y-%m-%d')
        }
        response = self.client.post('/api/bookings/', bad_data)
        
        # فرمول Q باید مچش رو بگیره و ارور بده!
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_4_invoice_accounting_logic(self):
        """تست ۴: تست جامع حسابداری، مالیات و تخفیف"""
        # ۱. ثبت یک رزرو پایه برای ۲ شب
        booking = Booking.objects.create(
            user=self.user,
            room=self.room,
            check_in_date=(timezone.now() + timedelta(days=1)).date(),
            check_out_date=(timezone.now() + timedelta(days=3)).date(),
            total_price=2000000
        )
        invoice = Invoice.objects.create(booking=booking)

        # ۲. اضافه کردن مینی‌بار به فاکتور (۵۰,۰۰۰ تومان)
        service_response = self.client.post(f'/api/invoices/{invoice.id}/add_service/', {'service_id': self.service.id})
        self.assertEqual(service_response.status_code, status.HTTP_200_OK)

        # ۳. تست زدنِ کد تخفیف منقضی شده (باید رد بشه)
        bad_coupon_response = self.client.post(f'/api/invoices/{invoice.id}/apply_coupon/', {'code': 'OLD10'})
        self.assertEqual(bad_coupon_response.status_code, status.HTTP_400_BAD_REQUEST)

        # ۴. تست زدنِ کد تخفیف معتبر (باید قبول بشه)
        good_coupon_response = self.client.post(f'/api/invoices/{invoice.id}/apply_coupon/', {'code': 'OFF10'})
        self.assertEqual(good_coupon_response.status_code, status.HTTP_200_OK)

        # ۵. گرفتن فیش نهایی از ماشین‌حساب و بررسی ریاضیات
        calc_response = self.client.get(f'/api/invoices/{invoice.id}/calculate_total/')
        data = calc_response.data
        
        # بررسی ریز محاسبات:
        # پول اتاق: ۲,۰۰۰,۰۰۰
        # خدمات: ۵۰,۰۰۰
        # جمع کل: ۲,۰۵۰,۰۰۰
        # تخفیف (۱۰ درصد): ۲۰۵,۰۰۰
        # مبلغ بعد از تخفیف: ۱,۸۴۵,۰۰۰
        # مالیات (۹ درصد): ۱۶۶,۰۵۰
        # پرداختی نهایی: ۲,۰۱۱,۰۵۰
        
        self.assertEqual(data['room_cost'], 2000000)
        self.assertEqual(data['services_cost'], 50000)
        self.assertEqual(data['discount_applied'], 205000)
        self.assertEqual(data['final_payable_amount'], 2011050.00)