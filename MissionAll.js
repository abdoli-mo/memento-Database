//-------------28/02/1405 22:00----------------
/**
 * =============================================
 * بخش 0.0
 * 📖 راهنمای موتور جاوااسکریپت Rhino 1.7.15
 * =============================================
 * 
 * 🎯 Rhino چیست؟
 *   Rhino یک موتور جاوااسکریپت متن‌باز است که به زبان جاوا نوشته شده
 *   و توسط بنیاد موزیلا توسعه داده می‌شود. این موتور به شما امکان
 *   می‌دهد کدهای جاوااسکریپت را در محیط جاوا اجرا کنید.
 * 
 * =============================================
 * ✅ مواردی که در Rhino 1.7.15 به صورت NATIVE پشتیبانی می‌شوند
 * ============================================
 * 
 *   📌 ECMAScript 5:
 *      - تمام ویژگی‌های ES5 به طور کامل پشتیبانی می‌شود
 * 
 *   📌 توابع پیکانی (Arrow Functions):
 *      const add = (a, b) => a + b;
 * 
 *   📌 متغیرهای محلی:
 *      let x = 10;
 *      const y = 20;
 * 
 *   📌 رشته‌های قالبی (Template Literals):
 *      const msg = `Hello ${name}`;
 * 
 *   📌 ساختمان داده‌ها:
 *      - Map, Set, WeakMap, WeakSet
 * 
 *   📌 حلقه for...of:
 *      for (let item of array) { ... }  // با محدودیت روی Iterableها
 * 
 *   📌 متدهای آرایه:
 *      map, filter, reduce, forEach, find, findIndex, includes, flat (جزئی)
 * 
 *   📌 متدهای آبجکت:
 *      Object.keys, Object.values, Object.entries
 * 
 *   📌 متدهای رشته:
 *      includes, startsWith, endsWith, repeat
 * 
 * ==========================================
 * ❌ مواردی که در Rhino 1.7.15 پشتیبانی نمی‌شوند
 * =========================================
 * 
 *   1️⃣ Destructuring (تخریب ساختار)
 *      ❌ const { name, age } = obj;
 *      ✅ const name = obj.name; const age = obj.age;
 * 
 *   2️⃣ Spread Operator (عملگر گسترش)
 *      ❌ const newObj = { ...oldObj };
 *      ✅ const newObj = Object.assign({}, oldObj);
 *      ❌ const newArr = [...oldArr];
 *      ✅ const newArr = oldArr.slice();
 * 
 *   3️⃣ Optional Chaining (زنجیر اختیاری)
 *      ❌ const val = obj?.prop?.sub;
 *      ✅ const val = obj && obj.prop && obj.prop.sub;
 * 
 *   4️⃣ Default Parameters (پارامتر پیش‌فرض)
 *      ❌ function fn(a = 10) { ... }
 *      ✅ function fn(a) { a = (a !== undefined) ? a : 10; ... }
 * 
 *   5️⃣ Class (کلاس)
 *      ❌ class MyClass { constructor() {} }
 *      ✅ function MyClass() { ... }
 *      ✅ MyClass.prototype.method = function() { ... };
 * 
 *   6️⃣ Modules (ماژول‌ها)
 *      ❌ import { fn } from './file.js';
 *      ❌ export default fn;
 *      ✅ const fn = require('./file.js');  // فقط در محیط‌های خاص
 *      ✅ // یا بارگذاری دستی با load()
 * 
 *   7️⃣ Console (کنسول)
 *      ❌ console.log('msg');
 *      ✅ log('msg');  // تابع سفارشی (بخش 1.5)
 * 
 *   8️⃣ window / global / globalThis
 *      ❌ window.myVar = 10;
 *      ❌ global.myVar = 10;
 *      ✅ myVar = 10;  // تعریف مستقیم در بالاترین scope
 * 
 *   9️⃣ setTimeout / setInterval
 *      ❌ setTimeout(fn, 1000);
 *      ✅ نیاز به Polyfill دارد (بخش 1.2)
 * 
 *   1️⃣0️⃣ Promise
 *      ❌ new Promise((resolve, reject) => { ... });
 *      ✅ نیاز به Polyfill دارد (بخش 1.4)
 * 
 * ============================================
 * 🔧 نکات عملی برای کار با Rhino
 * ============================================
 * 
 *   📌 تعریف متغیر سراسری:
 *      globalVar = "value";  // بدون var/let/const
 * 
 *   📌 دسترسی به امکانات جاوا:
 *      const thread = new java.lang.Thread();
 *      const file = new java.io.File("test.txt");
 *      const date = new java.util.Date();
 * 
 *   📌 دیباگ (جایگزین console.log):
 *      function log(msg) { java.lang.System.out.println(msg); }
 *      // یا استفاده از توابع کتابخانه (بخش 1.5):
 *      logDebug('source', 'section', 'line', 'message');
 *      logInfo('source', 'section', 'line', 'message');
 *      logError('source', 'section', 'line', 'message');
 * 
 *   📌 اجرای کدها به ترتیب وابستگی:
 *      load("1.1_Init_Polyfills.js");
 *      load("1.2_Init_PersianDate.js");
 *      load("1.3_Utils_Main.js");
 *      load("1.4_Utils_Promise.js");
 *      load("1.5_Utils_Debug.js");
 *      load("3.1_Mission_Objects.js");
 *      load("3.2_Mission_Functions.js");
 * 
 *   📌 مدیریت حافظه:
 *      - WeakMap در Rhino کار می‌کند و برای کش خودکار مفید است
 *      - از تابع cleanupAllIntervals() برای پاک کردن اینتروال‌ها استفاده کنید
 * 
 * =============================================
 * 💡 توصیه‌های نهایی
 * =============================================
 * 
 *   1. همیشه قبل از استفاده از یک متد، بررسی کنید که به صورت native وجود دارد
 *   2. برای محیط‌های مختلف از ابزارهای ترنسپایلر مانند Babel استفاده کنید
 *   3. در Rhino از let/const در سطح محلی استفاده کنید
 *   4. برای متغیرهای سراسری از var یا بدون کلمه کلیدی استفاده کنید
 *   5. برای دیباگ از توابع سفارشی (log, logDebug, logError) استفاده کنید
 *   6. در صورت استفاده از تایمرها، پس از اتمام کار آن‌ها را پاک کنید
 *   7. از کش کردن محاسبات سنگین با WeakMap برای بهبود عملکرد استفاده کنید
 * 
 * =============================================
 * 📚 منابع مفید
 * ============================================
 * 
 *   📖 مستندات رسمی Rhino:
 *      https://developer.mozilla.org/en-US/docs/Rhino
 * 
 *   📖 تغییرات نسخه‌ها:
 *      https://github.com/mozilla/rhino/releases
 * 
 *   📖 سازگاری با ECMAScript:
 *      https://mozilla.github.io/rhino/compat/engines.html
 * 
 *   📖 راهنمای جاوااسکریپت:
 *      https://developer.mozilla.org/en-US/docs/Web/JavaScript
 * 
 * =============================================
 * 🆘 رفع اشکال (Troubleshooting)
 * ============================================
 * 
 *   ❌ خطا: "TypeError: [function] is not a function"
 *      → راه‌حل: متد مورد نظر وجود ندارد، Polyfill مربوطه را بارگذاری کنید
 * 
 *   ❌ خطا: "SyntaxError: missing ; before statement"
 *      → راه‌حل: از Destructuring یا Spread Operator استفاده نکنید
 *  =============================================
**/
/**
 * ============================================================
 * بخش 1.1
 * 🔧 Polyfills برای موتور جاوااسکریپت Rhino 1.7.15
 * ============================================================
 * 
 * 🎯 هدف: افزودن متدهای缺失 به محیط Rhino
 * 📅 آخرین به‌روزرسانی: ۱۴۰۵/۰۲/۳۱
 * 👤 نویسنده: تیم توسعه
 * 
 * 📌 Polyfill های ارائه شده:
 *   - Array.from        - تبدیل array-like به آرایه واقعی
 *   - Array.prototype.max - پیدا کردن بزرگترین مقدار
 *   - Array.prototype.min - پیدا کردن کوچکترین مقدار
 *   - setTimeout        - اجرای تابع پس از تاخیر (با Thread)
 *   - clearTimeout      - لغو تایمر
 *   - setInterval       - اجرای دوره‌ای تابع
 *   - clearInterval     - لغو اینتروال
 *   - cleanupAllIntervals - پاک کردن تمام اینتروال‌ها
 * 
 * ⚠️ وابستگی‌ها: بدون وابستگی
 * 
 * ============================================================
 */
// ========== Array.from ==========
if (!Array.from) {
    Array.from = function(arrayLike, mapFn, thisArg) {
        if (arrayLike == null) {
            throw new TypeError('Array.from requires an array-like object');
        }
        const items = Object(arrayLike);
        const len = items.length >>> 0;
        const result = new Array(len);
        for (let i = 0; i < len; i++) {
            let value = items[i];
            if (mapFn) {
                value = mapFn.call(thisArg, value, i);
            }
            result[i] = value;
        }
        return result;
    };
}

// ========== Array.prototype.max ==========
if (!Array.prototype.max) {
    Array.prototype.max = function() {
        if (this.length === 0) return undefined;
        return Math.max.apply(null, this);
    };
}

// ========== Array.prototype.min ==========
if (!Array.prototype.min) {
    Array.prototype.min = function() {
        if (this.length === 0) return undefined;
        return Math.min.apply(null, this);
    };
}

// =============================================
// ⏱️ توابع زمانبندی (جاوا) - نیاز به Function Expression به دلیل arguments
// =============================================

/**
 * اجرای تابع پس از تاخیر مشخص (جاوا)
 * @param {Function} callback - تابع برگشتی
 * @param {number} delay - تاخیر به میلی‌ثانیه
 * @returns {java.lang.Thread} نخ ایجاد شده
 */
function setTimeout(callback, delay) {
    const args = Array.prototype.slice.call(arguments, 2);
    const thread = new java.lang.Thread({
        run: function() {
            try {
                java.lang.Thread.sleep(delay);
                callback.apply(null, args);
            } catch(e) {
                // نخ interrupted
            }
        }
    });
    thread.start();
    return thread;
};

/**
 * لغو اجرای setTimeout
 * @param {java.lang.Thread} thread - نخ ایجاد شده توسط setTimeout
 */
function clearTimeout(thread) {
    if (thread && thread.isAlive()) {
        try {
            thread.interrupt();
            thread.join(100);
        } catch(e) {
            // خطای لغو
        }
    }
};

// ذخیره اینتروال‌های فعال
if (typeof _activeIntervals === 'undefined') {
  activeIntervals = [];
}

/**
 * اجرای تابع به صورت دوره‌ای (جاوا)
 * @param {Function} callback - تابع برگشتی
 * @param {number} delay - فاصله زمانی به میلی‌ثانیه
 * @returns {Object} آبجکت اینتروال با متد stop()
 */
function setInterval(callback, delay) {
    const args = Array.prototype.slice.call(arguments, 2);
    let running = true;
    
    const thread = new java.lang.Thread({
        run: function() {
            while (running) {
                try {
                    java.lang.Thread.sleep(delay);
                    if (running) {
                        callback.apply(null, args);
                    }
                } catch(e) {
                    break;
                }
            }
        }
    });
    
    const intervalObj = {
        thread: thread,
        stop: function() {
            running = false;
            try {
                if (this.thread && this.thread.isAlive()) {
                    this.thread.interrupt();
                    this.thread.join(100);
                }
            } catch(e) {
                // خطای توقف
            }
            const idx = activeIntervals.indexOf(intervalObj);
            if (idx > -1) {
                activeIntervals.splice(idx, 1);
            }
        }
    };
    
    activeIntervals.push(intervalObj);
    thread.start();
    return intervalObj;
};

/**
 * لغو اجرای setInterval
 * @param {Object} interval - آبجکت اینتروال برگشتی از setInterval
 */
function clearInterval(interval) {
    if (interval && interval.stop) {
        interval.stop();
    }
};

/**
 * پاک کردن تمام اینتروال‌های فعال
 */
function cleanupAllIntervals() {
    while (activeIntervals.length > 0) {
        const interval = activeIntervals[0];
        if (interval && interval.stop) {
            interval.stop();
        }
    }
};
/**
 * ============================================
 * بخش 1.2
 * 🗓️ توابع تاریخ شمسی (Persian Date)
 * ============================================
 * 
 * 🎯 هدف: افزودن متدهای تاریخ شمسی به Date.prototype
 * 📅 آخرین به‌روزرسانی: ۱۴۰۵/۰۲/۳۱
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

// ✅ بررسی وجود متغیر قبل از تعریف (قابل فراخوانی چندباره)
if (typeof _persianCache === 'undefined') {
     _persianCache = new WeakMap();
}

// ✅ بررسی وجود متدها قبل از افزودن (جلوگیری از بازنویسی)
if (!Date.prototype.getPersianDate) {
    initializePersianDate();
}

function initializePersianDate() {
    // متد addDay - اضافه کردن روز به تاریخ
    if (!Date.prototype.addDay) {
        Date.prototype.addDay = function(days) {
            const date = new Date(this.valueOf());
            date.setDate(this.getDate() + Number(days));
            return date;
        };
    }
    
    // متد setPersianDate - تنظیم تاریخ شمسی
    if (!Date.prototype.setPersianDate) {
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
    }
    
    // متد getPersianParts - دریافت اجزای تاریخ شمسی با کش ساده
    if (!Date.prototype.getPersianParts) {
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
    }
    
    // متد getPersianWeekday - دریافت روز هفته شمسی (1=شنبه تا 7=جمعه)
    if (!Date.prototype.getPersianWeekday) {
        Date.prototype.getPersianWeekday = function() {
            return (((this.getDay() + 1) % 7) + 1);
        };
    }
    
    // متد getPersianDay - دریافت روز شمسی
    if (!Date.prototype.getPersianDay) {
        Date.prototype.getPersianDay = function() {
            return +this.getPersianParts()[2];
        };
    }
    
    // متد getPersianMonth - دریافت ماه شمسی
    if (!Date.prototype.getPersianMonth) {
        Date.prototype.getPersianMonth = function() {
            return +this.getPersianParts()[1];
        };
    }
    
    // متد getPersianYear - دریافت سال شمسی
    if (!Date.prototype.getPersianYear) {
        Date.prototype.getPersianYear = function() {
            return +this.getPersianParts()[0];
        };
    }
    
    // متد getPersianWeekdayName - دریافت نام روز هفته
    if (!Date.prototype.getPersianWeekdayName) {
        Date.prototype.getPersianWeekdayName = function() {
            const weekDaynames = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
            return weekDaynames[this.getPersianWeekday() - 1];
        };
    }
    
    // متد getPersianMonthName - دریافت نام ماه شمسی
    if (!Date.prototype.getPersianMonthName) {
        Date.prototype.getPersianMonthName = function() {
            const monthNames = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
            const parts = this.getPersianParts();
            return monthNames[parts[1] - 1];
        };
    }
    
    // متد getDateWithoutTime - دریافت تاریخ بدون زمان با اعتبارسنجی
    if (!Date.prototype.getDateWithoutTime) {
        Date.prototype.getDateWithoutTime = function() {
            if (!(this instanceof Date) || isNaN(this.getTime())) {
                return null;
            }
            const date = new Date(this);
            date.setHours(0, 0, 0, 0);
            return date;
        };
    }
    
    // متد getPersianDate - دریافت تاریخ شمسی فرمت‌شده
    if (!Date.prototype.getPersianDate) {
        Date.prototype.getPersianDate = function() {
            const d = this.getPersianParts();
            const persianDate = (d[0] + "/" + ("0" + d[1]).slice(-2) + "/" + ("0" + d[2]).slice(-2));
            return persianDate.replace(/([0-9])/g, function(token) {
                return String.fromCharCode(token.charCodeAt(0) + 1728);
            });
        };
    }
    
    // متد getPersianFullYear - دریافت سال کامل شمسی
    if (!Date.prototype.getPersianFullYear) {
        Date.prototype.getPersianFullYear = function() {
            return this.getPersianParts()[0];
        };
    }
    
    // متد toPersianDateString - رشته تاریخ شمسی کامل با اعداد فارسی
    if (!Date.prototype.toPersianDateString) {
        Date.prototype.toPersianDateString = function() {
            const day = this.getPersianDay().toString().replace(/\d/g, function(token) {
                return String.fromCharCode(token.charCodeAt(0) + 1728);
            });
            const year = this.getPersianFullYear().toString().replace(/\d/g, function(token) {
                return String.fromCharCode(token.charCodeAt(0) + 1728);
            });
            return this.getPersianWeekdayName() + " " + day + " " + this.getPersianMonthName() + " " + year;
        };
    }
    
    // متد toShortPersianDate - تاریخ شمسی کوتاه
    if (!Date.prototype.toShortPersianDate) {
        Date.prototype.toShortPersianDate = function() {
            const parts = this.getPersianParts();
            return parts[0] + "/" + ("0" + parts[1]).slice(-2) + "/" + ("0" + parts[2]).slice(-2);
        };
    }
    
    // متد toPersianISOString - تاریخ شمسی استاندارد
    if (!Date.prototype.toPersianISOString) {
        Date.prototype.toPersianISOString = function() {
            const parts = this.getPersianParts();
            return parts[0] + "-" + ("0" + parts[1]).slice(-2) + "-" + ("0" + parts[2]).slice(-2);
        };
    }
    
    // متد formatPersianDate - فرمت‌دهی پیشرفته تاریخ شمسی
    if (!Date.prototype.formatPersianDate) {
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
    }
    
    // متد addDays - نام دیگر برای addDay (برای سازگاری)
    if (!Date.prototype.addDays) {
        Date.prototype.addDays = Date.prototype.addDay;
    }
    
    // متد isPersianLeapYear - بررسی سال کبیسه شمسی (اصلاح شده)
    if (!Date.prototype.isPersianLeapYear) {
        Date.prototype.isPersianLeapYear = function(year) {
            year = parseInt(year) || this.getPersianFullYear();
            const y = year - (year > 979 ? 979 : 0);
            const remainder = y % 33;
            return remainder === 1 || remainder === 5 || remainder === 9 || remainder === 13 || 
                   remainder === 17 || remainder === 22 || remainder === 26 || remainder === 30;
        };
    }
}

// اجرای راه‌اندازی (در صورت نیاز)
if (typeof initializePersianDate === 'function') {
    initializePersianDate();
}


/**
 * ============================================================
 * بخش 1.3
 * 🛠️ توابع کمکی عمومی (Utility Functions)
 * ============================================================
 * 
 * 🎯 هدف: ارائه توابع پرکاربرد و عمومی
 * 📅 آخرین به‌روزرسانی: ۱۴۰۵/۰۲/۳۱
 * 👤 نویسنده: تیم توسعه
 * 
 * 📌 توابع ارائه شده:
 *   - toFarsiNumber()    - تبدیل اعداد به فارسی (مستقل)
 *   - time()             - استخراج ساعت و دقیقه
 *   - sleep()            - توقف اجرا (همگام/ناهمگام)
 *   - sleepThen()        - اجرا پس از تاخیر
 *   - roundUp()          - گرد کردن رو به بالا
 *   - uniqAndSort()      - حذف تکراری و مرتب‌سازی
 *   - sorted()           - مرتب‌سازی بدون تغییر اصلی
 *   - quantile()         - محاسبه کوانتیل
 *   - ranking()          - رتبه‌بندی مقادیر
 *   - addDirectionControl() - کنترل جهت متن (RTL/LTR)
 *   - csvToMarkdown()    - تبدیل CSV به جدول Markdown
 * 
 * ⚠️ وابستگی‌ها: بخش 1.1 (Polyfill ها)
 * 
 * 📌 نکات فنی:
 *   - تابع toFarsiNumber مستقل است و از جایگزینی یونیکد (1728+) استفاده می‌کند
 *   - تابع sleep ابتدا Thread.sleep جاوا را امتحان می‌کند، سپس Promise و در نهایت busy-wait
 *   - تابع csvToMarkdown از polyfill های آرایه (flat, flatMap) استفاده می‌کند
 * 
 * ============================================================
 */
/**
 * تبدیل اعداد انگلیسی به فارسی
 * @param {number|string} num - عدد یا رشته حاوی عدد
 * @returns {string} عدد به صورت فارسی
 */
 
function toFarsiNumber(num) {
    if (num === null || num === undefined) return '';
    return num.toString().replace(/\d/g, function(token) {
        return String.fromCharCode(token.charCodeAt(0) + 1728);
    });
};

/**
 * استخراج ساعت و دقیقه از شیء Date
 * @param {Date} t - شیء تاریخ
 * @returns {string} زمان به فرمت HH:MM
 */
function time(t) {
    if (!(t instanceof Date) || isNaN(t.getTime())) return '';
    const hours = t.getHours().toString().padStart(2, '0');
    const minutes = t.getMinutes().toString().padStart(2, '0');
    return hours + ':' + minutes;
};

/**
 * توقف اجرا به مدت مشخص (اولویت با Thread.sleep جاوا)
 * @param {number} ms - مدت زمان توقف به میلی‌ثانیه
 * @returns {Promise|void} اگر در محیط Promise وجود داشته باشد
 */
function sleep (ms) {
    try {
        java.lang.Thread.sleep(ms);
        return;
    } catch (e) {
        // ادامه به روش دوم
    }
    if (typeof Promise !== 'undefined') {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }
    const start = Date.now();
    while (Date.now() - start < ms) {
        // busy-wait fallback
    }
};

/**
 * اجرای تابع پس از تاخیر بدون قفل کردن
 * @param {Function} callback - تابعی که بعد از تاخیر اجرا شود
 * @param {number} ms - مدت زمان تاخیر به میلی‌ثانیه
 */
function sleepThen(callback, ms) {
    setTimeout(callback, ms);
};

/**
 * گرد کردن رو به بالا با دقت مشخص
 * @param {number} num - عدد ورودی
 * @param {number} precision - تعداد رقم اعشار
 * @returns {number} عدد گرد شده رو به بالا
 */
function roundUp(num, precision)  {
    let prec = precision;
    if (prec === undefined) prec = 0;
    const factor = Math.pow(10, prec);
    return Math.ceil(num * factor) / factor;
};

// ===========================================
// 🧮 توابع کار با آرایه (Array Utilities)
// ===========================================

/**
 * حذف مقادیر تکراری و مرتب‌سازی آرایه
 * @param {Array} arr - آرایه ورودی
 * @returns {Array} آرایه بدون تکرار و مرتب شده
 */
function uniqAndSort(arr) {
    if (!Array.isArray(arr)) return [];
    const unique = [];
    const seen = {};
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (!seen[item]) {
            seen[item] = true;
            unique.push(item);
        }
    }
    return unique.sort(function(a, b) { return a - b; });
};

/**
 * مرتب‌سازی آرایه بدون تغییر آرایه اصلی
 * @param {Array} arr - آرایه ورودی
 * @returns {Array} آرایه مرتب شده جدید
 */
function sorted (arr) {
    if (!Array.isArray(arr)) return [];
    return arr.slice().sort(function(a, b) { return a - b; });
};

/**
 * محاسبه کوانتیل (صدک) یک آرایه
 * @param {Array} arr - آرایه اعداد
 * @param {number} q - مقدار کوانتیل (بین 0 تا 1)
 * @param {boolean} isSorted - آیا آرایه از قبل مرتب شده است؟
 * @returns {number} مقدار کوانتیل
 */
function quantile(arr, q, isSorted) {
    // اعتبارسنجی ورودی
    if (!arr || !Array.isArray(arr) || arr.length === 0) {
        return 0;
    }
    
    // اعتبارسنجی مقدار q
    q = Math.max(0, Math.min(1, q));
    
    let sortedArr;
    if (isSorted === true) {
        sortedArr = arr;
    } else {
        sortedArr = arr.slice().sort(function(a, b) { return a - b; });
    }
    
    const pos = (sortedArr.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    
    if (sortedArr[base + 1] !== undefined) {
        return sortedArr[base] + rest * (sortedArr[base + 1] - sortedArr[base]);
    }
    return sortedArr[base];
}

/**
 * رتبه‌بندی مقادیر در آرایه
 * @param {Array} arr - آرایه ورودی
 * @param {Function} compFn - تابع مقایسه (پیش‌فرض: <=)
 * @returns {Array} آرایه رتبه‌ها
 */
function ranking(arr, compFn) {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    let compare = compFn;
    if (compare === undefined) {
        compare = function(a, b) { return a <= b; };
    }
    return arr.map(function(a) {
        return arr.filter(function(b) { return compare(a, b); }).length;
    });
};

// =============================================
// 🌐  توابع رشته و جهت و ایجاد مارک دان (String & Direction - Markdown)
// =============================================

/**
 * اضافه کردن کنترل جهت (RTL/LTR) به ابتدای هر خط
 * @param {string} text - متن ورودی
 * @param {string} direction - جهت: 'ltr' یا 'rtl'
 * @returns {string} متن با کاراکتر کنترل جهت
 */
function addDirectionControl(text, direction){
    let dir = direction;
    if (dir === undefined) dir = 'ltr';
    const controlChar = (dir === 'rtl') ? '\u200F' : '\u200E';
    const lines = text.split('\n');
    const controlledLines = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim()) {
            controlledLines.push(controlChar + line);
        } else {
            controlledLines.push('');
        }
    }
    return controlledLines.join('\n');
};


/** Converts CSV to Markdown Table
* @param {string} csvContent - The string content of the CSV
* @param {Object} options - Formatting options
* @param {string} [options.delimiter=","] - CSV column delimiter character
* @param {boolean|number} [options.hasHeader=false] - Use first row(s) as header
* @param {boolean} [options.compact=false] - Use compact spacing (no extra padding)
* @param {boolean} [options.separatorBetweenRows=false] - Add separator between data rows
* @param {string} [options.textDirection="ltr"] - Text direction: "ltr" or "rtl"
* @param {string} [options.breakLine=null] - Character for manual line breaks in text
* @param {number} [options.maxWidth=0] - Maximum total table width (0 = auto)
* @param {Array|Object} [options.columnMaxWidth=null] - Maximum column widths
* @returns {string}
*/
function csvToMarkdown(csvContent, options) {
    options = options || {};
    const delimiter = options.delimiter || ",";
    const hasHeader = options.hasHeader || true;
    const compact = options.compact || false;
    const separatorBetweenRows = options.separatorBetweenRows || false;
    const textDirection = options.textDirection || 'ltr';
    
    // اینجا اضافه شود:
    logDebug('csvToMarkdown', 'options', '600', 
        `تبدیل CSV: delimiter=${delimiter}, hasHeader=${hasHeader}, compact=${compact}`);
    
    // option های جدید
    const breakLine = options.breakLine || null;
    const maxWidth = options.maxWidth || 0;
    const columnMaxWidth = options.columnMaxWidth || null;
    
    // مدیریت multi header
    let headerRowsCount;
    if (typeof hasHeader === 'number' && hasHeader > 0) {
        headerRowsCount = hasHeader;
    } else if (hasHeader === true) {
        headerRowsCount = 1;
    } else {
        headerRowsCount = 0;
    }
    
    const hasAnyHeader = headerRowsCount > 0;

    if (delimiter != "\t") {
        csvContent = csvContent.replace(/\t/g, "    ");
    }
    
    const columns = csvContent.split("\n").filter(function(row) { return row.trim(); });
    
    // اینجا اضافه شود:
    logInfo('csvToMarkdown', 'dimensions', '605', 
        `جدول: ${columns.length} ردیف`);
    
    const splitColumns = "|";
    const tabularData = [];
    const maxRowLen = [];

    // پردازش داده‌ها و محاسبه عرض ستون‌ها
    columns.forEach(function(e, i) {
        if (typeof tabularData[i] == "undefined") {
            tabularData[i] = [];
        }

        const row = e.split(delimiter);

        row.forEach(function(ee, ii) {
            let cell = ee.trim();
            
            // حذف کوتیشن‌های اضافی از ابتدا و انتها
            if (cell.startsWith('"') && cell.endsWith('"')) {
                cell = cell.substring(1, cell.length - 1);
            }
            
            // اعمال breakLine اگر فعال باشد
            if (breakLine && cell.includes(breakLine)) {
                let lines = cell.split(breakLine);
                cell = lines.join('\n');
            }
            
            if (typeof maxRowLen[ii] == "undefined") {
                maxRowLen[ii] = 0;
            }

            // محاسبه طول بلندترین خط در سلول
            let lines = cell.split('\n');
            let maxCellLength = 0;
            lines.forEach(function(line) {
                const cleanLine = line.replace(/[\u200E\u200F]/g, '').trim();
                maxCellLength = Math.max(maxCellLength, cleanLine.length);
            });
            
            maxRowLen[ii] = Math.max(maxRowLen[ii], maxCellLength);
            tabularData[i][ii] = cell;
        });
    });

    // اینجا اضافه شود:
    logDebug('csvToMarkdown', 'columns', '610', 
        `ستون‌ها: ${maxRowLen.length} ستون, عرض‌ها: ${maxRowLen.join(',')}`);

    // اعمال محدودیت‌های عرض ستون‌ها
    if (columnMaxWidth) {
        if (Array.isArray(columnMaxWidth)) {
            // حالت آرایه: [25, 50, 20]
            maxRowLen.forEach(function(len, index) {
                if (columnMaxWidth[index] !== undefined && len > columnMaxWidth[index]) {
                    maxRowLen[index] = columnMaxWidth[index];
                }
            });
        } else if (typeof columnMaxWidth === 'object') {
            // حالت آبجکت: {0: 25, 1: 50, 2: 20}
            maxRowLen.forEach(function(len, index) {
                if (columnMaxWidth[index] !== undefined && len > columnMaxWidth[index]) {
                    maxRowLen[index] = columnMaxWidth[index];
                }
            });
        }
        
        // اینجا اضافه شود:
        logDebug('csvToMarkdown', 'limits', '615', 
            `محدودیت ستون‌ها اعمال شد`);
    }
    
    // اعمال محدودیت عرض کلی جدول
    if (maxWidth > 0) {
        const separatorCount = maxRowLen.length + 1;
        const paddingCount = compact ? 0 : maxRowLen.length * 2;
        const currentTotalWidth = maxRowLen.reduce(function(sum, len) {
            return sum + len;
        }, 0) + separatorCount + paddingCount;
        
        if (currentTotalWidth > maxWidth) {
            const availableWidth = maxWidth - separatorCount - paddingCount;
            const totalContentWidth = maxRowLen.reduce(function(sum, len) { return sum + len; }, 0);
            const ratio = availableWidth / totalContentWidth;
            
            maxRowLen.forEach(function(len, index) {
                maxRowLen[index] = Math.max(3, Math.floor(len * ratio));
            });
            
            // اینجا اضافه شود:
            logDebug('csvToMarkdown', 'widthLimit', '1280', 
                `محدودیت عرض کلی اعمال شد: ${currentTotalWidth} → ${maxWidth}`);
        }
    }

    // تابع برای شکستن کلمات طولانی
    const wrapText = function(text, maxLength) {
    if (text.length <= maxLength) return [text];
    
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(function(word) {
        // اگر کلمه خیلی طولانی است، آن را بشکن
        if (word.length >= maxLength) {
            // خط فعلی را ذخیره کن
            if (currentLine) {
                lines.push(currentLine.trim());
                currentLine = '';
            }
            // شکستن کلمه طولانی
            const parts = word.match(new RegExp('.{1,' + maxLength + '}', 'g')) || [word];
            parts.forEach(function(part) {
                lines.push(part);
            });
        } else {
            // کلمه عادی
            const potentialLine = currentLine ? currentLine + ' ' + word : word;
            if (potentialLine.length > maxLength) {
                if (currentLine) {
                    lines.push(currentLine.trim());
                }
                currentLine = word;
            } else {
                currentLine = potentialLine;
            }
        }
    });
    
    // خط آخر را اضافه کن
    if (currentLine) {
        lines.push(currentLine.trim());
    }

    // ترکیب خطوط کوتاه مجاور
    let i = 0;
    while (i < lines.length - 1) {
        if (lines[i].length + 1 + lines[i + 1].length <= maxLength) {
            lines[i] = lines[i] + ' ' + lines[i + 1];
            lines.splice(i + 1, 1);
        } else {
            i++;
        }
    }
    
    return lines;
};
    // تولید خط جداکننده
    let separatorOutput = "";
    maxRowLen.forEach(function(len) {
        const lineLength = len + (compact ? 0 : 2);
        const dashLine = Array(lineLength + 1).join("-");
        separatorOutput += splitColumns + dashLine;
    });
    separatorOutput += splitColumns + "\n";

    let headerOutput = "";
    let rowOutput = "";
    let remainingHeaderRows = headerRowsCount;
    
    // تولید ردیف‌ها
    tabularData.forEach(function(row, rowIndex) {
        // پردازش هر سلول و شکستن کلمات طولانی
        const processedRow = [];
        let maxLinesInRow = 1;
        
        row.forEach(function(cell, colIndex) {
            const maxColWidth = maxRowLen[colIndex];
            const cellLines = cell.split('\n');
            let allWrappedLines = [];
            
            cellLines.forEach(function(line) {
                const wrappedLines = wrapText(line, maxColWidth);
                allWrappedLines = allWrappedLines.concat(wrappedLines);
            });
            
            processedRow.push(allWrappedLines);
            maxLinesInRow = Math.max(maxLinesInRow, allWrappedLines.length);
        });
        
        // تولید هر خط از ردیف
        for (let lineIndex = 0; lineIndex < maxLinesInRow; lineIndex++) {
            let line = "";
            maxRowLen.forEach(function(len, colIndex) {
                const cellLines = processedRow[colIndex];
                const currentLine = cellLines[lineIndex] || "";
                const cleanCurrentLine = currentLine.replace(/[\u200E\u200F]/g, '').trim();
                
                const spacingLength = Math.max(0, len - cleanCurrentLine.length);
                const spacing = Array(spacingLength + 1).join(" ");
                
                const cellContent = textDirection === 'rtl' ? spacing + currentLine : currentLine + spacing;
                line += splitColumns + (compact ? "" : " ") + cellContent + (compact ? "" : " ");
            });
            
            line += splitColumns + "\n";
            
            if (remainingHeaderRows > 0) {
                headerOutput += line;
            } else {
                rowOutput += line;
            }
        }
        
        if (remainingHeaderRows > 0) {
            remainingHeaderRows--;
            // اگر آخرین ردیف هدر است، خط جداکننده اضافه کن
            if (remainingHeaderRows === 0) {
                headerOutput += separatorOutput;
            }
        } else {
            if (separatorBetweenRows && rowIndex < tabularData.length - 1) {
                rowOutput += separatorOutput;
            }
        }
    });

    const finalTable = headerOutput + (hasAnyHeader && remainingHeaderRows === 0 ? "" : separatorOutput) + rowOutput;
    
    // اعمال کنترل جهت به کل خروجی
    const controlChar = textDirection === 'rtl' ? '\u200F' : '\u200E';
    const lines = finalTable.split('\n');
    const controlledLines = [];
    
    lines.forEach(function(line) {
        if (line.trim()) {
            controlledLines.push(controlChar + line);
        } else {
            controlledLines.push('');
        }
    });
    
    // اینجا اضافه شود:
    logInfo('csvToMarkdown', 'complete', '630', 
        `اتمام تبدیل: ${columns.length} ردیف به Markdown`);
    
    return controlledLines.join('\n');
}


