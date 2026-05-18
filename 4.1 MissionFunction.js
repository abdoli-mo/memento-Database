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
