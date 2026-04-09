# Copilot Instructions — Htaccess Generator

## プロジェクト概要

サーバーレス・スタンドアロンの **HTML / CSS / Vanilla JS** 製 .htaccess 生成 Web アプリ。  
ユーザーが選択したオプションに基づいて、WordPress 用の .htaccess のリライトルールを生成する。

---

## 技術スタック

| 項目 | 内容 |
|---|---|
| HTML | HTML5 セマンティックマークアップ |
| CSS | カスタムプロパティ（CSS Variables）、ライトテーマ（デフォルト）+ ダークテーマ切り替え |
| JavaScript | Vanilla JS（ES2020+）、モジュール構成 |
| クリップボード | `navigator.clipboard.writeText()`（非同期） |
| ダウンロード | `Blob` + `URL.createObjectURL()` + `<a download>` |
| 外部依存 | **なし**（フレームワーク・ライブラリ不使用） |

---

## ホスティング

| 項目 | 内容 |
|---|---|
| プラットフォーム | **Cloudflare Pages** |
| デプロイ方式 | GitHub リポジトリ連携（`main` ブランチへの push で自動デプロイ） |
| ビルドコマンド | なし（スタティックサイトのためビルド不要） |
| 公開ディレクトリ | `/`（リポジトリルート） |
| カスタムドメイン | 未設定（必要に応じて追加） |

### `_headers` ファイル

Cloudflare Pages の HTTP レスポンスヘッダーをリポジトリルートの `_headers` ファイルで設定する。

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), payment=(), usb=()
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests
```

---

## ファイル構成

```
/
├── _headers                    ← Cloudflare Pages HTTP レスポンスヘッダー設定
├── index.html                  ← メイン HTML・全 UI 構造
├── htaccess-basics-guide/
│   └── index.html              ← .htaccess 入門ガイド
├── directives-guide/
│   └── index.html              ← ディレクティブ解説ガイド
├── options-errordocument-guide/
│   └── index.html              ← Options & ErrorDocument 解説ガイド
├── security-headers-guide/
│   └── index.html              ← セキュリティヘッダー解説ガイド
├── cache-performance-guide/
│   └── index.html              ← キャッシュ＆パフォーマンス設定解説ガイド
├── wp-protection-guide/
│   └── index.html              ← WordPress 保護設定解説ガイド
├── recovery-guide/
│   └── index.html              ← 設定ミス時のリカバリー手順ガイド
├── assets/
│   ├── css/
│   │   └── style.css           ← ライト / ダークテーマ デザイン（SCSS コンパイル済み）
│   ├── scss/
│   │   ├── style.scss          ← エントリポイント（@use でパーシャルを読み込み）
│   │   ├── _variables.scss     ← CSS カスタムプロパティ（ライト :root + ダーク [data-theme="dark"]）
│   │   └── ...                 ← パーシャル各種（_layout, _form, _button, _preset 等）
│   └── js/
│       ├── main.js             ← エントリーポイント（イベント登録・初期化・コピー処理）
│       ├── guide.js            ← ガイドページ用エントリーポイント（テーマ初期化）
│       ├── theme.js            ← テーマ切り替え共通モジュール
│       ├── generator.js        ← .htaccess ルール生成ロジック（3ファイル分）
│       └── presets.js          ← プリセット定義（おすすめ / ヘッダーのみ / パフォーマンス / 最大セキュリティ）
├── images/                     ← OGP 画像等（任意）
├── .local-docs/                ← セッション資料（デプロイ対象外）
├── .github/
│   └── copilot-instructions.md
└── .gitignore
```

---

## コーディング規約

### JavaScript

- **ES2020+** 構文を使用（`const` / `let`、アロー関数、テンプレートリテラル、Optional Chaining など）
- `var` は使用禁止
- ファイルは ES Modules（`type="module"`）として記述する
- 関数は単一責務の原則に従い、小さく保つ
- マジックナンバーは名前付き定数で定義する
- `main.js` がジェネレーターページのエントリーポイント。DOM 参照・イベント登録・コピー処理を担う
- `guide.js` がガイドページのエントリーポイント。テーマ初期化・切り替え処理のみを担う
- `theme.js` はテーマ切り替えの共通モジュール。ジェネレーターページ・ガイドページの両方から `import` する
- `generator.js` は純粋な生成ロジックのみ（DOM 操作なし）。設定オブジェクトを受け取り、行の配列を返す
- `presets.js` はデータ定義のみ（プリセット名・設定値のオブジェクト配列を `export`）

### HTML

- セマンティックタグを使用（`<section>`、`<label>`、`<output>` など）
- すべてのフォームコントロールには `<label>` を明示的に関連付ける（`for` 属性または `aria-label`）
- アクセシビリティのため `aria-*` 属性を適切に設定する

### CSS / SCSS

- CSS カスタムプロパティ（`--variable-name`）でテーマカラーを管理する
- クラス名は kebab-case を使用（例: `.button-primary`）
- セレクターの詳細度を低く保ち、ID セレクターは使用しない
- **デフォルトはライトテーマ**（背景: `#ffffff` 系、アクセント: 紫〜青グラデーション）
- ダークテーマは `[data-theme="dark"]` セレクタで上書き（背景: `#0f0f1a` 系）
- テーマ変数は `scss/_variables.scss` の `:root`（ライト）と `[data-theme="dark"]`（ダーク）で一元管理
- SCSS エントリポイントは `scss/style.scss`（`@use` でパーシャルを読み込み）
- SCSS コンパイル出力先は `css/style.css`（VS Code 拡張機能 **Live Sass Compiler** を使用）
- パーシャルは機能単位で分割する（`_variables`, `_layout`, `_form`, `_button`, `_preset` 等）