/**
 * ============================================================
 * بخش 1.4
 * ⏱️ پیاده‌سازی کامل Promise برای Rhino
 * ============================================================
 * 
 * 🎯 هدف: افزودن Promise و متدهای پیشرفته به محیط Rhino
 * 📅 آخرین به‌روزرسانی: ۱۴۰۵/۰۲/۳۱
 * 👤 نویسنده: تیم توسعه
 * 
 * 📌 متدهای ارائه شده:
 *   - Promise            - سازنده اصلی
 *   - then/catch/finally - متدهای نمونه
 *   - resolve/reject     - متدهای ایستا
 *   - all/race/any/allSettled - ترکیب‌کننده‌ها
 *   - delay/timeout      - تاخیر و محدودیت زمان
 *   - retry/sequential/parallel - الگوهای اجرا
 *   - cancellable/promisify - قابلیت‌های پیشرفته
 *   - map/reduce/props   - پردازش مجموعه‌ها
 *   - debounce/queue/pipeline - ابزارهای کاربردی
 * 
 * ⚠️ وابستگی‌ها: بخش 1.1 (setTimeout)
 * 
 * ============================================================
 */
(function() {
    
    'use strict';
    
    // ثابت‌های وضعیت Promise
    var PENDING = 'pending';
    var FULFILLED = 'fulfilled';
    var REJECTED = 'rejected';
    
    // بررسی thenable بودن
    function isThenable(value) {
        return value && (typeof value === 'object' || typeof value === 'function') 
               && typeof value.then === 'function';
    }
    
    // بررسی آرایه بودن
    function isArray(value) {
        return Array.isArray(value);
    }
    
    /**
     * سازنده اصلی Promise با پشتیبانی از همگام‌سازی
     */
    function Promise(executor) {
        var self = this;
        var lock = new java.util.concurrent.locks.ReentrantLock();
        
        if (typeof executor !== 'function') {
            throw new TypeError('Promise executor is not a function');
        }
        
        self._state = PENDING;
        self._value = undefined;
        self._reason = undefined;
        self._callbacks = [];
        self._handled = false;
        self._lock = lock;
        
        function safeExecute(fn, fallback) {
            return function(value) {
                var release = lock;
                try {
                    release = self._lock;
                    self._lock.lock();
                    fn(value);
                } catch(e) {
                    if (fallback) fallback(e);
                } finally {
                    if (release) release.unlock();
                }
            };
        }
        
        function resolve(value) {
            if (self._state !== PENDING) return;
            
            if (value === self) {
                reject(new TypeError('A promise cannot be resolved with itself'));
                return;
            }
            
            if (isThenable(value)) {
                try {
                    value.then(safeExecute(resolve), safeExecute(reject));
                } catch(e) {
                    reject(e);
                }
                return;
            }
            
            self._state = FULFILLED;
            self._value = value;
            self._executeCallbacks();
        }
        
        function reject(reason) {
            if (self._state !== PENDING) return;
            
            self._state = REJECTED;
            self._reason = reason;
            self._executeCallbacks();
            
            if (!self._handled && !Promise._suppressWarnings) {
                setTimeout(function() {
                    if (!self._handled) {
                        try {
                            log('WARNING: Unhandled promise rejection: ' + 
                                (reason && reason.message ? reason.message : reason));
                        } catch(e) {}
                    }
                }, 0);
            }
        }
        
        self._executeCallbacks = function() {
            if (self._state === PENDING) return;
            
            var callbacks = self._callbacks;
            self._callbacks = [];
            
            if (callbacks.length === 0) return;
            
            setTimeout(function() {
                for (var i = 0; i < callbacks.length; i++) {
                    var cb = callbacks[i];
                    try {
                        if (self._state === FULFILLED && cb.onFulfilled) {
                            cb.onFulfilled(self._value);
                        } else if (self._state === REJECTED && cb.onRejected) {
                            cb.onRejected(self._reason);
                        }
                    } catch(e) {
                        try { log('ERROR in promise callback: ' + (e.message || e)); } catch(ex) {}
                    }
                }
            }, 0);
        };
        
        try {
            executor(
                function(v) { safeExecute(resolve)(v); },
                function(r) { safeExecute(reject)(r); }
            );
        } catch(e) {
            reject(e);
        }
    }
    
    // =====================================
    // Instance Methods
    // =====================================
    
    Promise.prototype.then = function(onFulfilled, onRejected) {
        var self = this;
        
        if (typeof onRejected === 'function') {
            self._handled = true;
        }
        
        return new Promise(function(resolve, reject) {
            
            function handle(callback, value, fallback) {
                setTimeout(function() {
                    try {
                        if (typeof callback === 'function') {
                            var result = callback(value);
                            if (isThenable(result)) {
                                result.then(resolve, reject);
                            } else {
                                resolve(result);
                            }
                        } else {
                            fallback(value);
                        }
                    } catch(e) {
                        reject(e);
                    }
                }, 0);
            }
            
            self._lock.lock();
            try {
                if (self._state === FULFILLED) {
                    handle(onFulfilled, self._value, resolve);
                } else if (self._state === REJECTED) {
                    handle(onRejected, self._reason, reject);
                } else {
                    self._callbacks.push({
                        onFulfilled: function(value) { 
                            handle(onFulfilled, value, resolve); 
                        },
                        onRejected: function(reason) { 
                            handle(onRejected, reason, reject); 
                        }
                    });
                }
            } finally {
                self._lock.unlock();
            }
        });
    };
    
    Promise.prototype.catch = function(onRejected) {
        return this.then(null, onRejected);
    };
    
    Promise.prototype.finally = function(onFinally) {
        return this.then(
            function(value) {
                return Promise.resolve(onFinally ? onFinally() : null)
                    .then(function() { return value; });
            },
            function(reason) {
                return Promise.resolve(onFinally ? onFinally() : null)
                    .then(function() { throw reason; });
            }
        );
    };
    
    // ============================================
    // Static Methods - Core
    // ============================================
    
    Promise.resolve = function(value) {
        if (value instanceof Promise) return value;
        if (isThenable(value)) {
            return new Promise(function(resolve, reject) {
                value.then(resolve, reject);
            });
        }
        return new Promise(function(resolve) { resolve(value); });
    };
    
    Promise.reject = function(reason) {
        return new Promise(function(resolve, reject) { reject(reason); });
    };
    
    Promise.all = function(promises) {
        return new Promise(function(resolve, reject) {
            if (!isArray(promises)) {
                reject(new TypeError('Promise.all requires an array'));
                return;
            }
            
            var length = promises.length;
            if (length === 0) {
                resolve([]);
                return;
            }
            
            var results = new Array(length);
            var completed = 0;
            var settled = false;
            
            for (var i = 0; i < length; i++) {
                (function(index) {
                    Promise.resolve(promises[index]).then(function(value) {
                        if (settled) return;
                        results[index] = value;
                        completed++;
                        if (completed === length) {
                            settled = true;
                            resolve(results);
                        }
                    }, function(reason) {
                        if (!settled) {
                            settled = true;
                            reject(reason);
                        }
                    });
                })(i);
            }
        });
    };
    
    Promise.allSettled = function(promises) {
        return new Promise(function(resolve) {
            if (!isArray(promises)) {
                throw new TypeError('Promise.allSettled requires an array');
            }
            
            var length = promises.length;
            if (length === 0) {
                resolve([]);
                return;
            }
            
            var results = new Array(length);
            var completed = 0;
            
            for (var i = 0; i < length; i++) {
                (function(index) {
                    Promise.resolve(promises[index]).then(
                        function(value) {
                            results[index] = { status: FULFILLED, value: value };
                            completed++;
                            if (completed === length) resolve(results);
                        },
                        function(reason) {
                            results[index] = { status: REJECTED, reason: reason };
                            completed++;
                            if (completed === length) resolve(results);
                        }
                    );
                })(i);
            }
        });
    };
    
    Promise.race = function(promises) {
        return new Promise(function(resolve, reject) {
            if (!isArray(promises)) {
                reject(new TypeError('Promise.race requires an array'));
                return;
            }
            if (promises.length === 0) {
              return;
            }
            var settled = false;
            
            for (var i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(
                    function(value) {
                        if (!settled) {
                            settled = true;
                            resolve(value);
                        }
                    },
                    function(reason) {
                        if (!settled) {
                            settled = true;
                            reject(reason);
                        }
                    }
                );
            }
        });
    };
    
    Promise.any = function(promises) {
        return new Promise(function(resolve, reject) {
            if (!isArray(promises)) {
                reject(new TypeError('Promise.any requires an array'));
                return;
            }
            
            var length = promises.length;
            if (length === 0) {
                reject(new Error('All promises were rejected'));
                return;
            }
            
            var errors = new Array(length);
            var rejectedCount = 0;
            var settled = false;
            
            for (var i = 0; i < length; i++) {
                (function(index) {
                    Promise.resolve(promises[index]).then(
                        function(value) {
                            if (!settled) {
                                settled = true;
                                resolve(value);
                            }
                        },
                        function(reason) {
                            if (!settled) {
                                errors[index] = reason;
                                rejectedCount++;
                                if (rejectedCount === length) {
                                    settled = true;
                                    // ایجاد AggregateError (ساختار ساده برای Rhino)
                                    var aggregateErr = new Error('All promises were rejected');
                                    aggregateErr.name = 'AggregateError';
                                    aggregateErr.errors = errors;
                                    reject(aggregateErr);
                                }
                            }
                        }
                    );
                })(i);
            }
        });
    };    
    
    // ============================================
    // Static Methods - Utilities
    // ============================================
    
    Promise.delay = function(ms, value) {
        return new Promise(function(resolve) {
            setTimeout(function() { resolve(value); }, ms);
        });
    };
    
    Promise.timeout = function(promise, ms, message) {
        message = message || 'Timeout after ' + ms + 'ms';
        var timeoutPromise = new Promise(function(resolve, reject) {
            setTimeout(function() { reject(new Error(message)); }, ms);
        });
        return Promise.race([Promise.resolve(promise), timeoutPromise]);
    };
    
    Promise.sequential = function(tasks) {
        if (!isArray(tasks)) {
            return Promise.reject(new TypeError('Expected array'));
        }
        if (tasks.length === 0) {
            return Promise.resolve([]);
        }
        
        var results = [];
        return tasks.reduce(function(promise, task) {
            return promise.then(function() {
                return Promise.resolve(task()).then(function(result) {
                    results.push(result);
                });
            });
        }, Promise.resolve()).then(function() { 
            return results; 
        });
    };
    
    Promise.retry = function(fn, maxAttempts, delayMs) {
        delayMs = delayMs || 1000;
        return new Promise(function(resolve, reject) {
            var attempts = 0;
            
            function attempt() {
                attempts++;
                Promise.resolve(fn()).then(resolve, function(error) {
                    if (attempts >= maxAttempts) {
                        reject(error);
                    } else {
                        setTimeout(attempt, delayMs);
                    }
                });
            }
            
            attempt();
        });
    };
    
    Promise.cancellable = function(executor) {
        var cancelled = false;
        var cancelCallbacks = [];
        
        var promise = new Promise(function(resolve, reject) {
            function onCancel(callback) {
                cancelCallbacks.push(callback);
            }
            
            executor(
                function(value) { if (!cancelled) resolve(value); },
                function(reason) { if (!cancelled) reject(reason); },
                onCancel
            );
        });
        
        promise.cancel = function() {
            if (!cancelled) {
                cancelled = true;
                cancelCallbacks.forEach(function(cb) {
                    try { cb(); } catch(e) {}
                });
            }
        };
        
        promise.isCancelled = function() { return cancelled; };
        
        return promise;
    };
    
    Promise.promisify = function(fn) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            
            return new Promise(function(resolve, reject) {
                args.push(function(error, result) {
                    if (error) reject(error);
                    else resolve(result);
                });
                fn.apply(this, args);
            });
        };
    };
    
    Promise.promisifyAll = function(obj) {
        var result = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] === 'function') {
                result[key + 'Async'] = Promise.promisify(obj[key]);
            }
            result[key] = obj[key];
        }
        return result;
    };
    
    Promise.parallel = function(tasks, concurrency) {
        concurrency = concurrency || Infinity;
        
        if (!isArray(tasks) || tasks.length === 0) {
            return Promise.resolve([]);
        }
        
        var results = new Array(tasks.length);
        var running = 0;
        var completed = 0;
        var nextIndex = 0;
        var length = tasks.length;
        
        return new Promise(function(resolve, reject) {
            function runNext() {
                while (running < concurrency && nextIndex < length) {
                    var index = nextIndex++;
                    running++;
                    
                    Promise.resolve(tasks[index]()).then(function(value) {
                        results[index] = value;
                        completed++;
                        running--;
                        
                        if (completed === length) {
                            resolve(results);
                        } else {
                            runNext();
                        }
                    }, reject);
                }
            }
            
            runNext();
        });
    };
    
    Promise.map = function(items, mapper, concurrency) {
        if (!isArray(items) || items.length === 0) {
            return Promise.resolve([]);
        }
        
        if (concurrency) {
            var tasks = [];
            for (var i = 0; i < items.length; i++) {
                (function(index) {
                    tasks.push(function() {
                        return Promise.resolve(mapper(items[index], index));
                    });
                })(i);
            }
            return Promise.parallel(tasks, concurrency);
        }
        
        var mapped = [];
        for (var j = 0; j < items.length; j++) {
            mapped.push(Promise.resolve(mapper(items[j], j)));
        }
        return Promise.all(mapped);
    };
    
    Promise.reduce = function(items, reducer, initialValue) {
        if (!isArray(items) || items.length === 0) {
            if (initialValue !== undefined) {
                return Promise.resolve(initialValue);
            }
            return Promise.reject(new TypeError('Reduce of empty array with no initial value'));
        }
        
        var accumulator = initialValue !== undefined ? 
            Promise.resolve(initialValue) : 
            Promise.resolve(items[0]);
        
        var startIndex = initialValue !== undefined ? 0 : 1;
        
        for (var i = startIndex; i < items.length; i++) {
            (function(index) {
                accumulator = accumulator.then(function(acc) {
                    return Promise.resolve(reducer(acc, items[index], index));
                });
            })(i);
        }
        
        return accumulator;
    };
    
    Promise.props = function(obj) {
        if (!obj || typeof obj !== 'object') {
            return Promise.resolve({});
        }
        
        var keys = Object.keys(obj);
        if (keys.length === 0) {
            return Promise.resolve({});
        }
        
        var values = [];
        for (var i = 0; i < keys.length; i++) {
            values.push(Promise.resolve(obj[keys[i]]));
        }
        
        return Promise.all(values).then(function(results) {
            var resolvedObj = {};
            for (var j = 0; j < keys.length; j++) {
                resolvedObj[keys[j]] = results[j];
            }
            return resolvedObj;
        });
    };
    
    Promise.try = function(fn) {
        return new Promise(function(resolve, reject) {
            try {
                resolve(fn());
            } catch(e) {
                reject(e);
            }
        });
    };
    
    Promise.first = function(promises) {
        return Promise.any(promises);
    };
    
    Promise.debounce = function(fn, delay) {
        var timeout;
        return function() {
            var args = arguments;
            var context = this;
            return new Promise(function(resolve, reject) {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(function() {
                    try {
                        resolve(fn.apply(context, args));
                    } catch(e) {
                        reject(e);
                    }
                }, delay);
            });
        };
    };
    
    Promise.pipeline = function(initialValue) {
        var fns = Array.prototype.slice.call(arguments, 1);
        return fns.reduce(function(promise, fn) {
            return promise.then(fn);
        }, Promise.resolve(initialValue));
    };
    
    Promise.chunk = function(items, size, processor) {
        if (!isArray(items) || items.length === 0) {
            return Promise.resolve([]);
        }
        
        var chunks = [];
        for (var i = 0; i < items.length; i += size) {
            chunks.push(items.slice(i, i + size));
        }
        
        var tasks = [];
        for (var j = 0; j < chunks.length; j++) {
            tasks.push(function(chunk) {
                return function() {
                    return Promise.resolve(processor(chunk));
                };
            }(chunks[j]));
        }
        
        return Promise.sequential(tasks);
    };
    
    Promise.queue = function(concurrency) {
        concurrency = concurrency || 1;
        var queue = [];
        var running = 0;
        
        function processNext() {
            if (running >= concurrency || queue.length === 0) return;
            
            running++;
            var item = queue.shift();
            
            Promise.resolve(item.task()).then(function(result) {
                item.resolve(result);
            }).catch(function(error) {
                item.reject(error);
            }).finally(function() {
                running--;
                processNext();
            });
        }
        
        return {
            add: function(task) {
                return new Promise(function(resolve, reject) {
                    queue.push({ task: task, resolve: resolve, reject: reject });
                    processNext();
                });
            },
            size: function() {
                return queue.length;
            },
            running: function() {
                return running;
            },
            clear: function() {
                queue = [];
            }
        };
    };
    
    // ============================================
    // توابع کمکی
    // ============================================
    
    // تنظیمات هشدار
    Promise._suppressWarnings = false;
    Promise.disableWarnings = function() { Promise._suppressWarnings = true; };
    Promise.enableWarnings = function() { Promise._suppressWarnings = false; };
    
    
})(this);

/**
 * ============================================================
 * بخش 1.5
 * 🐛 سیستم مدیریت لاگ فشرده (Debug Logger)
 * ============================================================
 * 
 * 🎯 هدف: کنترل و مدیریت لاگ‌ها با قابلیت فعال/غیرفعال کردن
 * 📅 آخرین به‌روزرسانی: ۱۴۰۵/۰۲/۳۱
 * 👤 نویسنده: تیم توسعه
 * 
 * 📌 توابع ارائه شده:
 *   - objectToText()      - تبدیل آبجکت به متن درختی (برای نمایش)
 *   - logObject()         - لاگ کردن آبجکت با فرمت درختی
 *   - formatText()        - فرمت‌دهی متن با الگو و داده
 *   - template()          - تبدیل template literal به فرمت‌پذیر
 *   - manageLog()         - تابع اصلی مدیریت لاگ
 *   - logDebug()          - لاگ سطح دیباگ
 *   - logInfo()           - لاگ سطح اطلاعات
 *   - logWarn()           - لاگ سطح هشدار
 *   - logError()          - لاگ سطح خطا
 *   - logData()           - لاگ همراه با آبجکت
 *   - logForce()          - لاگ اجباری (بدون فیلتر)
 * 
 * 📌 ساختار DEBUG_CONFIG:
 *   - enabled: true/false
 *   - levels: سطوح فعال (debug, info, warn, error)
 *   - sources: تنظیمات هر منبع (منبع → سکشن‌ها)
 * 
 * ⚠️ وابستگی‌ها: بخش 1.3 (toFarsiNumber, addDirectionControl)
 * 
 * 📌 نکات فنی:
 *   - objectToText از الگوریتم درختی با قابلیت compact استفاده می‌کند
 *   - formatText از دو روش آرگومان متعدد و آبجکت داده پشتیبانی می‌کند
 *   - template تابعی برای تبدیل template literal به string قابل فرمت است
 * 
 * ============================================================
 */
// تابع اصلی برای تبدیل آبجکت به متن درختی
function objectToText(obj, option) {
    // 📝 مقداردهی اولیه پارامترها با مقادیر پیش‌فرض
    option = option || {};
    option.path = option.path || [];
    option.isRoot = option.isRoot === undefined ? false : option.isRoot;
    option.depth = option.depth || 0;
    option.isRecent = option.isRecent === undefined ? true : option.isRecent;
    option.showFunction = option.showFunction === undefined ? true : option.showFunction;
    option.parentType = option.parentType || 'root';
    option.compact = option.compact === undefined ? true : option.compact;
    
    // 🔧 تعریف متدهای کمکی به صورت محلی
    const hasSimpleValue = (value) => {
        return typeof value === 'string' || 
               typeof value === 'number' || 
               typeof value === 'boolean' ||
               value === null ||
               value === undefined;
    };

    const getSimpleValue = (obj, type) => {
        // 🎯 مدیریت مقادیر ساده و خاص
        if (obj === null) return '🚫 null';
        if (obj === undefined) return '❓ undefined';
        
        if (type === 'Date' || type === 'java.util.Date') {
            return obj.toString();
        }
        
        if (Array.isArray(obj)) return '[] (Empty Array)';
        
        if (typeof obj === 'object' && Object.keys(obj).length === 0) {
            return '{} (Empty Object)';
        }
        
        if (typeof obj === 'string') return '"' + obj + '"';
        if (typeof obj === 'boolean') return obj ? '✅ true' : '❌ false';
        if (typeof obj === 'number') return + obj;
        
        return obj;
    };

    const getCompactValue = (obj, type, currentName, relationLabel, currentDepth) => {
        // 📝 مقداردهی اولیه پارامترها
        currentDepth = currentDepth || 0;
        
        // آرایه‌ها - آرایه‌های با المان‌های ساده را کامپکت کن
        if (Array.isArray(obj) && obj.length > 0) {
            const simpleArray = obj.every(item => hasSimpleValue(item));
            
            if (simpleArray) {
                let items = obj.map(item => {
                    const itemType = getObjectType(item);
                    return getSimpleValue(item, itemType);
                });
                const itemCount = obj.length > 1 ? ' (' + obj.length + ' items)' : '';
                return '[' + items.join(', ') + ']' + itemCount;
            }
        }
        
        // آبجکت‌ها - براساس نوع و ساختار تصمیم بگیر
        if (typeof obj === 'object' && obj !== null && !Array.isArray(obj) && Object.keys(obj).length > 0) {
            const keys = Object.keys(obj);
            
            // شرط‌های بهبود یافته برای کامپکت کردن
            const shouldCompact = 
                // آبجکت‌های کوچک با مقادیر ساده
                (keys.length <= 20 && keys.every(key => {
                    const value = obj[key];
                    return hasSimpleValue(value) ||
                           (Array.isArray(value) && value.length <= 5 && value.every(item => hasSimpleValue(item)));
                })) ||
                // آبجکت‌های با ساختار ساده تودرتو (تا عمق ۲)
                (keys.length <= 15 && currentDepth < 2 && keys.every(key => {
                    const value = obj[key];
                    return hasSimpleValue(value) ||
                           (Array.isArray(value) && value.length <= 3 && value.every(item => hasSimpleValue(item))) ||
                           (typeof value === 'object' && value !== null && Object.keys(value).length <= 5);
                }));
            
            if (shouldCompact) {
                let items = keys.map(key => {
                    const value = obj[key];
                    const valueType = getObjectType(value);
                    
                    // اگر آرایه ساده است، کامپکت نمایش بده
                    if (Array.isArray(value) && value.every(item => hasSimpleValue(item))) {
                        const arrayItems = value.map(item => {
                            const itemType = getObjectType(item);
                            return getSimpleValue(item, itemType);
                        });
                        const arrayCount = value.length > 1 ? ' (' + value.length + ' items)' : '';
                        return key + ': [' + arrayItems.join(', ') + ']' + arrayCount;
                    }
                    
                    // اگر آبجکت تودرتو است و شرایط کامپکت را دارد، بازگشتی فراخوانی کن
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedCompact = getCompactValue(value, 'Object', key, 'property', currentDepth + 1);
                        if (nestedCompact) {
                            return key + ': ' + nestedCompact;
                        }
                    }
                    
                    // برای مقادیر ساده
                    return key + ': ' + getSimpleValue(value, valueType);
                }).filter(item => item !== null);
                
                // اگر همه آیتم‌ها کامپکت شدند
                if (items.length === keys.length) {
                    const compactDisplay = '{' + items.join(', ') + '}';
                    
                    // فقط اگر نمایش خیلی طولانی نشد
                    if (compactDisplay.length <= 250) {
                        return compactDisplay;
                    }
                }
            }
        }
        
        return null;
    };

    const getTypeIcon = (type, obj) => {
        // 🎨 انتخاب آیکون مناسب بر اساس نوع داده
        const icons = {
            'Array': '📊 ','Object': '📦 ','Function': '🔧 ',
            'string': '📝 ','number': '🔢 ','boolean': '⚖️ ',
            'Date': '📅 ','java.util.Date': '📅 ',
            'null': '🚫 ','undefined': '🌫️ '
        };
        
        if (icons[type]) return icons[type];
        
        // برای کلاس‌های کاستوم
        if (typeof obj === 'object' && obj !== null && obj.constructor && obj.constructor.name !== 'Object') {
            return '📦 ';
        }
        return icons[typeof obj] || '📄 ';
    };

    const getRelationLabel = (parentType, currentType, key, obj) => {
        // 🔗 تشخیص نسبت نود فعلی به والد
        if (parentType === 'Array') return 'element';
        
        if (parentType === 'Object') {
            if (currentType === 'Function') return 'method';
            if (!isNaN(key) && key !== '') return 'element';
            return 'property';
        }
        
        if (parentType === 'root') {
            return currentType === 'Function' ? 'method' : 'property';
        }
        
        return currentType === 'Function' ? 'method' : 'property';
    };

    const getObjectType = (obj) => {
        // 🔍 تشخیص نوع داده با پشتیبانی از انواع خاص
        if (obj === null) return 'null';
        if (obj === undefined) return 'undefined';
        
        try {
            if (typeof obj === 'function' && obj instanceof Function) {
                return 'Function';
            }
            if (obj instanceof Date) return 'Date';
            // تشخیص تاریخ جاوا
            if (obj.getClass && obj.getClass().getName && obj.getClass().getName() === 'java.util.Date') {
                return 'java.util.Date';
            }
            
            // تشخیص کلاس‌های کاستوم
            if (typeof obj === 'object' && obj !== null && obj.constructor && obj.constructor.name !== 'Object') {
                return obj.constructor.name;
            }
            const type = Object.prototype.toString.call(obj).slice(8, -1);
            return type;
        } catch (e) {
            // fallback برای خطاها
            if (obj instanceof Date) return 'Date';
            if (Array.isArray(obj)) return 'Array';
            return 'Unknown';
        }
    };

    const getObjectKeys = (obj) => {
        // 🔑 تولید کلیدهای آبجکت (برای آرایه و آبجکت معمولی)
        if (Array.isArray(obj)) {
            let keys = [];
            for (let i = 0; i < obj.length; i++) {
                keys.push(i);
            }
            return keys;
        }
        
        try {
            return Object.keys(obj);
        } catch (e) {
            let keys = [];
            for (let key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    keys.push(key);
                }
            }
            return keys;
        }
    };

    // 🎪 محاسبه متغیرهای نمایشی
    const indent = '  '.repeat(option.depth);
    const prefix = option.depth === 0 ? '' : (option.isRecent ? '╰─ ' : '├─ ');
    const currentName = option.path.length > 0 ? option.path[option.path.length - 1] : 'object';
    const type = getObjectType(obj);
    let output = '';
    let value='';
    
    // 🌳 بخش ریشه
    if (option.isRoot) {
        output += '🎯 root: ' + currentName + ' (' + type + ')';
        
        // اگر روت زیرمجموعه ندارد، مقدار آن را نمایش بده
        if (obj === null || obj === undefined || typeof obj !== 'object' || 
            (Array.isArray(obj) && obj.length === 0) || 
            (typeof obj === 'object' && Object.keys(obj).length === 0)) {
            
            value = getSimpleValue(obj, type);
            
            output += ' → ' + value + '\n';
            return output;
        }
        output += '\n';
    } else {
        // 🏷️  ساخت هدر برای نودهای غیر ریشه
        const relationLabel = getRelationLabel(option.parentType, type, currentName, obj);
        const typeIcon = getTypeIcon(type, obj);
        output += indent + prefix + relationLabel + ': ' + typeIcon + currentName + ': ';
    }
    
    // ⚙️ پردازش توابع
    if (typeof obj === 'function' && obj instanceof Function && !obj.getClass) {
        const functionName = obj.name || '';
        if (!option.showFunction) {
            output += functionName + '\n';
        } else {
            let functionSource = obj.toString();
            if (functionSource.length > 100) {
                functionSource = functionSource.substring(0, 100) + '... }';
            }
            output += functionName + ' → ' + functionSource + '\n';
        }
        return output;
    }

    // 📊 پردازش مقادیر ساده (غیر آبجکت)
    if (type === 'Date' || type === 'java.util.Date' || 
        obj === null || obj === undefined || 
        typeof obj !== 'object') {
        
        if (!option.isRoot) {
            value = getSimpleValue(obj, type);
            output += value + ' (' + type + ')\n';
        }
        return output;
    }
    // 🔍 اگر حالت کامپکت فعال است و می‌توان آبجکت را کامپکت نمایش داد
    if (option.compact && !option.isRoot) {
        const compactDisplay = getCompactValue(obj, type, currentName, getRelationLabel(option.parentType, type, currentName, obj), option.depth);
        if (compactDisplay) {
            output += compactDisplay + '\n';
            return output;
        }
    }

    // 🏷️ نمایش نوع برای آبجکت‌ها و آرایه‌ها
    if (!option.isRoot) {
        output += type + '\n';
    }

    // 🔍 پردازش فرزندان آبجکت
    const keys = getObjectKeys(obj);
    
    // 📭 اگر آبجکت یا آرایه خالی است
    if (keys.length === 0 && !option.isRoot) {
        const emptyIndent = '  '.repeat(option.depth + 1);
        if (Array.isArray(obj)) {
            output += emptyIndent + '╰─ [] (Empty Array)\n';
        } else {
            output += emptyIndent + '╰─ {Empty Object}\n';
        }
        return output;
    }
    
    // 🔄 پیمایش تمام کلیدها و پردازش فرزندان
    keys.forEach((key, index) => {
        const isRecentChild = index === keys.length - 1;
        
        try {
            const value = obj[key];
            const newPath = option.path.concat([key]);
            output += objectToText(value, {
                path: newPath,
                isRoot: false,
                depth: option.depth + 1,
                isRecent: isRecentChild,
                showFunction: option.showFunction,
                parentType: type,
                compact: option.compact
            });
        } catch (e) {
            // ❌ مدیریت خطا در دسترسی به ویژگی‌ها
            const errorIndent = '  '.repeat(option.depth + 1);
            const errorPrefix = isRecentChild ? '╰─ ' : '├─ ';
            const errorRelationLabel = getRelationLabel(type, 'error', key, obj);
            output += errorIndent + errorPrefix + errorRelationLabel + ': ' + '❌ ' + key + ': [Error: ' + e.message + ']\n';
        }
    });

    return output;
}
// تابع اصلی برای لاگ کردن آبجکت
function logObject(obj, name, showFunction) {
    if (name === undefined) name = 'object';
    if (showFunction === undefined) showFunction = false;
    
    try {
      const text = addDirectionControl(objectToText(obj, {
          path: [name],
          isRoot: true,
          depth: 0,
          isRecent: true,
          showFunction: showFunction,
          parentType: 'root',
          compact: true // یا false بسته به نیاز
      }), 'ltr');
      log(text);
    } catch (e) {
        log('❌ خطا در نمایش آبجکت: ' + e.message);
        try {
            // نمایش ساده در صورت خطا
            log('🔍 نمایش ساده آبجکت:');
            log('📌 نوع: ' + typeof obj);
            log('🎯 مقدار: ' + String(obj));
        } catch (e2) {
            log('💥 نمایش ساده نیز با خطا مواجه شد');
        }
    }
}

