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

| リポジトリ | 役割 |
|---|---|
| [rocket-martue/password-generator](https://github.com/rocket-martue/password-generator) | UI / アーキテクチャの参考（同技術スタック） |
| [rocket-martue/htaccess-security-settings](https://github.com/rocket-martue/htaccess-security-settings) | .htaccess 生成ロジックの参考（WordPress プラグイン版） |

