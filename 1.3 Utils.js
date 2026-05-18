// =============================================
// 📚 توابع کمکی عمومی (Utility Functions)
// =============================================

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

// ===========================================
// 🧮 توابع کار با آرایه (Array Utilities)
// ===========================================

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

// =============================================
// 🌐  توابع رشته و جهت و ایجاد مارک دان (String & Direction - Markdown)
// =============================================

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

// =============================================
// ⏱️ توابع زمانبندی (جاوا) - نیاز به Function Expression به دلیل arguments
// =============================================

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
