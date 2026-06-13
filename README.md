<div align="center">

# 🏨 East Hotel Management System
### یک راهکار مدرن و لوکس برای مدیریت هوشمند هتل
*(طراحی شده با معماریِ دارک‌مود و متمرکز بر تجربه‌ی کاربریِ بوتیک)*

<br>

<img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" />
<img src="https://img.shields.io/badge/DjangoREST-ff1709?style=for-the-badge&logo=django&logoColor=white" />
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />

</div>

---

## 🌟 چرا این پروژه متفاوت است؟
بسیاری از سیستم‌های مدیریت هتل بر روی ظاهر تمرکز دارند، اما در **East Hotel System**، قلبِ تپنده‌ی پروژه، **امنیت و دقت در محاسباتِ مالی** است. این سیستم نه تنها یک ویترینِ خیره‌کننده، بلکه یک **موتورِ پردازشِ تراکنشِ قابل اطمینان** است.

## 🛠 معماری و تکنولوژی
### ⚙️ قلب تپنده (Backend)
- **Django Rest Framework:** طراحیِ APIهایی با ساختار `ViewSet` برای دسترسی بهینه به داده‌ها.
- **Financial Integrity:** سیستمِ محاسبه‌گرِ هوشمند (Automatic Billing) که مالیات، تخفیف و بیعانه را بدون خطایِ انسانی محاسبه می‌کند.
- **Concurrency Control:** استفاده از منطقِ پیشرفته برای مدیریت رزروها و جلوگیری از تداخل (Overbooking).
- **Security:** استفاده از `JWT` برای مدیریتِ نشست‌های کاربری و فیلتر کردنِ دسترسی‌ها.

### 🎨 تجربه‌ی کاربری (Frontend)
- **Design Language:** پیاده‌سازیِ الگویِ `Dark Luxury` با پالت رنگیِ مشکی عمیق و طلایی.
- **Dynamic Content:** مدیریتِ کاملِ منوی رستوران و گالری تصاویر از طریق پنل ادمین.
- **Interactivity:** استفاده از تکنیک‌هایِ `Parallax`، `Z-Pattern Layout` و `Lightbox` برای درگیر کردنِ کاربر.

---

## 🚀 نقشه راه نصب
<details>
<summary><b>کلیک کنید برای مشاهده راهنمای نصب سریع</b></summary>

### راه اندازی بک‌اِند
```bash
cd backend
python -m venv venv
source venv/bin/activate  # در ویندوز: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
