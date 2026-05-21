/**
 * ===========================================
 * بخش 1.5
 * 🐛 سیستم مدیریت لاگ فشرده (Debug Logger)
 * ===========================================
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
 * ==========================================
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