---

## 機能仕様

本アプリはユーザーが選択したオプションに基づき、WordPress 用 .htaccess のディレクティブを **3 ファイル分** 生成する。

### 生成対象の .htaccess（3 ファイル）

| ファイル | 設置場所 | 内容 |
|---|---|---|
| ルート | `public_html/.htaccess` | リライト・ヘッダー・キャッシュ等メインの設定 |
| wp-admin | `public_html/wp-admin/.htaccess` | 管理画面の Basic 認証 |
| uploads | `public_html/wp-content/uploads/.htaccess` | PHP 実行防止 |

### ルート .htaccess の生成カテゴリ

#### 1. Options & ErrorDocument

- `Options -MultiViews -Indexes`（ディレクトリ一覧 & コンテンツネゴシエーション無効化）
- `ErrorDocument 403 default` / `ErrorDocument 404 default`（エラー処理の軽量化）

#### 2. ファイルアクセス制限

- `xmlrpc.php` のブロック（`Require all denied`）
- `wp-config.php` の保護
- `.htaccess` 自身の保護
- 危険な拡張子のブロック（`.inc` / `.log` / `.sh` / `.sql`）
- `wp-login.php` への Basic 認証（オプション。ユーザー名と `.htpasswd` のフルパスを入力）

#### 3. リライトルール（`mod_rewrite`）

- スラッシュ重複の正規化（`//` → `/`、301 リダイレクト）
- 悪意のあるボット・スクリプトのブロック（UA 判定: 攻撃ツール / 汎用クライアント / SEO クローラーをグループ別に個別 ON/OFF 可能）
- バックドア / マルウェア探索のブロック（既知ファイル名 → 403）
- `wp-*` ディレクトリの多重ネスト防止（パストラバーサル攻撃対策 → 403）
- `wp-includes` ディレクトリの直接ブラウズ防止
- HTTPS リダイレクト（`%{HTTPS}` + `X-Forwarded-Proto` 判定、Nginx リバプロ構成対応）
- IP アドレスによるブロック（オプション）
- 不正なクエリ文字列のブロック（`?w=xxx` 等 → 410 Gone）

#### 4. セキュリティヘッダー（`mod_headers`）

すべて `Header always set` で出力する（エラーレスポンスにも付与）。

