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
