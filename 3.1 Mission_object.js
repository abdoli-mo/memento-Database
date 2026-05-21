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
