// ==UserScript==
// @name         RandokuCC 繁簡轉換器
// @namespace    https://github.com/hsienjan/randoku-cc
// @version      1.1.0
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
      "倾": "傾", "假": "假", "偎": "偎", "偿": "償", "储": "儲",
      "傥": "儻", "傧": "儐", "储": "儲", "傩": "儺", "傲": "傲",
      // 更多常用字...
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
      "变量": "變數", "函数": "函式", "方法": "方法", "对象": "物件",
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
      "軟件": "軟件", "軟盘": "軟碟", "硬盘": "硬碟", "打印机": "打印機",
      "服务器": "伺服器", "网络": "網絡", "互联网": "互聯網", "信息": "資訊",
      "短信": "短訊", "摄像头": "攝錄機", "视频": "視像", "音频": "音頻",
      "鼠标": "滑鼠", "数码": "數碼", "数字": "數碼", "宽带": "寬頻",
      "笔记本电脑": "手提電腦", "台式机": "桌上電腦", "平板电脑": "平板電腦",
      "智能手机": "智能電話", "人工智能": "人工智能", "程序": "程式",
      "软件": "軟件", "硬件": "硬件", "文件": "檔案", "文件夹": "資料夾",
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
    useBuiltin: true,     // CDN 失效時使用內建字典
  };

  function getSettings() {
    try {
      const stored = GM_getValue('opencc_settings', '{}');
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  function saveSettings(settings) {
    GM_setValue('opencc_settings', JSON.stringify(settings));
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
    const size = 48;
    const margin = 20;

    if (pos.x !== null && pos.y !== null) {
      // 有儲存過位置，clamp 到可見範圍
      const maxX = window.innerWidth - size - margin;
      const maxY = window.innerHeight - size - margin;
      trigger.style.left = Math.max(margin, Math.min(pos.x, maxX)) + 'px';
      trigger.style.top = Math.max(margin, Math.min(pos.y, maxY)) + 'px';
    } else {
      // 預設右下角
      trigger.style.left = (window.innerWidth - size - margin) + 'px';
      trigger.style.top = (window.innerHeight - size - margin) + 'px';
    }
  }

  // ============================================
  // 網站黑名單檢查
  // ============================================
  function isBlacklisted(url, blacklist) {
    return blacklist.some(pattern => {
      try {
        const regex = new RegExp(pattern, 'i');
        return regex.test(url);
      } catch (e) {
        return false;
      }
    });
  }

  // ============================================
  // 簡易轉換器（內建字典）
  // ============================================
  function createBuiltinConverter(from, to) {
    return (text) => {
      if (!text) return text;

      let result = text;

      // 根據方向選擇字典
      if (from === 'cn' && to === 'tw') {
        // 簡轉繁（台灣）
        const dict = { ...BUILTIN_DICT.s2t, ...BUILTIN_DICT.tw };
        // 長詞優先
        const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
        for (const key of sortedKeys) {
          result = result.replace(new RegExp(key, 'g'), dict[key]);
        }
      } else if (from === 'cn' && to === 'hk') {
        // 簡轉繁（香港）
        const dict = { ...BUILTIN_DICT.s2t, ...BUILTIN_DICT.hk };
        const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
        for (const key of sortedKeys) {
          result = result.replace(new RegExp(key, 'g'), dict[key]);
        }
      } else if (from === 'tw' && to === 'cn') {
        // 繁轉簡（需要建立反向字典）
        const reverseDict = {};
        for (const [k, v] of Object.entries(BUILTIN_DICT.s2t)) {
          reverseDict[v] = k;
        }
        const sortedKeys = Object.keys(reverseDict).sort((a, b) => b.length - a.length);
        for (const key of sortedKeys) {
          result = result.replace(new RegExp(key, 'g'), reverseDict[key]);
        }
      }
      // 其他組合可依需求擴充

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
  function applyCustomRules(text, settings) {
    if (!text) return text;

    let result = text;
    const placeholders = [];

    // 步驟 1: 保護詞組（替換為佔位符）
    settings.protectWords.forEach((word, idx) => {
      if (!word) return;
      const placeholder = `__OPENCC_PROTECT_${idx}__`;
      const regex = new RegExp(escapeRegExp(word), 'g');
      result = result.replace(regex, (match) => {
        placeholders.push({ placeholder, value: match });
        return placeholder;
      });
    });

    // 步驟 2: OpenCC 轉換
    if (openccConverter) {
      result = useBuiltin ? openccConverter(result) : openccConverter(result);
    }

    // 步驟 3: 套用自定義轉換規則
    const sortedRules = Object.entries(settings.customRules)
      .sort((a, b) => b[0].length - a[0].length); // 長詞優先

    for (const [from, to] of sortedRules) {
      if (!from || from === to) continue;
      result = result.replace(new RegExp(escapeRegExp(from), 'g'), to);
    }

    // 步驟 4: 還原保護詞組
    placeholders.forEach(({ placeholder, value }) => {
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });

    return result;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

  function convertSelectedText() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const settings = getSettings();

    // 簡易實作：替換選取文字
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    if (!selectedText) return;

    // 這裡需要更複雜的實作來處理跨節點選取
    // 暫時使用簡易方案
    console.log('[OpenCC] Selected text conversion not fully implemented');
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
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        cursor: grab;
        z-index: 999998;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
      }
      #opencc-trigger.opencc-dragging {
        cursor: grabbing;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        transform: scale(1.1);
        transition: none;
      }
      #opencc-trigger:not(.opencc-dragging) {
        transition: transform 0.2s, box-shadow 0.2s;
      }
      #opencc-trigger:hover {
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
        const size = 48;
        const margin = 20;
        const maxX = window.innerWidth - size - margin;
        const maxY = window.innerHeight - size - margin;

        const newX = Math.max(margin, Math.min(startLeft + dx, maxX));
        const newY = Math.max(margin, Math.min(startTop + dy, maxY));

        trigger.style.left = newX + 'px';
        trigger.style.top = newY + 'px';
      }

      e.preventDefault();
    }

    function onPointerUp(e) {
      if (!isDragging) return;

      if (dragStarted) {
        // 儲存位置
        savePosition({ x: trigger.offsetLeft, y: trigger.offsetTop });
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
              <span>優先使用內建字典</span>
              <div class="opencc-switch ${settings.useBuiltin ? 'active' : ''}" id="opencc-builtin"></div>
            </label>
            <div class="opencc-hint">CDN 失效時的備援機制</div>
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
    } else {
      hidePanel();
    }
  }

  function hidePanel() {
    const panel = document.getElementById('opencc-panel');
    if (panel) {
      panel.classList.add('opencc-hidden');
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
      .split('\n')
      .map(s => s.trim())
      .filter(s => s);

    settings.customRules = {};
    panel.querySelector('#opencc-custom').value.split('\n').forEach(line => {
      const match = line.match(/^(.+?)=(.+)$/);
      if (match) {
        settings.customRules[match[1].trim()] = match[2].trim();
      }
    });

    settings.blacklist = panel.querySelector('#opencc-blacklist').value
      .split('\n')
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
    let debounceTimer = null;

    function flushPending() {
      if (pendingNodes.length === 0) return;
      const nodes = pendingNodes;
      pendingNodes = [];

      // 只轉換新增的節點，跳過已轉換的
      nodes.forEach(node => {
        if (node.dataset?.openccConverted) return;
        convertPage({ root: node, skipConverted: true });
      });
    }

    // 監聽 DOM 變化
    observer = new MutationObserver((mutations) => {
      // URL 變化檢測（SPA）→ 整頁重跑
      if (currentURL !== window.location.href) {
        currentURL = window.location.href;
        pendingNodes = [];
        if (!isBlacklisted(currentURL, settings.blacklist)) {
          convertPage();
        }
        return;
      }

      // 收集新增的節點
      let hasNewNodes = false;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE && !node.dataset?.openccConverted) {
            // 跳過 OpenCC 自己產生的 UI 元素
            if (node.id?.startsWith('opencc-')) continue;
            pendingNodes.push(node);
            hasNewNodes = true;
          }
        }
      }

      // debounce 批次處理
      if (hasNewNodes) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(flushPending, 300);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
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
