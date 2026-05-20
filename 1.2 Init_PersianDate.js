/**
 * ============================================
 * 🗓️ توابع تاریخ شمسی (Persian Date)
 * ============================================
 * 
 * 🎯 هدف: افزودن متدهای تاریخ شمسی به Date.prototype
 * 📅 آخرین به‌روزرسانی: 1404/01/15
 * 👤 نویسنده: تیم توسعه
 * 
 * 📌 متدهای اضافه شده به Date:
 *   - addDay()           - اضافه کردن روز
 *   - setPersianDate()   - تنظیم تاریخ شمسی
 *   - getPersianParts()  - دریافت اجزای تاریخ (با کش)
 *   - getPersianDay()    - دریافت روز شمسی
 *   - getPersianMonth()  - دریافت ماه شمسی
 *   - getPersianYear()   - دریافت سال شمسی
 *   - getPersianWeekday() - دریافت روز هفته (1-7)
 *   - getPersianWeekdayName() - نام روز هفته
 *   - getPersianMonthName() - نام ماه
 *   - getDateWithoutTime() - حذف زمان
 *   - getPersianDate()   - تاریخ فرمت‌شده (اعداد فارسی)
 *   - toPersianDateString() - رشته کامل تاریخ (اعداد فارسی)
 *   - toShortPersianDate() - تاریخ کوتاه
 *   - toPersianISOString() - استاندارد ISO
 *   - formatPersianDate() - فرمت دلخواه
 *   - isPersianLeapYear() - بررسی سال کبیسه
 * 
 * ⚠️ وابستگی‌ها: بدون وابستگی (کاملاً مستقل)
 * 
 * 📌 نکات فنی:
 *   - از WeakMap برای کش کردن نتایج getPersianParts استفاده می‌کند
 *   - اعداد فارسی با جایگزینی یونیکد (1728+) تبدیل می‌شوند
 *   - الگوریتم کبیسه شمسی: (y % 33) در {1,5,9,13,17,22,26,30}
 * 
 * ============================================
 */
// کش ساده برای محاسبات تکراری
const _persianCache = new WeakMap();

