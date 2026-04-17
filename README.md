# RandokuCC 繁簡轉換器

以 [OpenCC](https://github.com/BYVoid/OpenCC) 為基礎的瀏覽器 Userscript，支援繁簡中文轉換、自定義詞組、不轉換規則、網站黑名單與自動轉換。

## 功能

- 整頁簡繁 / 繁簡轉換（台灣 / 香港慣用語）
- 自動轉換模式（支援 SPA 動態內容）
- 自定義保護詞組（不轉換）
- 自定義轉換規則
- 網站黑名單（Regex）
- 一鍵還原原文
- 浮動按鈕可拖移，位置自動記憶
- CDN 失效時內建字典備援

## 安裝

1. 安裝瀏覽器擴充：[Tampermonkey](https://www.tampermonkey.net/)（Chrome / Edge / Firefox / Safari）
2. 點擊安裝：[randoku-cc.user.js](./randoku-cc.user.js)
3. 完成

## 快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `Alt+Shift+C` | 開啟設定面板 |
| `Alt+Shift+V` | 立即轉換 |
| `Alt+Shift+R` | 還原原文 |

## 轉換方向

- 簡體 → 台灣繁體
- 簡體 → 台灣慣用語（軟體、硬碟、印表機...）
- 簡體 → 香港繁體
- 繁體 → 簡體

## 技術

- 轉換引擎：[opencc-js](https://github.com/nk2028/opencc-js)（CDN）+ 內建字典（Fallback）
- 自動轉換：MutationObserver + debounce
- 設定儲存：Tampermonkey GM_getValue / GM_setValue
- 原始文字保存：WeakMap（自動 GC）

## License

MIT
