<div align="center">

# 🏨 Hotel Management System
### سیستم هوشمند مدیریت و رزرو هتل
*(طراحی شده با معماری مدرن، دارک‌مود و متمرکز بر تجربه‌ی کاربریِ بهینه)*

<br>

<img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" />
<img src="https://img.shields.io/badge/DjangoREST-ff1709?style=for-the-badge&logo=django&logoColor=white" />
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />

</div>

---

## 🌟 معرفی پروژه
این پروژه یک سیستم جامع برای مدیریت فرآیندهای هتل‌داری (رزرو، حسابداری و ویترین محصولات) است که با هدفِ **مقیاس‌پذیری در بک‌اِند** و **ارائه رابط کاربری حرفه‌ای** طراحی شده است. تمرکز اصلی بر روی امنیتِ تراکنش‌های مالی و دقتِ محاسبات در سیستمِ رزرواسیون است.

## 🛠 معماری و تکنولوژی
### ⚙️ بک‌اِند (Django + DRF)
- **API Architecture:** پیاده‌سازیِ اِندپوینت‌های کاملاً RESTful.
- **Financial Logic:** محاسباتِ دقیقِ هزینه‌ها شامل مالیات، خدماتِ جانبی و تسویه حسابِ نهایی در سمتِ سرور.
- **Concurrency Management:** مدیریت هوشمندِ موجودی اتاق‌ها جهت جلوگیری از تداخل (Overbooking).
- **Security:** سیستمِ احراز هویت با پروتکل JWT.

### 🎨 فرانت‌اِند (React.js)
- **Modern UI:** رابط کاربری واکنش‌گرا با تم دارک و المان‌های تعاملی.
- **Dynamic Content:** مدیریتِ لحظه‌ای منوی رستوران و تصاویر از طریق پنل ادمین.
- **UX Focused:** استفاده از تکنیک‌هایِ پیشرفته برای تعامل بهتر کاربر با سیستم.

---

## 🚀 راهنمای نصب

<details>
<summary><b>نمایش دستورات نصب</b></summary>

### راه اندازی بک‌اِند
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
