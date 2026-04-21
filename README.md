# .htaccess Generator for WordPress

WordPress 用 .htaccess のセキュリティ・パフォーマンス設定をブラウザで簡単に生成できる Web アプリ。

**https://htaccess-generator-b46.pages.dev/**

English version: **https://htaccess-generator-b46.pages.dev/en/**

## 多言語対応 / Multilingual

日本語（`/`）と英語（`/en/`）を URL で物理分離。各 URL が最初からその言語のコンテンツを返すため、FOUC（翻訳ちらつき）が発生しない。

- 日本語: `/`, `/htaccess-basics-guide/`, ...
- English: `/en/`, `/en/htaccess-basics-guide/`, ...

## 📜 ライセンスについて

本プロジェクトは **3層のライセンス構成** を採用しています:

| 対象 | ライセンス |
|---|---|
| ソースコード（本リポジトリ） | [MIT License](./LICENSE) |
| ホスティングサービス ([htaccess-generator-b46.pages.dev](https://htaccess-generator-b46.pages.dev)) | [利用規約](https://htaccess-generator-b46.pages.dev/terms) |
| 解説コンテンツ（ガイド記事・図表等） | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ja) |

> 💡 このツールは WordPress コミュニティへの贈り物として無償提供しています。
> セルフホスト・個人利用・業務利用（クライアントワーク含む）は歓迎します。
> ただし以下はご遠慮ください:
> - 本サービスを有料化して再提供する形での利用
> - 解説コンテンツを Udemy 等の**有料オンライン講座の教材として転用**すること
>
> 詳しくは[利用規約](https://htaccess-generator-b46.pages.dev/terms)をご覧ください。

## 特徴

- サーバー不要 — ブラウザだけで完結するスタティック Web アプリ
- 外部依存なし — フレームワーク・ライブラリ不使用の HTML / CSS / Vanilla JS 構成
- 多言語対応 — 日本語（`/`）と英語（`/en/`）を URL で物理分離（FOUC なし）
- 3 ファイル対応 — ルート / wp-admin / uploads 用の .htaccess をそれぞれ生成
- プリセット — ワンクリックでおすすめ・基本・パフォーマンス・最大セキュリティ等の構成を適用
- ライト / ダークテーマ切り替え

## 生成可能な設定

### セキュリティ

- `xmlrpc.php` / `wp-config.php` / `.htaccess` のアクセス制限
- 危険な拡張子（`.inc` / `.log` / `.sh` / `.sql`）のブロック
- `wp-login.php` / `wp-admin` への Basic 認証（生成コードの `AuthUserFile` はダミーパス `/path/to/your/.htpasswd` で出力されるため、サーバー上の `.htpasswd` 実パスに書き換えが必要。`admin-ajax.php` 除外・`upgrade.php` をサーバー内部 IP でスキップ対応。IP 除外もダミー IP `192.0.2.1` で出力されるため実 IP への書き換え必須）
- 悪意のあるボット・バックドア探索のブロック（攻撃ツール / 汎用クライアント / SEO クローラーをグループ別に個別 ON/OFF 可能）
- `wp-*` ディレクトリの多重ネスト防止 / `wp-includes` 直接ブラウズ防止
- HTTPS リダイレクト（リバースプロキシ対応）
- IP アドレスによるブロック
- 不正なクエリ文字列のブロック
- `uploads` ディレクトリの PHP 実行防止
- スラッシュ重複（`//`）の正規化リダイレクト

### セキュリティレスポンスヘッダー

- HSTS（Strict-Transport-Security）
- CSP（Content-Security-Policy）— ディレクティブ個別設定（default-src / script-src / style-src 等）、`frame-src` への YouTube / Google Maps 自動追加、wp-admin / wp-login.php への自動分岐出力（管理画面用に unsafe-inline / unsafe-eval を自動付与）、Report-Only モード対応
- X-Content-Type-Options / X-Frame-Options
- Referrer-Policy / Permissions-Policy（Geolocation は deny / Google Maps のみ許可 / 全許可の 3段階設定）

### キャッシュ & パフォーマンス

- Gzip 圧縮（mod_deflate）
- ブラウザキャッシュ（Expires / Cache-Control）— カテゴリ別（CSS/JS・画像・アイコン・動画・フォント・フィード）に有効期限をカスタマイズ可能
- ETag 無効化
- MIME タイプ追加

### サーバー設定

- `Options -Indexes`（ディレクトリ一覧非表示）/ `Options -MultiViews`（コンテントネゴシエーション無効）
- `ErrorDocument`（カスタムエラーページ — 400 / 401 / 403 / 404 / 500 等）
- Apache バージョン選択（2.4 のみ / 2.2 互換）

## 技術スタック

| 項目 | 内容 |
|---|---|
| 動作要件 | **Apache 2.4 以降**（`<RequireAll>` / `Require not ip` / `Header expr=` 等 2.4 専用構文を使用） |
| HTML | HTML5 セマンティックマークアップ |
| CSS | SCSS → CSS（カスタムプロパティ、ライト / ダークテーマ） |
| JavaScript | Vanilla JS（ES2020+）、ES Modules |
| ホスティング | Cloudflare Pages |
| 外部依存 | なし |

## ファイル構成

```
/
├── _headers                    ← Cloudflare Pages HTTP レスポンスヘッダー設定
├── index.html                  ← メイン UI（日本語）
├── htaccess-basics-guide/
│   └── index.html              ← .htaccess 入門ガイド（日本語）
├── directives-guide/
│   └── index.html              ← ディレクティブ解説ガイド（日本語）
├── options-errordocument-guide/
│   └── index.html              ← Options & ErrorDocument 解説ガイド（日本語）
├── security-headers-guide/
│   └── index.html              ← セキュリティヘッダー解説ガイド（日本語）
├── cache-performance-guide/
│   └── index.html              ← キャッシュ＆パフォーマンス設定解説ガイド（日本語）
├── wp-protection-guide/
│   └── index.html              ← WordPress 保護設定解説ガイド（日本語）
├── recovery-guide/
│   └── index.html              ← 設定ミス時のリカバリー手順ガイド（日本語）
├── terms/
│   └── index.html              ← 利用規約（日本語）
├── en/                         ← 英語版ページ（URL 物理分離）
│   ├── index.html              ← Main UI (English)
│   ├── htaccess-basics-guide/
│   │   └── index.html          ← .htaccess Basics Guide (English)
│   ├── directives-guide/
│   │   └── index.html          ← Directives & Flags Guide (English)
│   ├── options-errordocument-guide/
│   │   └── index.html          ← Options & ErrorDocument Guide (English)
│   ├── security-headers-guide/
│   │   └── index.html          ← Security Headers Guide (English)
│   ├── cache-performance-guide/
│   │   └── index.html          ← Cache & Performance Guide (English)
│   ├── wp-protection-guide/
│   │   └── index.html          ← WordPress Protection Guide (English)
│   ├── recovery-guide/
│   │   └── index.html          ← Recovery Guide (English)
│   └── terms/
│       └── index.html          ← Terms of Use (English)
└── assets/
    ├── css/
    │   └── style.css           ← コンパイル済み CSS
    ├── scss/
    │   ├── style.scss          ← SCSS エントリポイント
    │   ├── _variables.scss     ← CSS カスタムプロパティ（テーマ変数）
    │   ├── _base.scss          ← リセット & body
    │   ├── _layout.scss        ← レイアウト & カード
    │   ├── _toggle.scss        ← トグルスイッチ
    │   ├── _preset.scss        ← プリセットボタン
    │   ├── _form.scss          ← フォーム入力
    │   ├── _button.scss        ← ボタン & テーマ切替
    │   ├── _preview.scss       ← プレビューパネル
    │   └── _article.scss       ← ガイド記事ページ
    └── js/
        ├── main.js             ← エントリーポイント（イベント・コピー・ダウンロード）
        ├── guide.js            ← ガイドページ用エントリーポイント（テーマ初期化）
        ├── theme.js            ← テーマ切り替え共通モジュール
        ├── generator.js        ← .htaccess 生成ロジック
        ├── i18n-messages.js    ← 多言語メッセージ定義（ja / en）
        └── presets.js          ← プリセット定義
```

## ライセンス

MIT