/**
 * فرمت‌دهی متن با استفاده از الگو و داده‌های ورودی
 * @param {string} template - الگوی متنی حاوی placeholders مانند {0}، {name}، {age:02}
 * @param {Object|any} data - داده‌های جایگزین (آبجکت یا مقادیر جداگانه)
 * @returns {string} متن فرمت‌شده
 * 
 * @example
 * // روش آرگومان‌های متعدد
 * formatText('Hello {0}, you have {1} messages', 'John', 5);
 * // returns: 'Hello John, you have 5 messages'
 * 
 * @example
 * // روش آبجکت داده
 * formatText('Name: {name}, Age: {age:02}', {name: 'Ali', age: 5});
 * // returns: 'Name: Ali, Age: 05'
 * 
 * @example
 * // فرمت‌های عددی
 * formatText('ID: {id:03}', {id: 7});    // returns: 'ID: 007'
 * formatText('Value: {val:5}', {val: 42}); // returns: 'Value: 42   '
 */
function formatText(template, data) {
    if (typeof template !== 'string') throw new TypeError('Template must be a string');
    
    // روش قدیمی: آرگومان‌های متعدد ({0}, {1}, ...)
    if (arguments.length > 1 && !(data instanceof Object && data !== null)) {
        const args = Array.from(arguments).slice(1);
        return template.replace(/{(\d+)}/g, (match, indexStr) => {
            const index = parseInt(indexStr, 10);
            return (index >= 0 && index < args.length && args[index] != null) 
                ? args[index].toString() 
                : match;
        });
    }
    
    // روش جدید: آبجکت داده ({key}, {key:format})
    if (!data || typeof data !== 'object') return template;
    
    return template.replace(/{(\w+)(?::([^}]+))?}/g, (match, key, format) => {
        if (!data.hasOwnProperty(key)) return match;
        const value = data[key];
        if (value == null) return '';
        
        if (!format) return value.toString();
        
        // فرمت اعداد با صفر پیشرو (:02, :03)
        if (/^0\d+$/.test(format)) {
            let length = parseInt(format, 10);
            if (typeof value === 'number' && !isNaN(value)) {
                const absValue = Math.abs(Math.trunc(value));
                const padded = absValue.toString().padStart(length, '0');
                return value < 0 ? '-' + padded : padded;
            }
            return value.toString();
        }
        
        // فرمت عرض ثابت (:5, :10)
        if (/^\d+$/.test(format)) {
            let length = parseInt(format, 10);
            const str = value.toString();
            return str.length < length ? str.padEnd(length, ' ') : str.slice(0, length);
        }
        
        return value.toString();
    });
}

function template(templateLiteral) {
    const expressions = [];
    let index = 0;
    
    const converted = templateLiteral.replace(/\$\{([^}]+)\}/g,
      function(match, expr) {
        expressions.push(expr.trim());
        return '{' + (index++) + '}';
      });
    
    const dataEntries = expressions.map(function(expr, i) {
            return "'" + i + "': " + expr;
    });
    
    return "formatText('" + converted + "', { " + dataEntries.join(', ') + " })";
}
/**
 * 🎯 سیستم مدیریت لاگ فشرده‌شده
 */
function manageLog(message, options, data) {
  options = options || {};
  options.source = options.source || 'general';
  options.level = options.level || 'info';
  options.section = options.section || 'general';
  options.force = options.force || false;
  options.line = options.line || '';

  // 🔧 تنظیمات دیباگ فشرده
  const DEBUG_CONFIG = {
    enabled: true,
    levels: {'debug':1, 'info':1, 'warn':1, 'error':1},
    sources: {
      'getStatisticsParvaz':        {enabled:1, sections:{all:-1,default:1,'scoring':1,'missionType':1,'grouping':1,'rule2':1,'calculations':1,'weights':1,'persons':1,'init':1,'complete':1}},
      'generateRuleReports':        {enabled:1, sections:{all:-1,default:1,'rule1':1,'rule2':1,'rule4':1,'rule6':1,'ruleTotal':1,'init':1,'complete':1}},
      'getStates':                  {enabled:0, sections:{all:-1,default:1,'data':1,'balance':1,'calculations':1,'init':1,'complete':1}},
      'getGrade':                   {enabled:0, sections:{all:-1,default:1,'config':1,'calculations':1,'init':1,'complete':1}},
      'csvToMarkdown':              {enabled:0, sections:{all:-1,default:1,'dimensions':1,'processing':1,'init':1,'complete':1}},
      'mamoriat':                   {enabled:1, sections:{all:-1,default:1,'syncUpdate':1,'conflicts':1,'checkConflicts':1,'checkSqlConflicts':1,'getUsablePersons':1,'calcPersonsUsable':1,'info':1,'init':1,'complete':1}},
      'parvaz':                     {enabled:0, sections:{all:-1,default:1,'syncUpdate':1,'info':1,'init':1,'complete':1}},
      'typeMamoriat':               {enabled:0, sections:{all:-1,default:1,'syncUpdate':1,'info':1,'init':1,'complete':1}},
      'parvazLimit':                {enabled:0, sections:{all:-1,default:1,'info':1,'init':1,'complete':1}},
      'entriesToMamoriatEntreis':   {enabled:0, sections:{all:-1,default:1,'count':1,'processing':1,'init':1,'complete':1}},
      'entriesToTypeMamoriatEntreis':{enabled:0, sections:{all:-1,default:1,'count':1,'processing':1,'init':1,'complete':1}},
      'mamoriatLib':                {enabled:0, sections:{all:-1,default:1,'library':1,'init':1,'complete':1}},
      'objectToText':               {enabled:0, sections:{all:-1,default:1,'processing':1,'init':1,'complete':1}},
      'logObject':                  {enabled:0, sections:{all:-1,default:1,'config':1,'init':1,'complete':1}},
      'formatText':                 {enabled:0, sections:{all:-1,default:1,'processing':1,'init':1,'complete':1}},
      'template':                   {enabled:0, sections:{all:-1,default:1,'input':1,'processing':1,'init':1,'complete':1}},
      'initializePersianDate':      {enabled:0, sections:{all:-1,default:1,'init':1,'complete':1}},
      'markdownMamoriatPersonsBetweenTowDate':{enabled:0, sections:{all:-1,default:1,'config':1,'processing':1,'init':1,'complete':1}},
      'quantile':                   {enabled:0, sections:{all:-1,default:1,'params':1,'calculations':1,'init':1,'complete':1}},
      'ranking':                    {enabled:0, sections:{all:-1,default:1,'input':1,'calculations':1,'init':1,'complete':1}},
      'uniqAndSort':                {enabled:0, sections:{all:-1,default:1,'input':1,'processing':1,'init':1,'complete':1}},
      'sorted':                     {enabled:0, sections:{all:-1,default:1,'input':1,'processing':1,'init':1,'complete':1}},
      'roundUp':                    {enabled:0, sections:{all:-1,default:1,'params':1,'calculations':1,'init':1,'complete':1}},
      'refreshMamoriatLibrary':     {enabled:1, sections:{all:-1,default:1,'count':1,'processing':1,'init':1,'complete':1}},
      'manageLog':                  {enabled:0, sections:{all:-1,default:1,'config':1,'init':1,'complete':1}},
      'initBaseEntity':             {enabled:0, sections:{all:-1,default:1,'entry':1,'init':1,'complete':1}},
      'toFarsiNumber':              {enabled:0, sections:{all:-1,default:1,'input':1,'processing':1,'init':1,'complete':1}},
      'sleep':                      {enabled:0, sections:{all:-1,default:1,'duration':1,'init':1,'complete':1}},
      'addDirectionControl':        {enabled:0, sections:{all:-1,default:1,'processing':1,'init':1,'complete':1}}
    }
  };
  
  // ⏩ بررسی فعال بودن
  if (!DEBUG_CONFIG.enabled && !options.force) return;
  if (options.level === 'error') {} else {
    const sourceConfig = DEBUG_CONFIG.sources[options.source];
    if (!sourceConfig || !sourceConfig.enabled) { if (!options.force) return; }
    
    // 🔧 منطق جدید برای all و default
    if (sourceConfig && sourceConfig.sections) {
      const sections = sourceConfig.sections;
      let sectionEnabled = false;
      
      // بررسی all
      if (sections.all === 1) {
        sectionEnabled = true; // همه فعال
      } else if (sections.all === 0) {
        sectionEnabled = false; // همه غیرفعال
      } else if (sections.all === -1) {
        // وضعیت هر سکشن
        if (sections[options.section] !== undefined) {
          sectionEnabled = sections[options.section];
        } else {
          // استفاده از default
          sectionEnabled = sections.default || false;
        }
      }
      
      if (!sectionEnabled && !options.force) return;
    }
    
    if (!DEBUG_CONFIG.levels[options.level] && !options.force) return;
  }
  
  // 🎨 ایموجی و نمایش
  const emoji = {'debug':'🔍','info':'ℹ️','warn':'⚠️','error':'❌'}[options.level] || '📝';
  const lineInfo = options.line ? options.line : '';
  let finalMessage;
  try { finalMessage = `${emoji} [${options.source}:${lineInfo}.${options.section}] ${message}`; } 
  catch (error) { finalMessage = `${emoji} [${options.source}${lineInfo}.${options.section}] ${message}`; }
  
  data !== undefined && data !== null ? logObject(data, finalMessage) : log(finalMessage);
}

// 📝 توابع کمکی فشرده
function logDebug(s, sec, line, m) { manageLog(m || '', {source:s, level:'debug', section:sec, line:line}); }
function logInfo(s, sec, line, m)  { manageLog(m || '', {source:s, level:'info', section:sec, line:line}); }
function logWarn(s, sec, line, m)  { manageLog(m || '', {source:s, level:'warn', section:sec, line:line}); }
function logError(s, sec, line, m) { manageLog(m || '', {source:s, level:'error', section:sec, line:line}); }
function logData(s, sec, line,d,m) { manageLog(m || '', {source:s, level:'debug', section:sec, line:line}, d); }
function logForce(s, sec, line, m) { manageLog(m || '', {source:s, level:'info', section:sec, force:true, line:line}); }


/**
 * ============================================================
 * بخش 3.1
 * ✈️ کلاس‌های اصلی مدیریت ماموریت‌ها
 * ============================================================
 * 
 * 🎯 هدف: پیاده‌سازی کلاس‌های parvaz, typeMamoriat, mamoriat
 * 📅 آخرین به‌روزرسانی: ۱۴۰۵/۰۲/۳۱
 * 👤 نویسنده: تیم توسعه
 * 
 * 📌 کلاس‌های ارائه شده:
 *   - parvaz             - مدیریت پروازها
 *   - parvazLimit        - محدودیت‌های پرواز (تکراری - نیاز به بازبینی)
 *   - typeMamoriat       - انواع ماموریت و قوانین (1-7)
 *   - mamoriat           - مدیریت ماموریت‌ها
 *   - mamoriatLib        - کتابخانه ماموریت‌ها
 *   - refreshMamoriatLibrary() - همگام‌سازی خودکار
 * 
 * 📌 قابلیت‌های کلاس mamoriat:
 *   - بررسی تداخل (با کش)
 *   - محاسبه تاریخچه پروازها (با کش)
 *   - تعیین نفرات قابل استفاده
 *   - فرمت‌دهی زمان و تاریخ
 *   - مدیریت تاریخ نسبی (امروز، فردا، هفته بعد و...)
 * 
 * ⚠️ وابستگی‌ها: بخش 2.1, 1.2, 3.2
 * 
 * ============================================================
 */
// ==================== 🧩 پایه موجودیت ================
function initBaseEntity(instance, entry) {
  // خصوصیات پایه
  instance.e = entry;
  instance.props = {};

  // متد افزودن پراپرتی دینامیک
  instance.addProperty = function(name, field, def, options ) {
    if (options === undefined) options = {};
    const type = (options && options.type) || 'auto';
    
    Object.defineProperty(this, name, {
      get: () =>  {//logObject(this.e,'389:this.e');
        val=this.e.field(field)
        return this._convertValue(val !== undefined ? val : def, type) },
      set: (val) => this.setField(field, val !== null && val !== undefined ? val: def),
      enumerable: true
    });
  };
  /**
   * تبدیل مقدار به نوع داده مورد نظر (فقط موقع خواندن)
   */
  instance._convertValue = (value, type) => {
    if (value === null || value === undefined) return value;
    
    switch(type) {
      case 'number':
        return typeof value === 'number' ? value : parseInt(value) || 0;
      case 'boolean':
        if (typeof value === 'boolean') return value;
        return value === 'true' || value === true || value === '1';
      case 'array':
        return Array.isArray(value) ? value : [value];
      case 'object':
        return typeof value === 'object' ? value : JSON.parse(value || '{}');
      case 'string':
        return String(value);
      case 'auto':
      default:
        return value;
    }
  };
  
  // پراپرتی‌های مشترک
  instance.addProperty('active', 'فعال', true);
  instance.addProperty('colour', 'رنگ');
  instance.addProperty('bkGround', 'رنگ پس زمینه');

  // متد عمومی تنظیم فیلد
  instance.setField = function(fieldName, value) {
    if (this.e.field(fieldName) != value) {
      this.e.set(fieldName, value);
    }
  };
}

//≠=========== ✈️ کلاس مدیریت پروازها ===============
function parvaz(entry) {
  // مقداردهی اولیه خصوصیات پایه
  const self = this; // حفظ reference
  initBaseEntity(this, entry);

  // فیلدهای اختصاصی parvaz
  const fields = {
    parvaz: 'پرواز',
    typeParvazEntry: 'نوع ماموریت',
    typeParvaz: 'نوع پرواز',
    route: 'مسیر پرواز',
    sherkat: 'مرجع پرواز',
    airplan: 'هواپیما',
    duration: 'مدت روز',
    countLeg: 'تعداد لگ',
    deployment: 'استقراری',
    international: 'خارجی',
    sortNumber: 'ترتیب',
    schedule: 'برنامه ای',
    weekday: 'روز هفته',
    scheduleStartTime: 'ساعت رفت برنامه ای',
    scheduleEndTime: 'ساعت برگشت برنامه ای'
  };

  // افزودن فیلدها
Object.keys(fields).forEach(function(name) {
  this.addProperty(name, fields[name]);
}.bind(this));
  // ==================== متدهای اختصاصی ====================
  this.syncUpdate = function() {
    const lm = libByName("نوع ماموریت");
    if(!lm) throw new Error('کتابخانه نوع ماموریت یافت نشد');
    
    if (self.typeParvazEntry.length === 0) {
      const target = lm.findByKey(self.typeParvaz);
      if(target) self.e.link('نوع ماموریت', target);
    } else if (self.typeParvaz !== self.typeParvazEntry[0].name) {
      self.e.unlink('نوع ماموریت', self.typeParvazEntry[0]);
      const newTarget = lm.findByKey(self.typeParvaz);
      if(newTarget) self.e.link('نوع ماموریت', newTarget);
    }

    self.bkGround = self.active 
      ? (self.typeParvazEntry[0].field("رنگ") || '#FFFFFF')
      : "#7A221B";
  };
}

//============ 👥 کلاس مدیریت محدودیت‌های پرواز
function parvazLimit(entry) {
    // مقداردهی اولیه خصوصیات پایه
   initBaseEntity(this, entry);

  const fields = {
      parvaz: 'پرواز',
      typeParvazEntry: 'نوع ماموریت',
      typeParvaz: 'نوع پرواز',
      route: 'مسیر پرواز',
      sherkat: 'مرجع پرواز',
      airplan: 'هواپیما',
      duration: 'مدت روز',
      countLeg: 'تعداد لگ',
      deployment: 'استقراری',
      international: 'خارجی',
      sortNumber: 'ترتیب',
      schedule: 'برنامه ای',
      weekday: 'روز هفته',
      scheduleStartTime: 'ساعت رفت برنامه ای',
      scheduleEndTime: 'ساعت برگشت برنامه ای'
  };

  // افزودن فیلدها
Object.keys(fields).forEach(function(name) {
  this.addProperty(name, fields[name]);
}.bind(this));
}

//========= 📋 کلاس مدیریت انواع ماموریت‌ها
function typeMamoriat(entry) {
    // مقداردهی اولیه خصوصیات پایه
  initBaseEntity(this, entry);

  const fields = {
      nameTypeMamoriat: 'نام',
      shortName: 'نام کوتاه',
      typeParvaz: 'نوع',
      order: 'ترتیب نمایش',
      prioritize: 'اولویت ست نمودن',
      dateRuleFa: 'تاریخ اعمال قانون',
      dateRuleEn: 'تاریخ اعمال قانون میلادی',
      ruleCalc: 'محاسبه شده کلیه قوانین',
      //درصد پراکندگی نسبت پروازهای فرد در این گروه نسبت به دیگر نفرات در این گروه
      rule1_CountPct : "قانون ۱.درصد اعمال پراکندگی تعداد پرواز فرد",
      //درصد پراکندگی نسبت تعداد روز پروازهای فرد در این گروه نسبت به دیگر نفرات در این گروه
      rule1_SumDayPct:  "قانون ۱.درصد اعمال پراکندگی تعداد روز پرواز فرد",
      rule1_Calc : "قانون ۱.محاسبه شده",
      rule2_TypePerson : "قانون ۲.نحوه اعمال پراکندگی فرد",
      // این قانون سه وضعیت میتواند داشته باشد ۱.در تمامی گروه های پروازی ۲.فقط در گروه هایی که این ضریب را دارند ۳.در گروه های مشخص شده
      //درصد پراکندگی نسبت پروازهای فرد در این گروه نسبت به دیگر گروه‌های خود این فرد
      rule2_PersonInTypePct : "قانون ۲.درصد اعمال پراکندگی پرواز گروه",
      rule2_GroupsType : 'قانون۲. گروه های بررسی',
      rule2_Calc : "قانون ۲.محاسبه شده",
      rule3_TypeShift : "قانون ۳.نحوه اعمال نوبت",
      rule3_ShiftPct : "قانون ۳.درصد اعمال نوبت",
      rule3_Calc : "قانون ۳.محاسبه شده",
      rule4_RecentDaysPct : "قانون ۴.درصد اعمال مراعات فرد در چند روز اخیر",
      rule4_RecentDays : "قانون ۴.تعداد روز پرواز برای محاسبه",
      rule4_RecentDaysInTypePct : "قانون ۴.درصد اعمال مراعات تعداد پرواز در چند روز اخیر گروه",
      rule4_RecentDaysInType : "قانون ۴.تعداد روز پرواز برای محاسبه گروه",
      rule4_Calc : "قانون ۴.محاسبه شده",
      rule5_CoeffPerson : "قانون ۵.ضریب مستقیم نفرات",
      rule6_groupPersons : "قانون ۶.گروه محاسباتی",
      rule6_Calc : "قانون ۶.محاسبه شده",
    
      // 🎯 امتیازهای تجمیع‌شده
      rule7_NormalizedCountPct: "قانون ۷.درصد اعمال پراکندگی تعداد پرواز فرد در تجمیع",
      rule7_NormalizedDaysPct: "قانون ۷.درصد اعمال پراکندگی تعداد روز پرواز فرد در تجمیع",
      rule7_Order: "قانون ۷.نحوه مرتب سازی برای امتیاز دهی",
      rule7_Calc: "قانون ۷.محاسبه شده",
      ruleTotal_Calc : "قانون جمع.محاسبه شده",
      consolidationType_Name: "گروه نهایی جهت تجمیع",
      consolidationType_Coefficient:"ضریب گروه نهایی جهت تجمیع",
      consolidationType_MasterType : "تایپ اصلی برای خواندن ضرایب جهت تجمیع",
      consolidationType_Calc: "تجمیع گروه نهایی. محاسبه شده تجمیع",
      consolidationType_CalcR1: "تجمیع گروه نهایی. محاسبه شده ۱",
      consolidationType_CalcR2: "تجمیع گروه نهایی. محاسبه شده ۲",
      consolidationType_CalcR4: "تجمیع گروه نهایی. محاسبه شده ۴",
      consolidationType_CalcR6: "تجمیع گروه نهایی. محاسبه شده ۶",
      consolidationType_CalcRT: "تجمیع گروه نهایی. محاسبه شده نهایی قوانین",
      uniformityCount : "یکنواختی پرواز اعمالی",
      uniformity_Shift : "یکنواختی دوره اعمالی",
      uniformity_Recive : "یکنواختی دریافتی اعمالی",
  };

  // افزودن فیلدها
Object.keys(fields).forEach(function(name) {
  this.addProperty(name, fields[name]);
}.bind(this));
Object.defineProperties(this, {
  uniformityCountByPerson: {
    value: (p) => {
      try {
        return this.uniformityCount
                .filter(item => item.person === p)
                .reduce((sum, item) => sum + (item.increment || 0), 0);
      } catch (e) {
        return 0;
      }
    }
  }
})

  this.syncUpdate = function() {
    
    const sumPercentRuleType = (this.rule1_CountPct + this.rule1_SumDayPct +
        this.rule2_PersonInTypePct +
        this.rule4_RecentDaysPct + this.rule4_RecentDaysInTypePct);
    if (sumPercentRuleType != 100) {
      let textMessasge="جمع درصدهای وارد شده باید دقیقاً برابر ۱۰۰ باشد!" +"🔢 مجموع درصدهای فعلی:(" + sumPercentRuleType + ")"
      message(toFarsiNumber(textMessasge))
      cancel = true  // ⛔ لغو عملیات (متغیر سراسری Trigger)
    }
    
    if (this.active)
      this.bkGround = this.typeParvazEntry[0].field("رنگ");
    else
    {
      //رنگ غیر فعال . قرمز
      this.bkGround = "#7A221B"
    }
  }
}