function initializePersianDate() {
    // متد addDay - اضافه کردن روز به تاریخ
    Date.prototype.addDay = function(days) {
        const date = new Date(this.valueOf());
        date.setDate(this.getDate() + Number(days));
        return date;
    };
    
    // متد setPersianDate - تنظیم تاریخ شمسی
    Date.prototype.setPersianDate = function(jy, jm, jd) {
        jy = parseInt(jy);
        jm = parseInt(jm);
        jd = parseInt(jd);
        let gy = (jy <= 979) ? 621 : 1600;
        jy -= (jy <= 979) ? 0 : 979;
        let days = (365 * jy) + ((parseInt(jy / 33)) * 8) + (parseInt(((jy % 33) + 3) / 4)) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
        gy += 400 * (parseInt(days / 146097));
        days %= 146097;
        if (days > 36524) {
            gy += 100 * (parseInt(--days / 36524));
            days %= 36524;
            if (days >= 365) days++;
        }
        gy += 4 * (parseInt((days) / 1461));
        days %= 1461;
        gy += parseInt((days - 1) / 365);
        if (days > 365) days = (days - 1) % 365;
        let gd = days + 1;
        const sal_a = [0, 31, ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let gm;
        for (gm = 0; gm < 13; gm++) {
            let v = sal_a[gm];
            if (gd <= v) break;
            gd -= v;
        }
        this.setFullYear(gy, gm - 1, gd);
        return this;
    };
    
    // متد getPersianParts - دریافت اجزای تاریخ شمسی با کش ساده
    Date.prototype.getPersianParts = function() {
        const timestamp = this.getTime();
        if (_persianCache.has(this) && _persianCache.get(this).timestamp === timestamp) {
            return _persianCache.get(this).parts;
        }
        
        let gy = this.getFullYear();
        const gm = this.getMonth() + 1;
        const gd = this.getDate();
        const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        let jy = (gy <= 1600) ? 0 : 979;
        gy -= (gy <= 1600) ? 621 : 1600;
        const gy2 = (gm > 2) ? (gy + 1) : gy;
        let days = (365 * gy) + (parseInt((gy2 + 3) / 4)) - (parseInt((gy2 + 99) / 100)) + (parseInt((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
        jy += 33 * (parseInt(days / 12053));
        days %= 12053;
        jy += 4 * (parseInt(days / 1461));
        days %= 1461;
        jy += parseInt((days - 1) / 365);
        if (days > 365) days = (days - 1) % 365;
        const jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
        const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
        const parts = [jy, jm, jd];
        
        _persianCache.set(this, { timestamp: timestamp, parts: parts });
        return parts;
    };
    
    // متد getPersianWeekday - دریافت روز هفته شمسی (1=شنبه تا 7=جمعه)
    Date.prototype.getPersianWeekday = function() {
        return (((this.getDay() + 1) % 7) + 1);
    };
    
    // متد getPersianDay - دریافت روز شمسی
    Date.prototype.getPersianDay = function() {
        return +this.getPersianParts()[2];
    };
    
    // متد getPersianMonth - دریافت ماه شمسی
    Date.prototype.getPersianMonth = function() {
        return +this.getPersianParts()[1];
    };
    
    // متد getPersianYear - دریافت سال شمسی
    Date.prototype.getPersianYear = function() {
        return +this.getPersianParts()[0];
    };
    
    // متد getPersianWeekdayName - دریافت نام روز هفته
    Date.prototype.getPersianWeekdayName = function() {
        const weekDaynames = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
        return weekDaynames[this.getPersianWeekday() - 1];
    };
    
    // متد getPersianMonthName - دریافت نام ماه شمسی
    Date.prototype.getPersianMonthName = function() {
        const monthNames = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
        const parts = this.getPersianParts();
        return monthNames[parts[1] - 1];
    };
    
    // متد getDateWithoutTime - دریافت تاریخ بدون زمان با اعتبارسنجی
    Date.prototype.getDateWithoutTime = function() {
        if (!(this instanceof Date) || isNaN(this.getTime())) {
            return null;
        }
        const date = new Date(this);
        date.setHours(0, 0, 0, 0);
        return date;
    };
    
    // متد getPersianDate - دریافت تاریخ شمسی فرمت‌شده
    Date.prototype.getPersianDate = function() {
        const d = this.getPersianParts();
        const persianDate = (d[0] + "/" + ("0" + d[1]).slice(-2) + "/" + ("0" + d[2]).slice(-2));
        return persianDate.replace(/([0-9])/g, function(token) {
            return String.fromCharCode(token.charCodeAt(0) + 1728);
        });
    };
    
    // متد getPersianFullYear - دریافت سال کامل شمسی
    Date.prototype.getPersianFullYear = function() {
        return this.getPersianParts()[0];
    };
    
    // متد toPersianDateString - رشته تاریخ شمسی کامل با اعداد فارسی
    Date.prototype.toPersianDateString = function() {
        const day = this.getPersianDay().toString().replace(/\d/g, function(token) {
            return String.fromCharCode(token.charCodeAt(0) + 1728);
        });
        const year = this.getPersianFullYear().toString().replace(/\d/g, function(token) {
            return String.fromCharCode(token.charCodeAt(0) + 1728);
        });
        return this.getPersianWeekdayName() + " " + day + " " + this.getPersianMonthName() + " " + year;
    };
    
    // متد toShortPersianDate - تاریخ شمسی کوتاه
    Date.prototype.toShortPersianDate = function() {
        const parts = this.getPersianParts();
        return parts[0] + "/" + ("0" + parts[1]).slice(-2) + "/" + ("0" + parts[2]).slice(-2);
    };
    
    // متد toPersianISOString - تاریخ شمسی استاندارد
    Date.prototype.toPersianISOString = function() {
        const parts = this.getPersianParts();
        return parts[0] + "-" + ("0" + parts[1]).slice(-2) + "-" + ("0" + parts[2]).slice(-2);
    };
    
    // متد formatPersianDate - فرمت‌دهی پیشرفته تاریخ شمسی
    Date.prototype.formatPersianDate = function(format) {
        format = format || 'yyyy/mm/dd';
        const replacements = {
            'yyyy': this.getPersianFullYear().toString(),
            'yy': (this.getPersianFullYear() % 100).toString().padStart(2, '0'),
            'MMMM': this.getPersianMonthName(),
            'MMM': this.getPersianMonthName().substring(0, 3),
            'mm': this.getPersianMonth().toString().padStart(2, '0'),
            'm': this.getPersianMonth().toString(),
            'dd': this.getPersianDay().toString().padStart(2, '0'),
            'd': this.getPersianDay().toString(),
            'DDDD': this.getPersianWeekdayName(),
            'DDD': this.getPersianWeekdayName().substring(0, 3),
            'D': this.getPersianWeekday().toString()
        };
        
        return Object.keys(replacements).reduce(function(str, key) {
            return str.replace(new RegExp(key, 'g'), replacements[key]);
        }, format);
    };
    
    // متد addDays - نام دیگر برای addDay (برای سازگاری)
    Date.prototype.addDays = Date.prototype.addDay;
    
    // متد isPersianLeapYear - بررسی سال کبیسه شمسی (اصلاح شده)
    Date.prototype.isPersianLeapYear = function(year) {
        year = parseInt(year) || this.getPersianFullYear();
        const y = year - (year > 979 ? 979 : 0);
        const remainder = y % 33;
        return remainder === 1 || remainder === 5 || remainder === 9 || remainder === 13 || 
               remainder === 17 || remainder === 22 || remainder === 26 || remainder === 30;
    };
}

// اجرای راه‌اندازی
initializePersianDate();
