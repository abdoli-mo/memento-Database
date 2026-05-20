/**
 * =============================================
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
 *      load("4.1_Mission_Functions.js");
 * 
 *   📌 مدیریت حافظه:
 *      - WeakMap در Rhino کار می‌کند و برای کش خودکار مفید است
 *      - از تابع cleanupAllIntervals() برای پاک کردن اینتروال‌ها استفاده کنید
 * 
 * ============================================
 * 📦 Polyfill های ارائه شده در این کتابخانه
 * =============================================
 * 
 *   📌 بخش 1.1 (Init_Polyfills):
 *      - Array.from        - تبدیل array-like به آرایه
 *      - Array.max         - پیدا کردن بزرگترین مقدار
 *      - Array.min         - پیدا کردن کوچکترین مقدار
 *      - setTimeout        - اجرای تابع پس از تاخیر
 *      - clearTimeout      - لغو تایمر
 *      - setInterval       - اجرای دوره‌ای تابع
 *      - clearInterval     - لغو اینتروال
 * 
 *   📌 بخش 1.4 (Utils_Promise):
 *      - Promise           - پیاده‌سازی کامل Promise
 *      - Promise.all       - انتظار برای همه Promises
 *      - Promise.race      - اولین Promise تکمیل شده
 *      - Promise.any       - اولین Promise موفق
 *      - Promise.allSettled - وضعیت همه Promises
 *      - Promise.delay     - تاخیر با Promise
 *      - Promise.timeout   - محدودیت زمان
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
 *
// =============================================