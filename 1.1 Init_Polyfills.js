/**
 * ======================================
 * 🔧 Polyfills برای موتور جاوااسکریپت Rhino 1.7.15
 * ======================================
 * 
 * 📌 درباره Rhino 1.7.15:
 *   Rhino یک موتور جاوااسکریپت متن‌باز از موزیلا است که به زبان جاوا نوشته شده.
 *   این موتور امکان اجرای کدهای JS را در محیط جاوا فراهم می‌کند (مانند نرم‌افزارهای مبتنی بر Java).
 * 
* ======================================
* ✅ مواردی که در Rhino 1.7.15 به صورت NATIVE پشتیبانی می‌شوند:
 * =====================================
 *   - ECMAScript 5 به طور کامل
 *   - Arrow Functions () => {}
 *   - let / const (برای متغیرهای محلی)
 *   - Template Literals `text ${var}`
 *   - Map, Set, WeakMap, WeakSet
 *   - for...of (با محدودیت روی Iterableها)
 *   - Array Methods: map, filter, reduce, forEach, find, findIndex, includes, flat (جزئی)
 *   - Object.keys, Object.values, Object.entries
 *   - String.prototype.includes, startsWith, endsWith, repeat
 *   - Promise (❌ خیر - نیاز به Polyfill دارد، در بخش 1.4 پیاده‌سازی شده)
 * 
 * ======================================
 * ❌ مواردی که در Rhino 1.7.15 پشتیبانی نمی‌شوند (و باید جایگزین شوند):
 * =====================================
 * 
 *   1. Destructuring Assignment
 *      → جایگزینی با dot notation:
 *        const { name, age } = obj;  // ❌
 *        const name = obj.name; const age = obj.age;  // ✅
 * 
 *   2. Spread Operator (...)
 *      → جایگزینی با Object.assign یا Array.prototype.concat:
 *        const newObj = { ...oldObj };  // ❌
 *        const newObj = Object.assign({}, oldObj);  // ✅
 *        const newArr = [...oldArr];  // ❌
 *        const newArr = oldArr.slice();  // ✅
 * 
 *   3. Optional Chaining (?.)
 *      → جایگزینی با بررسی دستی null/undefined:
 *        const val = obj?.prop?.sub;  // ❌
 *        const val = obj && obj.prop && obj.prop.sub;  // ✅
 * 
 *   4. Default Parameters
 *      → جایگزینی با چک کردن در ابتدای تابع:
 *        function fn(a = 10) { ... }  // ❌
 *        function fn(a) { a = (a !== undefined) ? a : 10; ... }  // ✅
 * 
 *   5. Class (کلمه کلیدی class)
 *      → جایگزینی با Function constructor و prototype:
 *        class MyClass { constructor() {} }  // ❌
 *        function MyClass() {}  // ✅
 * 
 *   6. Modules (import/export)
 *      → جایگزینی با ماژولار کردن دستی و استفاده از آبجکت سراسری:
 *        import { fn } from './file.js';  // ❌
 *        const fn = require('./file.js'); // فقط در محیط‌های خاص
 * 
 *   7. Console (console.log)
 *      → جایگزینی با توابع سفارشی مانند log، logDebug، logError (تعریف شده در بخش 1.5):
 *        console.log('msg');  // ❌
 *        log('msg'); logDebug(src, sec, line, msg);  // ✅
 * 
 *   8. window / global / globalThis
 *      → وجود ندارند، متغیرهای سراسری را بدون var/let/const تعریف کنید:
 *        global.myVar = 10;  // ❌
 *        myVar = 10;  // ✅ (در بالاترین scope)
 * 
 *   9. setTimeout / setInterval
 *      → وجود ندارند، نیاز به Polyfill با استفاده از java.lang.Thread دارند (در همین فایل پیاده‌سازی شده)
 * 
 *   10. Promise
 *       → وجود ندارد، نیاز به Polyfill کامل (در بخش 1.4 پیاده‌سازی شده با قابلیت‌های پیشرفته)
 * 
 * =========================================
 * 🎯 Polyfill های ارائه شده در این فایل (بخش 1.2):
 * ==========================================
 * 
 *   ✅ Array.from                - تبدیل array-like (مانند NodeList, arguments) به آرایه واقعی
 *   ✅ Array.prototype.max       - پیدا کردن بزرگترین مقدار عددی در آرایه (برای آرایه خالی undefined)
 *   ✅ Array.prototype.min       - پیدا کردن کوچکترین مقدار عددی در آرایه (برای آرایه خالی undefined)
 *   ✅ setTimeout                - اجرای تابع پس از تاخیر با استفاده از java.lang.Thread
 *   ✅ clearTimeout              - لغو تایمر ایجاد شده توسط setTimeout
 *   ✅ setInterval               - اجرای دوره‌ای تابع با استفاده از java.lang.Thread
 *   ✅ clearInterval             - لغو اینتروال ایجاد شده توسط setInterval
 * 
 * 📌 نکات مهم هنگام استفاده از Polyfill‌های تایمر:
 *   - این Polyfill‌ها از نخ‌های جاوا (java.lang.Thread) استفاده می‌کنند.
 *   - در محیط‌های غیر جاوا (مانند مرورگر) کار نخواهند کرد.
 *   - تابع بازگشتی (callback) در نخ جداگانه اجرا می‌شود، بنابراین از متغیرهای مشترک با احتیاط استفاده کنید.
 *   - clearTimeout و clearInterval با آبجکت نخ یا اینتروال کار می‌کنند (مانند مرورگر).
  * 📚 منابع مفید برای آشنایی بیشتر با Rhino:
 * =========================================
 * 
 *   - مستندات رسمی: https://developer.mozilla.org/en-US/docs/Rhino
 *   - تغییرات نسخه‌ها: https://github.com/mozilla/rhino/releases
 *   - سازگاری با ECMAScript: https://mozilla.github.io/rhino/compat/engines.html
 * 
 * ===========================================
 * 💡 توصیه‌های نهایی:
 * ============================================
 * 
 *   - همیشه قبل از استفاده از یک متد، بررسی کنید که به صورت native وجود دارد یا خیر.
 *   - برای محیط‌های مختلف (مرورگر، Node، Rhino) از ابزارهای ترنسپایلر مانند Babel استفاده کنید.
 *   - در Rhino، از let/const در سطح محلی استفاده کنید، اما برای متغیرهای سراسری از var یا بدون کلمه کلیدی استفاده کنید.
 *   - برای دیباگ به جای console از توابع سفارشی (مانند log، logDebug) که در بخش 1.5 تعریف می‌شوند استفاده کنید.
 * 
 * ===========================================
 */

// ========== شروع کد Polyfill ها ==========

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
const activeIntervals = [];

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