| ヘッダー | 値（デフォルト） | 目的 |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | HTTPS 強制（ブラウザレベル）。`expr=` 条件で HTTPS 接続時のみ送信 |
| `Content-Security-Policy` | `upgrade-insecure-requests;` | Mixed Content 自動修正 |
| `X-Content-Type-Options` | `nosniff` | MIME スニッフィング禁止 |
| `X-Frame-Options` | `SAMEORIGIN` | クリックジャッキング防止 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | URL 情報漏洩制御 |
| `Permissions-Policy` | camera / microphone / payment 等を無効化 | 不要なブラウザ API の制限 |

#### 5. キャッシュ & パフォーマンス

- Gzip 圧縮（`mod_deflate`）: HTML / CSS / JS / JSON 等のテキスト圧縮
- ブラウザキャッシュ（`Cache-Control`）: カテゴリ別（CSS/JS・画像・アイコン・動画・フォント・フィード）に有効期限をカスタマイズ可能 + `immutable` フラグ
- HTML / JSON / XML はキャッシュしない（動的コンテンツ）
- ETag の無効化
- MIME タイプの追加（`mime_module`）: `.ico` / `.svg` / `.woff` 等
- Keep-Alive の有効化

### wp-admin/.htaccess の生成内容

- 管理画面全体への Basic 認証（ユーザー名と `.htpasswd` のフルパスを入力）
- `admin-ajax.php` の除外（フロントエンド Ajax の動作継続）
- `upgrade.php` のサーバー内部 IP 除外（WordPress 自動更新の維持）

### wp-content/uploads/.htaccess の生成内容

- PHP 関連ファイル（`.php` / `.phar` / `.phtml`）の実行防止（`FilesMatch` + `Require all denied`）
- Apache 2.2 / 2.4 互換パターンで記述（幅広い環境への対応）

### プリセット機能

ユーザーがワンクリックで定型構成を適用できるプリセットを用意する。

| プリセット名 | 説明 |
|---|---|
| おすすめ設定 | セキュリティとパフォーマンスのバランスが取れた推奨構成（uploads 保護を含む） |
| セキュリティヘッダーのみ | ヘッダーだけ有効、他は無効 |
| パフォーマンス重視 | キャッシュ・圧縮設定のみ |
| 最大セキュリティ | Basic 認証を除くすべてのセキュリティ項目を有効化（uploads 保護を含む） |

### UI 機能

- **タブ切り替えプレビュー**: 生成される .htaccess の内容を `<pre>` + `<code>` でリアルタイム表示する。3 ファイル（ルート / wp-admin / uploads）をタブで切り替え、選択中のタブのみ表示する。wp-admin・uploads タブは該当オプションが有効な場合のみ表示する
- **クリップボードコピー**: 表示中のタブの内容を `navigator.clipboard.writeText()` でワンクリックコピー
- **ダウンロード**: 表示中のタブの内容を `Blob` + `URL.createObjectURL()` で `.htaccess` ファイルとしてダウンロードする（MIME タイプ: `text/plain`）
- **ダーク / ライトテーマ切り替え**: `[data-theme="dark"]` で切り替え、デフォルトはライトテーマ- **入力必須オプションのヒントメッセージ**: トグル ON かつ入力欄が空のときにリアルタイムでユーザーに入力を促す（対象: IP ブロック / wp-login.php Basic 認証 / wp-admin Basic 認証）
### .htaccess 生成時の注意事項

- `# BEGIN WordPress` 〜 `# END WordPress` ブロックは **生成しない**（WordPress がパーマリンク設定の保存時に自動生成するため。環境により内容が異なる）
- カスタムルールはすべて WordPress ブロックの **上** に配置する（WordPress の `RewriteRule . /index.php [L]` より後に書くと RewriteRule 系が届かないため。`Header` / `Cache-Control` 等のレスポンス系ディレクティブは位置に依存しないが、統一性のため上にまとめる）
- 生成出力の末尾に配置ガイドコメントを付与する（例: `# ↓ この下に WordPress が自動生成するブロックが入ります`）
- `<IfModule>` ラッパーで未対応モジュール環境での 500 エラーを防止する
- HSTS ヘッダーの `expr=` 条件で Nginx リバースプロキシ構成（XServer / ConoHa WING 等）に対応する

