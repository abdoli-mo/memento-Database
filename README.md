# Memento Database - Persian Date & Mission Manager

کتابخانه جاوااسکریپت برای مدیریت تاریخ شمسی و سیستم ماموریت‌های پروازی

## قابلیت‌ها

- تبدیل و محاسبات تاریخ شمسی
- توابع کمکی آرایه و آبجکت
- مدیریت ماموریت‌ها و پروازها
- محاسبات آماری و اولویت‌بندی نفرات
- خروجی Markdown و CSV

## نحوه استفاده

```javascript
initializePersianDate();
const mArray = getMArray();
const parvazMissions = mArray.filterOnlyParvaz();