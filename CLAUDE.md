# CLAUDE.md — Htaccess Generator

## プロジェクト概要

サーバーレス・スタンドアロンの **HTML / CSS / Vanilla JS** 製 .htaccess 生成 Web アプリ。
Cloudflare Pages でホスティング。ビルドなし、外部依存なし。

詳細な仕様・コーディング規約は `.github/copilot-instructions.md` を参照。

---

## ファイル構成（重要ファイル）

```
/
├── _headers                        ← Cloudflare Pages CSP 等のレスポンスヘッダー設定
├── index.html                      ← メインページ（ジェネレーター UI）
├── {guide-name}/index.html         ← ガイドページ（5ページ）
├── assets/
│   ├── css/style.css               ← SCSS コンパイル済み（直接編集しない）
│   ├── scss/                       ← SCSS ソース（編集対象）
│   └── js/
│       ├── main.js                 ← ジェネレーターページ エントリーポイント
│       ├── guide.js                ← ガイドページ エントリーポイント
│       ├── theme.js                ← テーマ切り替え共通モジュール
│       ├── generator.js            ← .htaccess 生成ロジック（DOM 操作なし）
│       └── presets.js              ← プリセット定義データ
└── _headers                        ← CSP ハッシュ管理（後述）
```

---

## 必須ルール

### CSP インラインスクリプトのハッシュ管理

`_headers` の `Content-Security-Policy` には `script-src` に sha256 ハッシュを指定している。
**`<head>` 内のインラインスクリプトを変更したら必ずハッシュを再計算すること。**

```js
// ハッシュ再計算（Node.js）
const fs = require('fs'), crypto = require('crypto');
const content = fs.readFileSync('index.html', 'utf-8');
const script = content.slice(content.indexOf('<script>') + 8, content.indexOf('</script>'));
console.log('sha256-' + crypto.createHash('sha256').update(script, 'utf8').digest('base64'));
```

`_headers` は全ページ共通（`/*`）のため、**全ページのインラインスクリプトは同一内容にする**こと。

### 全ページ共通のダークモード初期化スクリプト

`index.html` および全ガイドページの `<head>` には以下の**完全に同一の**スクリプトを使用する:

```html
<script>
    try {
        if (window.localStorage && localStorage.getItem('htaccess-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    } catch (e) {
        // localStorage is unavailable (e.g. disabled or restricted); fall back to default theme
    }
</script>
```

内容・インデント・コメント文が異なると CSP ハッシュが一致しなくなるため**一字一句同じにすること**。

---

## 禁止事項（プロジェクト固有）

- `var` 使用禁止（`const` / `let` を使用）
- 外部フレームワーク・ライブラリ導入禁止
- `# BEGIN WordPress` 〜 `# END WordPress` ブロックの生成禁止
- `<IfModule>` なしでの Apache モジュール依存ディレクティブ記述禁止
- `php_flag engine off` 使用禁止（PHP-FPM 環境非対応のため）
- `Header set`（`always` なし）でのセキュリティヘッダー出力禁止
- **`Header always set Connection "keep-alive"` の生成禁止**（`Connection` はホップバイホップヘッダーのため `.htaccess` では Keep-Alive を制御できない。Keep-Alive は `httpd.conf` の `KeepAlive` ディレクティブで設定する）

---

## 既知の設計判断

| 項目 | 判断 | 理由 |
|---|---|---|
| Keep-Alive オプション | 削除済み | `.htaccess` では制御不可 |
| `.htpasswd` 生成 | 非対応 | bcrypt は外部ライブラリ必須、SHA1 はセキュリティ不足 |
| `# BEGIN WordPress` ブロック | 生成しない | WordPress が自動生成するため |
| `style.css` の直接編集 | 禁止 | SCSS コンパイル済みファイルのため `scss/` を編集する |