### Basic 認証の方針

- パスワードの自動生成や `.htpasswd` のハッシュ生成は**行わない**（bcrypt は外部ライブラリ必須、SHA1 はセキュリティ不足のため）
- UI では **ユーザー名** と **`.htpasswd` のフルパス**（例: `/home/username/.htpasswd`）のみ入力させる
- `.htaccess` には `AuthUserFile` のパス参照のみ出力する
- 生成出力に `.htpasswd` の作成コマンドをコメントで案内する（例: `# htpasswd -c /home/username/.htpasswd ユーザー名`）

### 生成出力の構造

`generator.js` はセクションごとにビルド関数を分け、以下の順序で出力をまとめる。

```
# ===========================
# Security Settings
# ===========================
（Options / ErrorDocument / ファイル保護 / IP ブロック）

# ===========================
# Rewrite Rules
# ===========================
（mod_rewrite 内のルール群）

# ===========================
# Cache & Performance Settings
# ===========================
（Gzip / Expires / Cache-Control / ETag / MIME Type / Keep-Alive）

# ===========================
# Security Response Headers
# ===========================
（mod_headers 内のヘッダー群）

# ↓ この下に WordPress が自動生成するブロックが入ります
# BEGIN WordPress
# ...
# END WordPress
```

---

## 禁止事項

- `var` の使用禁止（`const` / `let` を使用）
- 外部フレームワーク・ライブラリの導入禁止
- ID セレクターの使用禁止（CSS の詳細度を低く保つ）
- `# BEGIN WordPress` 〜 `# END WordPress` ブロックの生成禁止（WordPress が自動管理するため）
- `# BEGIN WordPress` 〜 `# END WordPress` ブロック内へのカスタムルール配置禁止（WordPress が自動上書きするため）
- `<IfModule>` なしでの Apache モジュール依存ディレクティブ記述禁止（500 エラー防止）
- `php_flag engine off` の使用禁止（PHP-FPM 環境で効かないため、`FilesMatch` + `Require all denied` を使用する）
- `Header set`（`always` なし）でのセキュリティヘッダー出力禁止（エラーレスポンスにも付与するため `Header always set` を使用する）

---

## 参考リポジトリ

本プロジェクトは以下の 2 リポジトリをアーキテクチャ・コードパターンの参考にしている。

