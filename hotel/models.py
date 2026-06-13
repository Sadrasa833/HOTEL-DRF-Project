from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Room(models.Model):
    ROOM_TYPES = (
        ('single', 'یک تخته'),
        ('double', 'دو تخته'),
        ('suite', 'سوئیت'),
        ('vip', 'VIP'),
    )
    room_number = models.CharField(max_length=10, unique=True, verbose_name="شماره اتاق")
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES, verbose_name="نوع اتاق")
    capacity = models.PositiveIntegerField(default=2, verbose_name="ظرفیت")
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="قیمت هر شب")
    
    description = models.TextField(blank=True, null=True, verbose_name="توضیحات اتاق")
    amenities = models.CharField(max_length=250, default="وای‌فای رایگان، سیستم سرمایش، تلویزیون ۴K، یخچال، مینی‌بار", verbose_name="امکانات اتاق (با کاما جدا شود)")
    
    is_active = models.BooleanField(default=True, verbose_name="فعال / قابل رزرو")

    def __str__(self):
        return f"اتاق {self.room_number}"

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'در انتظار پرداخت بیعانه (موقت)'),
        ('confirmed', 'تایید شده (اتاق قفل شد)'),
        ('checked_out', 'تسویه شده و خروج کامل'),
        ('canceled', 'لغو شده'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    check_in_date = models.DateField(verbose_name="تاریخ ورود")
    check_out_date = models.DateField(verbose_name="تاریخ خروج")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="وضعیت رزرو")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="هزینه کل اتاق")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"رزرو اتاق {self.room.room_number} - {self.user.username}"


class Service(models.Model):
    name = models.CharField(max_length=100, verbose_name="نام سرویس")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="قیمت سرویس")
    is_active = models.BooleanField(default=True, verbose_name="موجود در هتل")

    def __str__(self):
        return f"{self.name} ({self.price} تومان)"


class Coupon(models.Model):
    code = models.CharField(max_length=20, unique=True, verbose_name="کد تخفیف")
    discount_percent = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)],
        verbose_name="درصد تخفیف"
    )
    valid_until = models.DateTimeField(verbose_name="تاریخ انقضا")
    is_active = models.BooleanField(default=True, verbose_name="فعال")

    def __str__(self):
        return self.code


class Invoice(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='invoice')
    services = models.ManyToManyField(Service, blank=True, verbose_name="خدمات استفاده شده")
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True)
    
    deposit_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="مبلغ بیعانه پرداخت شده")
    
    tax_rate = models.DecimalField(max_digits=4, decimal_places=2, default=9.00, verbose_name="درصد مالیات")
    
    is_paid = models.BooleanField(default=False, verbose_name="تسویه کامل نهایی؟")
    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"فاکتور رزرو {self.booking.room.room_number}"


class HotelGallery(models.Model):
    title = models.CharField(max_length=100, verbose_name="عنوان عکس (مثلا: نمای لابی)")
    image = models.ImageField(upload_to='hotel_gallery/', verbose_name="فایل عکس")
    is_active = models.BooleanField(default=True, verbose_name="نمایش در سایت")

    def __str__(self):
        return self.title

class RoomImage(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='room_images/', verbose_name="عکس اتاق")
    is_main = models.BooleanField(default=False, verbose_name="عکس اصلی (کاور)؟")

    def __str__(self):
        return f"عکس {self.room.room_number}"


class MenuItem(models.Model):
    CATEGORY_CHOICES = (
        ('restaurant', 'منوی رستوران'),
        ('bar', 'بار و نوشیدنی‌ها'),
    )
    name = models.CharField(max_length=100, verbose_name="نام آیتم")
    description = models.TextField(blank=True, null=True, verbose_name="توضیحات (ترکیبات)")
    price = models.DecimalField(max_digits=12, decimal_places=0, verbose_name="قیمت (تومان)") 
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name="دسته بندی")
    is_active = models.BooleanField(default=True, verbose_name="موجود در منو")

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"