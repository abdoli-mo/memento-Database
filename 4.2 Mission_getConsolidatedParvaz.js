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

