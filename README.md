# ParsShop Frontend

پنل مدیریت فروشگاه پارس‌شاپ - ساخته شده با Vue 3 و TypeScript

## ویژگی‌ها

- 🔐 سیستم احراز هویت کامل (OTP و Username/Password)
- 📱 طراحی ریسپانسیو
- 🌙 پشتیبانی از حالت تاریک
- 🎨 استفاده از Tailwind CSS
- 🔤 فونت YekanBakh برای نمایش بهتر فارسی
- 📊 داشبورد مدیریتی
- 🔒 کنترل دسترسی‌ها
- 🌐 API Integration با NestJS Backend
- 🔄 Proxy برای حل مشکل CORS

## تکنولوژی‌های استفاده شده

- **Vue 3** - فریمورک اصلی
- **TypeScript** - برای Type Safety
- **Vue Router** - مدیریت مسیرها
- **Pinia** - مدیریت State
- **Tailwind CSS** - استایل‌دهی
- **YekanBakh Font** - فونت فارسی
- **Axios** - HTTP Client
- **SweetAlert2** - نمایش پیام‌ها
- **Custom Phone Formatting** - فرمت‌دهی شماره تلفن

## نصب و راه‌اندازی

### پیش‌نیازها
- Node.js (نسخه 18 یا بالاتر)
- npm یا yarn

### مراحل نصب

1. کلون کردن پروژه:
```bash
git clone <repository-url>
cd parsshop-frontend
```

2. نصب dependencies:
```bash
npm install
```

3. اجرای پروژه در حالت توسعه:
```bash
npm run dev
```

4. ساخت پروژه برای production:
```bash
npm run build
```

## ساختار پروژه

```
src/
├── assets/          # فایل‌های استاتیک و CSS
├── components/      # کامپوننت‌های قابل استفاده مجدد
├── layouts/         # Layout های مختلف
├── router/          # تنظیمات Vue Router
├── services/        # سرویس‌های API
├── stores/          # Pinia Stores
├── types/           # TypeScript Type Definitions
├── views/           # صفحات اصلی
└── main.ts          # Entry Point
```

## API Backend

این پروژه با یک backend NestJS کار می‌کند که باید روی `http://localhost:3000` در دسترس باشد.

### Endpoints موجود:
- `GET /api/health` - بررسی سلامت API
- `POST /api/auth/otp/request` - درخواست کد OTP
- `POST /api/auth/otp/verify` - تایید کد OTP
- `POST /api/auth/login/password` - ورود با رمز عبور
- `POST /api/auth/register/password` - ثبت نام
- `POST /api/auth/refresh` - تمدید توکن
- `POST /api/auth/logout` - خروج
- `GET /api/auth/me/admin-check` - بررسی دسترسی ادمین

## صفحات موجود

### صفحات احراز هویت:
- `/auth/login` - ورود با نام کاربری و رمز عبور
- `/auth/login-otp` - ورود با کد یکبار مصرف
- `/auth/verify-otp` - تایید کد OTP
- `/auth/register` - ثبت نام

### صفحات اصلی:
- `/dashboard` - داشبورد اصلی
- `/profile` - پروفایل کاربری
- `/admin-test` - تست دسترسی‌های مدیریتی

## ویژگی‌های احراز هویت

- **دو روش ورود**: OTP و Username/Password
- **مدیریت توکن**: Automatic token refresh
- **کنترل دسترسی**: Role-based access control
- **حفاظت مسیرها**: Protected routes با navigation guards

## تنظیمات

### متغیرهای محیطی:
- `VITE_API_BASE_URL`: آدرس پایه API (پیش‌فرض: http://localhost:3000/api)

### تنظیمات Tailwind:
فایل `tailwind.config.cjs` شامل تنظیمات سفارشی رنگ‌ها و کلاس‌های مخصوص پروژه است.

## مشارکت

برای مشارکت در پروژه:
1. Fork کنید
2. Branch جدید بسازید
3. تغییرات را commit کنید
4. Pull Request ارسال کنید

## لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.