# CLAUDE.md — Htaccess Generator

## プロジェクト概要

サーバーレス・スタンドアロンの **HTML / CSS / Vanilla JS** 製 .htaccess 生成 Web アプリ。
Cloudflare Pages でホスティング。ビルドなし、外部依存なし。

詳細な仕様・コーディング規約は `.github/copilot-instructions.md` を参照。

---

## ファイル構成（重要ファイル）

```
/
├── index.html                      ← メインページ（ジェネレーター UI）
├── htaccess-basics-guide/index.html        ← .htaccess 入門ガイド
├── directives-guide/index.html             ← ディレクティブ解説ガイド
├── options-errordocument-guide/index.html  ← Options & ErrorDocument 解説ガイド
├── security-headers-guide/index.html       ← セキュリティヘッダー解説ガイド
├── cache-performance-guide/index.html      ← キャッシュ＆パフォーマンス設定解説ガイド
├── wp-protection-guide/index.html          ← WordPress 保護設定解説ガイド
├── recovery-guide/index.html               ← 設定ミス時のリカバリー手順ガイド
├── assets/
│   ├── css/style.css               ← SCSS コンパイル済み（直接編集しない）
│   ├── scss/                       ← SCSS ソース（編集対象）
│   └── js/
│       ├── main.js                 ← ジェネレーターページ エントリーポイント
│       ├── guide.js                ← ガイドページ エントリーポイント
│       ├── theme.js                ← テーマ切り替え共通モジュール
│       ├── generator.js            ← .htaccess 生成ロジック（DOM 操作なし）
│       └── presets.js              ← プリセット定義データ
└── _headers                        ← Cloudflare Pages レスポンスヘッダー設定（CSP ハッシュ管理）
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
| `style.css` の直接編集 | 禁止 | SCSS コンパイル済みファイルのため `assets/scss/` を編集する |
| `# BEGIN/END HtaccessGenerator` マーカー | ルート .htaccess のみ出力 | WordPress の BEGIN/END ブロックと共存できるよう範囲を明示するため |
| CSP Report-Only 時の `upgrade-insecure-requests` | 除外 | アクション指示のため Report-Only ヘッダーに含めても無視される。管理画面 CSP も同様に除外する |
| 管理画面 CSP（wp-admin / wp-login.php） | フロント CSP と同じディレクティブ構成をベースに `script-src` へ `'unsafe-inline'` / `'unsafe-eval'`、`style-src` へ `'unsafe-inline'` を追加して動的生成 | ハードコード定数を廃止し、ユーザー設定を反映しつつ wp-admin の動作に必要な unsafe-* を保証するため |

---

## 作業フロー

- **修正・機能追加が必要な場合は、まず GitHub Issue をたてる**（直接コミットしない）

GitHub MCP を使用する

---

## 実装後チェックリスト

機能追加・変更を行ったあとは以下を確認すること。

- [ ] `README.md` の「生成可能な設定」に変更内容が反映されているか
