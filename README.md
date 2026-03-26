# .htaccess Generator for WordPress

WordPress 用 .htaccess のセキュリティ・パフォーマンス設定をブラウザで簡単に生成できる Web アプリ。

**https://htaccess-generator-b46.pages.dev/**

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
- 悪意のあるボット・バックドア探索のブロック
- `wp-*` ディレクトリの多重ネスト防止 / `wp-includes` 直接ブラウズ防止
- HTTPS リダイレクト（リバースプロキシ対応）
- IP アドレスによるブロック
- 不正なクエリ文字列のブロック
- `uploads` ディレクトリの PHP 実行防止

### セキュリティレスポンスヘッダー

- HSTS（Strict-Transport-Security）
- CSP（upgrade-insecure-requests）
- X-Content-Type-Options / X-Frame-Options
- Referrer-Policy / Permissions-Policy

### キャッシュ & パフォーマンス

- Gzip 圧縮（mod_deflate）
- ブラウザキャッシュ（Expires / Cache-Control）
- ETag 無効化
- MIME タイプ追加
- Keep-Alive 有効化

## 技術スタック

| 項目 | 内容 |
|---|---|
| HTML | HTML5 セマンティックマークアップ |
| CSS | SCSS → CSS（カスタムプロパティ、ライト / ダークテーマ） |
| JavaScript | Vanilla JS（ES2020+）、ES Modules |
| ホスティング | Cloudflare Pages |
| 外部依存 | なし |

## ファイル構成

```
/
├── _headers                ← Cloudflare Pages HTTP レスポンスヘッダー設定
├── index.html              ← メイン UI
├── guide/
│   └── index.html          ← .htaccess ディレクティブ・フラグ解説ガイド
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
    ├── theme.js            ← テーマ切り替え共通モジュール
    ├── generator.js        ← .htaccess 生成ロジック
    └── presets.js           ← プリセット定義
```

## ライセンス

MIT
