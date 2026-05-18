// ============================================================
// 📚 توابع کمکی عمومی (Utility Functions)
// ============================================================

/**
 * تبدیل اعداد انگلیسی به فارسی
 * @param {number|string} num - عدد یا رشته حاوی عدد
 * @returns {string} عدد به صورت فارسی
 */
const toFarsiNumber = (num) => {
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
const time = (t) => {
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
const sleep = (ms) => {
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
const sleepThen = (callback, ms) => {
    setTimeout(callback, ms);
};

/**
 * گرد کردن رو به بالا با دقت مشخص
 * @param {number} num - عدد ورودی
 * @param {number} precision - تعداد رقم اعشار
 * @returns {number} عدد گرد شده رو به بالا
 */
const roundUp = (num, precision) => {
    let prec = precision;
    if (prec === undefined) prec = 0;
    const factor = Math.pow(10, prec);
    return Math.ceil(num * factor) / factor;
};

// ============================================================
// 🧮 توابع کار با آرایه (Array Utilities)
// ============================================================

/**
 * حذف مقادیر تکراری و مرتب‌سازی آرایه
 * @param {Array} arr - آرایه ورودی
 * @returns {Array} آرایه بدون تکرار و مرتب شده
 */
const uniqAndSort = (arr) => {
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
const sorted = (arr) => {
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
const quantile = (arr, q, isSorted) => {
    let sortedArr;
    if (isSorted === true) {
        sortedArr = arr;
    } else {
        sortedArr = arr.slice().sort(function(a, b) { return a - b; });
    }
    if (!sortedArr || sortedArr.length === 0) return 0;
    const pos = (sortedArr.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sortedArr[base + 1] !== undefined) {
        return sortedArr[base] + rest * (sortedArr[base + 1] - sortedArr[base]);
    }
    return sortedArr[base];
};

/**
 * رتبه‌بندی مقادیر در آرایه
 * @param {Array} arr - آرایه ورودی
 * @param {Function} compFn - تابع مقایسه (پیش‌فرض: <=)
 * @returns {Array} آرایه رتبه‌ها
 */
const ranking = (arr, compFn) => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    let compare = compFn;
    if (compare === undefined) {
        compare = function(a, b) { return a <= b; };
    }
    return arr.map(function(a) {
        return arr.filter(function(b) { return compare(a, b); }).length;
    });
};

// ============================================================
// 🌐 توابع رشته و جهت (String & Direction)
// ============================================================

/**
 * اضافه کردن کنترل جهت (RTL/LTR) به ابتدای هر خط
 * @param {string} text - متن ورودی
 * @param {string} direction - جهت: 'ltr' یا 'rtl'
 * @returns {string} متن با کاراکتر کنترل جهت
 */
const addDirectionControl = (text, direction) => {
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

// ============================================================
// ⏱️ توابع زمانبندی (جاوا) - نیاز به Function Expression به دلیل arguments
// ============================================================

/**
 * اجرای تابع پس از تاخیر مشخص (جاوا)
 * @param {Function} callback - تابع برگشتی
 * @param {number} delay - تاخیر به میلی‌ثانیه
 * @returns {java.lang.Thread} نخ ایجاد شده
 */
const setTimeout = function(callback, delay) {
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
const clearTimeout = function(thread) {
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
const setInterval = function(callback, delay) {
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
const clearInterval = function(interval) {
    if (interval && interval.stop) {
        interval.stop();
    }
};

/**
 * پاک کردن تمام اینتروال‌های فعال
 */
const cleanupAllIntervals = function() {
    while (activeIntervals.length > 0) {
        const interval = activeIntervals[0];
        if (interval && interval.stop) {
            interval.stop();
        }
    }
};