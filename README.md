# .htaccess Generator for WordPress

WordPress 用 .htaccess のセキュリティ・パフォーマンス設定をブラウザで簡単に生成できる Web アプリ。

**https://htaccess-generator-b46.pages.dev/**

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
- 3 ファイル対応 — ルート / wp-admin / uploads 用の .htaccess をそれぞれ生成
- プリセット — ワンクリックでおすすめ・基本・パフォーマンス・最大セキュリティ等の構成を適用
- ライト / ダークテーマ切り替え

## 生成可能な設定

### セキュリティ

- `xmlrpc.php` / `wp-config.php` / `.htaccess` のアクセス制限
- 危険な拡張子（`.inc` / `.log` / `.sh` / `.sql`）のブロック
- `wp-login.php` / `wp-admin` への Basic 認証
- 悪意のあるボット・バックドア探索のブロック（攻撃ツール / 汎用クライアント / SEO クローラーをグループ別に個別 ON/OFF 可能）
- `wp-*` ディレクトリの多重ネスト防止 / `wp-includes` 直接ブラウズ防止
- HTTPS リダイレクト（リバースプロキシ対応）
- IP アドレスによるブロック
- 不正なクエリ文字列のブロック
- `uploads` ディレクトリの PHP 実行防止

### セキュリティレスポンスヘッダー

- HSTS（Strict-Transport-Security）
- CSP（Content-Security-Policy）— ディレクティブ個別設定（default-src / script-src / style-src 等）、wp-admin 用 CSP 分岐、Report-Only モード対応
- X-Content-Type-Options / X-Frame-Options
- Referrer-Policy / Permissions-Policy

### キャッシュ & パフォーマンス

- Gzip 圧縮（mod_deflate）
- ブラウザキャッシュ（Expires / Cache-Control）— カテゴリ別（CSS/JS・画像・アイコン・動画・フォント・フィード）に有効期限をカスタマイズ可能
- ETag 無効化
- MIME タイプ追加

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
├── index.html                  ← メイン UI
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
        └── presets.js          ← プリセット定義
```

## ライセンス

MIT