| リポジトリ | 役割 |
|---|---|
| [rocket-martue/password-generator](https://github.com/rocket-martue/password-generator) | **UI / アーキテクチャの参考**。同じ技術スタック（HTML / CSS / Vanilla JS / Cloudflare Pages）のサーバーレス Web アプリ。ファイル構成・SCSS 設計・テーマ切り替え・プリセット UI・コピー機能のパターンを踏襲する |
| [rocket-martue/htaccess-security-settings](https://github.com/rocket-martue/htaccess-security-settings) | **.htaccess 生成ロジックの参考**。WordPress プラグイン版の .htaccess ジェネレーター。`class-hss-htaccess-builder.php` のセクション構成（`build_options_section` / `build_file_protection_section` / `build_rewrite_section` / `build_cache_section` / `build_headers_section`）・プリセット定義・Apache ディレクティブの出力パターンを JS に移植する |

---

## 作業履歴

### 2026-03-26: PR #5 マージ（#4 対応）

**ブランチ**: `feature/issue-4-guide-pages`

**対応内容**:

- **#4** ガイドページ追加・URL 構造整理・`assets/` 統合・ダークモード FOUC 修正: ディレクティブ解説・セキュリティヘッダー・キャッシュ＆パフォーマンス・WordPress 保護・リカバリーの 5 ガイドページを追加。`css/` `js/` `scss/` を `assets/` 配下に統合。`<head>` 内ブロッキングインラインスクリプトで FOUC を解消し、`_headers` の CSP を sha256 ハッシュ対応に変更。ドロップダウンナビをヘッダーに追加

**変更ファイル**: `index.html` / 各ガイドページ（新規）/ `assets/` 全体 / `_headers`

---

### 2026-03-26: PR #7 マージ（#6 対応）

**ブランチ**: `fix/issue-6-dropdown-escape-blur`

**対応内容**:

- **#6** Escape キーでドロップダウンが視覚的に閉じない問題を修正: CSS 表示条件を `aria-expanded` ベースに一元化。`focusin` ハンドラに `escapingByKey` フラグを追加し Escape 後のフォーカス復帰で再開しないよう制御

**変更ファイル**: `assets/js/main.js` / `assets/scss/_layout.scss` / `assets/css/style.css`

---

### 2026-03-27: PR #9 マージ（#8 対応）

**ブランチ**: `feature/issue-8-preset-reset-button`

**対応内容**:

- **#8** プリセットエリアにリセットボタンを追加: 全設定を初期状態（全 OFF）に戻せるリセットボタンを実装。ライト/ダーク両テーマ対応スタイルを追加

**変更ファイル**: `assets/js/main.js` / `assets/scss/_preset.scss` / `assets/css/style.css`

---

### 2026-03-27: Issue #10 対応計画策定・派生 Issue 作成

**対象 Issue**: [#10 セキュリティレスポンスヘッダーの設定は、サイト毎に設定内容を変更できた方がいい](https://github.com/rocket-martue/htaccess-generator/issues/10)

**ブランチ**: `feature/issue-10-security-headers-customization`

**対応計画**: `.local-docs/plan-issue-10-security-headers-customization.md`

**対応内容**: セキュリティレスポンスヘッダー（HSTS / X-Frame-Options / Referrer-Policy / Permissions-Policy）のサブオプションを追加し、サイトごとに設定をカスタマイズできるようにする。

**サブオプション UI 方針**:
- ドロップダウン（`<select>`）は使用しない
- チェックボックス: 独立した ON/OFF（HSTS の includeSubDomains / preload、Permissions-Policy の各機能）
- ラジオボタン: 排他的な選択（X-Frame-Options の DENY / SAMEORIGIN、Referrer-Policy の 8 択）

**修正対象ファイル**: `index.html` / `generator.js` / `main.js` / `presets.js` / SCSS / `security-headers-guide/index.html`

**派生 Issue**（#10 のコメントから切り出し）:
- [#11 CSP の詳細設定](https://github.com/rocket-martue/htaccess-generator/issues/11)
- [#12 ボットブロックの例外設定](https://github.com/rocket-martue/htaccess-generator/issues/12)
- [#13 Options ディレクティブのサーバー互換性注意喚起](https://github.com/rocket-martue/htaccess-generator/issues/13)
- [#14 キャッシュ有効期限のカスタマイズ](https://github.com/rocket-martue/htaccess-generator/issues/14)
- [#15 入力が必要なオプションにヒントメッセージを表示](https://github.com/rocket-martue/htaccess-generator/issues/15)

---

### 2026-03-28: PR #16 マージ（#10 対応）

**ブランチ**: `feature/issue-10-security-headers-customization`

**対応内容**:

- **#10** セキュリティレスポンスヘッダーのカスタマイズ対応: HSTS（includeSubDomains / preload）・X-Frame-Options（DENY / SAMEORIGIN）・Referrer-Policy（8 択ラジオ）・Permissions-Policy（7 機能チェックボックス）のサブオプション UI を追加し、`generator.js` の `buildHeadersSection()` を動的生成に変更。セキュリティヘッダーガイドページも合わせて更新

**変更ファイル**: `index.html` / `assets/js/generator.js` / `assets/js/main.js` / `assets/js/presets.js` / `assets/scss/_form.scss` / `security-headers-guide/index.html`

---

### 2026-03-28: PR #17 マージ（#11 対応）

**ブランチ**: `feature/issue-11-csp-detailed-settings`

**対応内容**:

- **#11** CSP（Content-Security-Policy）詳細設定対応: `upgrade-insecure-requests` 固定出力だった CSP を、各ディレクティブ（default-src / script-src / style-src / img-src / font-src / connect-src / frame-src / frame-ancestors）を個別 ON/OFF・値指定できるサブフィールド UI に拡張。script-src に `unsafe-inline` / `unsafe-eval`、style-src に `unsafe-inline` チェックボックスを追加。frame-src に YouTube / Google Maps ショートカット追加

**変更ファイル**: `index.html` / `assets/js/generator.js` / `assets/js/main.js` / `assets/js/presets.js` / `assets/scss/_form.scss` / `security-headers-guide/index.html`

---

### 2026-03-28: PR #19 マージ（htaccess 入門ガイド追加）

**ブランチ**: `feat/htaccess-basics-guide`

**対応内容**:

- `.htaccess` 入門ガイドページ（`htaccess-basics-guide/index.html`）を新規作成: .htaccess とは / できること / 使える環境（主要レンタルサーバー対応表）/ WordPress との関係 / 基本構文の 3 本柱 / 注意事項（バックアップ・リカバリガイドリンク）
- `index.html` のガイドドロップダウンに「.htaccess 入門」を先頭エントリとして追加

**変更ファイル**: `htaccess-basics-guide/index.html`（新規）/ `index.html`

---

### 2026-03-28 〜 2026-04-01: PR #18 マージ（#12 / #13 / #14 / #15 対応）

**ブランチ**: `feature/remaining-issues`

**対応内容**:

- **#13** Options ディレクティブのサーバー互換性注意喚起: `disableIndexes` トグル直後に静的な注意テキストを追加
- **#15** 入力必須オプションのヒントメッセージ: トグル ON かつ入力欄が空のときにリアルタイムでヒントを表示（IP ブロック / wp-login.php Basic 認証 / wp-admin Basic 認証）
- **#12** ボットブロックの UA 個別 ON/OFF: 17 UA を「攻撃ツール / 汎用クライアント / SEO クローラー」グループ別に個別チェックボックスで ON/OFF 可能に
- **#14** キャッシュ有効期限カスタマイズ: CSS/JS・画像・アイコン・動画・フォント・フィード・デフォルトの 7 カテゴリをセレクトボックス（6 択）で設定可能に

**変更ファイル**: `index.html` / `assets/scss/_form.scss` / `assets/js/generator.js` / `assets/js/main.js` / `assets/js/presets.js`

---

### 2026-03-29 〜 2026-04-01: PR #30 マージ（#23 / #24 対応）

**ブランチ**: `feat/p3-documentation`

**対応内容**:

- **#23** Options & ErrorDocument ガイドページ新規作成: `options-errordocument-guide/index.html` を追加（-Indexes / -MultiViews の説明、ErrorDocument の動作原理、サーバー互换性注意、メンテナンス模式例）
- **#24** directives-guide に `%{THE_REQUEST}` 解説追加: `%{THE_REQUEST}` を使う理由と `\s[^\s?]*//` パターンの説明

**変更ファイル**: `options-errordocument-guide/index.html`（新規）/ `directives-guide/index.html`

---

### 2026-04-01: PR #29 マージ（#20 / #21 / #25 / #26 / #27 / #28 対応）

**ブランチ**: `fix/p1-bug-fixes`

**対応内容**:

- **#20** CSP `frame-src` で `'none'` と許可ソースが同時出力されるバグを修正: YouTube / Google Maps が ON の場合は `'none'` を除外
- **#21** CSP に `default-src` を追加: デフォルト値 `'self' https:`、全プリセットに反映（未指定ディレクティブの全許可フォールバックを防止）
- **#25** `wp-includes` の直接アクセスブロックを 2 ブロック構成に修正（`wp-admin/includes/` への全アクセス + `wp-includes/*.php` への直接アクセス）
- **#26** Gzip の `SetOutputFilter DEFLATE` を削除（`AddOutputFilterByType` との重複・圧縮済み画像の再圧縮 CPU 浪費を解消）
- **#27** CSP に wp-admin 用分岐（`<If>` ブロック）を追加: `cspAdminSplit` チェックボックスで管理画面とフロントエンドに別 CSP を出力（管理画面側は `unsafe-eval` + `unsafe-inline` 許可）
- **#28** Permissions-Policy `geolocation` を 3 択 UI に変更: 完全無効化 / Google マップ許可 / ポリシーから除外

**変更ファイル**: `assets/js/generator.js` / `assets/js/main.js` / `assets/js/presets.js` / `index.html`

---

### 2026-04-01: PR #32 作成（#31 対応）

**ブランチ**: `fix/issue-31-double-slash-pattern`

**対応内容**:

- **#31** ダブルスラッシュ検出パターンをクエリ文字列除外に修正: `[^\s]*` → `[^\s?]*`（ `?url=https://example.com` への誤マッチを防止）

**変更ファイル**: `assets/js/generator.js` / `directives-guide/index.html`

---

### 2026-04-02: PR #34 マージ（#33 対応）

**ブランチ**: `feat/issue-33-security-headers-guide-content`

**対応内容**:

- **#33** セキュリティヘッダーガイドにコンテンツを追加: 「セキュリティヘッダーとは」イントロセクション追加（概要・メリット・デメリット・ヘッダー一覧テーブル）。CSP セクションに管理画面用 CSP 分岐（`<If>` ブロック）の説明追加。Permissions-Policy の `geolocation` 3 択設定を説明

**変更ファイル**: `security-headers-guide/index.html`

---

### 2026-04-04: PR #36 マージ（#35 対応）

**ブランチ**: `fix/issue-35-remove-basic-auth-username`

**対応内容**:

- **#35** Basic 認証のユーザー名入力欄を削除: `require valid-user` は `.htpasswd` 登録ユーザー全員を許可するため、ジェネレーター側でユーザー名を入力させる必要がなかった。wp-login.php / wp-admin 両方の入力欄を削除し、出力コメントを簡略化

**変更ファイル**: `index.html` / `assets/js/generator.js` / `assets/js/main.js` / `assets/js/presets.js`

---

### 2026-04-05: PR #38 マージ（CSP デフォルト設定改善）

**ブランチ**: `fix/csp-security-defaults`

**対応内容**:

- `img-src` に `https:` を追加（バグ修正）: `img-src` 明示時に `default-src` フォールバックが効かなくなる仕様により外部画像が全ブロックされていた問題を修正（`'self' data:` → `'self' data: https:`）
- `unsafe-eval` をデフォルト無効化: XSS リスクが高いため全プリセットで `false` に変更。必要な場合向けにコメント案内を追加
- `X-Frame-Options` と `frame-ancestors` 併用時にコメントを追加
- `Permissions-Policy` に `accelerometer=()` を追加

**変更ファイル**: `assets/js/generator.js` / `assets/js/main.js` / `assets/js/presets.js` / `index.html`

---

### 2026-04-05: PR #39 マージ（#37 対応）

**ブランチ**: `feat/csp-report-only`

**対応内容**:

- **#37** CSP に Report-Only モードを追加: `Content-Security-Policy-Report-Only` ヘッダーを出力するチェックボックスを追加。Report-Only 時は `upgrade-insecure-requests` を除外（管理画面 CSP も同様）。全ディレクティブ無効時は CSP ヘッダー自体を出力しないガードを追加

**変更ファイル**: `index.html` / `assets/js/generator.js` / `assets/js/main.js` / `assets/js/presets.js`

---

### 2026-04-06: PR #45 マージ（#44 対応）

**ブランチ**: `feature/cache-control-max-age-customizable`

**対応内容**:

- **#44** Cache-Control の max-age をカテゴリ別にカスタマイズ可能に: CSS/JS・画像・アイコン・フォント・動画の max-age をラジオボタン（6 択）で設定可能に。CSS/JS・フォントには `immutable` 付与。`Header set` → `Header always set` に修正（CLAUDE.md 禁止事項対応）

**変更ファイル**: `assets/js/generator.js` / `index.html` / `assets/js/main.js` / `assets/js/presets.js`

---

### 2026-04-06: PR #55, #56, #57, #59 マージ（#40 / #41 / #42 / #43 / #52 / #53 対応）

**ブランチ**: 各 Issue 個別ブランチ

**対応内容**:

- **#52** X-Forwarded-Proto を HTTPS リダイレクトのサブオプションに従属（PR #55）: 独立 toggle-row からサブオプションに移動し、`httpsRedirect` OFF 時に連動して無効化
- **#53** 対応 Apache バージョン（2.4 以降）を UI と README に明記（PR #56）: ヘッダー説明文・README 技術スタックテーブルに要件を追記
- **#40** HSTS max-age カスタマイズ（PR #57）: セレクトボックス（5 択）追加、`preload` ON かつ max-age 1年未満の場合に警告表示
- **#41** Permissions-Policy 拡充（PR #57）: `fullscreen` / `autoplay` / `clipboard-read` / `clipboard-write` / `picture-in-picture` / `screen-wake-lock` / `web-share` の 7 項目を追加
- **#42** 不正クエリパラメータのカスタマイズ（PR #59）: テキストエリアで自由に設定可能に（英数字・`_`・`-` のみ許容）
- **#43** 危険な拡張子のカスタマイズ（PR #59）: テキストエリアで自由に設定可能に（先頭の `.` 自動除去・バリデーションあり）

**変更ファイル**: `index.html` / `assets/js/generator.js` / `assets/js/main.js` / `assets/js/presets.js`

---

### 2026-04-07: PR #60 マージ（#58 対応）

**ブランチ**: `feature/issue-58-apache-version-selector`

**対応内容**:

- **#58** 対象 Apache バージョンを UI で切り替えられるようにする: プリセットセクション直下にラジオボタン（2.2/2.4 両対応 / 2.4 以降のみ）を追加。2.4 選択時は `<IfVersion>` 分岐なしのシンプルな `Require all denied` 出力に切り替わる

**変更ファイル**: `index.html` / `assets/js/generator.js` / `assets/js/main.js` / `assets/js/presets.js`

---

### 2026-04-08: PR #62 マージ（#61 対応）

**ブランチ**: `feature/issue-61-csp-refactor`

**対応内容**:

- **#61** CSP 管理画面分岐を常時有効化・管理画面 CSP を動的生成に変更: `cspAdminSplit` チェックボックスを廃止し、CSP 有効時は常に wp-admin / wp-login.php を分岐出力。ハードコードの `ADMIN_CSP` 定数を廃止し、フロント CSP と同じディレクティブ構成をベースに `script-src` / `style-src` へ `'unsafe-inline'` / `'unsafe-eval'` を追加して動的生成。フロント側の `unsafe-*` チェックボックス UI を全廃

**変更ファイル**: `assets/js/generator.js` / `assets/js/main.js` / `assets/js/presets.js` / `index.html`

---

### 2026-04-09: PR #65 マージ（#64 対応）

**ブランチ**: `feature/issue-64-apache-version-default`

**対応内容**:

- **#64** デフォルト Apache バージョンを `both`（2.2/2.4 互換）から `2.4` に変更: `presets.js` の `DEFAULT_SETTINGS.apacheVersion`・`main.js` のフォールバック値・`index.html` のデフォルトチェックをすべて `2.4` に統一

**変更ファイル**: `assets/js/presets.js` / `assets/js/main.js` / `index.html`

---

### 2026-04-09: Issue #66 対応・マージ

**対応内容**:

- **#66** CSP サブフィールドの Report-Only トグルを先頭に移動: ディレクティブ一覧（8行）の末尾にあり見えにくかった `Report-Only モード（テスト用）` チェックボックスをサブフィールドの先頭に移動。2つのヒントテキストを1つに統合（`upgrade-insecure-requests` の注意 + Report-Only の説明）。

**変更ファイル**: `index.html`
