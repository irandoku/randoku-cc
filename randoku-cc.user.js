// ==UserScript==
// @name         RandokuCC 繁簡轉換器
// @namespace    https://github.com/irandoku/randoku-cc
// @version      1.1.1
// @description  以 OpenCC 為基礎的繁簡中文轉換 Userscript，支援自定義詞組、網站黑名單、自動轉換、一鍵還原
// @author       Randoku
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @grant        GM_info
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.min.js#sha384-DnXH/hsXaoW1DNaNY4N0kiwNuX9BsiaMeyB2AB+OyTTIfYnwVv+1/ciFfLaZmUrx
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  // ============================================
  // 內建字典（Fallback 機制）
  // ============================================
  const BUILTIN_DICT = {
    // 簡體轉繁體（台灣）核心字典
    s2t: {
      "万": "萬", "与": "與", "丑": "醜", "专": "專", "业": "業",
      "丛": "叢", "东": "東", "丝": "絲", "丢": "丟", "两": "兩",
      "严": "嚴", "丧": "喪", "个": "個", "丰": "豐", "临": "臨",
      "为": "為", "丽": "麗", "举": "舉", "么": "麼", "义": "義",
      "乌": "烏", "乐": "樂", "乔": "喬", "习": "習", "乡": "鄉",
      "书": "書", "买": "買", "乱": "亂", "了": "瞭", "争": "爭",
      "于": "於", "云": "雲", "亚": "亞", "产": "產", "亩": "畝",
      "亲": "親", "亵": "褻", "亸": "嚲", "亿": "億", "仅": "僅",
      "从": "從", "仑": "侖", "仓": "倉", "仪": "儀", "们": "們",
      "价": "價", "众": "眾", "优": "優", "伙": "夥", "会": "會",
      "伟": "偉", "传": "傳", "伤": "傷", "伦": "倫", "伪": "偽",
      "伫": "佇", "体": "體", "余": "餘", "佣": "傭", "佥": "僉",
      "侠": "俠", "侣": "侶", "侥": "僥", "侦": "偵", "侧": "側",
      "侨": "僑", "侩": "儈", "侬": "儂", "俣": "俁", "俦": "儔",
      "俨": "儼", "俩": "倆", "俪": "儷", "俭": "儉", "债": "債",
      "倾": "傾", "偿": "償", "储": "儲", "傥": "儻", "傧": "儐",
      "傩": "儺", "发": "發", "变": "變", "见": "見", "观": "觀",
      "让": "讓", "说": "說", "话": "話", "请": "請", "谁": "誰",
      "关": "關", "开": "開", "间": "間", "问": "問", "门": "門",
      "闲": "閒", "处": "處", "声": "聲", "员": "員", "别": "別",
      "场": "場", "块": "塊", "备": "備", "复": "複", "觉": "覺",
      "历": "歷", "记": "記", "论": "論", "讲": "講", "读": "讀",
      "写": "寫", "学": "學", "导": "導", "层": "層", "岁": "歲",
      "岛": "島", "广": "廣", "庆": "慶", "应": "應", "怀": "懷",
      "忆": "憶", "恼": "惱", "惯": "慣", "悬": "懸", "担": "擔",
      "拥": "擁", "报": "報", "拦": "攔", "择": "擇", "据": "據",
      "断": "斷", "无": "無", "时": "時", "还": "還", "过": "過",
      "这": "這", "里": "裡", "边": "邊", "经": "經", "运": "運",
      "进": "進", "远": "遠", "选": "選", "违": "違", "连": "連",
      "迟": "遲", "迹": "跡", "递": "遞", "触": "觸", "订": "訂",
      "计": "計", "讨": "討", "认": "認", "评": "評", "诉": "訴",
      "词": "詞", "试": "試", "诗": "詩", "诚": "誠", "诞": "誕",
      "该": "該", "详": "詳", "诧": "詫", "证": "證", "识": "識",
      "诊": "診", "误": "誤", "诵": "誦", "谜": "謎", "谢": "謝",
      "谈": "談", "谱": "譜", "谷": "穀", "购": "購", "赠": "贈",
      "赞": "讚", "赶": "趕", "赵": "趙", "趋": "趨", "跃": "躍",
      "车": "車", "轨": "軌", "轩": "軒", "轮": "輪", "转": "轉",
      "软": "軟", "载": "載", "辅": "輔", "轻": "輕", "辞": "辭",
      "迁": "遷", "达": "達", "适": "適", "遗": "遺", "释": "釋",
      "鉴": "鑑", "钝": "鈍", "钢": "鋼", "钟": "鐘", "钥": "鑰",
      "钱": "錢", "铁": "鐵", "铜": "銅", "银": "銀", "链": "鏈",
      "锁": "鎖", "锅": "鍋", "锋": "鋒", "锐": "銳", "错": "錯",
      "锡": "錫", "鸣": "鳴", "鸭": "鴨", "鸽": "鴿", "鹏": "鵬",
      "鹤": "鶴", "黄": "黃", "齐": "齊", "齿": "齒", "龄": "齡",
      "龙": "龍", "龟": "龜"
    },
    // 台灣慣用語轉換
    tw: {
      "軟件": "軟體", "軟盘": "軟碟", "硬盘": "硬碟", "磁盘": "磁碟",
      "光盘": "光碟", "内存": "記憶體", "打印机": "印表機", "服务器": "伺服器",
      "网络": "網路", "互联网": "網際網路", "信息": "資訊", "短信": "簡訊",
      "摄像头": "攝影機", "视频": "影片", "音频": "音訊", "鼠标": "滑鼠",
      "数码": "數位", "数字": "數位", "数字化": "數位化", "数码化": "數位化",
      "宽带": "寬頻", "调制解调器": "數據機", "笔记本电脑": "筆記型電腦",
      "台式机": "桌上型電腦", "平板电脑": "平板電腦", "智能手机": "智慧型手機",
      "人工智能": "人工智慧", "程序": "程式", "编程": "程式設計",
      "软件": "軟體", "硬件": "硬體", "接口": "介面", "文件": "檔案",
      "文件夹": "資料夾", "驱动": "驅動", "驱动器": "磁碟機",
      "默认": "預設", "设置": "設定", "选项": "選項", "配置": "組態",
      "变量": "變數", "函数": "函式", "对象": "物件",
      "类": "類別", "实例": "實例", "属性": "屬性", "参数": "參數",
      "返回值": "回傳值", "导入": "匯入", "导出": "匯出", "命名空间": "命名空間",
      "库": "函式庫", "模块": "模組", "组件": "元件", "控件": "控制項",
      "操作系统": "作業系統", "进程": "行程", "线程": "執行緒",
      "寄存器": "暫存器", "堆栈": "堆疊", "队列": "佇列", "缓存": "快取",
      "刷新": "重新整理", "注销": "登出", "登录": "登入", "账户": "帳號",
      "用户名": "使用者名稱", "密码": "密碼", "权限": "權限", "身份": "身分",
    },
    // 香港慣用語
    hk: {
      "軟盘": "軟碟", "硬盘": "硬碟", "打印机": "打印機",
      "服务器": "伺服器", "网络": "網絡", "互联网": "互聯網", "信息": "資訊",
      "短信": "短訊", "摄像头": "攝錄機", "视频": "視像", "音频": "音頻",
      "鼠标": "滑鼠", "数码": "數碼", "数字": "數碼", "宽带": "寬頻",
      "笔记本电脑": "手提電腦", "台式机": "桌上電腦", "平板电脑": "平板電腦",
      "智能手机": "智能電話", "程序": "程式",
      "软件": "軟件", "文件": "檔案", "文件夹": "資料夾",
      "默认": "預設", "设置": "設定", "变量": "變數", "函数": "函數",
      "类": "類別", "对象": "物件", "参数": "參數", "库": "函數庫",
      "模块": "模組", "操作系统": "作業系統", "进程": "行程", "线程": "線程",
      "寄存器": "暫存器", "刷新": "重新整理", "注销": "登出", "登录": "登入",
      "账户": "賬戶", "用户名": "用戶名稱", "密码": "密碼",
    }
  };

  // ============================================
  // 設定管理
  // ============================================
  const DEFAULT_SETTINGS = {
    origin: 'cn',           // 來源：cn, hk, tw, twp
    target: 'tw',           // 目標：cn, hk, tw, twp
    auto: false,            // 自動轉換模式
    blacklist: [            // 網站黑名單（regex pattern）
      'google\\.com/search',
      'translate\\.google',
      'docs\\.google',
      'github\\.com',
    ],
    protectWords: [],       // 保護詞組（不轉換）
    customRules: {},        // 自定義轉換規則
    useBuiltin: false,    // 預設使用 CDN；失效時自動 fallback 到內建字典
  };

  let _settingsCache = null;
  let _customRulesCache = null;

  function getSettings() {
    if (_settingsCache) return _settingsCache;
    try {
      const stored = GM_getValue('opencc_settings', '{}');
      const parsed = JSON.parse(stored);
      _settingsCache = { ...DEFAULT_SETTINGS, ...parsed };
      return _settingsCache;
    } catch (e) {
      _settingsCache = DEFAULT_SETTINGS;
      return _settingsCache;
    }
  }

  function saveSettings(settings) {
    GM_setValue('opencc_settings', JSON.stringify(settings));
    _settingsCache = { ...settings };
    _customRulesCache = null;
  }

  function invalidateSettingsCache() {
    _settingsCache = null;
    _customRulesCache = null;
  }

  // ============================================
  // 按鈕位置管理
  // ============================================
  const DEFAULT_POSITION = { x: null, y: null }; // null = 使用預設（右下角）

  function getPosition() {
    try {
      const stored = GM_getValue('opencc_position', '{}');
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_POSITION, ...parsed };
    } catch (e) {
      return DEFAULT_POSITION;
    }
  }

  function savePosition(pos) {
    GM_setValue('opencc_position', JSON.stringify(pos));
  }

  function applyPosition(trigger) {
    const pos = getPosition();
    const size = 36;
    const margin = 12;

    trigger.style.left = 'auto';
    if (pos.y !== null) {
      // 相容既有位置資料，只沿用垂直位置；按鈕固定在右側邊緣
      const maxY = window.innerHeight - size - margin;
      trigger.style.top = Math.max(margin, Math.min(pos.y, maxY)) + 'px';
    } else {
      // 預設右側中央，避免遮住頁面右下角常見控制項
      trigger.style.top = Math.max(margin, (window.innerHeight - size) / 2) + 'px';
    }
  }

  // ============================================
  // 網站黑名單檢查
  // ============================================
  const _blacklistRegexCache = new Map();

  function isBlacklisted(url, blacklist) {
    return blacklist.some(pattern => {
      let regex = _blacklistRegexCache.get(pattern);
      if (regex === undefined) {
        try {
          regex = new RegExp(pattern, 'i');
          _blacklistRegexCache.set(pattern, regex);
        } catch (e) {
          _blacklistRegexCache.set(pattern, null);
          return false;
        }
      }
      if (!regex) return false;
      return regex.test(url);
    });
  }

  // ============================================
  // 簡易轉換器（內建字典）
  // ============================================
  // 預處理：將字典排序並預編譯 RegExp，避免每次轉換重新計算
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function reverseDict(dict) {
    const reversed = {};
    for (const [k, v] of Object.entries(dict)) {
      if (k === v) continue; // ponytail: skip identity mappings
      reversed[v] = k;
    }
    return reversed;
  }

  // ponytail: twp uses tw vocabulary; fallback maps twp→tw
  const TARGET_ALIAS = { twp: 'tw' };

  const BUILTIN_CONVERTER_CACHE = (() => {
    const cache = {};
    function buildRules(dict) {
      return Object.keys(dict)
        .sort((a, b) => b.length - a.length)
        .map(key => ({ regex: new RegExp(escapeRegExp(key), 'g'), replacement: dict[key] }));
    }
    // cn → tw (twp 使用台灣慣用語，與 tw 共用字典)
    cache['cn:tw'] = buildRules({ ...BUILTIN_DICT.s2t, ...BUILTIN_DICT.tw });
    cache['cn:twp'] = cache['cn:tw'];
    // cn → hk
    cache['cn:hk'] = buildRules({ ...BUILTIN_DICT.s2t, ...BUILTIN_DICT.hk });
    // tw → cn (反向：s2t + tw 慣用語都反轉)
    cache['tw:cn'] = buildRules({ ...reverseDict(BUILTIN_DICT.s2t), ...reverseDict(BUILTIN_DICT.tw) });
    // hk → cn (反向：s2t + hk 慣用語都反轉)
    cache['hk:cn'] = buildRules({ ...reverseDict(BUILTIN_DICT.s2t), ...reverseDict(BUILTIN_DICT.hk) });
    return cache;
  })();

  function createBuiltinConverter(from, to) {
    const aliasedTo = TARGET_ALIAS[to] || to;
    const cacheKey = `${from}:${aliasedTo}`;
    const rules = BUILTIN_CONVERTER_CACHE[cacheKey];
    if (!rules) {
      console.warn(`[OpenCC] No builtin converter for ${from}→${to}, text unchanged`);
      return (text) => text;
    }
    return (text) => {
      if (!text) return text;
      let result = text;
      for (const { regex, replacement } of rules) {
        result = result.replace(regex, replacement);
      }
      return result;
    };
  }

  // ============================================
  // OpenCC 轉換器建立
  // ============================================
  let openccConverter = null;
  let useBuiltin = false;

  async function createConverter(from, to) {
    const settings = getSettings();

    // 檢查 OpenCC 是否可用
    if (typeof OpenCC !== 'undefined' && OpenCC.Converter && !settings.useBuiltin) {
      try {
        openccConverter = OpenCC.Converter({ from, to });
        useBuiltin = false;
        return openccConverter;
      } catch (e) {
        console.warn('[OpenCC] CDN converter failed, using builtin:', e);
      }
    }

    // 使用內建轉換器
    useBuiltin = true;
    openccConverter = createBuiltinConverter(from, to);
    return openccConverter;
  }

  // ============================================
  // 自定義詞組處理
  // ============================================
  function buildCustomRulesCache(settings) {
    const protectRegexes = settings.protectWords.map((word, idx) => ({
      regex: new RegExp(escapeRegExp(word), 'g'),
      placeholder: `__OPENCC_PROTECT_${idx}__`,
    }));

    const sortedRules = Object.entries(settings.customRules)
      .sort((a, b) => b[0].length - a[0].length)
      .filter(([from, to]) => from && from !== to)
      .map(([from, to]) => ({
        regex: new RegExp(escapeRegExp(from), 'g'),
        replacement: to,
      }));

    return { protectRegexes, sortedRules };
  }

  function applyCustomRules(text, settings) {
    if (!text) return text;

    if (!_customRulesCache) {
      _customRulesCache = buildCustomRulesCache(settings);
    }

    let result = text;
    const placeholders = [];

    // 步驟 1: 保護詞組（替換為佔位符）
    for (const { regex, placeholder } of _customRulesCache.protectRegexes) {
      result = result.replace(regex, (match) => {
        placeholders.push({ placeholder, value: match });
        return placeholder;
      });
    }

    // 步驟 2: OpenCC 轉換
    if (openccConverter) {
      result = openccConverter(result);
    }

    // 步驟 3: 套用自定義轉換規則
    for (const { regex, replacement } of _customRulesCache.sortedRules) {
      result = result.replace(regex, replacement);
    }

    // 步驟 4: 還原保護詞組
    for (const { placeholder, value } of placeholders) {
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }

    return result;
  }

  // ============================================
  // DOM 文字節點遍歷
  // ============================================
  function iterateTextNodes(node, callback) {
    const walker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let textNode;
    while ((textNode = walker.nextNode())) {
      callback(textNode);
    }
  }

  // ============================================
  // 轉換功能
  // ============================================
  async function convertPage(options = {}) {
    const { root = document.body, skipConverted = false } = options;
    const settings = getSettings();
    const converter = await createConverter(settings.origin, settings.target);

    if (!converter) {
      console.error('[OpenCC] Converter not available');
      return { count: 0, time: 0 };
    }

    const start = Date.now();
    let count = 0;

    // 轉換標題（只在整頁模式時）
    if (root === document.body) {
      if (!document.title.startsWith('opencc:')) {
        const originalTitle = document.title;
        const convertedTitle = applyCustomRules(originalTitle, settings);
        if (convertedTitle !== originalTitle) {
          document.title = 'opencc:' + convertedTitle;
          document.documentElement.dataset.openccOriginalTitle = originalTitle;
          count++;
        }
      }
    }

    // 轉換文字節點
    if (root) {
      iterateTextNodes(root, (textNode) => {
        // 跳過已轉換的節點
        if (skipConverted && textNode.parentElement?.dataset.openccConverted) return;

        const original = textNode.nodeValue;
        if (!original || !original.trim()) return;

        const converted = applyCustomRules(original, settings);
        if (converted !== original) {
          // 存原始文字到父元素（用 data 屬性太長會被截斷，改存到 WeakMap）
          if (!originalTextMap.has(textNode)) {
            originalTextMap.set(textNode, original);
          }
          textNode.nodeValue = converted;
          // 標記父元素已轉換
          if (textNode.parentElement) {
            textNode.parentElement.dataset.openccConverted = '1';
          }
          count++;
        }
      });
    }

    return { count, time: Date.now() - start };
  }

  // 還原功能
  const originalTextMap = new WeakMap();

  function restorePage() {
    let count = 0;

    // 還原標題
    const origTitle = document.documentElement.dataset.openccOriginalTitle;
    if (origTitle) {
      document.title = origTitle;
      delete document.documentElement.dataset.openccOriginalTitle;
      count++;
    }

    // 還原 body 文字節點
    if (document.body) {
      document.body.querySelectorAll('[data-opencc-converted]').forEach(el => {
        delete el.dataset.openccConverted;
      });

      iterateTextNodes(document.body, (textNode) => {
        const original = originalTextMap.get(textNode);
        if (original !== undefined) {
          textNode.nodeValue = original;
          originalTextMap.delete(textNode);
          count++;
        }
      });
    }

    return count;
  }

  // ============================================
  // UI 元件
  // ============================================
  function createPanel() {
    // 檢查是否已存在
    if (document.getElementById('opencc-panel')) return;

    const settings = getSettings();

    // 樣式
    const style = document.createElement('style');
    style.textContent = `
      #opencc-panel {
        position: fixed;
        width: 280px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        z-index: 999999;
        overflow: hidden;
        transition: opacity 0.2s, transform 0.2s;
      }
      #opencc-panel.opencc-hidden {
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
      }
      #opencc-panel .opencc-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 16px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #opencc-panel .opencc-close {
        cursor: pointer;
        opacity: 0.8;
        font-size: 18px;
        line-height: 1;
      }
      #opencc-panel .opencc-close:hover { opacity: 1; }
      #opencc-panel .opencc-body {
        padding: 16px;
      }
      #opencc-panel .opencc-section {
        margin-bottom: 16px;
      }
      #opencc-panel .opencc-section:last-child {
        margin-bottom: 0;
      }
      #opencc-panel .opencc-label {
        display: block;
        color: #666;
        margin-bottom: 6px;
        font-weight: 500;
      }
      #opencc-panel select,
      #opencc-panel textarea {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 13px;
        box-sizing: border-box;
      }
      #opencc-panel textarea {
        min-height: 60px;
        resize: vertical;
        font-family: monospace;
      }
      #opencc-panel .opencc-row {
        display: flex;
        gap: 8px;
      }
      #opencc-panel .opencc-row select {
        flex: 1;
      }
      #opencc-panel .opencc-arrow {
        color: #999;
        align-self: center;
        font-size: 14px;
      }
      #opencc-panel .opencc-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }
      #opencc-panel .opencc-switch {
        position: relative;
        width: 40px;
        height: 20px;
        background: #ddd;
        border-radius: 10px;
        transition: background 0.2s;
      }
      #opencc-panel .opencc-switch.active {
        background: #667eea;
      }
      #opencc-panel .opencc-switch::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 50%;
        transition: transform 0.2s;
      }
      #opencc-panel .opencc-switch.active::after {
        transform: translateX(20px);
      }
      #opencc-panel .opencc-btn {
        background: #667eea;
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        width: 100%;
        transition: background 0.2s;
      }
      #opencc-panel .opencc-btn:hover {
        background: #5a6fd6;
      }
      #opencc-panel .opencc-btn:active {
        background: #4e5ec2;
      }
      #opencc-panel .opencc-btn-secondary {
        background: #f0f0f0;
        color: #333;
        margin-top: 8px;
      }
      #opencc-panel .opencc-btn-secondary:hover {
        background: #e0e0e0;
      }
      #opencc-panel .opencc-hint {
        font-size: 11px;
        color: #999;
        margin-top: 4px;
      }
      #opencc-panel .opencc-tabs {
        display: flex;
        border-bottom: 1px solid #eee;
        margin-bottom: 12px;
      }
      #opencc-panel .opencc-tab {
        flex: 1;
        padding: 8px;
        text-align: center;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        color: #666;
      }
      #opencc-panel .opencc-tab.active {
        color: #667eea;
        border-bottom-color: #667eea;
        font-weight: 500;
      }
      #opencc-panel .opencc-tab-content {
        display: none;
      }
      #opencc-panel .opencc-tab-content.active {
        display: block;
      }
      #opencc-trigger {
        position: fixed;
        width: 36px;
        height: 36px;
        right: -18px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
        cursor: grab;
        z-index: 999998;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        opacity: 0.4;
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
      }
      #opencc-trigger.opencc-dragging {
        cursor: grabbing;
        opacity: 1;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        transform: scale(1.1);
        transition: none;
      }
      #opencc-trigger:not(.opencc-dragging) {
        transition: right 0.25s ease, opacity 0.2s, transform 0.2s, box-shadow 0.2s;
      }
      #opencc-trigger:hover,
      #opencc-trigger:focus-visible,
      #opencc-trigger.opencc-panel-open {
        right: 0;
        opacity: 1;
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
      }
      #opencc-trigger:active {
        transform: scale(0.95);
      }
    `;
    document.head.appendChild(style);

    // 觸發按鈕
    const trigger = document.createElement('div');
    trigger.id = 'opencc-trigger';
    trigger.innerHTML = '文';
    trigger.title = 'OpenCC 繁簡轉換（可拖移）';
    applyPosition(trigger);
    document.body.appendChild(trigger);

    // 拖移邏輯
    let isDragging = false;
    let dragStarted = false;
    let startX, startY, startLeft, startTop;

    function onPointerDown(e) {
      // 只處理左鍵或 touch
      if (e.type === 'mousedown' && e.button !== 0) return;

      const point = e.touches ? e.touches[0] : e;
      startX = point.clientX;
      startY = point.clientY;
      startLeft = trigger.offsetLeft;
      startTop = trigger.offsetTop;
      isDragging = true;
      dragStarted = false;

      e.preventDefault();
    }

    function onPointerMove(e) {
      if (!isDragging) return;

      const point = e.touches ? e.touches[0] : e;
      const dx = point.clientX - startX;
      const dy = point.clientY - startY;

      // 超過 5px 才算拖移（區分點擊）
      if (!dragStarted && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        dragStarted = true;
        trigger.classList.add('opencc-dragging');
      }

      if (dragStarted) {
        const margin = 12;
        const size = 36;
        const maxY = window.innerHeight - size - margin;

        const newY = Math.max(margin, Math.min(startTop + dy, maxY));

        trigger.style.top = newY + 'px';
      }

      e.preventDefault();
    }

    function onPointerUp(e) {
      if (!isDragging) return;

      if (dragStarted) {
        // 儲存位置
        savePosition({ x: null, y: trigger.offsetTop });
        trigger.classList.remove('opencc-dragging');
      } else {
        // 沒有實際拖移 = 點擊，開啟面板
        togglePanel();
      }

      isDragging = false;
      dragStarted = false;
    }

    // Mouse events
    trigger.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);

    // Touch events
    trigger.addEventListener('touchstart', onPointerDown, { passive: false });
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);

    // 面板
    const panel = document.createElement('div');
    panel.id = 'opencc-panel';
    panel.className = 'opencc-hidden';
    panel.innerHTML = `
      <div class="opencc-header">
        <span>OpenCC 繁簡轉換</span>
        <span class="opencc-close">&times;</span>
      </div>
      <div class="opencc-body">
        <div class="opencc-tabs">
          <div class="opencc-tab active" data-tab="main">主選項</div>
          <div class="opencc-tab" data-tab="custom">自定義</div>
          <div class="opencc-tab" data-tab="advanced">進階</div>
        </div>

        <div class="opencc-tab-content active" data-content="main">
          <div class="opencc-section">
            <label class="opencc-label">轉換方向</label>
            <div class="opencc-row">
              <select id="opencc-origin">
                <option value="cn" ${settings.origin === 'cn' ? 'selected' : ''}>簡體</option>
                <option value="tw" ${settings.origin === 'tw' ? 'selected' : ''}>台灣繁體</option>
                <option value="hk" ${settings.origin === 'hk' ? 'selected' : ''}>香港繁體</option>
              </select>
              <span class="opencc-arrow">→</span>
              <select id="opencc-target">
                <option value="tw" ${settings.target === 'tw' ? 'selected' : ''}>台灣繁體</option>
                <option value="twp" ${settings.target === 'twp' ? 'selected' : ''}>台灣慣用語</option>
                <option value="hk" ${settings.target === 'hk' ? 'selected' : ''}>香港繁體</option>
                <option value="cn" ${settings.target === 'cn' ? 'selected' : ''}>簡體</option>
              </select>
            </div>
          </div>

          <div class="opencc-section">
            <label class="opencc-toggle">
              <span>自動轉換模式</span>
              <div class="opencc-switch ${settings.auto ? 'active' : ''}" id="opencc-auto"></div>
            </label>
            <div class="opencc-hint">頁面載入時自動轉換</div>
          </div>

          <div class="opencc-section">
            <button class="opencc-btn" id="opencc-convert">立即轉換</button>
            <button class="opencc-btn opencc-btn-secondary" id="opencc-restore">還原原文</button>
          </div>
        </div>

        <div class="opencc-tab-content" data-content="custom">
          <div class="opencc-section">
            <label class="opencc-label">保護詞組（不轉換）</label>
            <textarea id="opencc-protect" placeholder="每行一個詞組，例如：&#10;蔡徐坤&#10;天干地支">${settings.protectWords.join('\n')}</textarea>
            <div class="opencc-hint">這些詞組會被保留原樣</div>
          </div>

          <div class="opencc-section">
            <label class="opencc-label">自定義轉換規則</label>
            <textarea id="opencc-custom" placeholder="格式：原詞=轉換後&#10;例如：&#10;鼠标=滑鼠&#10;软件=軟體">${Object.entries(settings.customRules).map(([k, v]) => `${k}=${v}`).join('\n')}</textarea>
            <div class="opencc-hint">每行一個規則，格式：原詞=轉換後</div>
          </div>
        </div>

        <div class="opencc-tab-content" data-content="advanced">
          <div class="opencc-section">
            <label class="opencc-label">網站黑名單（Regex）</label>
            <textarea id="opencc-blacklist" placeholder="每行一個 Pattern">${settings.blacklist.join('\n')}</textarea>
            <div class="opencc-hint">符合的網站不會自動轉換</div>
          </div>

          <div class="opencc-section">
            <label class="opencc-toggle">
              <span>強制使用內建字典</span>
              <div class="opencc-switch ${settings.useBuiltin ? 'active' : ''}" id="opencc-builtin"></div>
            </label>
            <div class="opencc-hint">關閉時優先使用 CDN，失敗才使用內建字典</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // 事件綁定
    panel.querySelector('.opencc-close').addEventListener('click', hidePanel);

    // Tab 切換
    panel.querySelectorAll('.opencc-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        saveSettingsFromUI();
        panel.querySelectorAll('.opencc-tab').forEach(t => t.classList.remove('active'));
        panel.querySelectorAll('.opencc-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        panel.querySelector(`[data-content="${tab.dataset.tab}"]`).classList.add('active');
      });
    });

    // 自動轉換開關
    panel.querySelector('#opencc-auto').addEventListener('click', function() {
      this.classList.toggle('active');
    });

    // 內建字典開關
    panel.querySelector('#opencc-builtin').addEventListener('click', function() {
      this.classList.toggle('active');
    });

    // 轉換按鈕
    panel.querySelector('#opencc-convert').addEventListener('click', async () => {
      saveSettingsFromUI();
      const btn = panel.querySelector('#opencc-convert');
      btn.textContent = '轉換中...';
      btn.disabled = true;

      const result = await convertPage();

      btn.textContent = `轉換完成 (${result.count} 處, ${result.time}ms)`;
      setTimeout(() => {
        btn.textContent = '立即轉換';
        btn.disabled = false;
      }, 2000);
    });

    // 還原按鈕
    panel.querySelector('#opencc-restore').addEventListener('click', () => {
      const btn = panel.querySelector('#opencc-restore');
      const count = restorePage();
      btn.textContent = `已還原 (${count} 處)`;
      setTimeout(() => {
        btn.textContent = '還原原文';
      }, 2000);
    });

    // 點擊外部收合
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
        hidePanel();
      }
    });

    // 關閉分頁前自動存檔
    window.addEventListener('beforeunload', () => {
      saveSettingsFromUI();
    });
  }

  function togglePanel() {
    const panel = document.getElementById('opencc-panel');
    const trigger = document.getElementById('opencc-trigger');
    if (!panel || !trigger) return;

    if (panel.classList.contains('opencc-hidden')) {
      // 根據按鈕位置決定面板展開方向
      const triggerRect = trigger.getBoundingClientRect();
      const panelWidth = 280;
      const panelHeight = 400; // 大約高度
      const margin = 10;

      // 水平：按鈕在右半邊，面板往左展開；反之往右
      if (triggerRect.left + panelWidth + margin > window.innerWidth) {
        panel.style.left = (triggerRect.left - panelWidth - margin) + 'px';
      } else {
        panel.style.left = (triggerRect.right + margin) + 'px';
      }

      // 垂直：確保面板不超出視窗
      let top = triggerRect.top;
      if (top + panelHeight > window.innerHeight) {
        top = window.innerHeight - panelHeight - margin;
      }
      top = Math.max(margin, top);
      panel.style.top = top + 'px';

      panel.classList.remove('opencc-hidden');
      trigger.classList.add('opencc-panel-open');
    } else {
      hidePanel();
    }
  }

  function hidePanel() {
    const panel = document.getElementById('opencc-panel');
    const trigger = document.getElementById('opencc-trigger');
    if (panel) {
      panel.classList.add('opencc-hidden');
      trigger?.classList.remove('opencc-panel-open');
      saveSettingsFromUI();
    }
  }

  function saveSettingsFromUI() {
    const panel = document.getElementById('opencc-panel');
    if (!panel) return;

    const settings = getSettings();

    settings.origin = panel.querySelector('#opencc-origin').value;
    settings.target = panel.querySelector('#opencc-target').value;
    settings.auto = panel.querySelector('#opencc-auto').classList.contains('active');
    settings.useBuiltin = panel.querySelector('#opencc-builtin').classList.contains('active');

    settings.protectWords = panel.querySelector('#opencc-protect').value
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(s => s);

    settings.customRules = {};
    panel.querySelector('#opencc-custom').value.split(/\r?\n/).forEach(line => {
      const match = line.match(/^(.+?)=(.+)$/);
      if (match) {
        settings.customRules[match[1].trim()] = match[2].trim();
      }
    });

    settings.blacklist = panel.querySelector('#opencc-blacklist').value
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(s => s);

    saveSettings(settings);
  }

  // ============================================
  // 自動轉換（MutationObserver）
  // ============================================
  let currentURL = '';
  let observer = null;

  function startAutoConvert() {
    const settings = getSettings();
    if (!settings.auto) return;
    if (isBlacklisted(window.location.href, settings.blacklist)) return;

    // 初始轉換
    convertPage();

    // 批次處理新增節點的 buffer
    let pendingNodes = [];
    let pendingTextNodes = [];
    let debounceTimer = null;

    function flushPending() {
      const settings = getSettings();

      // 處理新增的元素節點
      if (pendingNodes.length > 0) {
        const nodes = pendingNodes;
        pendingNodes = [];

        // 批次處理：若節點較多，直接對 document.body 統一走一次 TreeWalker
        if (nodes.length > 10) {
          convertPage({ root: document.body, skipConverted: true });
        } else {
          for (const node of nodes) {
            if (node.dataset?.openccConverted) continue;
            convertPage({ root: node, skipConverted: true });
          }
        }
      }

      // 處理內容變化的文字節點（例如 X 的「顯示更多」展開）
      if (pendingTextNodes.length > 0) {
        const textNodes = pendingTextNodes;
        pendingTextNodes = [];
        for (const textNode of textNodes) {
          if (!textNode.parentNode) continue;
          const currentText = textNode.nodeValue;
          if (!currentText || !currentText.trim()) continue;
          const converted = applyCustomRules(currentText, settings);
          if (converted !== currentText) {
            originalTextMap.set(textNode, currentText);
            textNode.nodeValue = converted;
          }
        }
      }
    }

    // 監聽 DOM 變化
    observer = new MutationObserver((mutations) => {
      // URL 變化檢測（SPA）→ 整頁重跑
      if (currentURL !== window.location.href) {
        currentURL = window.location.href;
        pendingNodes = [];
        pendingTextNodes = [];
        if (!isBlacklisted(currentURL, settings.blacklist)) {
          convertPage();
        }
        return;
      }

      let needsFlush = false;

      for (const mutation of mutations) {
        // 收集新增的元素節點
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && !node.dataset?.openccConverted) {
              if (node.id?.startsWith('opencc-')) continue;
              // 忽略不應轉換的節點類型
              const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'SVG', 'MATH', 'TEMPLATE'];
              if (skipTags.includes(node.tagName)) continue;
              // 忽略 contenteditable 區域
              if (node.isContentEditable || node.closest?.('[contenteditable]')) continue;
              pendingNodes.push(node);
              needsFlush = true;
            }
          }
        }

        // 收集內容變化的文字節點（例如 X 的「顯示更多」展開）
        if (mutation.type === 'characterData') {
          const textNode = mutation.target;
          if (textNode.nodeType === Node.TEXT_NODE && textNode.nodeValue?.trim()) {
            pendingTextNodes.push(textNode);
            needsFlush = true;
          }
        }
      }

      // debounce 批次處理
      if (needsFlush) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(flushPending, 300);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  // ============================================
  // 初始化
  // ============================================
  function init() {
    const settings = getSettings();

    // 檢查是否在黑名單
    if (isBlacklisted(window.location.href, settings.blacklist)) {
      console.log('[OpenCC] Current site is blacklisted, skipping');
      return;
    }

    // 建立 UI
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        createPanel();
        if (settings.auto) startAutoConvert();
      });
    } else {
      createPanel();
      if (settings.auto) startAutoConvert();
    }

    // 註冊選單命令
    if (typeof GM_registerMenuCommand !== 'undefined') {
      GM_registerMenuCommand('OpenCC: 開啟面板', togglePanel);
      GM_registerMenuCommand('OpenCC: 立即轉換', convertPage);
      GM_registerMenuCommand('OpenCC: 還原原文', () => restorePage());
    }

    // 鍵盤快捷鍵
    document.addEventListener('keydown', (e) => {
      // Alt+Shift+C 開啟面板
      if (e.altKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        togglePanel();
      }
      // Alt+Shift+V 快速轉換
      if (e.altKey && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        convertPage();
      }
      // Alt+Shift+R 還原原文
      if (e.altKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        restorePage();
      }
    });

    // 視窗 resize 時重新 clamp 按鈕位置
    window.addEventListener('resize', () => {
      const trigger = document.getElementById('opencc-trigger');
      if (trigger) applyPosition(trigger);
    });
  }

  // 啟動
  init();
})();
