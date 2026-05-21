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