// 🗓️ کلاس مدیریت ماموریت‌ها
function mamoriat(entry) {
    // مقداردهی اولیه خصوصیات پایه
  initBaseEntity(this, entry);

  const fields = {
      statusDay: 'وضعیت روز',
      mamoriat: 'نام ماموریت',
      parvazEntry: 'پرواز لینک',
      parvaz:'پرواز',
      typeParvazInitialEntry: 'نوع ماموریت پروازی اولیه',
      typeParvazEntry: 'نوع ماموریت پروازی انجام شده',
      dateRelative: 'تاریخ نسبی',
      startDateEn: 'تاریخ رفت میلادی',
      endDateEn: 'تاریخ برگشت میلادی',
      startDateFa: 'تاریخ رفت شمسی',
      weekdayFa: 'روز هفته',
      week: 'هفته',
      day: 'روز',
      monthName: 'نام ماه',
      year: 'سال',
      description: 'جزئیات',
      duration: 'مدت روز',
      startTime: 'ساعت رفت',
      endTime: 'ساعت برگشت',
      personsEntry: 'افراد',
      persons: 'نفرات',
      personsUsable: 'نفرات قابل استفاده',
      statusParvaz: 'وضعیت پرواز',
      details: 'توضیحات',
      Interference: 'تداخل',
      historyParvaz: 'سوابق پرواز',
      historyPerson: 'سوابق افراد'
  };


  // افزودن فیلدها
Object.keys(fields).forEach(function(name) {
    // تنظیمات تایپ برای فیلدهای مختلف
    const fieldOptions ={};
    switch(name) {
      case 'day':case 'year':case 'duration':
        fieldOptions.type = 'number';
        break;
      default:
        fieldOptions.type = 'auto';
    }
    this.addProperty(name, fields[name]);
}.bind(this));
// تعریف پراپرتی‌های خاص
  this.weekdays =(()=> ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"]);
  this.weekdaysEn =(()=> ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  this.monthNames =(()=> ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", 
                    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]);

    Object.defineProperties(this, {
      p: {
        get: () => {
          try {
            return this.parvaz[0] ? this.parvaz[0] : null;
          } catch (e) {
            log('Error: can not get p');
            return null;
          }
        },
        set: (val) => this.parvazEntry[0] = val
      },
      weekdayEn: {
        get: () => this.weekdaysEn()[this.weekdayNumber - 1],
        set: (val) => this._setWeekdayEn(val)
      },
      weekdayNumber: {
        get: () => this._getWeekdayNumber(),
        set: (val) => this.weekdayFa = this.weekdays()[val - 1]
      },
      monthNumber: {
        get: () => this.monthNames().indexOf(this.monthName) + 1,
        set: (val) => this.monthName = this.monthNames()[val - 1]
      }
    });

  // ====================
  // 🕒 متدهای مدیریت زمان
  // ====================

  this.getDateRealative= function() {
    if (this.dateRelative == "تاریخ انتخاب شده" && this.startDateEn instanceof Date ) 
      return this.startDateEn
    const date = new Date();
    if (this.startTime) {
      date.setHours(this.startTime.getHours(), this.startTime.getMinutes(), 0,0);
    } else {
      date.setHours(0, 0, 0);
    }
    if (this.dateRelative === "انتخاب روز ماه") 
      //log( this.year +'/'+this.monthNumber+'/'+this.day )
      return date.setPersianDate(this.year, this.monthNumber, this.day);
    const addDay = this._calculateDayOffset();
    if (addDay !== 0) {
      date.setDate(date.getDate() + addDay);
    }
    return date;
  
  }
    this._calculateDayOffset= function() {
    const offsets = {
      "فردا": 1,
      "پس فردا": 2,
      "دیروز": -1,
      "پریروز": -2
    };

    let addday = offsets[this.dateRelative] || 0;

    if (this.dateRelative === "انتخاب روز هفته") {
      addday += this.weekdayNumber - new Date().getPersianWeekday();

      const weekOffsets = {
        "هفته بعد": 7,
        "دو هفته بعد": 14,
        "هفته قبل": -7,
        "دو هفته قبل": -14
      };

      addday += weekOffsets[this.week] || 0;
    }

    return addday;
  }


  this.setDateRealative = function(date) {
    if (!(date instanceof Date)) {
      throw new Error('Error: Invalid Date to set');
      return;
    }
    this.day = date.getPersianDay();
    this.monthName = date.getPersianMonthName();
    this.year = date.getPersianYear();
    this.weekdayFa = date.getPersianWeekdayName();

    this.startDateFa = date.toShortPersianDate();
    this.startDateEn = date;

    // تنظیم تاریخ پایان
    const endDate = new Date(date.getTime());
    endDate.setDate(endDate.getDate() + parseInt(this.duration) - 1);
    
    if (this.endTime) {
      endDate.setHours(this.endTime.getHours(), this.endTime.getMinutes(), 0);
    } else {
      endDate.setHours(23, 59, 0);
    }

    this.endDateEn = endDate;
    if (this.dateRelative != "تاریخ انتخاب شده" || !this.startDateEn instanceof Date ) 
      this.dateRelative = "انتخاب روز ماه";
    this.week = "";
  }

  this._formatPersianDate= function (date) {
    const parts = [
      date.getPersianDate(),
      date.getPersianWeekdayName(),
      date.getPersianDay(),
      date.getPersianMonthName(),
      date.getPersianYear()
    ];
    
    return toFarsiNumber(parts.join(" "));
  }

  // ====================
  // 👥 متدهای مدیریت نفرات
  // ====================

  this.syncUpdate= function() {
    const date = this.getDateRealative();
    this.setDateRealative(date)
    this._checkConflicts();
    this._managePersonnel();
    this._updateStatusAndColors();
    this.calcHistory();
    this.calcPersonsUsable();
    
  }

  this._managePersonnel= function() {
    const lp = libByName("نفرات");
    
    // اضافه کردن نفرات جدید
    this.persons.forEach(pA => {
      if (!this.personsEntry.some(pE => pA === pE.name)) {
        try {
          this.e.link('افراد', lp.findByKey(pA));
        } catch (e) {
          log('خطا در اضافه کردن نفر {pA}:', e);
        }
      }
    });

    // حذف نفرات غیرمرتبط
    this.personsEntry.forEach(pE => {
      if (!this.persons.includes(pE.name)) {
        this.e.unlink('افراد', pE);
      }
    });
  }
// ====================
// ⚠️ متدهای بررسی تداخل (نسخه نهایی)
// ====================

/**
 * بررسی تداخل ماموریت‌ها
 * @param {Object} options - گزینه‌های بررسی
 * @param {boolean} options.useCache - استفاده از کش (پیش‌فرض: true)
 * @param {boolean} options.forceRefreshCache - بازسازی اجباری کش (پیش‌فرض: false)
 * @returns {Array} لیست تداخل‌ها
 */
this._checkConflicts = function(options) {
    // تنظیمات پیش‌فرض
    options = options || {};
    const useCache = options.useCache !== true; // پیش‌فرض: false
    const forceRefreshCache = options.forceRefreshCache || false;
    
    // اگر ماموریت کنسل شده، بررسی نکن
    if (this.statusParvaz === "کنسل") {
        return [];
    }
    
    const lp = libByName("نفرات");
    const allConflicts = [];
    const processedPersons = {};
    
    // ========== مرحله 1: آماده‌سازی داده‌ها ==========
    let personMissionsMap = {};
    
    if (useCache) {
        // ========== روش سریع: استفاده از کش ==========
        
        // ساخت کش اگر وجود نداشته باشد یا refresh اجباری
        if (typeof conflictCache === 'undefined' || forceRefreshCache) {
            conflictCache = {
                byPerson: {},    // ماموریت‌های هر شخص
                byDate: [],      // ماموریت‌های مرتب شده با تاریخ
                lastUpdate: Date.now()
            };
            
            let mArray = getMArray(true); // force refresh
            
            // ساخت ایندکس‌ها
            mArray.forEach(m => {
                // ایندکس بر اساس شخص
                m.persons.forEach(p => {
                    if (!conflictCache.byPerson[p]) {
                        conflictCache.byPerson[p] = [];
                    }
                    conflictCache.byPerson[p].push({
                        id: m.e.id,
                        name: m.e.name,
                        startDateEn: m.startDateEn,
                        endDateEn: m.endDateEn,
                        statusParvaz: m.statusParvaz,
                        statusDay: m.statusDay,
                        persons: m.persons.slice()  // کپی آرایه
                    });
                });
                
                // ایندکس بر اساس تاریخ
                conflictCache.byDate.push({
                    id: m.e.id,
                    startDateEn: m.startDateEn,
                    endDateEn: m.endDateEn
                });
            });
            
            // مرتب‌سازی بر اساس تاریخ شروع
            conflictCache.byDate.sort((a, b) => a.startDateEn - b.startDateEn);
            
            log('✅ conflictCache created/refreshed');
        }
        
        // استفاده از کش
        this.persons.forEach(pA => {
            personMissionsMap[pA] = conflictCache.byPerson[pA] || [];
        });
        
    } else {
        // ========== روش دقیق: استفاده از mArray مستقیم ==========
        let mArray = getMArray();
        const mArrayParvaz = mArray.filterOnlyParvaz();
        
        this.persons.forEach(pA => {
            personMissionsMap[pA] = mArrayParvaz.filterByPerson(pA);
        });
    }
    
    // ========== مرحله 2: بررسی تداخل‌ها (logic یکسان برای هر دو روش) ==========
    this.persons.forEach(pA => {
        if (processedPersons[pA]) return;
        
        const personMissions = personMissionsMap[pA];
        const personName = lp.findByKey(pA).field("نام خانوادگی") || pA;
        
        personMissions.forEach(other => {
            // رد کردن ماموریت جاری
            if (other.id === this.e.id) return;
            
            // رد کردن ماموریت‌های کنسل شده
            if (other.statusParvaz === "کنسل") return;
            
            // بررسی تداخل مستقیم
            const hasDirectConflict = (
                (this.startDateEn > other.startDateEn && this.startDateEn < other.endDateEn) ||
                (this.endDateEn > other.startDateEn && this.endDateEn < other.endDateEn)
            );
            
            const bothCompleted = (this.statusParvaz === "اتمام" && other.statusParvaz === "اتمام");
            
            if (hasDirectConflict && !bothCompleted) {
                allConflicts.push({
                    type: "تداخل پرواز",
                    message: "تداخل پرواز با " + other.name,
                    mission: other,
                    personName: personName
                });
                processedPersons[pA] = true;
                return;
            }
            
            // بررسی نزدیکی زمانی فقط برای پروازها
            if (this.statusDay === "پرواز" && other.statusDay === "پرواز" && !bothCompleted) {
                // فاصله پس از پرواز قبلی
                const hoursAfter = Math.floor((this.startDateEn - other.endDateEn) / (1000 * 60 * 60));
                if (hoursAfter > 0 && hoursAfter < 12) {
                    allConflicts.push({
                        type: "نزدیکی پرواز",
                        message: `فاصله کم پس از پرواز ${other.name} (${hoursAfter} ساعت)`,
                        mission: other,
                        personName: personName,
                        hours: hoursAfter
                    });
                    processedPersons[pA] = true;
                    return;
                }
                
                // فاصله قبل از پرواز بعدی
                const hoursBefore = Math.floor((this.endDateEn - other.startDateEn) / (1000 * 60 * 60));
                if (hoursBefore < 0 && hoursBefore > -12) {
                    allConflicts.push({
                        type: "نزدیکی پرواز",
                        message: `فاصله کم قبل از پرواز ${other.name} (${Math.abs(hoursBefore)} ساعت)`,
                        mission: other,
                        personName: personName,
                        hours: Math.abs(hoursBefore)
                    });
                    processedPersons[pA] = true;
                    return;
                }
            }
        });
    });
    
    // ========== مرحله 3: نمایش نتیجه ==========
    if (allConflicts.length > 0) {
        this.Interference = allConflicts;
        this._showCombinedConflictDialog(allConflicts);
    }
    
    return allConflicts;
};

/**
 * نمایش دیالوگ ترکیبی تداخل‌ها
 * @private
 */
this._showCombinedConflictDialog = function(conflicts) {
    const directConflicts = conflicts.filter(c => c.type === "تداخل پرواز");
    const timeGapConflicts = conflicts.filter(c => c.type === "نزدیکی پرواز");
    
    let dialogText = "ماموریت: " + this.e.name + "\n\n";
    
    if (directConflicts.length > 0) {
        dialogText += "🔴 تداخل‌های پرواز:\n";
        directConflicts.slice(0, 5).forEach(conflict => {
            dialogText += "• " + conflict.personName + " - " + conflict.message + "\n";
        });
        if (directConflicts.length > 5) {
            dialogText += "و " + (directConflicts.length - 5) + " تداخل دیگر\n";
        }
        dialogText += "\n";
    }
    
    if (timeGapConflicts.length > 0) {
        dialogText += "🟡 نزدیکی‌های زمانی:\n";
        timeGapConflicts.slice(0, 5).forEach(conflict => {
            dialogText += "• " + conflict.personName + " - " + conflict.message + "\n";
        });
        if (timeGapConflicts.length > 5) {
            dialogText += "و " + (timeGapConflicts.length - 5) + " نزدیکی دیگر\n";
        }
    }
    
    if (dialogText.length > 1000) {
        const totalConflicts = directConflicts.length + timeGapConflicts.length;
        dialogText = "ماموریت: " + this.e.name + "\n\n";
        dialogText += "⚠️ " + totalConflicts + " تداخل و نزدیکی زمانی شناسایی شد.\n";
        dialogText += "لطفا نفرات و زمان‌بندی را بررسی نمایید.";
    }
    
    dialog()
        .title("هشدار تداخل ماموریت")
        .text(dialogText)
        .positiveButton("متوجه شدم")
        .show();
};

/**
 * بررسی تداخل با SQL (برای تأیید نهایی)
 * این متن با توجه به ایرادات sql عمر اجرای نمی باشد
 */
this._checkSqlConflicts = function() {
    const lp = libByName("نفرات");
    const allConflicts = [];
    const processedPersons = {};

    const personConditions = this.persons.map(pA => 
        formatText('"{persons}" LIKE "{person}"', {persons: "نفرات", person: pA})
    ).join(" OR ");
    
    if (!personConditions) return [];

    const sqlQuery = formatText(
        "SELECT id, " +
        '"{statusDay}" as statusDay, ' +
        '"{mamoriat}" as mamoriat, ' + 
        '"{startDateEn}" as startDateEn, ' +
        '"{endDateEn}" as endDateEn, ' +
        '"{statusParvaz}" as statusParvaz, ' +
        '"{persons}" as persons ' +
        'FROM "ماموریت نفرات" ' +
        "WHERE ({personConditions}) " +
        'AND id != "{currentId}"',
        {
            statusDay: "وضعیت روز",
            mamoriat: "نام ماموریت",
            startDateEn: "تاریخ رفت میلادی",
            endDateEn: "تاریخ برگشت میلادی",
            statusParvaz: "وضعیت پرواز",
            persons: "نفرات",
            personConditions: personConditions,
            currentId: this.e.id
        }
    );

    try {
        const sqlResults = sql(sqlQuery).asObjects();
        
        for (let i = 0; i < sqlResults.length; i++) {
            const sqlRow = sqlResults[i];
            const otherMissionPersons = sqlRow.persons;
            const commonPersons = this.persons.filter(pA => 
                otherMissionPersons && otherMissionPersons.includes(pA)
            );
            
            for (let j = 0; j < commonPersons.length; j++) {
                const pA = commonPersons[j];
                if (processedPersons[pA]) continue;
                
                const personName = lp.findByKey(pA).field("نام خانوادگی");
                
                const otherMission = {
                    e: { id: sqlRow.id, name: sqlRow.mamoriat },
                    id: sqlRow.id,
                    statusDay: sqlRow.statusDay,
                    startDateEn: new Date(sqlRow.startDateEn),
                    endDateEn: new Date(sqlRow.endDateEn),
                    statusParvaz: sqlRow.statusParvaz,
                    persons: sqlRow.persons
                };

                const hasDirectConflict = (
                    (this.startDateEn > otherMission.startDateEn && this.startDateEn < otherMission.endDateEn) ||
                    (this.endDateEn > otherMission.startDateEn && this.endDateEn < otherMission.endDateEn)
                );
                
                const bothCompleted = (this.statusParvaz === "اتمام" && otherMission.statusParvaz === "اتمام");
                
                if (hasDirectConflict && !bothCompleted) {
                    allConflicts.push({
                        type: "تداخل پرواز",
                        message: "تداخل پرواز با " + sqlRow.mamoriat,
                        mission: otherMission,
                        personName: personName
                    });
                    processedPersons[pA] = true;
                }
            }
        }
    } catch (e) {
        log("خطا در اجرای کوئری SQL: " + e.message);
    }

    if (allConflicts.length > 0) {
        this._showCombinedConflictDialog(allConflicts);
    }
    
    return allConflicts;
};

  // ====================
  // 📊 متدهای محاسباتی
  // ====================
/**
 * محاسبه تاریخچه پروازهای قبلی
 * @param {Object} options - گزینه‌های محاسبه
 * @param {boolean} options.useCache - استفاده از کش (پیش‌فرض: true)
 * @param {boolean} options.forceRefreshCache - بازسازی اجباری کش (پیش‌فرض: false)
 * @param {number} options.maxHistoryCount - حداکثر تعداد تاریخچه (پیش‌فرض: 10)
 * @returns {Array} لیست تاریخچه پروازها
 */
this.calcHistory = function(options) {
    // تنظیمات پیش‌فرض
    options = options || {};
    const useCache = options.useCache !== false;
    const forceRefreshCache = options.forceRefreshCache || false;
    const maxHistoryCount = options.maxHistoryCount || 10;
    
    // اگر وضعیت روز پرواز نیست، خالی برگردان
    if (this.statusDay !== "پرواز") {
        this.historyParvaz = [];
        return [];
    }
    
    // اعتبارسنجی وجود پرواز
    if (!this.p || !this.p.name) {
        logWarn('mamoriat', 'calcHistory', 'noFlight', 'پروازی برای این ماموریت یافت نشد');
        this.historyParvaz = [];
        return [];
    }
    
    // ========== مرحله 1: آماده‌سازی کش ==========
    if (useCache) {
        // ساخت کش اگر وجود نداشته باشد یا refresh اجباری
        if (typeof historyCache === 'undefined' || forceRefreshCache) {
            historyCache = {
                data: {},
                lastUpdate: Date.now()
            };
            
            const mArray = getMArray(true); // force refresh
            const parvazMissions = mArray.filterOnlyParvaz();
            
            // ساخت ایندکس بر اساس نام پرواز
            parvazMissions.forEach(m => {
                try {
                    const parvazName = m.p && m.p.name;
                    if (!parvazName) return;
                    
                    if (!historyCache.data[parvazName]) {
                        historyCache.data[parvazName] = [];
                    }
                    
                    historyCache.data[parvazName].push({
                        id: m.e.id,
                        name: m.e.name,
                        startDateEn: m.startDateEn,
                        startDateFa: m.startDateFa,
                        startDate: m.startDateEn,
                        persons: m.persons ? m.persons.slice() : [],
                        duration: m.duration
                    });
                } catch (e) {
                    logError('mamoriat', 'calcHistory', 'cacheBuild', e.message);
                }
            });
            
            // مرتب‌سازی نزولی بر اساس تاریخ (جدیدترین اول)
            Object.values(historyCache.data).forEach(arr => {
                arr.sort((a, b) => b.startDateEn - a.startDateEn);
            });
            
            logInfo('mamoriat', 'calcHistory', 'cacheInit', 
                'historyCache created for ' + Object.keys(historyCache.data).length + ' flights');
        }
        
        // ========== مرحله 2: استفاده از کش ==========
        const parvazName = this.p.name;
        const cachedHistory = historyCache.data[parvazName] || [];
        
        // فیلتر کردن ماموریت‌های قبل از تاریخ جاری
        const filteredHistory = cachedHistory.filter(item => {
            try {
                return item.startDateEn && item.startDateEn < this.startDateEn;
            } catch (e) {
                return false;
            }
        });
        
        // محدود کردن تعداد و تبدیل به فرمت خروجی
        this.historyParvaz = filteredHistory.slice(0, maxHistoryCount).map(item => ({
            "تاریخ": item.startDateFa || '',
            "سرتیم": item.persons && item.persons.length > 0 ? item.persons[0] : '',
            "نفرات": item.persons && item.persons.length > 1 ? item.persons.slice(1).join(', ') : ''
        }));
        
        logDebug('mamoriat', 'calcHistory', 'cacheHit', 
            `${parvazName}: ${this.historyParvaz.length} تاریخچه از کش`);
            
        return this.historyParvaz;
    }
    
    // ========== مرحله 3: روش مستقیم (بدون کش) ==========
    try {
        const parvazEntry = this.parvazEntry && this.parvazEntry[0];
        if (!parvazEntry) {
            this.historyParvaz = [];
            return [];
        }
        
        const parvazObj = new parvaz(parvazEntry);
        const relatedMissions = entriesToMamoriatEntreis(lib().linksTo(parvazObj.e));
        
        const history = relatedMissions
            .filterInternal(ma => ma.startDateEn && ma.startDateEn < this.startDateEn)
            .sort((a, b) => b.startDateEn - a.startDateEn)
            .slice(0, maxHistoryCount)
            .map(ma => ({
                "تاریخ": ma.startDateFa || '',
                "سرتیم": ma.persons && ma.persons.length > 0 ? ma.persons[0] : '',
                "نفرات": ma.persons && ma.persons.length > 1 ? ma.persons.slice(1).join(', ') : ''
            }));
        
        this.historyParvaz = history;
        
        logDebug('mamoriat', 'calcHistory', 'direct', 
            `${this.p.name}: ${history.length} تاریخچه (بدون کش)`);
            
        return this.historyParvaz;
        
    } catch (e) {
        logError('mamoriat', 'calcHistory', 'error', e.message);
        this.historyParvaz = [];
        return [];
    }
};

  // ====================
  // 🕒 متدهای فرمت‌دهی زمان
  // ====================

  this.startEndHoursTimeFormat= function() {
    return this._formatTimeRange(this.startTime, this.endTime, false);
  }

  this.startEndTimeFormat= function() {
    return this._formatTimeRange(this.startTime, this.endTime, true);
  }

  this._formatTimeRange= function(startTime, endTime, showMinutes ) {
    showMinutes = showMinutes || false;
    if (!startTime) return '';
    
    const formatPart = (date, part) => ("0" + date['get'+part+'s']()).slice(-2);
    let result = '⌚' +formatPart(startTime, 'Hour');
    
    if (showMinutes) {
      result += ':'+formatPart(startTime, 'Minute');
    }
    
    if (endTime) {
      result += '➜' +formatPart(endTime, 'Hour');
      if (showMinutes) {
      result += ':'+formatPart(endTime, 'Minute');
      }
    }
    
    return result;
  }

  // ====================
  // 🛠️ متدهای کمکی
  // ====================

  this._setWeekdayEn = function (value) {
    const weekdayMap = {
      'Sat': 'شنبه', 'Saturday': 'شنبه',
      'Sun': 'یک‌شنبه', 'Sunday': 'یک‌شنبه',
      'Mon': 'دوشنبه', 'Monday': 'دوشنبه',
      'Tue': 'سه‌شنبه', 'Tuesday': 'سه‌شنبه',
      'Wed': 'چهارشنبه', 'Wednesday': 'چهارشنبه',
      'Thu': 'پنج‌شنبه', 'Thursday': 'پنج‌شنبه',
      'Fri': 'جمعه', 'Friday': 'جمعه'
    };
    
    this.weekdayFa = weekdayMap[value] || this.weekdayFa;
  }

  this._getWeekdayNumber= function() {
    const weekdayMap = {
      "شنبه": 1,
      "یک‌شنبه": 2, "یکشنبه": 2, "یک شنبه": 2,
      "دوشنبه": 3, "دو شنبه": 3,
      "سه‌شنبه": 4, "سهشنبه": 4, "سه شنبه": 4,
      "چهارشنبه": 5, "چهار شنبه": 5,
      "پنج‌شنبه": 6, "پنجشنبه": 6, "پنج شنبه": 6,
      "جمعه": 7
    };
    
    return weekdayMap[this.weekdayFa] || 1;
  }

  this._updateStatusAndColors= function() {
    if (this.statusDay === "پرواز") {
      this.typeParvazInitialEntry = this.p.typeParvazEntry;
      if (this.typeParvazEntry.length === 0) {
        this.typeParvazEntry = this.p.typeParvazEntry;
      }
    } else {
      const lm = libByName("نوع ماموریت");
      if (this.typeParvazEntry.length === 0) {
        const e = lm.findByKey(this.statusDay);
        if (e) this.e.link(typeParvazEntry, e);
      } else if (this.statusDay !== this.typeParvazEntry[0].name) {
        this.e.unlink(typeParvazEntry, this.typeParvazEntry[0]);
        this.e.link(typeParvazEntry, lm.findByKey(this.statusDay));
      }
    }

    this.bkGround = this.typeParvazEntry[0].field("رنگ") || "#7A221B";
    
    if (this.statusParvaz === "اولیه") {
      this.statusParvaz = "ایجاد پرواز";
    }
    //message('run1');
    if (this.statusParvaz === "ایجاد پرواز" && this.persons.length >= 1) {
      this.statusParvaz = "اختصاص نفرات";
      if (this.statusDay !== "پرواز") {
        this.personsUsable = "";
      } else {
    //message('run2');
        this.calcPersonsUsable();
      }
    }
  }
// ==============================================
// 👥 متدهای مدیریت نفرات قابل استفاده
// ==============================================

// مشخص کردن نفرات قابل استفاده برای ماموریت
this.getUsablePersons = function() {
  // تنظیمات وضعیت‌های مختلف
  const statusSettings = [
    { name: "ReadyForParvaz", statusParvaz: "", icon: "✅ ➜" },
    { name: "UnSetForParvaz", statusParvaz: "ایجاد پرواز", icon: "☑️ ➜" },
    { name: "noParvaz", statusParvaz: "", icon: "⛔ ➜" },
    { name: "SetForParvazPersons", statusParvaz: "اختصاص نفرات", icon: "✈️ ➜" },
    { name: "RuningParvazPersons", statusParvaz: "درحال انجام", icon: "🛫 ➜" },
    { name: "CompleteParvazPersons", statusParvaz: "اتمام", icon: "🛬 ➜" },
    { name: "CancleParvazPersons", statusParvaz: "کنسل", icon: "❌ ➜" }
  ];

  // فیلتر ماموریت‌ها در بازه زمانی
  const mArray = getMArray(); 
  const mArrayFilter = mArray.filterBetweenTwoDates(
    this.startDateEn, 
    this.startDateEn.addDay(parseInt(this.duration) - 1)
  );

  // پردازش اطلاعات هر نفر
  const PersonsStatus = libByName("نفرات").entries()
    .map(pe => pe.name)
    .reverse()
    .map(p => this._processPersonStatus(p, mArrayFilter, statusSettings));

  // گروه‌بندی نفرات بر اساس وضعیت
  //const statusPersons = this._groupPersonsByStatus(PersonsStatus, statusSettings);
  //logObject(statusSettings,'statusSettings(1418):')
  //logObject(PersonsStatus,'PersonsStatus(1418):')
  //logObject(statusPersons,'statusPersons(1405):')
  // ایجاد خروجی‌های مختلف
  return this._generateOutput(PersonsStatus, statusSettings, mArray);
}

/**
 * پردازش وضعیت یک نفر خاص
 * @private
 */
this._processPersonStatus = function(personName, mArrayFilter, statusSettings) {
  const person = { name: personName, nameStatusRoute: [] };
  const personMissions = mArrayFilter.filterByPerson(personName);
  const flightPersonMissions = personMissions.filterOnlyParvaz();
  //logObject(statusSettings,'statusSettings(1418):')
  //logObject(personMissions,'personMissions(1419):')
  //logObject(flightPersonMissions,'flightPersonMissions(1420):')
  //logObject(statusSettings,'statusSettings(1421):')
  statusSettings.forEach((setting, index) => {
    person.nameStatusRoute[index] = "";
    
    if (index == 0) { // وضعیت آماده
    // اگر هیچ کدام از وضعیتها نبود در وضعیت آماده قرار داده میشود
    } 
    else if (index == 2) { // وضعیت غیرپروازی
      person.nameStatusRoute[2] = personMissions
        .filterInternal(m => m.statusDay !== "پرواز")
        //حدا کردن نام وصعیت غیر پردازی 
        .map(m => m.e.name.slice(0, 3))
        .join();
    } 
    else { // وضعیت‌های پروازی
      person.nameStatusRoute[index] = flightPersonMissions
        .filterInternal(m => m.statusParvaz === setting.statusParvaz)
        //جدا کردن نام وصعیت پردازی
        .map(m => m.e.name.slice(6, 9))
        .join();
    }
  });
//چک کردن وضعیت آماده
const hasAnyStatus = statusSettings.slice(1).some((_, i) => 
  person.nameStatusRoute[i + 1] !== ""
);
//logObject(hasAnyStatus,'hasAnyStatus(1429):')
person.nameStatusRoute[0] = hasAnyStatus ? "" : "Rdy";

//logObject(person,'person(1423)')
  return person;
}

/**
 * گروه‌بندی نفرات بر اساس وضعیت
 * @private
 */
this._groupPersonsByStatus = function(persons, statusSettings) {
  const grouped = {};
  
  statusSettings.forEach((setting, index) => {
    grouped[setting.name] = persons.filter(p => 
      p.nameStatusRoute[index] !== ""
    );
  });

  return grouped;
}

/**
 * تولید خروجی‌های متنی و Markdown از داده‌های نفرات گروه‌بندی شده
 * 
 * @param {Array} statusPersons - آرایه نفرات با وضعیت‌های آنها
 * @param {Array} statusSettings - آرایه تنظیمات وضعیت‌ها (آیکون، نام و ...)
 * @param {Array} mArray - آرایه داده‌های ماموریت‌ها برای گزارش‌گیری
 * @returns {Object} آبجکت حاوی خروجی‌های متنی و Markdown
 */
this._generateOutput = (statusPersons, statusSettings, mArray) => {
    
     // قالب‌بندی خطوط طولانی با شکستن به چند خط
    const formatLine = line => line.length <= 40 ? line : 
        line.slice(0, 4) + (line.slice(4).match(/.{1,40}/g) || [line.slice(4)]).join("\n      ");

    //  تولید محتوای خروجی برای هر وضعیت
    const outputs = statusSettings
        .map((setting, index) => {
            // فیلتر نفراتی که در این وضعیت دارای مقدار معتبر هستند
            const persons = statusPersons.filter(p => 
                p.nameStatusRoute && 
                p.nameStatusRoute[index] && 
                p.nameStatusRoute[index].trim()
            );
            
            // اگر هیچ نفری در این وضعیت نبود، مقدار null برگردان
            return persons.length ? {
                // ساخت خط وضعیت: آیکون + لیست نفرات
                statusLine: setting.icon + ' ' + persons.map(p =>
                    p.name + ":" + p.nameStatusRoute[index]).join(', '),
                // تولید گزارش Markdown برای 9 روز گذشته
                markdown: markdownMamoriatPersonsBetweenTowDate(
                    mArray, 
                    persons.map(p => p.name), 
                    this.startDateEn.addDay(-9), 
                    this.startDateEn
                )
            } : null;
        })
        .filter(Boolean); // حذف وضعیت‌های بدون نفر

    // ایجاد کپی از statusPersons برای اضافه کردن خروجی‌ها
    const result = Object.assign({}, statusPersons);
    
    // تولید خروجی متنی: ترکیب خطوط وضعیت‌ها
    result.string = outputs.map(o => formatLine(o.statusLine)).join("\n")
    
    // تولید خروجی Markdown: ترکیب خطوط وضعیت + گزارش‌ها
    result.markdown = outputs.map(o => 
        formatLine(o.statusLine) + (o.markdown ? "\n" + o.markdown : "") 
    ).join("\n")
    
    return result;
};
// ==============================================
// 🔢 متد محاسبه نفرات قابل استفاده
// ==============================================

// مشخص کردن و به‌روزرسانی لیست نفرات قابل استفاده
this.calcPersonsUsable = function() {
  if (this.statusDay !== "پرواز") return;
  
  const usablePersons = this.getUsablePersons();
 // message('run');
 logData('mamoriat', 'usablePersons', '1734', usablePersons, 'داده‌های نفرات قابل استفاده');
  this.personsUsable = usablePersons.string;
  this.historyPerson = usablePersons.markdown;
}

// ==============================================
// 🕒 متدهای فرمت‌دهی زمان (تکمیلی)
// ==============================================

/**
 * فرمت‌دهی زمان شروع به صورت ISO
 * @param {string} local - زبان خروجی ('fa' یا دیگر)
 * @returns {string} زمان فرمت‌شده
 */
this.startTimeISOFormat = function(local) {
  const strTime = time(this.startTime);
  return local === "fa" ? toFarsiNumber(strTime) : strTime;
}

/**
 * فرمت‌دهی زمان پایان به صورت ISO
 * @param {string} local - زبان خروجی ('fa' یا دیگر)
 * @returns {string} زمان فرمت‌شده
 */
this.endTimeISOFormat = function(local) {
  const strTime = time(this.endTime);
  return local === "fa" ? toFarsiNumber(strTime) : strTime;
}

/**
 * فرمت‌دهی زمان شروع با قالب دلخواه
 * @param {string} format - قالب خروجی
 * @param {string} local - زبان خروجی ('fa' یا دیگر)
 * @returns {string} زمان فرمت‌شده
 */
this.startTimeFormat = function(format, local) {
  return this.startTime 
    ? new persianDate(this.startTime).toLocale(local).format(format)
    : '';
}

/**
 * فرمت‌دهی زمان پایان با قالب دلخواه
 * @param {string} format - قالب خروجی
 * @param {string} local - زبان خروجی ('fa' یا دیگر)
 * @returns {string} زمان فرمت‌شده
 */
this.endTimeFormat = function (format, local) {
  return this.endTime 
    ? new persianDate(this.endTime).toLocale(local).format(format)
    : '';
}

// ==============================================
// 📅 متدهای مربوط به تاریخ (تکمیلی)
// ==============================================

/**
 * دریافت روز هفته پایان ماموریت
 * @returns {string} نام روز هفته
 */
this.getEndWeekdayFa= function() {
  const endDayIndex = (this.weekdayNumber - 1 + parseInt(this.duration)- 1) % 7;
  return this.weekdays()[endDayIndex];
}

/**
 * همگام‌سازی اولیه ماموریت
 */
this.syncCreate= function() {
  if (this.statusDay === "پرواز") {
    this.startTime = this.p.scheduleStartTime;
    this.endTime = this.p.scheduleEndTime;
    this.duration = this.p.duration || 1;
  }
  this.statusParvaz = "ایجاد پرواز";
  this.syncUpdate();
}
}

/**
 * ============================================================
 * بخش 3.2
 * 📊 توابع پایه و زنجیره‌ای آرایه‌های ماموریت
 * ============================================================
 * 
 * 🎯 هدف: تبدیل و پردازش آرایه‌های ماموریت با قابلیت زنجیره‌ای
 * 📅 آخرین به‌روزرسانی: ۱۴۰۵/۰۲/۳۱
 * 👤 نویسنده: تیم توسعه
 * 
 * 📌 توابع ارائه شده:
 *   - entriesToMamoriatEntreis() - تبدیل entries به آرایه mamoriat
 *   - entriesToTypeMamoriatEntreis() - تبدیل به typeMamoriat
 *   - getMArray()          - دریافت کش شده ماموریت‌ها (TTL 60s)
 *   - markdownMamoriatPersonsBetweenTowDate() - گزارش Markdown
 * 
 * 📌 متدهای زنجیره‌ای آرایه (filterInternal, filterByPerson, ...):
 *   - filterInternal()     - فیلتر با حفظ متدها
 *   - filterByPerson()     - فیلتر بر اساس نفر
 *   - filterByDate()       - فیلتر بر اساس تاریخ
 *   - filterBetweenTwoDates() - فیلتر بازه زمانی
 *   - filterOnlyParvaz()   - فقط پروازها
 *   - filterByTypeParvazEntryLinkShortName() - فیلتر نوع پرواز
 *   - createLink()         - ایجاد لینک برای سرعت بیشتر
 *   - sortByDate()         - مرتب‌سازی بر اساس تاریخ
 *   - groupBy()            - گروه‌بندی دلخواه
 *   - uniqueBy()           - حذف تکراری بر اساس کلید
 * 
 * ⚠️ وابستگی‌ها: بخش 3.1, 1.2
 * 
 * ============================================================
 */
function mamoriatLib(lib) {
  this.lm = lib;
  this.findById = function(id) {
    return new mamoriat(this.lm.findById(id))
  }
  this.findByKey = function(name) {
    return new mamoriat(this.lm.findByKey(name))
  }
  this.find = function(query) {
    return entriesToMamoriatEntreis(this.lm.find(query))
  }
  this.entries = function() {
    return entriesToMamoriatEntreis(this.lm.entries())
  }
};

function refreshMamoriatLibrary() {
    const lm = libByName("ماموریت نفرات");
    const nowTime = Date.now();
    const changes = [], auto = [];
    const level = { "اتمام":1, "درحال انجام":2, "اختصاص نفرات":3, "ایجاد پرواز":4, "اولیه":5 };
    
    const isAuto = (old, newStatus) => 
        (old === "اولیه" && newStatus === "ایجاد پرواز") ||
        (old === "ایجاد پرواز" && newStatus === "اختصاص نفرات");
    
    const apply = (m, newStatus) => {
        m.statusParvaz = newStatus;
        if (newStatus === "اتمام") m.historyPerson = "";
        if (newStatus === "اختصاص نفرات" && m.statusDay !== "پرواز") m.personsUsable = "";
        if (newStatus === "ایجاد پرواز" || newStatus === "اختصاص نفرات") m.calcPersonsUsable();
    };
    //statisticsParvaz = getStatisticsParvaz();
    lm.entries().forEach(e => {
        const m = new mamoriat(e);
        const startHour = Math.floor((nowTime - m.startDateEn) / 3600000);
        const endHour = Math.floor((nowTime - m.endDateEn) / 3600000);
        const old = m.statusParvaz;
        let newStatus = null;
        
        if (old === "اولیه") newStatus = "ایجاد پرواز";
        else if (old === "ایجاد پرواز") {
            if (m.persons.length && startHour > -30) newStatus = "اختصاص نفرات";
            else if (m.persons.length && startHour > -6) newStatus = "درحال انجام";
            else if (m.statusDay !== "پرواز" && m.persons.length) newStatus = "اختصاص نفرات";
        }
        else if (old === "اختصاص نفرات") {
            if (!m.persons.length) newStatus = "ایجاد پرواز";
            else if (startHour > -6) newStatus = "درحال انجام";
        }
        else if (old === "درحال انجام") {
            if (!m.persons.length) newStatus ="ایجاد پرواز";
            else if (endHour > 3) newStatus = "اتمام";
        }
        
        if (newStatus && newStatus !== old) {
            const item = { m, old, new: newStatus, reverse: level[newStatus] > level[old] };
            if (isAuto(old, newStatus)) {
                auto.push(item);
                apply(m, newStatus);
            } else {
                changes.push(item);
            }
        }
    });
    const formatItem = (c) => 
        `${c.reverse ? "🟡" : "🟢"}${c.m.e.name}\n     ${c.old} ⬅️ ${c.new}`;
        
    // تغییرات خودکار - نمایش قبل از هر دیالوگ دیگر
    if (auto.length) {
        let msg = `🔄 ${auto.length} تغییر خودکار:\n\n` + 
            auto.slice(0, 10).map(c => formatItem(c)).join("\n\n") +
            (auto.length > 10 ? `\n\n  ...و ${auto.length - 10} مورد` : "");
        dialog().title("✨ تغییرات خودکار").text(msg).positiveButton("متوجه شدم").show();
    }
    
    // تغییرات نیازمند تأیید
    const showConfirm = (c, i, total, next) => {
        dialog().title(`${c.reverse ? "⚠️" : "🔄"} تغییر ${i}${total == 1 ? " مورد" : `/${total}`}`)
            .text(formatItem(c))
            .positiveButton("✅ تأیید", () => { apply(c.m, c.new); next(); })
            .negativeButton("❌ رد", next).show();
    };
        
    if (changes.length === 1) {
        showConfirm(changes[0], 1, 1, () => message("✓ پایان"));
    }
    else if (changes.length > 1) {
        // اضافه کردن control character دستی برای هر خط
        let msg = `⚠️ ${changes.length} مورد نیاز به تأیید\n\n`;
        msg += changes.slice(0, 8).map(c => 
            formatItem(c)
        ).join("\n\n");
        if (changes.length > 8) msg += `\n\n  ...و ${changes.length - 8} مورد`;
        
        dialog().title("📋 تأیید تغییرات").text(msg)
            .positiveButton("✅ تأیید همه", () => { changes.forEach(c => apply(c.m, c.new)); message(`✓ ${changes.length} تغییر`); })
            .neutralButton("🔍 بررسی تک تک", () => {
                let i = 0;
                const next = () => i < changes.length ? showConfirm(changes[i], i+1, changes.length, () => { i++; next(); }) : message("✓ پایان");
                next();
            })
            .negativeButton("❌ رد همه", () => message("✗ هیچ تغییری اعمال نشد")).show();
    }
    else if (!auto.length) {
        dialog().title("✅ نتیجه").text("همه ماموریت‌ها در وضعیت مناسب هستند").positiveButton("باشه").show();
    }
}

/**
 * تابع اصلی برای تبدیل entries به مجموعه typeMamoriat
 * این تابع یک آبجکت از entries را می‌گیرد و برای هرکدام یک typeMamoriat می‌سازد
 * و در نهایت قابلیت‌های فیلتر و پردازش را به آن اضافه می‌کند
 * @param {Array} entries - آرایه‌ای از entries
 * @returns {Array} - آرایه‌ای از typeMamoriatها با متدهای اضافه شده
 */
function entriesToTypeMamoriatEntreis(entries) {
  // تبدیل هر entry به شیء typeMamoriat
  const meArray = entries.map(function(e) { 
    return new typeMamoriat(e); 
  });
  
  /**
   * اضافه کردن متدها و خصوصیات به آرایه
   * این تابع تمام متدهای فیلتر و پردازش را به آرایه اضافه می‌کند
   * @param {Array} arr - آرایه‌ای از typeMamoriatها
   * @returns {Array} - آرایه با متدهای اضافه شده
   */
  function addAllMethods(arr) {
    if (!arr || !Array.isArray(arr)) return arr;
    
    // اگر از قبل متدها اضافه شده‌اند، چیزی اضافه نکن
    if (arr.filterInternal && arr.filterByShortName) {
      return arr;
    }

    /**
     * فیلتر داخلی با تابع مقایسه‌ای دلخواه
     * @param {Function} compFn - تابع مقایسه‌ای
     * @returns {Array} - آرایه فیلتر شده با متدهای اضافه شده
     */
    arr.filterInternal = function(compFn) {
      const results = this.filter(compFn);
      return addAllMethods(results);
    };

    /**
     * فیلتر بر اساس نام کوتاه
     * @param {string} shortName - نام کوتاه برای فیلتر
     * @returns {Array} - آرایه فیلتر شده با متدهای اضافه شده
     */
    arr.filterByShortName = function(shortName) {
      return this.filterInternal(function(tm) {
        return tm.shortName == shortName;
      });
    };


    /**
     * پیدا کردن یک typeMamoriat بر اساس نام کوتاه
     * @param {string} shortName - نام کوتاه برای جستجو
     * @returns {typeMamoriat|null} - typeMamoriat پیدا شده یا null
     */
    arr.findByShortName = function(shortName) {
      for (let i = 0; i < this.length; i++) {
        if (this[i].shortName === shortName) {
          return this[i];
        }
      }
      return null;
    };    


    /**
     * فیلتر بر اساس تجمیع گروه 
     * @param {string} consolidationType_Name - تجمیع گروه  برای فیلتر
     * @returns {Array} - آرایه فیلتر شده با متدهای اضافه شده
     */
    arr.filterByConsolidationType_Name = function(consolidationType_Name) {
      return this.filterInternal(function(tm) {
        return tm.consolidationType_Name == consolidationType_Name;
      });
    };

    /**
     * فیلتر فقط typeهای پروازی
     * @returns {Array} - آرایه فیلتر شده با متدهای اضافه شده
     */
    arr.filterOnlyParvaz = function() {
      return this.filterInternal(function(tm) {
        return tm.typeParvaz == "پرواز";
      });
    };

    /**
     * فیلتر فقط typeهای غیر پروازی
     * @returns {Array} - آرایه فیلتر شده با متدهای اضافه شده
     */
    arr.filterOnlyNoParvaz = function() {
      return this.filterInternal(function(tm) {
        return tm.typeParvaz != "پرواز";
      });
    };

    /**
     * فیلتر بر اساس آرایه‌ای از نام‌های کوتاه
     * @param {Array} shortNames - آرایه‌ای از نام‌های کوتاه
     * @returns {Array} - آرایه فیلتر شده با متدهای اضافه شده
     */
    arr.filterByArrayShortName = function(shortNames) {
      return this.filterInternal(function(tm) {
        return shortNames.includes(tm.shortName);
      });
    };

    /**
     * فیلتر بر اساس نوع پرواز
     * @param {string} type - نوع پرواز (مثلاً "داخلی", "خارجی")
     * @returns {Array} - آرایه فیلتر شده با متدهای اضافه شده
     */
    arr.filterByTypeParvaz = function(type) {
      return this.filterInternal(function(tm) {
        return tm.typeParvaz === type;
      });
    };

    // استفاده از getter برای count
    Object.defineProperty(arr, 'count', {
      get: function() { return this.length; }
    });

    // ========== متدهای آرایه‌ای با قابلیت زنجیره‌ای ==========
    
    /**
     * متدهای آرایه که آرایه جدید برمی‌گردانند را wrap می‌کنیم
     * تا متدهای ما به آرایه جدید اضافه شوند
     */
    const chainableMethods = ['map', 'filter', 'slice', 'concat'];
    
    chainableMethods.forEach(function(methodName) {
      const originalMethod = arr[methodName];
      if (typeof originalMethod === 'function') {
        arr[methodName] = function() {
          const result = originalMethod.apply(this, arguments);
          return addAllMethods(result);
        };
      }
    });

    /**
     * متد برای گرفتن اولین typeMamoriat
     * @returns {typeMamoriat|null} - اولین typeMamoriat یا null
     */
    arr.first = function() {
      return this.length > 0 ? this[0] : null;
    };

    /**
     * متد برای گرفتن نام‌های کوتاه منحصر به فرد
     * @returns {Array} - آرایه‌ای از نام‌های کوتاه منحصر به فرد
     */
    arr.getUniqueShortNames = function() {
      const uniqueNames = [];
      this.forEach(function(tm) {
        if (tm.shortName && !uniqueNames.includes(tm.shortName)) {
          uniqueNames.push(tm.shortName);
        }
      });
      return uniqueNames;
    };

    /**
     * متد برای گروه‌بندی بر اساس نوع پرواز
     * @returns {Object} - آبجکت گروه‌بندی شده
     */
    arr.groupByTypeParvaz = function() {
      const groups = {};
      this.forEach(function(tm) {
        const type = tm.typeParvaz || 'نامشخص';
        if (!groups[type]) {
          groups[type] = addAllMethods([]);
        }
        groups[type].push(tm);
      });
      return groups;
    };

    /**
     * بررسی وجود type با نام کوتاه مشخص
     * @param {string} shortName - نام کوتاه برای بررسی
     * @returns {boolean} - true اگر وجود داشته باشد
     */
    arr.hasShortName = function(shortName) {
      return this.findByShortName(shortName) !== null;
    };

    return arr;
  }

  // اضافه کردن متدها به آرایه اصلی و بازگرداندن آن
  return addAllMethods(meArray);
}

/**
 * تابع اصلی برای تبدیل entries به مجموعه ماموریت‌ها
 * این تابع یک آبجکت از entries را می‌گیرد و برای هرکدام یک ماموریت می‌سازد
 * و در نهایت قابلیت‌های فیلتر و پردازش را به آن اضافه می‌کند
 * @param {Array} entries - آرایه‌ای از entries
 * @returns {Array} - آرایه‌ای از mamoriatها با متدهای اضافه شده
 */
function entriesToMamoriatEntreis(entries) {
  // تبدیل هر entry به شیء mamoriat
  const meArray = entries.map(function(e) { 
    return new mamoriat(e); 
  });
  
  /**
   * اضافه کردن متدها و خصوصیات به آرایه
   * این تابع تمام متدهای فیلتر و پردازش را به آرایه اضافه می‌کند
   * @param {Array} arr - آرایه‌ای از mamoriatها
   * @returns {Array} - آرایه با متدهای اضافه شده
   */
  function addAllMethods(arr) {
    if (!arr || !Array.isArray(arr)) return arr;
    
    // اگر از قبل متدها اضافه شده‌اند، چیزی اضافه نکن
    if (arr.filterInternal && arr.createLink) {
      return arr;
    }
    /**
     * ایجاد لینک برای بالا بردن سرعت اجرا
     * هر اینتری برای دریافت مقادیر زمان زیادی را صرف می‌کند و این کار سبب می‌شود 
     * در آرایه‌های تو در تو این زمان هدر رود. بخاطر این یکبار آن را به متغیر نسبت می‌دهیم 
     * و بارهای بعد از آن استفاده می‌کنیم
     * @param {string} switchName - نام سوئیچ
     * @returns {Array} - خود آرایه برای زنجیره‌ای کردن
     */
    arr.createLink = function(switchName) {
      if (switchName === "typeParvazEntry") {
        // برای هر ماموریت، لینک typeParvazEntry را ایجاد کن
        this.forEach(function(m) {
          if (m.typeParvazEntry && m.typeParvazEntry.length > 0) {
            //log("m:" + m.e.name + " count Type parvazi:" + m.typeParvazEntry.length);
            m.typeParvazEntryLink = {
              name: m.typeParvazEntry[0].name,
              shortName: m.typeParvazEntry[0].field("نام کوتاه"),
              parvaz: m.typeParvazEntry[0].field("نوع")
            };
          }
        });
      }
      return this;
    };

    /**
     * فیلتر داخلی با تابع مقایسه‌ای دلخواه
     * @param {Function} compFn - تابع مقایسه‌ای
     * @returns {Array} - آرایه فیلتر شده با متدهای اضافه شده
     */
    arr.filterInternal = function(compFn) {
      const results = this.filter(compFn);
      return addAllMethods(results);
    };

    arr.filterByStartDate = function(date) {
      return this.filterInternal(function(m) {
        // بررسی وجود تاریخ‌ها قبل از مقایسه
        return m.startDateEn && date && 
               m.startDateEn.getDateWithoutTime().getTime() === date.getDateWithoutTime().getTime();
      });
    };

    arr.filterToEndDate = function(date) {
      return this.filterInternal(function(m) {
        // بررسی وجود EndDateEn قبل از مقایسه
        return m.EndDateEn && date && 
               m.EndDateEn.getDateWithoutTime().getTime() >= date.getDateWithoutTime().getTime();
      });
    };

    arr.filterByDateAndPerson = function(date, person) {
      return this.filterInternal(function(m) {
        // بررسی وجود تمام propertyهای لازم
        if (!m.startDateEn || !date || !m.persons) return false;
        
        try {
          const startDate = m.startDateEn.getDateWithoutTime().getTime();
          const endDate = m.startDateEn.addDay((parseInt(m.duration) || 1) - 1).getDateWithoutTime().getTime();
          const targetDate = date.getDateWithoutTime().getTime();
          
          // بررسی قرار گرفتن تاریخ در بازه و وجود شخص
          const dateInRange = startDate <= targetDate && endDate >= targetDate;
          const personFound = m.persons.includes(person);
          
          return dateInRange && personFound;
        } catch (e) {
          return false;
        }
      });
    };

    arr.filterByDate = function(date) {
      return this.filterInternal(function(m) {
        if (!m.startDateEn || !date) return false;
        
        try {
          const startDate = m.startDateEn.getDateWithoutTime().getTime();
          const endDate = m.startDateEn.addDay((parseInt(m.duration) || 1) - 1).getDateWithoutTime().getTime();
          const targetDate = date.getDateWithoutTime().getTime();
          //log(startDate + ' ' + endDate + ' ' + targetDate)
          const check= startDate <= targetDate && endDate >= targetDate;
          //log(check)
          return check 
        } catch (e) {
          return false;
        }
      });
    };

    arr.filterBetweenTwoDates = function(startDate, endDate) {
      return this.filterInternal(function(m) {
        if (!m.startDateEn || !startDate || !endDate) return false;
        
        try {
          const d1 = m.startDateEn.getDateWithoutTime().getTime();
          const d2 = m.startDateEn.addDay((m.duration || 1) - 1).getDateWithoutTime().getTime();
          const q1 = startDate.getDateWithoutTime().getTime();
          const q2 = endDate.getDateWithoutTime().getTime();
          
          // بررسی تداخل بازه‌های زمانی
          return (
            (d1 >= q1 && d1 <= q2) || // شروع ماموریت در بازه
            (d2 >= q1 && d2 <= q2) || // پایان ماموریت در بازه  
            (q1 >= d1 && q1 <= d2) || // شروع بازه در ماموریت
            (q2 >= d1 && q2 <= d2)    // پایان بازه در ماموریت
          );
        } catch (e) {
          return false;
        }
      });
    };

    arr.filterOnlyParvaz = function() {
      return this.filterInternal(m=> m.statusDay === "پرواز");
    };

    arr.filterOnlyNoParvaz = function() {
      return this.filterInternal(m=> m.statusDay !== "پرواز");
    };

    arr.filterByPerson = function(person) {
      return this.filterInternal(function(m) {
        return m.persons && m.persons.includes(person);
      });
    };

    /**
     * فیلتر بر اساس تایپ پروازی بخصوصی
     * @param {string} typeParvazEntryLinkShortName - نام کوتاه تایپ پرواز
     * @returns {Array} - آرایه فیلتر شده با متدهای اضافه شده
     */
    arr.filterByTypeParvazEntryLinkShortName = function(typeParvazEntryLinkShortName) {
      // اگر لینک ایجاد نشده، ابتدا createLink را فراخوانی کن
      if (this.length > 0 && !this[0].typeParvazEntryLink) {
        this.createLink('typeParvazEntry');
      }
      return this.filterInternal(function(m) {
        return m.typeParvazEntryLink && 
               m.typeParvazEntryLink.shortName === typeParvazEntryLinkShortName;
      });
    };

    /**
     * فیلتر بر اساس یک آرایه‌ای از تایپ پروازی
     * @param {Array} arrayTypeParvazEntryLinkShortName - آرایه‌ای از نام‌های کوتاه تایپ پرواز
     * @returns {Array} - آرایه فیلتر شده با متدهای اضافه شده
     */
    arr.filterByArrayTypeParvazEntryLinkShortName = function(arrayTypeParvazEntryLinkShortName) {
      // اگر لینک ایجاد نشده، ابتدا createLink را فراخوانی کن
      if (this.length > 0 && !this[0].typeParvazEntryLink) {
        this.createLink('typeParvazEntry');
      }
      return this.filterInternal(function(m) {
        return m.typeParvazEntryLink && 
               arrayTypeParvazEntryLinkShortName.includes(m.typeParvazEntryLink.shortName);
      });
    };
    
    /**
     * گروه‌بندی ماموریت‌ها بر اساس یک کلید
     */
    arr.groupBy = function(keyFn) {
      const groups = {};
      this.forEach(item => {
        const key = keyFn(item);
        if (!groups[key]) groups[key] = addAllMethods([]);
        groups[key].push(item);
      });
      return groups;
    };
    
    /**
     * مرتب‌سازی ماموریت‌ها
     */
    arr.sortByDate = function(descending) {
      descending= descending || false
      return this.sort((a, b) => {
        const dateA = a.startDateEn ? a.startDateEn.getTime() : 0;
        const dateB = b.startDateEn ? b.startDateEn.getTime() : 0;
        return descending ? dateB - dateA : dateA - dateB;
      });
    };
    
    /**
     * گرفتن ماموریت‌های منحصر به فرد بر اساس یک ویژگی
     */
    arr.uniqueBy = function(keyFn) {
      const seen = new Set();
      return this.filterInternal(item => {
        const key = keyFn(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };    
    
    // پیشنهاد: تبدیل به getter
    Object.defineProperty(arr, 'count', {
      get: function() { return this.length; }
    });
    
    Object.defineProperty(arr, 'days', {
      get: function() { 
        return this.reduce((sum, m) => sum + (parseInt(m.duration) || 0), 0);
      }
    });

    // ========== متدهای آرایه‌ای با قابلیت زنجیره‌ای ==========
    
    /**
     * متدهای آرایه که آرایه جدید برمی‌گردانند را wrap می‌کنیم
     * تا متدهای ما به آرایه جدید اضافه شوند
     */
    const chainableMethods = ['map', 'filter', 'slice'];
    
    chainableMethods.forEach(function(methodName) {
      const originalMethod = arr[methodName];
      if (typeof originalMethod === 'function') {
        arr[methodName] = function() {
          const result = originalMethod.apply(this, arguments);
          return addAllMethods(result);
        };
      }
    });

    /**
     * متد forEach با قابلیت زنجیره‌ای
     
    const originalForEach = arr.forEach;
    arr.forEach = function(callback) {
      if (typeof originalForEach === 'function') {
        originalForEach.call(this, callback);
      }
      logObject(this[0].duration)
      return this;
    };
    */
    return arr;
  }

  // اضافه کردن متدها به آرایه اصلی و بازگرداندن آن
  return addAllMethods(meArray);
}

// در ابتدای فایل، بعد از تعریف entriesToMamoriatEntreis
let _mArrayCache = null;
let _mArrayLastUpdate = null;

function getMArray(forceRefresh) {
    forceRefresh = forceRefresh === true ;
    const now = Date.now();
    const CACHE_TTL = 60000;
    
    if (forceRefresh || !_mArrayCache || (now - _mArrayLastUpdate) > CACHE_TTL) {
        _mArrayCache = entriesToMamoriatEntreis(libByName("ماموریت نفرات").entries());
        _mArrayLastUpdate = now;
    }
    return _mArrayCache;
}

function markdownMamoriatPersonsBetweenTowDate(meArray, persons, startDate, endDate) {
    // 🎯 تابع کمکی برای تبدیل ماموریت به نمادهای نمایشی
    const mamoriatToSymbol = (me, chd, firstMarkdownd) => {
        let result = {
            symbol: "",
            name: "",
            name2: "",
            airplan: ""
        };
        //logObject(result,'result0(2654):')

        if (me.length === 0) return result;

        const startDatem = me[0].startDateEn.getDateWithoutTime().getTime();
        const endDatem = me[0].startDateEn.addDay(me[0].duration - 1).getDateWithoutTime().getTime();
        const checkDate = chd.getDateWithoutTime().getTime();
        const firstMarkdowndate = (firstMarkdownd || chd).getDateWithoutTime().getTime();

        // 🔍 بررسی موقعیت تاریخ نسبت به ماموریت
        if ((startDatem < checkDate && endDatem < checkDate) || (startDatem > checkDate && endDatem > checkDate)) {
            //logObject(result,'result1(2654):')
            return result;
        }

        // 📍 ماموریت قبل از تاریخ شروع گزارش
        if (startDatem < checkDate && checkDate === firstMarkdowndate) {
            result.symbol = "××";
            if (me[0].statusDay === "پرواز") {
                result.airplan = me[0].e.name.slice(0, 2);
                result.name = me[0].e.name.slice(6, 9);
                result.name2 = ("" + Math.abs(chd.getDate() - me[0].startDateEn.getDate() - 1) + "d");
            } else {
                result.name = me[0].e.name.slice(0, 3);
                result.name2 = ("" + Math.abs(chd.getDate() - me[0].startDateEn.getDate()) + "d");
            }
            //logObject(result,'result2(2654):')
            return result;
        }

        // 📍 شروع ماموریت در این تاریخ
        if (startDatem === checkDate) {
            result.symbol = "××";
            if (me[0].statusDay === "پرواز") {
                result.airplan = me[0].e.name.slice(0, 2);
                result.name = me[0].e.name.slice(6, 9);
                result.name2 = me[0].e.name.slice(10, 13);
            } else {
                result.name2 = me[0].e.name.slice(0, 3);
            }
            //logObject(result,'result3(2654):')
            return result;
        }

        // 📍 ماموریت بعد از این تاریخ
        if (endDatem > checkDate) {
            if (me[0].statusDay === "پرواز") {
                result.name = "»»»";
            } else {
                result.name2 = "»»»";
            }
            //logObject(result,'result4(2654):')
            return result;
        }

        // 📍 ماموریت در حال انجام
        if (me[0].statusDay === "پرواز") {
            const endHour = me[0].endTime ? me[0].endTime.getHours() : 0;
            result.name = endHour <= 4 ? "»" : endHour >= 18 ? "»»»" : "»»";
        } else {
            result.name2 = "»»";
        }

        //logObject(result,'result5(2654):')
        return result;
    };

    // 📅 فیلتر ماموریت‌ها در بازه زمانی
    const filteredMeArray = meArray.filterBetweenTwoDates(startDate, endDate);
    //logObject(filteredMeArray,'filteredMeArray');
    const weekdays = ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"];
    let header = "Dy//Wk,", csvContent = "";
    
    persons.forEach((person, pi) => {
        const missions = filteredMeArray.filterByPerson(person);
        let row = person;
        
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            if (pi === 0) header += formatText("{day:02}//{weekday:3},", {
                day: d.getPersianDay(),
                weekday: weekdays[d.getPersianWeekday() - 1]
            });
            
            const daily = missions.filterByDate(d);
            const symbols = mamoriatToSymbol(daily, d, startDate);
            row += "," + formatText("{airplan}//{name}//{name2}", symbols);
        }
        
        if (pi === 0) csvContent = header.slice(0, -1) + "\n";
        csvContent += row + (pi < persons.length - 1 ? "\n" : "");
    });
    
    const markdown = csvToMarkdown(csvContent, {
        delimiter: ",",
        breakLine: '//',
        compact: true,
        separatorBetweenRows: true
    });
    
    return markdown;
}

/**
 * ============================================================
 * بخش 4.1
 * 📈 آمار پروازی و اولویت‌بندی افراد (Static Parvaz)
 * ============================================================
 * 
 * 🎯 هدف: محاسبه آمار و اولویت افراد برای انواع ماموریت
 * 📅 آخرین به‌روزرسانی: ۱۴۰۵/۰۲/۳۱
 * 👤 نویسنده: تیم توسعه
 * 
 * 📌 توابع ارائه شده:
 *   - getStatisticsParvaz() - محاسبه اصلی آمار و اولویت‌بندی
 *   - generateRuleReports() - تولید گزارش قوانین 1-7
 *   - getStates()          - تحلیل تعادل و شناسایی Outliers (IQR)
 *   - getGrade()           - گریدبندی (سطح‌بندی) افراد
 * 
 * 📌 قوانین محاسباتی (1 تا 7):
 *   - قانون 1: پراکندگی تعداد و روزهای پرواز
 *   - قانون 2: پراکندگی نسبت به گروه‌های خاص
 *   - قانون 4: مراعات افراد در روزهای اخیر
 *   - قانون 6: گروه‌های محاسباتی
 *   - قانون 7: تجمیع گروه نهایی
 * 
 * 📌 خروجی:
 *   - persons: داده‌های هر نفر (امتیازات، درصدها، گریدها)
 *   - groupStatistics: آمار هر گروه
 *   - balanceScore: امتیاز تعادل کلی
 *   - ruleWeightData: وزن‌های استفاده شده
 * 
 * ⚠️ وابستگی‌ها: بخش 3.2, 3.1, 1.3
 * 
 * ============================================================
 */
/**
 * تابع اصلی برای محاسبه آمار پروازی و اولویت‌بندی نفرات
 * این تابع با تحلیل داده‌های تاریخی ماموریت‌ها، اولویت هر نفر را برای هر نوع ماموریت محاسبه می‌کند
 * 
 * @param {Object} options - تنظیمات اختیاری
 * @param {string[]} [options.missionTypes] - آرایه انواع ماموریت برای فیلتر
 * @param {Object} [options.personConfig] - تنظیمات پرسن
 * @param {string[]} [options.personConfig.excluded] - نفرات حذف شده
 * @param {Object} [options.personConfig.groups] - گروه‌های پرسن
 * @param {string} [options.personConfig.scoringMode] - حالت امتیازدهی: 'global' | 'group' |'auto'
 * @param {boolean} [options.includeRecentMissions] - آیا ماموریت‌های اخیر لحاظ شود؟
 * @param {number} [options.levelsCount] - تعداد سطوح گریدبندی (2 تا 10) - پیش‌فرض: 7
 * @param {boolean} [options.isAscending] - جهت گریدبندی: true=صعودی (بالاترین درصد=بهترین سطح), false=نزولی (بالاترین درصد=پایین‌ترین سطح) - پیش‌فرض: false
 * @returns {Object} - شیء حاوی آمار کامل و اولویت‌بندی‌های محاسبه‌شده
 */
function getStatisticsParvaz(options) {
  // 🔧 مقداردهی اولیه پارامترهای ورودی با مقادیر پیش‌فرض
  options = options || {};
  options.missionTypes = options.missionTypes || [];
  options.personConfig = options.personConfig || {};
  options.personConfig.excluded = options.personConfig.excluded || [];
  options.personConfig.groups = options.personConfig.groups || {};
  options.personConfig.scoringMode = options.personConfig.scoringMode || 'auto';
  options.includeRecentMissions = options.includeRecentMissions !== false;
  options.levelsCount = Math.min(Math.max(options.levelsCount || 7, 2), 10);
  options.isAscending = options.isAscending || false;
  
  // 📥 بارگذاری داده‌های پایه از کتابخانه‌ها
  const lp = libByName("نفرات");
  const ltm = libByName("نوع ماموریت");
  const lm = libByName("ماموریت نفرات");

  // 👥 استخراج لیست نفرات از کتابخانه نفرات
  const personsEntries = lp.entries();
  const persons = personsEntries.map(pe => pe.name).reverse();
  
  // 🎯 استخراج انواع ماموریت‌های پروازی و اعمال فیلتر
  const typeMamoriatArray = entriesToTypeMamoriatEntreis(ltm.entries().reverse()).filterOnlyParvaz();
  const filterTypeMamoriatArray = (options.missionTypes && options.missionTypes.length > 0) 
    ? typeMamoriatArray.filter(tm => options.missionTypes.includes(tm.shortName))
    : typeMamoriatArray;

  // استخراج گروه برای تجمیع 
  const groups = Array.from(
    new Set(
      filterTypeMamoriatArray
        .map(tm => tm.consolidationType_Name.trim())
        .filter(Boolean) // حذف مقادیر null/undefined
    )
  );
  const consolidatedData = groups.length > 0 ? 
    getConsolidatedParvaz({ 
      personConfig: options.personConfig || {}, 
      consolidationGroups: groups 
    }) : null;
  
  // لاگ اطلاعات فیلتر
  logInfo('getStatisticsParvaz', 'filter', '265', 
    'انواع ماموریت: ' + filterTypeMamoriatArray.length + ' از ' + typeMamoriatArray.length + 
    (options.missionTypes && options.missionTypes.length > 0 ? ' (فیلتر شده)' : ' (همه انواع)'));
  
  // 📋 دریافت داده‌های مورد نیاز از کتابخانه ماموریت نفرات
  const mArray = getMArray(); 
  
  // ✈️ فیلتر کردن فقط ماموریت‌های پروازی و ایجاد لینک به نوع ماموریت
  const mArrayParvaz = mArray.filterOnlyParvaz();
  mArrayParvaz.createLink("typeParvazEntry");

  // 🗂️ شیء اصلی برای ذخیره نتایج نهایی
  const statisticsParvaz = {};

  // لاگ شروع محاسبات
  const SourceLog = 'getStatisticsParvaz';
  logInfo(SourceLog, 'init', '355', 'شروع محاسبات آمار پروازی');
  logData(SourceLog, 'options', '2414',options)

  // 🔄 پردازش هر نوع ماموریت به صورت جداگانه
  filterTypeMamoriatArray.forEach(tm => {
    // ✈️ فیلتر ماموریت‌ها بر اساس نوع ماموریت فعلی
    const mAt = mArrayParvaz.filterByTypeParvazEntryLinkShortName(tm.shortName);

    // لاگ اطلاعات نوع ماموریت
    logInfo(SourceLog, 'missionStats', '375', 
      'آمار ' + tm.shortName + ': ' + mAt.count + ' ماموریت, ' + mAt.days + ' روز');

    // 🔧 سازماندهی گروه‌ها بر اساس scoringMode
    const groupsFromTM = tm.rule6_groupPersons || [];
    const userGroups = options.personConfig.groups || {};

    // 🎯 تعیین scoringMode: اگر tm دارای گروه باشد و کاربر چیزی مشخص نکرده باشد، از گروه استفاده کن
    let scoringMode;
    if (options.personConfig.scoringMode && options.personConfig.scoringMode !== 'auto') {
        scoringMode = options.personConfig.scoringMode;
    } else if (groupsFromTM.length > 0) {
        scoringMode = 'group';
    } else {
        scoringMode = 'global';
    }

    // لاگ حالت محاسباتی
    logInfo(SourceLog, 'scoring', '385', 
      'حالت محاسباتی: ' + scoringMode + ', گروه‌ها: ' + groupsFromTM.length);

    // 📊 ایجاد ساختار داده برای ذخیره نتایج این نوع ماموریت
    statisticsParvaz[tm.shortName] = {
      persons: {},              //شامل امتیازات و درصدهای یک نفر و گروه های ان 
      ruleWeightData: {},       // وزن‌های قوانین
      balanceScore: {},         // امتیازهای تعادل
      groupStatistics:  {} ,
      gradingConfig: {          // 🆕 ذخیره تنظیمات گریدبندی استفاده شده
        levelsCount: options.levelsCount,
        isAscending: options.isAscending
      },
      count: mAt.count,         //تعداد ماموریت
      days: mAt.days ,           //تعداد روز ماموریت
      // 🆕 اضافه کردن excluded persons
      excludedPersons: options.personConfig.excluded || []
    };

    // 🔧 فیلتر کردن نفرات بر اساس personConfig - حذف افراد excluded
    let filteredPersons = persons;
    if (options.personConfig.excluded.length > 0) {
      filteredPersons = persons.filter(p => !options.personConfig.excluded.includes(p));
      logDebug(SourceLog, 'excluded', '965', 
        'افراد حذف شده: ' + options.personConfig.excluded.length + ' نفر');
    }


    // 🗃️ تعریف آرایه‌های مورد نیاز برای محاسبات آماری
    const countAll = {};              // تعداد کل ماموریت‌های هر نفر در تمام انواع
    const daysAll = {};               // مجموع روزهای ماموریت هر نفر در تمام انواع
    const countType = {};             // تعداد ماموریت‌های هر نفر در این نوع خاص
    const daysType = {};              // مجموع روزهای ماموریت هر نفر در این نوع خاص
    const ratioTypeToAll = {};
    const countRule2NotZero = {};
    const ratioTypeToRule2NotZero = {};
    const countRule2Groups = {};
    const ratioTypeToGroups = {};
    const countGroup  = {};           //تعداد روز نسبت گروههای مشخص شده در قانون ۲
    const ratio = {};                 //نسبت نهایی در قانون ۲
    const uniformityCount = {};       // تعدیل یکنواختی اعمال‌شده برای هر نفر
    const count_UType = {}; // تعداد ماموریت‌ها پس از اعمال تعدیل یکنواختی
    const CoeffPerson = {};           // ضریب تمایل هر نفر برای این نوع ماموریت
    const recentCount = {};           // تعداد ماموریت‌های هر نفر در چند روز گذشته
    const recentTypeCount = {};       // تعداد ماموریت‌های هر نفر در چند روز گذشته مربوط به این گروه
    const consolidatedCount = {};
    const consolidatedUniformity = {};
    const consolidatedCount_U = {};
    const consolidatedDays = {};

    // 🎯 شناسایی گروه‌های مربوط به قانون ۲
    const rule2Groups = (tm.rule2_GroupsType || [])
      .filter(groupName => typeMamoriatArray.some(tm => tm.shortName === groupName));
    logData(SourceLog, 'tm.rule2_GroupsType', '2492', tm.rule2_GroupsType)
    logData(SourceLog, 'rule2Groups', '2493', rule2Groups)

    // 🎯 شناسایی نوع‌های ماموریت که rule2_PersonInTypePct ≠ 0 دارند
    const rule2NotZeroTypes = typeMamoriatArray
      .filter(otherTm => otherTm.rule2_PersonInTypePct > 0)
      .map(otherTm => otherTm.shortName);
    logData(SourceLog, 'rule2NotZeroTypes', '2495', 
       rule2NotZeroTypes)

    // 👤 پردازش داده‌های هر نفر به صورت جداگانه
    filteredPersons.forEach(p => {
      const mAtp = mAt.filterByPerson(p);
      const mAp = mArrayParvaz.filterByPerson(p);

      // 🧮 محاسبات آماری پایه برای هر نفر
      countAll[p] = mAp.count;
      daysAll[p] = mAp.days;
      countType[p] = mAtp.count;
      daysType[p] = mAtp.days;

      // 🔄 اعمال تعدیل یکنواختی (اصلاح برنامه‌ای)
      uniformityCount[p] = tm.uniformityCountByPerson(p)
      count_UType[p] = countType[p] + uniformityCount[p];

      // 💖 محاسبه ضریب تمایل نفر (درصد بکارگیری)
      const directPersonEntry = tm.rule5_CoeffPerson.find(item => item.نفر === p);
      CoeffPerson[p] = directPersonEntry ? directPersonEntry["درصد بکارگیری"] / 100 : 1;


      // 📅 محاسبه ماموریت‌های اخیر (فقط اگر includeRecentMissions=true باشد)
      if (options.includeRecentMissions) {
        const nDaysAgo = (n) => {
          const date = new Date();
          date.setDate(date.getDate() - n);
          return date;
        };
        
        const firstDaysAgo = nDaysAgo(tm.rule4_RecentDays || 3);
        const missionsNDaysInAll = mAp.filter(m => m.startDate >= firstDaysAgo);
        recentCount[p] = missionsNDaysInAll.length;
        
        const secondDaysAgoInType = nDaysAgo(tm.rule4_RecentDaysInType || 7);
        const missionsNDaysInType = mAtp.filter(m => m.startDate >= secondDaysAgoInType);
        recentTypeCount[p] = missionsNDaysInType.length;
      } else {
        // ❌ اگر ماموریت‌های اخیر لحاظ نشود، مقادیر صفر می‌شوند
        recentCount[p] = 0;
        recentTypeCount[p] = 0;
      }
      // محاسبه نسبت پایه به کل ماموریت‌های پروازی
      ratioTypeToAll[p] = countAll[p] > 0 ? Math.round(countType[p] * 100 / countAll[p]) : 0
      // محاسبه نسبت فقط برای گروه‌های با rule2_PersonInTypePct ≠ 0
      countRule2NotZero[p] = mAp.filter(m => rule2NotZeroTypes.includes(m.typeParvazEntryLink.shortName)).count;
      ratioTypeToRule2NotZero[p] =  countRule2NotZero[p] > 0 ? Math.round(countType[p] * 100 / countRule2NotZero[p]) : 0;
      // محاسبه نسبت فقط برای گروه‌های مشخص شده
      countRule2Groups[p] = mAp.filter(m => rule2Groups.includes(m.typeParvazEntryLink.shortName)).count;
      ratioTypeToGroups[p] = countRule2Groups[p] > 0 ? Math.round(countType[p] * 100 / countRule2Groups[p]) : 0;
      // ابتدا Case را بررسی و محاسبات لازم را انجام می‌دهیم
      switch(tm.rule2_TypePerson) {
        case 'فقط در گروه هایی که این ضریب را دارند':
          countGroup[p]=countRule2NotZero[p]
          ratio[p] =  ratioTypeToRule2NotZero[p];
          break;
        case 'در گروه های مشخص شده':
          countGroup[p]=countRule2Groups[p]
          ratio[p] =  ratioTypeToGroups[p];
          break;
        case 'در تمامی گروه های پروازی':
        default:
          // پیش‌فرض: نسبت به کل ماموریت‌های پروازی
          countGroup[p]=countAll[p]
          ratio[p] = ratioTypeToAll[p];
      }
       // 🎯 جمع‌آوری داده‌های Consolidated 
      const personConsolidated = 
          consolidatedData && 
          tm.consolidationType_Name && 
          consolidatedData[tm.consolidationType_Name] && 
          consolidatedData[tm.consolidationType_Name].persons && 
          consolidatedData[tm.consolidationType_Name].persons[p] ? 
          consolidatedData[tm.consolidationType_Name].persons[p] : 
          null;
      
      consolidatedCount[p] = personConsolidated && personConsolidated.normalized ? 
          (Math.round((personConsolidated.normalized.missions - 1) *100) || 0) : 0; // تغییر بازه [1 - 10] -> [0-1000]
      consolidatedUniformity[p] = personConsolidated && personConsolidated.normalized ? 
          (Math.round((personConsolidated.normalized.uniformity ) *100) || 0) : 0; // تغییر بازه [1 - 10] -> [0-1000]
      consolidatedCount_U[p] = personConsolidated && personConsolidated.normalized ? 
          (Math.round((personConsolidated.normalized.missions_U - 1) *100) || 0) : 0; // تغییر بازه [1 - 10] -> [0-1000]
          
      consolidatedDays[p] = personConsolidated && personConsolidated.normalized ? 
          (Math.round((personConsolidated.normalized.days -1)*100) || 0) : 0;
      
    });

    // 🎯 تعیین منبع نسبت برای لاگ‌گیری و گزارش
    let ratioSource = '';
    let ratioGroup = '';
    
    switch(tm.rule2_TypePerson) {
        case 'در تمامی گروه های پروازی': 
            ratioSource = 'تمام گروه‌های پروازی';
            ratioGroup = 'All';
            break;
        case 'فقط در گروه هایی که این ضریب را دارند': 
            ratioSource = 'گروه‌های با قانون ۲ غیرصفر';
            ratioGroup = rule2NotZeroTypes.join(', '); // 🆕 لیست missionType‌ها
            break;
        case 'در گروه های مشخص شده': 
            ratioSource = 'گروه‌های مشخص شده';
            ratioGroup = rule2Groups.join(', '); // 🆕 لیست missionType‌ها
            break;
        default: 
            ratioSource = 'تمام گروه‌های پروازی (پیش‌فرض)';
            ratioGroup = 'All';
    }
    
    // لاگ قانون ۲
    logDebug(SourceLog, 'rule2', '400', 
        'قانون ۲: ' + ratioSource + ', گروه: ' + ratioGroup);

    // 🎯 محاسبه وزن‌های قوانین بر اساس تنظیمات نوع ماموریت
    let weightCount = tm.rule1_CountPct/100;
    let weightDays = tm.rule1_SumDayPct/100;
    let weightRatio = tm.rule2_PersonInTypePct/100;
    let weightRecent = options.includeRecentMissions ? tm.rule4_RecentDaysPct/100 : 0;
    let weightRecentType = options.includeRecentMissions ? tm.rule4_RecentDaysInTypePct/100 : 0;
    let weightConsolidatedCount = tm.rule7_NormalizedCountPct/100 || 0;
    let weightConsolidatedDays = tm.rule7_NormalizedDaysPct/100 || 0;
    let orderConsolidated = tm.rule7_Order || false;

    // 🧮 محاسبه مجموع وزن‌ها برای نرمال‌سازی
    let weightTotalRules = weightCount + weightDays + weightRatio + 
                           weightRecent + weightRecentType +
                           weightConsolidatedCount + weightConsolidatedDays;    
    // 🔧 جلوگیری از تقسیم بر صفر و اصلاح اوزان در صورت نیاز
    if (weightTotalRules === 0) {
      weightCount = 0.25; 
      weightDays = 0.1; 
      weightRatio = 0.4; 
      weightRecent = 0.03; 
      weightRecentType = 0.02; 
      weightConsolidatedCount = 0.15;
      weightConsolidatedDays = 0.05;
      weightTotalRules = 1;
      logWarn(SourceLog, 'weights', '430', 'وزن‌ها صفر بودند، مقادیر پیش‌فرض اعمال شد');
    }
    
    // لاگ وزن‌ها
    logDebug(SourceLog, 'weights', '430', 
      'وزن‌ها: تعداد=' + (weightCount*100).toFixed(1) + '%, روزها=' + (weightDays*100).toFixed(1) + '%, نسبت=' + (weightRatio*100).toFixed(1) + '%');

    // 💾 ذخیره وزن‌های محاسبه‌شده در ساختار نتایج
    statisticsParvaz[tm.shortName].ruleWeightData = {
      weightCount: weightCount,
      weightDays: weightDays,
      weightRatio: weightRatio,
      weightRecent: weightRecent,
      weightRecentType: weightRecentType,
      weightTotalRules: weightTotalRules,
      weightConsolidatedCount : weightConsolidatedCount,
      weightConsolidatedDays : weightConsolidatedDays,
      // 🆕 اضافه کردن اطلاعات ratio
      ratioConfig: {
          ratioSource: ratioSource,
          ratioGroup: ratioGroup, // 🆕 حالا شامل لیست missionType‌هاست
          rule2TypePerson: tm.rule2_TypePerson,
          rule2NotZeroTypes: rule2NotZeroTypes,
          rule2Groups: rule2Groups
      }
    };
    // 🎯 ساختار گروه‌بندی کامل با گروه نهایی
    const groupsStructure = (() => {
      const isGroupMode = scoringMode === 'group';
      
      // 🎯 سازماندهی گروه‌ها
      let organizedGroups = {};
      let groupSource = '';
      
      if (!isGroupMode) {
        organizedGroups = { 'All': filteredPersons };
        groupSource = 'global';
      } else if (groupsFromTM.length > 0) {
        organizedGroups = Object.fromEntries(
          groupsFromTM
            .filter(groupObj => groupObj.گروه)
            .map(groupObj => {
              const mainMembers = (groupObj["نفرات اصلی"] || []).filter(p => filteredPersons.includes(p));
              const otherMembers = (groupObj["دیگر نفرات"] || [])
                .filter(p => filteredPersons.includes(p) && !mainMembers.includes(p));
              const allMembers = mainMembers.concat(otherMembers);
              return allMembers.length > 0 ? [groupObj.گروه, allMembers] : null;
            })
            .filter(Boolean)
        );
        
        let allGroupedPersons = Object.values(organizedGroups).flat();
        let ungroupedPersons = filteredPersons.filter(p => !allGroupedPersons.includes(p));
        if (ungroupedPersons.length > 0) {
          organizedGroups['NoGroup'] = ungroupedPersons;
        }
        
        groupSource = 'mission_type';
      } else if (Object.keys(userGroups).length > 0) {
        organizedGroups = Object.fromEntries(
          Object.entries(userGroups)
            .map(([groupName, members]) => [
              groupName, 
              (members || []).filter(p => filteredPersons.includes(p))
            ])
            .filter(([_, members]) => members.length > 0)
        );
        
        let allGroupedPersons = Object.values(organizedGroups).flat();
        let ungroupedPersons = filteredPersons.filter(p => !allGroupedPersons.includes(p));
        if (ungroupedPersons.length > 0) {
          organizedGroups['NoGroup'] = ungroupedPersons;
        }
        
        groupSource = 'user_defined';
      } else {
        organizedGroups = { 'All': filteredPersons };
        groupSource = 'global_fallback';
      }
      
      // 🎯 نقشه‌های دسترسی
      const personGroupMap = {};
      const priorityGroupMap = {};
      const secondaryGroupMap = {};
      
      Object.entries(organizedGroups).forEach(([groupName, members]) => {
        members.forEach(person => {
          if (!personGroupMap[person]) personGroupMap[person] = [];
          personGroupMap[person].push(groupName);
        });
      });
      
      if (groupSource === 'mission_type') {
        groupsFromTM.forEach(groupObj => {
          if (!groupObj.گروه) return;
          
          (groupObj["نفرات اصلی"] || []).forEach(person => {
            if (filteredPersons.includes(person)) priorityGroupMap[person] = groupObj.گروه;
          });
          
          (groupObj["دیگر نفرات"] || []).forEach(person => {
            if (filteredPersons.includes(person) && !priorityGroupMap[person]) {
              secondaryGroupMap[person] = groupObj.گروه;
            }
          });
        });
      }
      
      // 🎯 محاسبه گروه نهایی برای هر نفر
      const finalGroups = {};
      
      filteredPersons.forEach(person => {
        const personGroups = personGroupMap[person] || [];
        
        if (personGroups.length === 0) {
          finalGroups[person] = isGroupMode ? 'NoGroup' : 'All';
        } else if (personGroups.length === 1) {
          finalGroups[person] = personGroups[0];
        } else {
          // تصمیم‌گیری برای نفرات چندگروهی
          if (priorityGroupMap[person] && personGroups.includes(priorityGroupMap[person])) {
            finalGroups[person] = priorityGroupMap[person];
          } else if (secondaryGroupMap[person] && personGroups.includes(secondaryGroupMap[person])) {
            finalGroups[person] = secondaryGroupMap[person];
          } else {
            finalGroups[person] = personGroups[0];
          }
        }
      });
      
      // 🎯 نفرات چندگروهی
      const multiGroupPersons = Object.fromEntries(
        Object.entries(personGroupMap)
          .filter(([_, groups]) => groups.length > 1)
          .map(([person, groups]) => [person, { 
            allGroups: groups,
            finalGroup: finalGroups[person]
          }])
      );
      
      return {
        // 🎯 ساختار اصلی
        organizedGroups: organizedGroups,
        personGroupMap: personGroupMap,
        priorityGroupMap: priorityGroupMap,
        secondaryGroupMap: secondaryGroupMap,
        finalGroups: finalGroups, // 🆕 گروه نهایی هر نفر
        multiGroupPersons: multiGroupPersons,
        
        // ⚙️ تنظیمات
        config: {
          scoringMode: scoringMode,
          groupSource: groupSource,
          isGroupMode: isGroupMode
        }
      };
    })();
    // لاگ سازماندهی گروه‌ها
    logData(SourceLog, 'grouping', 3381, groupsStructure, 'ساختار گروه‌ها');
    
    // 💾 ذخیره در ساختار اصلی
    statisticsParvaz[tm.shortName].groupsStructure = groupsStructure;
    
    // 🔄 محاسبات برای هر گروه در organizedGroups
    Object.entries(groupsStructure.organizedGroups).forEach(([groupName, groupMembers]) => {
      // ⏩ اگر گروه خالی باشد، از پردازش آن صرف‌نظر کن
      if (groupMembers.length === 0) return;

      // لاگ محاسبات گروه
      logDebug(SourceLog, 'calculations', '405', 
        'محاسبات گروه ' + groupName + ': ' + groupMembers.length + ' نفر');

      // 📊 محاسبات آماری برای گروه - استفاده از تابع getStates برای تحلیل توزیع داده‌ها
      const stateCount_UType = getStates(
        Object.fromEntries(groupMembers.map(p => [p, count_UType[p]])), 
        {order:'asc'}
      );
      const stateDays = getStates(
        Object.fromEntries(groupMembers.map(p => [p, daysType[p]])), 
        {order:'asc'}
      );
      const stateRatio = getStates(
        Object.fromEntries(groupMembers.map(p => [p, ratio[p]])), 
        {order:'asc'}
      );
      const stateRecent = getStates(
        Object.fromEntries(groupMembers.map(p => [p, recentCount[p]])), 
        {order:'asc'}
      );
      const stateRecentType = getStates(
        Object.fromEntries(groupMembers.map(p => [p, recentTypeCount[p]])), 
        {order:'asc'}
      );
      const stateConsolidatedCount = getStates(
        Object.fromEntries(groupMembers.map(p => [p, consolidatedCount_U[p]])), 
        {order:(orderConsolidated?'desc':'asc')}
      );
      
      const stateConsolidatedDays = getStates(
        Object.fromEntries(groupMembers.map(p => [p, consolidatedDays[p]])), 
        {order:(orderConsolidated?'desc':'asc')}
      );
        
      // 📈 محاسبه امتیازها و درصدها برای هر فاکتور
      const scoreCount = stateCount_UType.scores;
      const scoreDays = stateDays.scores;
      const scoreRatio = stateRatio.scores;
      const scoreRecent = stateRecent.scores;
      const scoreRecentType = stateRecentType.scores;
      const scoreConsolidatedCount = stateConsolidatedCount.scores;
      const scoreConsolidatedDays = stateConsolidatedDays.scores;

      // 🧮 محاسبه درصدهای وزنی برای هر فاکتور
      const percentCount = Object.fromEntries(groupMembers.map(p => [p, Math.round(scoreCount[p] * weightCount * weightTotalRules)]));
      const percentDays = Object.fromEntries(groupMembers.map(p => [p, Math.round(scoreDays[p] * weightDays * weightTotalRules)]));
      const percentCountDays = Object.fromEntries(groupMembers.map(p => [p, Math.round(percentCount[p] + percentDays[p])]));
      const percentRatio = Object.fromEntries(groupMembers.map(p => [p, Math.round(scoreRatio[p] * weightRatio * weightTotalRules)]));
      const percentRecent = Object.fromEntries(groupMembers.map(p => [p, Math.round(scoreRecent[p] * weightRecent * weightTotalRules)]));
      const percentRecentType = Object.fromEntries(groupMembers.map(p => [p, Math.round(scoreRecentType[p] * weightRecentType * weightTotalRules)]));
      const percentRecents = Object.fromEntries(groupMembers.map(p => [p, Math.round(percentRecent[p] + percentRecentType[p])]));
      const percentConsolidatedCount = Object.fromEntries(groupMembers.map(p => [p, Math.round(scoreConsolidatedCount[p] * weightConsolidatedCount * weightTotalRules)]));
      const percentConsolidatedDays = Object.fromEntries(groupMembers.map(p => [p, Math.round(scoreConsolidatedDays[p] * weightConsolidatedDays * weightTotalRules)]));
      const percentConsolidated = Object.fromEntries(groupMembers.map(p => [p, Math.round(percentConsolidatedCount[p] + percentConsolidatedDays[p])]));
      const percentBase = Object.fromEntries(
        groupMembers.map(p => [p, Math.round(
          percentCount[p] + percentDays[p] + percentRatio[p] +
          percentRecent[p] + percentRecentType[p] +
          percentConsolidatedCount[p] + percentConsolidatedDays[p]
        )])
      );
      // 🎯 محاسبه درصد نهایی با اعمال ضریب تمایل (منطق معکوس)
      const percentTotal = Object.fromEntries(groupMembers.map(p => [p, percentBase[p] * (2 - CoeffPerson[p])]));

      // 🎓 گریدبندی نتایج با استفاده از پارامترهای جدید
      const gradeCountDays = getGrade(percentCountDays, options.levelsCount, options.isAscending);
      const gradeRatio = getGrade(percentRatio, options.levelsCount, options.isAscending);
      const gradeRecents = getGrade(percentRecents, options.levelsCount, options.isAscending);
      const gradeConsolidated = getGrade(percentConsolidated, options.levelsCount, options.isAscending);
      const gradeBase = getGrade(percentBase, options.levelsCount, options.isAscending);
      const gradeTotal = getGrade(percentTotal, options.levelsCount, options.isAscending);

      // ذخیره نتایج گروه
      const stateGroupPersons = Object.fromEntries(
        groupMembers.map(p => [p, {
          // 📊 داده‌های آماری پایه
          count: countType[p],
          uniformityCount: uniformityCount[p],
          count_U: count_UType[p],
          days: daysType[p],
          countAll: countAll[p],
          daysAll: daysAll[p],
          countGroup: countGroup[p],
          ratio: ratio[p],
          recentCount: recentCount[p],
          recentTypeCount: recentTypeCount[p],
          consolidatedCount: consolidatedCount[p],
          consolidatedUniformity: consolidatedUniformity[p],
          consolidatedCount_U: consolidatedCount_U[p],
          consolidatedDays: consolidatedDays[p],
          CoeffPerson: CoeffPerson[p],
          
          // ⚠️ اطلاعات outlier
          outlierInfo: {
            count: stateCount_UType.outliers[p] ? '⚠️' : '✅',
            days: stateDays.outliers[p] ? '⚠️' : '✅',
            ratio: stateRatio.outliers[p] ? '⚠️' : '✅',
            recent: stateRecent.outliers[p] ? '⚠️' : '✅',
            recentType: stateRecentType.outliers[p] ? '⚠️' : '✅',
            consolidatedCount: stateConsolidatedCount.outliers[p] ? '⚠️' : '✅',
            consolidatedDays: stateConsolidatedDays.outliers[p] ? '⚠️' : '✅'
          },
          
          // 📈 امتیازهای محاسباتی
          scoreCount: scoreCount[p],
          scoreDays: scoreDays[p],
          scoreRatio: scoreRatio[p],
          scoreRecent: scoreRecent[p],
          scoreRecentType: scoreRecentType[p],
          scoreConsolidatedCount: scoreConsolidatedCount[p],
          scoreConsolidatedDays: scoreConsolidatedDays[p],
          
          // 💯 درصدهای محاسباتی
          percentCount: percentCount[p],
          percentDays: percentDays[p],
          percentCountDays: percentCountDays[p],
          percentRatio: percentRatio[p],
          percentRecent: percentRecent[p],
          percentRecentType: percentRecentType[p],
          percentRecents: percentRecents[p],
          percentConsolidatedCount: percentConsolidated[p],
          percentConsolidatedDays: percentConsolidatedDays[p],
          percentConsolidated: percentConsolidated[p],
          percentBase: percentBase[p],
          percentTotal: percentTotal[p],
          
          // 🎯 گریدهای تعیین‌شده
          gradeCountDays: gradeCountDays.details[p].grade,
          gradeRatio: gradeRatio.details[p].grade,
          gradeRecents: gradeRecents.details[p].grade,
          gradeConsolidated: gradeConsolidated.details[p].grade,
          gradeBase: gradeBase.details[p].grade,
          gradeTotal: gradeTotal.details[p].grade,
          
          // 🔢 سطوح اولویت
          priorityCountDays: gradeCountDays.details[p].priorityLevel,
          priorityRatio: gradeRatio.details[p].priorityLevel,
          priorityRecents: gradeRecents.details[p].priorityLevel,
          priorityConsolidated: gradeConsolidated.details[p].priorityLevel,
          priorityTotal: gradeTotal.details[p].priorityLevel
        }])
      );

      // 📊 ذخیره آمار گروه
      statisticsParvaz[tm.shortName].groupStatistics[groupName] = {
        groupName:groupName,
        memberCount: groupMembers.length,
        members: groupMembers,
        balanceScore: {
          balanceCount: stateCount_UType.balanceScore,
          balanceDays: stateDays.balanceScore,
          balanceRatio: stateRatio.balanceScore,
          balanceRecent: stateRecent.balanceScore,
          balanceConsolidatedCount: stateConsolidatedCount.balanceScore,
          balanceConsolidatedDays: stateConsolidatedDays.balanceScore,
          balanceRecentType: stateRecentType.balanceScore
        },
        gradeDetails: {
          gradeCountDays: gradeCountDays.summary,
          gradeRatio: gradeRatio.summary,
          gradeRecents: gradeRecents.summary,
          gradeConsolidated: gradeConsolidated.summary,
          gradeTotal: gradeTotal.summary
        },
        persons: stateGroupPersons
      };
      
    });
    
    // 🎯 تعیین گروه نهایی برای هر نفر - نسخه ساده‌شده
    filteredPersons.forEach(p => {
      const finalGroup = groupsStructure.finalGroups[p];
      
      // 🎯 پیدا کردن داده‌های گروه نهایی
      const finalGroupData = statisticsParvaz[tm.shortName].groupStatistics && 
                            statisticsParvaz[tm.shortName].groupStatistics[finalGroup] &&
                            statisticsParvaz[tm.shortName].groupStatistics[finalGroup].persons &&
                            statisticsParvaz[tm.shortName].groupStatistics[finalGroup].persons[p];
      
      if (finalGroupData) {
        // ایجاد یا به‌روزرسانی ساختار persons
        if (!statisticsParvaz[tm.shortName].persons[p]) {
          statisticsParvaz[tm.shortName].persons[p] = {};
        }
        
        // کپی داده‌ها از گروه نهایی
        Object.keys(finalGroupData).forEach(key => {
          statisticsParvaz[tm.shortName].persons[p][key] = finalGroupData[key];
        });
        
        // اضافه کردن groupname نهایی
        statisticsParvaz[tm.shortName].persons[p].groupname = finalGroup;
        
        // لاگ برای نفرات چندگروهی
        const personGroups = groupsStructure.personGroupMap[p] || [];
        if (personGroups.length > 1) {
          logDebug(SourceLog, 'finalGroup', '415', 
            'نفر ' + p + ': گروه‌ها=' + personGroups.join(', ') + ', نهایی=' + finalGroup);
        }
      } else {
        logWarn(SourceLog, 'finalGroup', '420', 
          'داده‌ای برای نفر ' + p + ' در گروه نهایی ' + finalGroup + ' یافت نشد');
      }
    });
    
    // 📊 ذخیره balanceScore کلی برای این نوع ماموریت
    statisticsParvaz[tm.shortName].balanceScore = {  
      balanceCount: getStates(count_UType, {order:'asc'}).balanceScore,
      balanceDays: getStates(daysType, {order:'asc'}).balanceScore,
      balanceRatio: getStates(ratio, {order:'asc'}).balanceScore,
      balanceRecent: getStates(recentCount, {order:'asc'}).balanceScore,
      balanceConsolidatedCount: getStates(consolidatedCount_U, {order:'desc'}).balanceScore,
      balanceConsolidatedDays: getStates(consolidatedDays, {order:'desc'}).balanceScore,
      balanceRecentType: getStates(recentTypeCount, {order:'asc'}).balanceScore
    };

    // لاگ تعادل نهایی
    logInfo(SourceLog, 'balance', '1005', 
      'تعادل نهایی ' + tm.shortName + ': تعداد=' + statisticsParvaz[tm.shortName].balanceScore.balanceCount + '%, روزها=' + statisticsParvaz[tm.shortName].balanceScore.balanceDays + '%');

    // 📝 ایجاد گزارش آماری برای قوانین
    const ruleReports = generateRuleReports(statisticsParvaz[tm.shortName]);
    
    // 💾 اختصاص نتایج به نوع ماموریت برای ذخیره در دیتابیس
    tm.rule1_Calc = ruleReports.rule1_Calc;
    tm.rule2_Calc = ruleReports.rule2_Calc;
    tm.rule4_Calc = ruleReports.rule4_Calc;
    tm.rule6_Calc = ruleReports.rule6_Calc;
    tm.rule7_Calc = ruleReports.rule7_Calc;
    tm.ruleTotal_Calc = ruleReports.ruleTotal_Calc;
  });

  // لاگ اتمام محاسبات
  logInfo(SourceLog, 'complete', '465', 
    'اتمام محاسبات: ' + Object.keys(statisticsParvaz).length + ' نوع ماموریت پردازش شد');

  // 🏁 بازگشت نتایج نهایی
  return statisticsParvaz;
};

function generateRuleReports(tmStatics) {
    const persons = Object.keys(tmStatics.persons);
    
    logInfo('generateRuleReports', 'init', '475', 
        'شروع تولید گزارش برای ' + persons.length + ' نفر');
    
    // تابع کمکی برای تعیین آیکون وضعیت بالانس
    function getBalanceIcon(score) {
        if (score >= 80) return '🟢';
        if (score >= 65) return '🟡';
        if (score >= 50) return '🟠';
        return '🔴';
    }

    // 🎯 تابع برای تعیین علامت گروه نهایی
    function getFinalSign(personName, groupName, finalGroup) {
        return groupName === finalGroup ? '🟢': '🔴';
    }
    // 🆕 اضافه کردن excluded persons به انتهای گزارش قانون ۶
    let excludedPersons_Calc='';
    if (tmStatics.excludedPersons && tmStatics.excludedPersons.length > 0) {
        excludedPersons_Calc += "\n## افراد حذف شده (Excluded)\n\n";
        excludedPersons_Calc += tmStatics.excludedPersons.join(', ');
        excludedPersons_Calc += "\n";
    }

    // محاسبه و چاپ قانون ۱
    const rule1_Balance = formatText("Balance Scores - Count: {balanceScoreCount} {balanceIconCount}, Days: {balanceScoreDays} {balanceIconDays}\n", {
        balanceScoreCount: tmStatics.balanceScore.balanceCount,
        balanceIconCount: getBalanceIcon(tmStatics.balanceScore.balanceCount),
        balanceScoreDays: tmStatics.balanceScore.balanceDays,
        balanceIconDays: getBalanceIcon(tmStatics.balanceScore.balanceDays)
    });
    
    let rule1_Markdown = "P,G,CountU,CntScore,Dys,DysScore,Sum\n";
    
    // 🎯 استفاده از groupStatistics به جای persons.groups
    Object.entries(tmStatics.groupStatistics).forEach(([groupName, groupStats]) => {
        Object.entries(groupStats.persons).forEach(([personName, personData]) => {
            const finalGroup = tmStatics.persons[personName].groupname;
            const finalSign = getFinalSign(personName, groupName, finalGroup);
            
            const rule1CountOutlierIcon = personData.outlierInfo.count === '⚠️' ? personData.outlierInfo.count : '';
            const rule1DaysOutlierIcon = personData.outlierInfo.days === '⚠️' ? personData.outlierInfo.days : '';
            const signUni = personData.uniformityCount >= 0 ? '+' : '-';
            
            rule1_Markdown += formatText("{p},{group}{finalSign},{cntOutIcon}{cnt}{signUni}{uni:1}:{sumCount},{scoreCount:3}%({percentCount}%),{daysOutIcon}{days:2},{scoreDays:3}%({percentDays}%),{percentCountDays}%\n", {
                p: personName,
                group: groupName,
                finalSign: finalSign,
                cnt: personData.count,
                signUni: signUni,
                uni: Math.abs(personData.uniformityCount),
                sumCount: personData.count_U,
                scoreCount: personData.scoreCount,
                percentCount: personData.percentCount,
                cntOutIcon: rule1CountOutlierIcon,
                days: personData.days,
                daysOutIcon: rule1DaysOutlierIcon,
                scoreDays: personData.scoreDays,
                percentDays: personData.percentDays,
                percentCountDays: personData.percentCountDays
            });
        });
    });
    
    rule1_Markdown = rule1_Markdown.slice(0, -1);
    const rule1_Calc = rule1_Balance + csvToMarkdown(rule1_Markdown, {delimiter: ",", compact: true});
    
    logInfo('generateRuleReports', 'rule1', '3038', 
        'قانون ۱: تعادل تعداد=' + tmStatics.balanceScore.balanceCount + '%, روزها=' + tmStatics.balanceScore.balanceDays + '%');
    
    // محاسبه و چاپ قانون ۲ - ❌ بدون finalSign
    const rule2_Balance = formatText("Balance Score - Ratio: {balanceScoreRatio} {balanceIconRatio}\n", {
        balanceScoreRatio: tmStatics.balanceScore.balanceRatio,
        balanceIconRatio: getBalanceIcon(tmStatics.balanceScore.balanceRatio)
    });
    
    let rule2_Markdown = "P,Cnt Type/group,Score,Percent\n";
    
    // 🎯 استفاده از groupStatistics - فقط یک رکورد برای هر نفر (گروه نهایی)
    persons.forEach(personName => {
        const personData = tmStatics.persons[personName];
        const finalGroup = personData.groupname;
        
        if (tmStatics.groupStatistics[finalGroup] && tmStatics.groupStatistics[finalGroup].persons[personName]) {
            const personGroupData = tmStatics.groupStatistics[finalGroup].persons[personName];
            
            const rule2RatioOutlierIcon = personGroupData.outlierInfo.ratio === '⚠️' ? personGroupData.outlierInfo.ratio : '';
            
            rule2_Markdown += formatText("{p},{ratioOutIcon}{cntTyp:2}/{cntGrp:3} ({ratio:3}%),{scoreRatio:3}%,{percentRatio}%\n", {
                p: personName,
                group: finalGroup,
                cntTyp: personGroupData.count,
                ratioOutIcon: rule2RatioOutlierIcon,
                cntGrp: personGroupData.countGroup,
                ratio: personGroupData.ratio,
                scoreRatio: personGroupData.scoreRatio,
                percentRatio: personGroupData.percentRatio
            });
        }
    });
    
    rule2_Markdown = rule2_Markdown.slice(0, -1);
    let rule2_Calc = rule2_Balance + csvToMarkdown(rule2_Markdown, {delimiter: ",", compact: true});
        
    // 🆕 اضافه کردن اطلاعات ratioSource و ratioGroup به انتهای گزارش قانون ۲
    if (tmStatics.ruleWeightData && tmStatics.ruleWeightData.ratioConfig) {
        const ratioConfig = tmStatics.ruleWeightData.ratioConfig;
        rule2_Calc += "\n## تنظیمات قانون ۲\n\n";
        rule2_Calc += "**منبع محاسبه:** " + ratioConfig.ratioSource + "\n\n";
        rule2_Calc += "**گروه‌های محاسبه:** " + ratioConfig.ratioGroup + "\n\n";
        rule2_Calc += "**نوع قانون:** " + ratioConfig.rule2TypePerson + "\n";
    }
    
    logInfo('generateRuleReports', 'rule2', '3085', 
        'قانون ۲: تعادل نسبت=' + tmStatics.balanceScore.balanceRatioTypeToAll + '%');    
        
    // محاسبه و چاپ قانون ۴
    const rule4_Balance = formatText("Balance Scores - Recent Mission: {balanceScoreRecent} {balanceIconRecent}, Recent Mission Type: {balanceScoreRecentType} {balanceIconRecentType}\n", {
        balanceScoreRecent: tmStatics.balanceScore.balanceRecent,
        balanceIconRecent: getBalanceIcon(tmStatics.balanceScore.balanceRecent),
        balanceScoreRecentType: tmStatics.balanceScore.balanceRecentType,
        balanceIconRecentType: getBalanceIcon(tmStatics.balanceScore.balanceRecentType)
    });
    
    let rule4_Markdown = "P,G,Rcnt1,Rcnt2,Score1,Score2,Sum\n";
    
    // 🎯 استفاده از groupStatistics
    Object.entries(tmStatics.groupStatistics).forEach(([groupName, groupStats]) => {
        Object.entries(groupStats.persons).forEach(([personName, personData]) => {
            const finalGroup = tmStatics.persons[personName].groupname;
            const finalSign = getFinalSign(personName, groupName, finalGroup);
            
            const rule4RecentOutlierIcon = personData.outlierInfo.recent === '⚠️' ? personData.outlierInfo.recent : '';
            const rule4RecentTypeOutlierIcon = personData.outlierInfo.recentType === '⚠️' ? personData.outlierInfo.recentType : '';
            
            rule4_Markdown += formatText("{p},{group}{finalSign},{recent1:2}{recentOut:1},{recent2:2}{recentTypeOut:1},{scoreRecent:3}%({percentRecent}%),{scoreRecentType:3}%({percentRecentType}%),{percentRecents}%\n", {
                p: personName,
                group: groupName,
                finalSign: finalSign,
                recent1: personData.recentCount,
                recent2: personData.recentTypeCount,
                scoreRecent: personData.scoreRecent,
                percentRecent: personData.percentRecent,
                scoreRecentType: personData.scoreRecentType,
                percentRecentType: personData.percentRecentType,
                recentOut: rule4RecentOutlierIcon,
                recentTypeOut: rule4RecentTypeOutlierIcon,
                percentRecents: personData.percentRecents
            });
        });
    });
    
    rule4_Markdown = rule4_Markdown.slice(0, -1);
    const rule4_Calc = rule4_Balance + csvToMarkdown(rule4_Markdown, {delimiter: ",", compact: true});

    logInfo('generateRuleReports', 'rule4', '495', 
        'قانون ۴: تعادل اخیر=' + tmStatics.balanceScore.balanceRecent + '%, اخیر نوع=' + tmStatics.balanceScore.balanceRecentType + '%');

    // محاسبه و چاپ قانون ۶ (گروه‌های محاسباتی) - 🎯 با تفکیک اعضای نهایی و غیر نهایی
    let rule6_Calc = "";
    if (tmStatics.groupStatistics && Object.keys(tmStatics.groupStatistics).length > 0) {
        const rule6_Balance = "## گروه‌های محاسباتی\n\n";
        let rule6_Markdown = "Grp,cnt,Final//Member,Oth//Mem,B//Cnt,B//Dys,B//Rat,B//Rcnt,B2//Rcnt\n";
        
        Object.keys(tmStatics.groupStatistics).forEach(groupName => {
            const groupStats = tmStatics.groupStatistics[groupName];
            const balanceScore = groupStats.balanceScore || {};
            
            // 🎯 تفکیک اعضای نهایی و غیر نهایی
            const finalMembers = [];
            const otherMembers = [];
            
            groupStats.members.forEach(member => {
                const finalGroup = tmStatics.persons[member].groupname;
                if (finalGroup === groupName) {
                    finalMembers.push(member);
                } else {
                    otherMembers.push(member);
                }
            });
            
            rule6_Markdown += formatText("{group},{memberCount},{finalMembers},{otherMembers},{balanceIconCount}//{balanceCount},{balanceIconDays}//{balanceDays},{balanceIconRatio}//{balanceRatio},{balanceIconRecent}//{balanceRecent},{balanceIconRecentType}//{balanceRecentType}\n", {
                group: groupName,
                memberCount: groupStats.memberCount,
                finalMembers: finalMembers.join(' '),
                otherMembers: otherMembers.join(' '),
                balanceCount: balanceScore.balanceCount || 'N/A',
                balanceIconCount: getBalanceIcon(balanceScore.balanceCount) || "⚫",
                balanceDays: balanceScore.balanceDays || 'N/A',
                balanceIconDays: getBalanceIcon(balanceScore.balanceDays) || "⚫",
                balanceRatio: balanceScore.balanceRatio || 'N/A',
                balanceIconRatio: getBalanceIcon(balanceScore.balanceRatio) || "⚫",
                balanceRecent: balanceScore.balanceRecent || 'N/A',
                balanceIconRecent: getBalanceIcon(balanceScore.balanceRecent) || "⚫",
                balanceRecentType: balanceScore.balanceRecentType || 'N/A',
                balanceIconRecentType: getBalanceIcon(balanceScore.balanceRecentType) || "⚫"
            });
        });
        
        rule6_Markdown = rule6_Markdown.slice(0, -1);
        rule6_Calc = rule6_Balance + csvToMarkdown(rule6_Markdown, {
            delimiter: ",", 
            breakLine: '//',
            columnMaxWidth: {0: 2, 1: 2, 2: 5, 3: 3}, 
            separatorBetweenRows:true,
            compact: true
        });
        rule6_Calc += excludedPersons_Calc
        
        logInfo('generateRuleReports', 'rule6', '500', 
            'گروه‌های قانون ۶: ' + Object.keys(tmStatics.groupStatistics).length + ' گروه, افراد حذف شده: ' + (tmStatics.excludedPersons.length || 0));
    } else {
        rule6_Calc = "## گروه‌های محاسباتی\n\nهیچ گروهی تعریف نشده است.\n";
        rule6_Calc += excludedPersons_Calc
        
        logWarn('generateRuleReports', 'rule6', '500', 
            'هیچ گروهی برای قانون ۶ تعریف نشده, افراد حذف شده: ' + (tmStatics.excludedPersons.length || 0));
    }

    // محاسبه و چاپ قانون ۷
    const rule7_Balance = formatText("Balance Scores - Count: {balanceScoreCount} {balanceIconCount}, Days: {balanceScoreDays} {balanceIconDays}\n", {
        balanceScoreCount: tmStatics.balanceScore.balanceConsolidatedCount,
        balanceIconCount: getBalanceIcon(tmStatics.balanceScore.balanceConsolidatedCount),
        balanceScoreDays: tmStatics.balanceScore.balanceConsolidatedDays,
        balanceIconDays: getBalanceIcon(tmStatics.balanceScore.balanceConsolidatedDays)
    });
    
    let rule7_Markdown = "P,G,CountU,CntScore,Dys,DysScore,Sum\n";
    
    // 🎯 استفاده از groupStatistics به جای persons.groups
    Object.entries(tmStatics.groupStatistics).forEach(([groupName, groupStats]) => {
        Object.entries(groupStats.persons).forEach(([personName, personData]) => {
            const finalGroup = tmStatics.persons[personName].groupname;
            const finalSign = getFinalSign(personName, groupName, finalGroup);
            
            const rule7CountOutlierIcon = personData.outlierInfo.consolidatedCount === '⚠️' ? personData.outlierInfo.consolidatedCount : '';
            const rule7DaysOutlierIcon = personData.outlierInfo.consolidatedDays === '⚠️' ? personData.outlierInfo.consolidatedDays : '';
            const signUni = personData.consolidatedUniformity >= 0 ? '+' : '-';
            
            rule7_Markdown += formatText("{p},{group}{finalSign},{cntOutIcon}{cnt}{signUni}{uni:1}:{sumCount},{scoreCount:3}%({percentCount}%),{daysOutIcon}{days:2},{scoreDays:3}%({percentDays}%),{percentCountDays}%\n", {
                p: personName,
                group: groupName,
                finalSign: finalSign,
                cnt: personData.consolidatedCount,
                signUni: signUni,
                uni: Math.abs(personData.consolidatedUniformity),
                sumCount: personData.consolidatedCount_U,
                scoreCount: personData.scoreConsolidatedCount,
                percentCount: personData.percentConsolidatedCount,
                cntOutIcon: rule7CountOutlierIcon,
                days: personData.consolidatedDays,
                daysOutIcon: rule7DaysOutlierIcon,
                scoreDays: personData.scoreConsolidatedDays,
                percentDays: personData.percentConsolidatedDays,
                percentCountDays: personData.percentConsolidated
            });
        });
    });
    
    rule7_Markdown = rule7_Markdown.slice(0, -1);
    const rule7_Calc = rule7_Balance + csvToMarkdown(rule7_Markdown, {delimiter: ",", compact: true});
    
    logInfo('generateRuleReports', 'rule7', '3038', 
        'قانون ۷: تعادل تعداد=' + tmStatics.balanceScore.balanceConsolidatedCount + '%, روزها=' + tmStatics.balanceScore.balanceConsolidatedDays + '%');

    // محاسبه و چاپ قانون کل (Total)
    const ruleTotal_Balance = formatText("Overall Balance Scores - Count: {countScore} {countIcon}, Days: {daysScore} {daysIcon}, Ratio: {ratioScore} {ratioIcon}, Recent: {recentScore} {recentIcon}, RecentType: {recentTypeScore} {recentTypeIcon}\n", {
        countScore: tmStatics.balanceScore.balanceCount,
        countIcon: getBalanceIcon(tmStatics.balanceScore.balanceCount),
        daysScore: tmStatics.balanceScore.balanceDays,
        daysIcon: getBalanceIcon(tmStatics.balanceScore.balanceDays),
        ratioScore: tmStatics.balanceScore.balanceRatio,
        ratioIcon: getBalanceIcon(tmStatics.balanceScore.balanceRatio),
        recentScore: tmStatics.balanceScore.balanceRecent,
        recentIcon: getBalanceIcon(tmStatics.balanceScore.balanceRecent),
        recentTypeScore: tmStatics.balanceScore.balanceRecentType,
        recentTypeIcon: getBalanceIcon(tmStatics.balanceScore.balanceRecentType)
    });
    
    let ruleTotal_Markdown = "P,G,C +U,Dy,R1%,CAl,R2%,R4%,B%,Cf%,Ttl%\n";
    
    // 🎯 استفاده از groupStatistics برای قانون کل
    Object.entries(tmStatics.groupStatistics).forEach(([groupName, groupStats]) => {
        Object.entries(groupStats.persons).forEach(([personName, personData]) => {
            const finalGroup = tmStatics.persons[personName].groupname;
            const finalSign = getFinalSign(personName, groupName, finalGroup);
            
            const rule1CountOutlierIcon = personData.outlierInfo.count === '⚠️' ? personData.outlierInfo.count : '';
            const rule1DaysOutlierIcon = personData.outlierInfo.days === '⚠️' ? personData.outlierInfo.days : '';
            const signUni = personData.uniformityCount >= 0 ? '+' : '-';
            const rule2RatioOutlierIcon = personData.outlierInfo.ratio === '⚠️' ? personData.outlierInfo.ratio : '';
            
            ruleTotal_Markdown += formatText("{p},{group}{finalSign},{cntOutIcon}{cnt}{signUni}{uni:1},{daysOutIcon}{days},{gradeCountDays}{r1:2},{ratioOutIcon}{cntAll:3},{gradeRatio}{r2:2},{gradeRecents}{r4:2},{base},{coeff:3},{grade}{final:3}\n", {
                p: personName,
                group: groupName,
                finalSign: finalSign,
                cntOutIcon: rule1CountOutlierIcon,
                cnt: personData.count,
                signUni: signUni,
                uni: Math.abs(personData.uniformityCount),
                daysOutIcon: rule1DaysOutlierIcon,
                days: personData.days,
                gradeCountDays: personData.gradeCountDays,
                r1: personData.percentCountDays,
                ratioOutIcon: rule2RatioOutlierIcon,
                cntAll: personData.countAll,
                gradeRatio: personData.gradeRatio,
                r2: personData.percentRatio,
                gradeRecents: personData.gradeRecents,
                r4: personData.percentRecents,
                base: personData.percentBase,
                coeff: Math.round(personData.CoeffPerson * 100),
                final: Math.round(personData.percentTotal),
                grade: personData.gradeTotal
            });
        });
    });
    
    ruleTotal_Markdown = ruleTotal_Markdown.slice(0, -1);
    const ruleTotal_Calc = ruleTotal_Balance + csvToMarkdown(ruleTotal_Markdown, {delimiter: ",", breakLine: '//',compact: true});

    logInfo('generateRuleReports', 'complete', '510', 
        'اتمام تولید گزارش برای ' + persons.length + ' نفر');

    return {
        rule1_Calc: rule1_Calc,
        rule2_Calc: rule2_Calc,
        rule4_Calc: rule4_Calc,
        rule6_Calc: rule6_Calc,
        rule7_Calc: rule7_Calc,
        ruleTotal_Calc: ruleTotal_Calc
    };
}

/**
 * تابع محاسبه تعادل داده‌ها و تخصیص وزن هوشمند
 * 
 * 📊 هدف اصلی:
 * - تحلیل میزان تعادل در مجموعه داده‌های عددی
 * - تشخیص خودکار اعداد پرت (Outliers) با الگوریتم IQR
 * - تخصیص وزن‌های متناسب بر اساس سطح تعادل داده‌ها
 * - ارائه امتیاز تعادل کلی برای ارزیابی کیفیت و یکنواختی داده‌ها
 * 
 * 🎯 منطق محاسبات:
 * - داده‌های کاملاً متعادل → امتیاز تعادل 10 → وزن‌ها نزدیک به maxBalancePercent
 * - داده‌های پرت‌دار → امتیاز تعادل نزدیک به 0 → اختلاف وزن‌ها بیشتر
 * - کوچکترین عدد → بیشترین وزن (100)
 * - بزرگترین عدد → کمترین وزن (متناسب با امتیاز تعادل)
 * - maxBalancePercent: تعیین‌کننده حداکثر وزنی که داده‌ها در حالت تعادل کامل می‌گیرند
 * 
 * 🔧 پارامترهای قابل تنظیم:
 * - maxBalancePercent: سقف وزنی برای داده‌های متعادل (پیش‌فرض: 80)
 * - outlierEffect: حساسیت سیستم به اعداد پرت (low/medium/high)
 * - strictLevel: سطح سخت‌گیری در محاسبات (1-3)
 * - order: جهت توزیع وزن‌ها (صعودی/نزولی)
 * - outlierThreshold: آستانه تشخیص اعداد پرت
 * 
 * 📈 کاربردها:
 * - نرمال‌سازی داده‌ها برای الگوریتم‌های یادگیری ماشین
 * - وزن‌دهی ویژگی‌ها در مدل‌های پیش‌بینی
 * - فیلتر کردن داده‌های پرت در تحلیل‌های آماری
 * - اولویت‌بندی داده‌ها در سیستم‌های تصمیم‌گیری
 * - ارزیابی کیفیت دیتاست‌های عددی
 * 
 * @param {number[]|Object} InputData - آرایه اعداد یا آبجکت شامل مقادیر عددی
 * @param {Object} options - آبجکت تنظیمات پیشرفته
 * @param {string} options.order - ترتیب توزیع وزن: 'desc' نزولی (کوچک→بزرگ), 'asc' صعودی (بزرگ→کوچک)
 * @param {number} options.strictLevel - سطح سخت‌گیری (1 آسان, 2 معمولی, 3 سخت)
 * @param {string} options.outlierEffect - حساسیت به اعداد پرت: 'low' (تأثیر زیاد پرت), 'medium', 'high' (تأثیر کم پرت)
 * @param {number} options.maxBalancePercent - سقف وزنی برای داده‌های متعادل (پیش‌فرض: 80)
 * @param {number} options.outlierThreshold - آستانه تشخیص اعداد پرت (1.5 استاندارد, 2 سخت‌گیرانه, 1 آسان)
 *  * @returns {Object} آبجکت شامل balanceScore, scores, outliers, statistics
 */
function getStates(InputData, options) {
    // استخراج و تنظیم پارامترهای پیش‌فرض
    const config = {
        order: (options && options.order) || 'asc',
        strictLevel: (options && options.strictLevel) || 2,
        outlierEffect: (options && options.outlierEffect) || 'medium',
        maxBalancePercent: (options && options.maxBalancePercent) || 80, // سقف وزنی برای داده‌های متعادل
        outlierThreshold: (options && options.outlierThreshold) || 1 // با سطح آشکارسازی بیشتر 
    };

    // اینجا اضافه شود:
    logDebug('getStates', 'config', '515', 
        `تنظیمات: strictLevel=${config.strictLevel}, outlierEffect=${config.outlierEffect}, maxBalancePercent=${config.maxBalancePercent}`);

    // تبدیل تأثیر اعداد پرت به مقدار عددی
    const getAdjustFactor = (effect) => {
        if (effect === 'low') return 10;    // حساسیت کم - اعداد پرت تأثیر بیشتری در کاهش امتیاز دارند
        if (effect === 'medium') return 15; // حساسیت متوسط - تعادل بین شناسایی پرت و حفظ داده
        if (effect === 'high') return 20;   // حساسیت زیاد - اعداد پرت تأثیر کمتری دارند
        return 15;
    };

    config.adjustFactor = getAdjustFactor(config.outlierEffect);
    
    /**
     * محاسبه امتیاز تعادل داده‌ها بر اساس پراکندگی
     * هرچه داده‌ها متعادل‌تر باشند (پراکندگی کمتر) → امتیاز بالاتر
     * هرچه داده‌ها پرت‌دارتر باشند (پراکندگی بیشتر) → امتیاز پایین‌تر
     */
    const balanceScoreRange = (nums, strictLevel, adjustFactor, maxBalancePercent) => {
        if (nums.length === 0) return maxBalancePercent;
        
        const min = Math.min.apply(Math, nums);
        const max = Math.max.apply(Math, nums);
        if (min === 0 && max === 0) return maxBalancePercent; // داده‌های یکسان → تعادل کامل
        const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        if (mean === 0) return maxBalancePercent; // استفاده از سقف وزنی
        
        const range = (max - min) / mean; // دامنه نسبی نشان‌دهنده پراکندگی داده‌ها
        const score = maxBalancePercent - (range * adjustFactor * strictLevel);
        
        return Math.max(0, Math.min(maxBalancePercent, Math.round(score)));
    };
    
    // تشخیص نوع ورودی (آرایه یا آبجکت)
    const isArray = Array.isArray(InputData);
    const inputValues = isArray ? InputData : Object.keys(InputData).map(key => InputData[key]);
    
    // اینجا اضافه شود:
    logInfo('getStates', 'stats', '520', 
        `داده‌ها: ${inputValues.length} مقدار,min=${Math.min.apply(Math,inputValues)}, max=${Math.min.apply(Math,inputValues)}`);
    
    // پردازش داده‌های خالی
    if (inputValues.length === 0) {
        // اینجا اضافه شود:
        logWarn('getStates', 'emptyData', '515', 
            `اده‌های خالی دریافت شد`);
            
        const emptyResult = isArray ? [] : {};
        return {
            balanceScore: 100, // امتیاز کامل برای داده‌های خالی
            scores: emptyResult,
            outliers: emptyResult,
            statistics: {},
            config: config
        };
    }
    
    // محاسبه امتیاز تعادل با استفاده از maxBalancePercent
    let balanceScore = balanceScoreRange(inputValues, config.strictLevel, config.adjustFactor, config.maxBalancePercent);
    const min = Math.min.apply(Math, inputValues);
    const max = Math.max.apply(Math, inputValues);
    const mean = inputValues.reduce((a, b) => a + b, 0) / inputValues.length;
    
    /**
     * تشخیص اعداد پرت با الگوریتم IQR
     * اعداد خارج از محدوده [Q1 - threshold*IQR, Q3 + threshold*IQR] پرت محسوب می‌شوند
     * تأثیر outlierThreshold:
     * - مقادیر پایین (1.0): مرزهای باریک‌تر → شناسایی پرت‌های بیشتر
     * - مقادیر متوسط (1.5): استاندارد صنعتی → تعادل مناسب
     * - مقادیر بالا (2.0): مرزهای گسترده‌تر → شناسایی پرت‌های کمتر
     */
    const detectOutliers = (nums, threshold) => {
        const sorted = nums.slice().sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)]; // چارک اول (25%)
        const q3 = sorted[Math.floor(sorted.length * 0.75)]; // چارک سوم (75%)
        const iqr = q3 - q1; // محدوده بین چارکی
        const lowerBound = q1 - threshold * iqr;
        const upperBound = q3 + threshold * iqr;
        
        return nums.filter(num => num < lowerBound || num > upperBound);
    };
    
    const outliers = detectOutliers(inputValues, config.outlierThreshold);
    
    // اینجا اضافه شود:
    if (outliers.length > 0) {
        logWarn('getStates', 'outliers', '530', 
            `اعداد پرت: ${outliers.length} مورد (${((outliers.length/inputValues.length)*100).toFixed(1)}%)`);
    }
    
    let scores;
    
    // محاسبه وزن‌ها بر اساس امتیاز تعادل و maxBalancePercent
    if (min === max) {
        // اگر همه اعداد برابر باشند
        // اینجا اضافه شود:
        logDebug('getStates', 'equalData', '1160', 
            `همه داده‌ها برابر: ${min}`);
            
        const uniformpercent = config.order === 'desc' ? 100 : balanceScore;
        scores = isArray 
            ? inputValues.map(() => uniformpercent)
            : Object.keys(InputData).reduce((acc, key) => {
                acc[key] = uniformpercent;
                return acc;
            }, {});
    } else {
        // محاسبه وزن برای هر عدد به صورت پویا
        const calculatedPercent = inputValues.map(num => {
            let percent;
            if (config.order === 'desc') {
                // حالت نزولی: اعداد کوچک وزن بیشتر (100)، اعداد بزرگ وزن کمتر (balanceScore)
                percent = balanceScore + ((100 - balanceScore) * (max - num)) / (max - min);
            } else {
                // حالت صعودی: اعداد کوچک وزن کمتر (balanceScore)، اعداد بزرگ وزن بیشتر (100)
                percent = balanceScore + ((100 - balanceScore) * (num - min)) / (max - min);
            }
            return Math.round(percent);
        });
        
        scores = isArray 
            ? calculatedPercent
            : Object.keys(InputData).reduce((acc, key, index) => {
                acc[key] = calculatedPercent[index];
                return acc;
            }, {});
    }
    
    // نرمال‌سازی امتیاز تعادل به بازه 0-100 و محاسبه آمار
    balanceScore = parseFloat((balanceScore * 100 / config.maxBalancePercent).toFixed(0));
    
    // اینجا اضافه شود:
    logInfo('getStates', 'balance', '545', 
        `امتیاز تعادل: ${balanceScore}%`);
    
    // محاسبه آمار توصیفی
    const statistics = {
        dataCount: inputValues.length,
        outlierCount: outliers.length,
        outlierPercentage: parseFloat(((outliers.length / inputValues.length) * 100).toFixed(2)),
        minValue: min,
        maxValue: max,
        meanValue: parseFloat(mean.toFixed(2)),
        range: max - min,
        iqr: inputValues.length >= 4 ? (function() {
            // محاسبه IQR برای داده‌های کافی
            const sorted = inputValues.slice().sort((a, b) => a - b);
            const q1 = sorted[Math.floor(sorted.length * 0.25)];
            const q3 = sorted[Math.floor(sorted.length * 0.75)];
            return (q3 - q1).toFixed(2);
        })() : 'N/A' // برای داده‌های ناکافی
    };
    
    // اینجا اضافه شود:
    logDebug('getStates', 'statistics', '540', 
        `آمار: range=${max-min}, IQR=${statistics.iqr}, outlierThreshold=${config.outlierThreshold}`);
    
    // خروجی نهایی
    return {
        balanceScore: balanceScore,        // امتیاز تعادل نرمال شده (0-100)
        scores: scores,                  // وزن‌های تخصیص داده شده
        outliers: isArray ? outliers : Object.keys(InputData).reduce((acc, key, index) => {
            // نگاشت اعداد پرت به ساختار اصلی
            if (outliers.includes(inputValues[index])) {
                acc[key] = inputValues[index];
            }
            return acc;
        }, {}),
        statistics: statistics,            // آمار کامل تحلیل
        config: config                     // تنظیمات استفاده شده
    };
}

/**
 * 🎓 تابع برای اعمال گریدبندی سطحی پویا به نفرات
 * این تابع نفرات را بر اساس ورودی اعداد در سطوح مختلف دسته‌بندی می‌کند
 * 
 * @param {Object|Array} inputData -  آرایه و یا آبجکت از اعداد برای گرید بندی
 * @param {number} levelsCount - تعداد سطوح (2 تا 10)
 * @param {boolean} isAscending - true: صعودی (بالاترین درصد = بهترین سطح), false: نزولی (بالاترین درصد = پایین‌ترین سطح)
 */
function getGrade(inputData, levelsCount, isAscending) {
  // 🔧 تنظیمات پیش‌فرض
  levelsCount = levelsCount === undefined ? 7 : Math.max(2, Math.min(10, levelsCount));
  isAscending = isAscending === undefined ? false : isAscending;

  // اینجا اضافه شود:
  logInfo('getGrade', 'config', '565', 
      `گریدبندی: ${levelsCount} سطح, ${isAscending ? 'صعودی' : 'نزولی'}`);

  // 📊 تشخیص نوع ورودی
  let dataStructure;
  let inputType = typeof inputData;
  
  if (Array.isArray(inputData)) {
    dataStructure = {
      type: 'array',
      keys: inputData.map(function(_, index) { return 'item_' + index; }),
      values: inputData,
      original: inputData
    };
  } else if (inputData && typeof inputData === 'object') {
    const keys = Object.keys(inputData);
    const values = keys.map(function(key) { return inputData[key]; });
    dataStructure = {
      type: 'object',
      keys: keys,
      values: values,
      original: inputData
    };
  } else {
    logError('getGrade', 'inputValidation', '1185', 
        `ورودی نامعتبر: ${inputType}`);
        
    return {
      success: false,
      error: 'ورودی نامعتبر',
      inputType: inputType
    };
  }
  
  // 📋 اعتبارسنجی داده‌ها
  const validValues = dataStructure.values.map(function(value) {
    const numValue = Number(value);
    return isNaN(numValue) ? 0 : numValue;
  });
  
  if (validValues.length === 0) {
    // اینجا اضافه شود:
    logWarn('getGrade', 'emptyData', '1190', 
        `هیچ داده معتبری وجود ندارد`);
        
    return {
      success: false,
      error: 'هیچ داده معتبری وجود ندارد',
      inputData: inputData
    };
  }

  logDebug('getGrade', 'validData', '1190', 
      `داده‌های معتبر: ${validValues.length} مقدار`);

  // 🔧 اصلاح محاسبه کوانتیل‌ها - بررسی تکراری نبودن
  const quantiles = {};
  const uniqueQuantiles = new Set();
  
  for (let i = 1; i < levelsCount; i++) {
    let quantileValue = quantile(validValues, i / levelsCount);
    
    // جلوگیری از مقادیر تکراری
    if (uniqueQuantiles.has(quantileValue)) {
      quantileValue = quantileValue + (i * 0.001); // اضافه کردن تفاوت کوچک
    }
    
    uniqueQuantiles.add(quantileValue);
    quantiles['q' + i] = parseFloat(quantileValue.toFixed(2));
  }

  logData('getGrade', 'quantiles', '575', quantiles);

  // 📊 ایموجی پک‌ها
  const emojiPacks = {
    2:  ['🔴', '🟢'],
    3:  ['🔴', '🟡', '🟢'],
    4:  ['🔴', '🟠', '🟡', '🟢'],
    5:  ['🔴', '🟠', '🟡', '🟢', '💚'],
    6:  ['🔴', '🟠', '🟡', '🟢', '💚', '🌟'],
    7:  ['🔴', '🟠', '🟡', '🟢', '💚', '🌟', '👑'],
    8:  ['🔴', '🟤', '🟠', '🟡', '🟢', '💚', '🌟', '👑'],
    9:  ['⚫', '🔴', '🟤', '🟠', '🟡', '🟢', '💚', '🌟', '👑'],
    10: ['⚫', '🔴', '🟤', '🟠', '🟡', '🟢', '💚', '🌟', '👑']
  };
  
  const emojis = emojiPacks[levelsCount];
  
  // 🔄 ترتیب سطوح
  const priorityLevels = [];
  if (isAscending) {
    for (let i = 1; i <= levelsCount; i++) {
      priorityLevels.push(i);
    }
  } else {
    for (let i = levelsCount; i >= 1; i--) {
      priorityLevels.push(i);
    }
  }
  
  // 🗂️ ایجاد نتایج
  const results = {
    success: true,
    inputType: dataStructure.type,
    itemsCount: validValues.length,
    config: {
      levelsCount: levelsCount,
      isAscending: isAscending,
      quantiles: quantiles,
      emojis: emojis
    },
    summary: {
      valueRange: {
        min: Math.min.apply(Math, validValues),
        max: Math.max.apply(Math, validValues),
        average: parseFloat((validValues.reduce(function(a, b) { return a + b; }, 0) / validValues.length).toFixed(2))
      },
      gradeDistribution: {},
      priorityDistribution: {}
    },
    grades: dataStructure.type === 'array' ? [] : {},
    details: dataStructure.type === 'array' ? [] : {}
  };
  
  // 👤 الگوریتم بهبود یافته برای محاسبه سطح
  const calculateLevelIndex = function(value, quantiles, levelsCount, isAscending) {
    let levelIndex = 0;
    
    // محاسبه سطح بر اساس بازه‌های کوانتیل
    for (let i = 1; i < levelsCount; i++) {
      if (value >= quantiles['q' + i]) {
        levelIndex = i;
      } else {
        break;
      }
    }
    
    // 🔧 اصلاح: اطمینان از توزیع مناسب سطوح
    if (levelIndex >= levelsCount) {
      levelIndex = levelsCount - 1;
    }
    
    if (!isAscending) { levelIndex = levelsCount - 1 - levelIndex;}
    
    return levelIndex;
  };

  const updateDistribution = function(summary, grade, priorityLevel) {
    summary.gradeDistribution[grade] = (summary.gradeDistribution[grade] || 0) + 1;
    summary.priorityDistribution[priorityLevel] = (summary.priorityDistribution[priorityLevel] || 0) + 1;
  };

  // پردازش هر آیتم
  dataStructure.keys.forEach(function(key, index) {
    const value = validValues[index];
    const levelIndex = calculateLevelIndex(value, quantiles, levelsCount, isAscending);
    const gradeInfo = {
      value: value,
      grade: emojis[levelIndex],
      priorityLevel: priorityLevels[levelIndex],
      gradeLevel: levelIndex + 1
    };
    
    if (dataStructure.type === 'array') {
      gradeInfo.originalIndex = index;
      gradeInfo.originalValue = dataStructure.original[index];
      results.grades.push(gradeInfo.grade);
      results.details.push(gradeInfo);
    } else {
      gradeInfo.originalValue = dataStructure.original[key];
      gradeInfo.key = key;
      results.grades[key] = gradeInfo.grade;
      results.details[key] = gradeInfo;
    }
    
    updateDistribution(results.summary, gradeInfo.grade, gradeInfo.priorityLevel);
  });

  // 🎯 بررسی توزیع نتایج
  const totalGrades = Object.keys(results.summary.gradeDistribution).length;
  if (totalGrades <= 1) {
    results.warning = 'توزیع گریدها نامتعادل است - ممکن است داده‌ها مشکل داشته باشند';
    
    logWarn('getGrade', 'distribution', '1235', 
        `توزیع گریدها نامتعادل: فقط ${totalGrades} سطح`);
  } else {
    logData('getGrade', 'distribution', '1235', results.summary.gradeDistribution)
  }
  
  logInfo('getGrade', 'complete', '595', 
      `اتمام گریدبندی: ${validValues.length} مقدار در ${levelsCount} سطح`);
  
  return results;
}

/**
 * ============================================================
 * بخش 4.2
 * 🔄 تجمیع گروه نهایی (Consolidated Parvaz)
 * ============================================================
 * 
 * 🎯 هدف: تجمیع چند نوع ماموریت در یک گروه نهایی با ضرایب
 * 📅 آخرین به‌روزرسانی: ۱۴۰۵/۰۲/۳۱
 * 👤 نویسنده: تیم توسعه
 * 
 * 📌 توابع ارائه شده:
 *   - getConsolidatedParvaz() - محاسبه آمار تجمیع شده
 *   - generateSimpleSummaryReport() - گزارش خلاصه گروه
 * 
 * 📌 مفاهیم کلیدی:
 *   - consolidationType_Name: نام گروه تجمیع
 *   - consolidationType_Coefficient: ضریب هر نوع ماموریت
 *   - consolidationType_MasterType: تایپ اصلی برای خواندن ضرایب
 *   - normalized: امتیاز نرمال‌شده (بازه [1-10] → [0-900])
 * 
 * 📌 خروجی هر گروه:
 *   - persons: داده‌های هر نفر (actual, normalized)
 *   - totals: مجموع گروه
 *   - consolidationInfo: اطلاعات گروه (اعضا، ضرایب، نرمال‌سازی)
 * 
 * ⚠️ وابستگی‌ها: بخش 3.2, 3.1, 1.3
 * 
 * ============================================================
 */
/**
 * تابع ساده‌شده برای محاسبه آمار پروازی تجمیع شده
 * فقط اطلاعات اصلی و امتیازهای نرمال‌شده
 * 
 * @param {Object} options - تنظیمات اختیاری
 * @param {string[]} [options.consolidationGroups] - آرایه گروه‌های تجمیع برای فیلتر
 * @param {Object} [options.personConfig] - تنظیمات پرسن
 * @param {string[]} [options.personConfig.excluded] - نفرات حذف شده
 * @returns {Object} - شیء حاوی آمار اصلی و امتیازهای نرمال‌شده
 */
function getConsolidatedParvaz(options) {
  // 🔧 مقداردهی اولیه پارامترهای ورودی
  options = options || {};
  options.consolidationGroups = options.consolidationGroups || [];
  options.personConfig = options.personConfig || {};
  options.personConfig.excluded = options.personConfig.excluded || [];
  
  // 📥 بارگذاری داده‌های پایه
  const lp = libByName("نفرات");
  const ltm = libByName("نوع ماموریت");
  
  // 👥 استخراج لیست نفرات
  const persons = lp.entries().map(pe => pe.name).reverse();
  
  // 🎯 استخراج انواع ماموریت‌های پروازی
  const typeMamoriatArray = entriesToTypeMamoriatEntreis(ltm.entries().reverse()).filterOnlyParvaz();
  
  // 🎯 شناسایی گروه‌های تجمیع
  const consolidationGroupsMap = {};
  
  typeMamoriatArray.forEach(tm => {
    if (tm.consolidationType_Name) {
      const groupName = tm.consolidationType_Name;
      
      if (!consolidationGroupsMap[groupName]) {
        consolidationGroupsMap[groupName] = {
          name: groupName,
          members: [],
          masterType: null,
          totalCoefficient: 0
        };
      }
      
      const member = {
        shortName: tm.shortName,
        coefficient: tm.consolidationType_Coefficient || 1,
        isMaster: tm.consolidationType_MasterType === true,
        typeData: tm
      };
      
      consolidationGroupsMap[groupName].members.push(member);
      consolidationGroupsMap[groupName].totalCoefficient += member.coefficient;
      
      if (member.isMaster) {
        consolidationGroupsMap[groupName].masterType = tm;
      }
    }
  });
  
  // 🔧 تبدیل به آرایه و تنظیم masterType
  const consolidationGroups = Object.values(consolidationGroupsMap)
    .filter(group => group.members.length > 0)
    .map(group => {
      if (!group.masterType && group.members.length > 0) {
        group.masterType = group.members[0].typeData;
        group.members[0].isMaster = true;
      }
      return group;
    });
  
  // 🎯 اعمال فیلتر گروه‌ها
  const filterConsolidationGroups = (options.consolidationGroups && options.consolidationGroups.length > 0) 
    ? consolidationGroups.filter(group => options.consolidationGroups.includes(group.name))
    : consolidationGroups;
  
  // 📋 استخراج تاریخچه ماموریت‌ها
  const mArray = getMArray();
  const mArrayParvaz = mArray.filterOnlyParvaz();
  mArrayParvaz.createLink("typeParvazEntry");
  
  // 🗂️ شیء اصلی برای ذخیره نتایج - با ساختار جدید
  const consolidatedStatistics = {};

  // لاگ شروع
  const SourceLog = 'getConsolidatedParvazSimple';
  logInfo(SourceLog, 'init', '100', 
    'شروع محاسبات آمار تجمیع شده ساده - گروه‌ها: ' + filterConsolidationGroups.length);

  // 🔄 پردازش هر گروه تجمیع
  filterConsolidationGroups.forEach(consolidationGroup => {
    const masterTM = consolidationGroup.masterType;
    
    // 🔍 محاسبه کمترین ضریب
    const minCoefficient = Math.min.apply(null, consolidationGroup.members.map(m => m.coefficient));
    const baseType = consolidationGroup.members.find(m => m.coefficient === minCoefficient).shortName || 'Unknown';
    
    // 📊 ایجاد ساختار نتایج گروه - با ساختار جدید
    consolidatedStatistics[consolidationGroup.name] = {
      persons: {}, // 👥 داده‌های هر نفر
      totals: {    // 📈 مجموع گروه
        actual: {
          missions: 0,
          days: 0,
          uniformity: 0,
          missions_U: 0
        },
        normalized: {
          missions: 0,
          days: 0,
          uniformity: 0,
          missions_U: 0
        }
      },
      consolidationInfo: { // ℹ️ اطلاعات گروه تجمیع
        groupName: consolidationGroup.name,
        masterType: masterTM.shortName,
        members: consolidationGroup.members.map(m => m.shortName),
        coefficients: consolidationGroup.members.map(m => ({
          type: m.shortName,
          coefficient: m.coefficient,
          isMaster: m.isMaster
        })),
        totalCoefficient: consolidationGroup.totalCoefficient,
        normalizationInfo: { // 📐 اطلاعات نرمال‌سازی
          minCoefficient: minCoefficient,
          minCoefficientType: baseType,
          normalizedCoefficients: consolidationGroup.members.map(m => ({
            type: m.shortName,
            originalCoefficient: m.coefficient,
            normalizedCoefficient: m.coefficient / minCoefficient
          }))
        }
      }
    };

    // 🔧 فیلتر کردن نفرات حذف شده
    let filteredPersons = persons;
    if (options.personConfig.excluded.length > 0) {
      filteredPersons = persons.filter(p => !options.personConfig.excluded.includes(p));
    }

    // 👤 پردازش هر نفر
    filteredPersons.forEach(person => {
      const allPersonMissions = mArrayParvaz.filterByPerson(person);
      
      // 🎯 محاسبه داده‌های گروه
      let actualMissions = 0;           // تعداد واقعی ماموریت‌ها
      let actualMissionsWithUniformity = 0; // تعداد با uniformity
      let actualDays = 0;              // روزهای واقعی ماموریت‌ها
      let totalUniformity = 0;         // مجموع uniformity
      let totalNormalizedMissions = 0;   // مجموع نرمال‌شده تعداد
      let totalNormalizedMissionsWithUniformity = 0; // مجموع نرمال‌شده با uniformity
      let totalNormalizedDays = 0;    // مجموع نرمال‌شده روزها

      consolidationGroup.members.forEach(member => {
        const uniformityCount = member.typeData.uniformityCountByPerson(person);
        const memberMissions = allPersonMissions
            .filterByTypeParvazEntryLinkShortName(member.shortName);
        
        const normalizedCoefficient = member.coefficient / minCoefficient;
        
        // 📊 جمع‌آوری آمار واقعی
        actualMissions += memberMissions.count;
        totalUniformity += uniformityCount;
        actualDays += memberMissions.days;
      
        // 🎯 جمع‌آوری آمار نرمال‌شده
        totalNormalizedMissions += memberMissions.count * normalizedCoefficient;
        totalNormalizedDays += memberMissions.days * normalizedCoefficient;
        
        // محاسبات با uniformity
        const missions_U = memberMissions.count + uniformityCount;
        actualMissionsWithUniformity += missions_U;
        totalNormalizedMissionsWithUniformity += missions_U * normalizedCoefficient;
      });

      // 🎯 محاسبه امتیازهای نرمال‌شده (۰-۱۰)
      const normalizedMissions = actualMissions > 0 ? totalNormalizedMissions / actualMissions : 0;
      const normalizedMissionsWithUniformity = actualMissionsWithUniformity > 0 ? 
        totalNormalizedMissionsWithUniformity / actualMissionsWithUniformity : 0;
      const normalizedDays = actualDays > 0 ? totalNormalizedDays / actualDays : 0;
      const normalizedUniformity = normalizedMissionsWithUniformity - normalizedMissions;

      // 💾 ذخیره داده‌های نفر با ساختار جدید
      consolidatedStatistics[consolidationGroup.name].persons[person] = {
        actual: {
          missions: actualMissions,
          days: actualDays,
          uniformity: totalUniformity,
          missions_U: actualMissionsWithUniformity
        },
        normalized: {
          missions: Math.round((normalizedMissions -1)*100),
          missions_U: Math.round((normalizedMissionsWithUniformity -1)*100),
          uniformity: Math.round((normalizedUniformity)*100),
          days: Math.round((normalizedDays -1)*100)
        }
      };
      
      // 📈 به‌روزرسانی مجموع گروه
      const totals = consolidatedStatistics[consolidationGroup.name].totals;
      totals.actual.missions += actualMissions;
      totals.actual.days += actualDays;
      totals.actual.uniformity += totalUniformity;
      totals.actual.missions_U += actualMissionsWithUniformity;
      totals.normalized.missions += normalizedMissions;
      totals.normalized.days += normalizedDays;
      totals.normalized.uniformity += normalizedUniformity;
      totals.normalized.missions_U += normalizedMissionsWithUniformity;
    });
    
    // 📊 محاسبه میانگین‌های نرمال‌شده
    const personCount = Object.keys(consolidatedStatistics[consolidationGroup.name].persons).length;
    if (personCount > 0) {
      const totals = consolidatedStatistics[consolidationGroup.name].totals;
      totals.normalized.missions = Math.round((totals.normalized.missions / personCount -1)*100);
      totals.normalized.days =  Math.round((totals.normalized.days / personCount-1)*100);
      totals.normalized.uniformity =  Math.round((totals.normalized.uniformity / personCount)*100);
      totals.normalized.missions_U =  Math.round((totals.normalized.missions_U / personCount-1)*100);
    }
    
    logObject(consolidatedStatistics[consolidationGroup.name]);
    
    // 📝 ایجاد گزارش ساده
    const summaryReport = generateSimpleSummaryReport(consolidatedStatistics[consolidationGroup.name]);
    
    // 💾 اختصاص گزارش به همه اعضا
    consolidationGroup.members.forEach(member => {    
      const tm = member.typeData;
      tm.consolidationType_Calc = summaryReport;
    });
    
    logInfo(SourceLog, 'groupComplete', '200', 
      'اتمام پردازش گروه: ' + consolidationGroup.name);
  });

  // لاگ اتمام
  logInfo(SourceLog, 'complete', '300', 
    'اتمام محاسبات: ' + Object.keys(consolidatedStatistics).length + ' گروه پردازش شد');
  
  return consolidatedStatistics; // 📤 بازگشت آمار تجمیع‌شده
}

/**
 * تولید گزارش ساده برای گروه
 * @param {Object} consolidatedData - داده‌های تجمیع شده
 * @returns {string} - گزارش متنی
 */
function generateSimpleSummaryReport(consolidatedData) {
    const consInfo = consolidatedData.consolidationInfo || {};
    const normInfo = consInfo.normalizationInfo || {};
    const persons = Object.keys(consolidatedData.persons || {});
    const totalPersons = persons.length;
    const totals = consolidatedData.totals || {};
    
    // 🎯 بخش 1: اطلاعات گروه
    let report = '## 📊 گزارش تجمیع: ' + (consInfo.groupName || 'Unknown') + '\n\n';
    
    report += '**Master Type:** ' + (consInfo.masterType || 'Unknown') + ' 👑\n';
    report += '**Total Persons:** ' + totalPersons + '\n\n';
    
    // 🎯 بخش 2: اعضا و ضرایب
    const coeffs = normInfo.normalizedCoefficients || [];
    if (coeffs.length > 0) {
        report += "### 👥 Members & Coefficients\n\n";
        
        let membersMarkdown = "Type,Orig//Coeff,Norm//Coeff,Role\n";
        coeffs.forEach(c => {
            const role = c.type === normInfo.minCoefficientType ? 'Base 🔢' : 'Member';
            membersMarkdown += c.type + ',' + c.originalCoefficient + ',' + 
                c.normalizedCoefficient.toFixed(2) + ',' + role + '\n';
        });
        
        report += csvToMarkdown(membersMarkdown, {delimiter: ",", breakLine: '//', compact: true});
        report += '\n**Base Coefficient:** ' + normInfo.minCoefficient + 
                 ' (' + normInfo.minCoefficientType + ')\n\n';
    }
    
    // 🎯 بخش 3: آمار کلی گروه
    report += "### 📈 Group Totals\n\n";
    
    let statsData = [];
    
    statsData.push(['Avg Norm Missions', totals.normalized.missions + ' unit/mission']);
    statsData.push(['Avg Norm Days', totals.normalized.days + ' unit/mission']);
    statsData.push(['Total Actual Missions', totals.actual.missions || 0]);
    statsData.push(['Total Actual Days', totals.actual.days || 0]);
    statsData.push(['Base Coefficient', normInfo.minCoefficient || 1]);
    statsData.push(['Persons Count', totalPersons]);
    
    let statsMarkdown = "Metric,Value\n";
    statsData.forEach(([metric, value]) => {
        statsMarkdown += metric + ',' + value + '\n';
    });
    
    report += csvToMarkdown(statsMarkdown, {delimiter: ",", compact: true});
    report += "\n";
    
    // 🎯 بخش 4: نفرات برتر
    if (persons.length > 0) {
        report += "### 🏆 Top Performers\n\n";
        
        // مرتب‌سازی بر اساس امتیاز ماموریت با uniformity
        const sortedPersons = persons
            .map(p => ({
                name: p,
                data: consolidatedData.persons[p],
                score: consolidatedData.persons[p].normalized.missions_U || 0
            }))
            .sort((a, b) => b.score - a.score);
        
        let topMarkdown = "Ra//nk,Per//son,Norm//Missions//(U),Actual//Missions//(U),Norm//Days,Actual//Days\n";
        
        sortedPersons.forEach((person, index) => {
            const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1) + '.';
            const personData = person.data;
            const normSign = (personData.normalized.uniformity || 0) >= 0 ? '+' : '-';
            const actualSign = (personData.actual.uniformity || 0) >= 0 ? '+' : '-';

            topMarkdown += formatText("{rank},{person},{normMissions}{normSign}{normUni}:{normMissionsU},{actualMissions}{actualSign}{actualUni}:{actualMissionsU},{normDays},{actualDays}\n", {
                rank: rankIcon,
                person: person.name,
                normMissions: (personData.normalized.missions || 0),
                normSign: normSign,
                normUni: Math.abs(personData.normalized.uniformity || 0),
                normMissionsU: (personData.normalized.missions_U || 0),
                actualMissions: personData.actual.missions || 0,
                actualSign: actualSign,
                actualUni: Math.abs(personData.actual.uniformity || 0),
                actualMissionsU: personData.actual.missions_U || 0,
                normDays: (personData.normalized.days || 0),
                actualDays: personData.actual.days || 0
            });
        });
        
        report += csvToMarkdown(topMarkdown, {delimiter: ",", breakLine: '//', compact: true});
        report += "\n";
    }
    
    // 🎯 بخش 5: خلاصه
    report += "### 📝 Summary\n\n";
    report += "**Score Interpretation:**\n";
    report += "- Norm Score: normalized units per actual mission\n";
    report += "- Example: score 1.42 means 1.42 normalized units/mission\n";
    report += "- Uniformity: adjustment based on master type settings\n\n";
    
    report += "---\n";
    report += "**Tech Info:**\n";
    report += "- Mode: Consolidated Normalized\n";
    report += "- Base Norm: coefficient " + normInfo.minCoefficient + "\n";
    report += "- Generated: " + new Date().toLocaleTimeString('fa-IR') + "\n";
    
    return report;
}

