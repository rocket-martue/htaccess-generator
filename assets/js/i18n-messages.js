/**
 * i18n-messages.js — JS 動的生成で使う翻訳メッセージ
 *
 * generator.js / main.js / guide.js / theme.js が参照するキーのみを格納。
 * HTML の静的テキストは含まない。
 */

export const messagesJa = {
	// ナビゲーション（ハンバーガー aria-label）
	'nav.open': 'メニューを開く',
	'nav.close': 'メニューを閉じる',

	// テーマ切り替え
	'theme.dark': 'ダークモードに切り替え',
	'theme.light': 'ライトモードに切り替え',
	'theme.dark.label': 'ダーク',
	'theme.light.label': 'ライト',

	// プレビュー
	'preview.placeholder': '# オプションを選択してください',
	'btn.copy': 'コピー',
	'btn.copied': 'コピー済！',
	'btn.copyFail': 'コピー失敗',
	'btn.copy.aria': '表示中の内容をクリップボードにコピー',
	'btn.download': 'ダウンロード',
	'btn.download.aria': '表示中の内容を .htaccess ファイルとしてダウンロード',

	// タブ
	'tab.root': 'ルート .htaccess',
	'tab.list.aria': '生成ファイルの切り替え',

	// ヒント（バリデーション文言）
	'hint.ipBlock': 'ブロックする IP アドレスを入力してください',

	// プリセット（動的生成）
	'preset.recommended.label': 'おすすめ設定',
	'preset.recommended.desc': 'セキュリティとパフォーマンスのバランスが取れた推奨構成',
	'preset.basic.label': '基本設定',
	'preset.basic.desc': 'おすすめ設定からパフォーマンス（キャッシュ・圧縮）を除いた構成',
	'preset.headers-performance.label': 'パフォーマンス + セキュリティヘッダー',
	'preset.headers-performance.desc': 'キャッシュ・圧縮とセキュリティヘッダーを組み合わせた構成',
	'preset.headers-only.label': 'セキュリティヘッダーのみ',
	'preset.headers-only.desc': 'セキュリティレスポンスヘッダーだけを有効化',
	'preset.performance.label': 'パフォーマンス重視',
	'preset.performance.desc': 'キャッシュ・圧縮設定のみ有効化',
	'preset.max-security.label': '最大セキュリティ',
	'preset.max-security.desc': 'Basic 認証を除くすべてのセキュリティ項目を有効化',
	'preset.reset.label': 'リセット',
	'preset.reset.desc': 'すべての設定を初期状態に戻す',
	'preset.group.aria': 'プリセット選択',

	// .htaccess 出力コメント
	'gen.comment.blockXmlrpc': '# XML-RPC へのアクセスを無効化',
	'gen.comment.protectWpConfig': '# wp-config.php を保護',
	'gen.comment.protectHtaccess': '# .htaccess へのアクセス禁止',
	'gen.comment.blockDangerousExt': '# 特定のファイルタイプへのアクセスを制限',
	'gen.comment.wpLoginBasicAuth': '# wp-login.php に Basic 認証を設定',
	'gen.comment.ipBlock': '# 既知の攻撃 IP をブロック',
	'gen.comment.normalizeSlashes': '\t# スラッシュの重複（//）を正規化',
	'gen.comment.blockBadBots': '\t# 悪意のあるボット・スクリプトをブロック',
	'gen.comment.blockBackdoors': '\t# バックドア / マルウェア探索をブロック',
	'gen.comment.blockWpNesting': '\t# wp-* ディレクトリの多重ネストリクエストをブロック',
	'gen.comment.blockWpAdminIncludes': '\t# wp-admin/includes/ への直接アクセスをブロック',
	'gen.comment.blockWpIncludes': '\t# wp-includes/*.php への直接アクセスをブロック',
	'gen.comment.httpsRedirect': '\t# HTTPS リダイレクト',
	'gen.comment.blockBadQuery': '\t# 不正なクエリ文字列をブロック',
	'gen.comment.gzip': '# Gzip 圧縮',
	'gen.comment.expires': '# ブラウザキャッシュ設定',
	'gen.comment.cacheControl': '# Cache-Control ヘッダー',
	'gen.comment.mimeType': '# MIME タイプ追加',
	'gen.comment.etagDisable': '# ETags を無効化',
	'gen.comment.hsts': '\t# HSTS（HTTPS 接続時のみ送信）',
	'gen.comment.csp': '\t# CSP',
	'gen.comment.xContentType': '\t# X-Content-Type-Options',
	'gen.comment.xFrameOptions': '\t# X-Frame-Options',
	'gen.comment.xFrameOptionsWithCsp': '\t# X-Frame-Options（CSP の frame-ancestors と併用 - CSP 非対応の古いブラウザ向け保険）',
	'gen.comment.referrerPolicy': '\t# Referrer-Policy',
	'gen.comment.permissionsPolicy': '\t# Permissions-Policy',
	'gen.section.security': '# セキュリティ設定',
	'gen.section.rewrite': '# リライトルール',
	'gen.section.cache': '# キャッシュ & パフォーマンス設定',
	'gen.section.headers': '# セキュリティレスポンスヘッダー',
	'gen.comment.wpAdminBasicAuth': '# wp-admin に Basic 認証を設定',
	'gen.comment.ajaxExclude': '# admin-ajax.php へのアクセスを許可（フロントエンドの Ajax 用）',
	'gen.comment.upgradeIpExclude': '# upgrade.php はサーバー内部 IP のみ Basic 認証をスキップ（自動更新用）',
	'gen.comment.htpasswdPathPlaceholder': '# ↓ 要書き換え: サーバー上の .htpasswd の実際のフルパスに変更してください',
	'gen.comment.serverIpPlaceholder': '# ↓ 要書き換え: サーバーの実際の内部 IP に変更してください（例: 127.0.0.1）',
	'gen.comment.blockPhp': '# PHP 関連ファイルの実行を禁止',
};

export const messagesEn = {
	// Navigation (hamburger aria-label)
	'nav.open': 'Open menu',
	'nav.close': 'Close menu',

	// Theme toggle
	'theme.dark': 'Switch to dark mode',
	'theme.light': 'Switch to light mode',
	'theme.dark.label': 'Dark',
	'theme.light.label': 'Light',

	// Preview
	'preview.placeholder': '# Select options to generate',
	'btn.copy': 'Copy',
	'btn.copied': 'Copied!',
	'btn.copyFail': 'Copy failed',
	'btn.copy.aria': 'Copy current content to clipboard',
	'btn.download': 'Download',
	'btn.download.aria': 'Download current content as .htaccess file',

	// Tabs
	'tab.root': 'Root .htaccess',
	'tab.list.aria': 'Switch generated file',

	// Hints (validation messages)
	'hint.ipBlock': 'Enter IP addresses to block',

	// Presets (dynamic)
	'preset.recommended.label': 'Recommended',
	'preset.recommended.desc': 'Balanced security and performance configuration',
	'preset.basic.label': 'Basic',
	'preset.basic.desc': 'Recommended config without performance (cache/compression)',
	'preset.headers-performance.label': 'Performance + Security Headers',
	'preset.headers-performance.desc': 'Combines caching/compression with security headers',
	'preset.headers-only.label': 'Security Headers Only',
	'preset.headers-only.desc': 'Enable only security response headers',
	'preset.performance.label': 'Performance Focused',
	'preset.performance.desc': 'Enable only cache/compression settings',
	'preset.max-security.label': 'Maximum Security',
	'preset.max-security.desc': 'Enable all security options except Basic Auth',
	'preset.reset.label': 'Reset',
	'preset.reset.desc': 'Reset all settings to default',
	'preset.group.aria': 'Select preset',

	// .htaccess output comments
	'gen.comment.blockXmlrpc': '# Disable XML-RPC access',
	'gen.comment.protectWpConfig': '# Protect wp-config.php',
	'gen.comment.protectHtaccess': '# Block access to .htaccess',
	'gen.comment.blockDangerousExt': '# Restrict access to specific file types',
	'gen.comment.wpLoginBasicAuth': '# Set Basic Auth for wp-login.php',
	'gen.comment.ipBlock': '# Block known attack IPs',
	'gen.comment.normalizeSlashes': '\t# Normalize duplicate slashes (//)',
	'gen.comment.blockBadBots': '\t# Block malicious bots and scripts',
	'gen.comment.blockBackdoors': '\t# Block backdoor / malware probes',
	'gen.comment.blockWpNesting': '\t# Block wp-* nested directory requests',
	'gen.comment.blockWpAdminIncludes': '\t# Block direct access to wp-admin/includes/',
	'gen.comment.blockWpIncludes': '\t# Block direct access to wp-includes/*.php',
	'gen.comment.httpsRedirect': '\t# HTTPS redirect',
	'gen.comment.blockBadQuery': '\t# Block malicious query strings',
	'gen.comment.gzip': '# Gzip compression',
	'gen.comment.expires': '# Browser cache settings',
	'gen.comment.cacheControl': '# Cache-Control headers',
	'gen.comment.mimeType': '# Add MIME types',
	'gen.comment.etagDisable': '# Disable ETags',
	'gen.comment.hsts': '\t# HSTS (sent only over HTTPS)',
	'gen.comment.csp': '\t# CSP',
	'gen.comment.xContentType': '\t# X-Content-Type-Options',
	'gen.comment.xFrameOptions': '\t# X-Frame-Options',
	'gen.comment.xFrameOptionsWithCsp': '\t# X-Frame-Options (combined with CSP frame-ancestors - fallback for legacy browsers)',
	'gen.comment.referrerPolicy': '\t# Referrer-Policy',
	'gen.comment.permissionsPolicy': '\t# Permissions-Policy',
	'gen.section.security': '# Security Settings',
	'gen.section.rewrite': '# Rewrite Rules',
	'gen.section.cache': '# Cache & Performance Settings',
	'gen.section.headers': '# Security Response Headers',
	'gen.comment.wpAdminBasicAuth': '# Set Basic Auth for wp-admin',
	'gen.comment.ajaxExclude': '# Allow access to admin-ajax.php (for frontend Ajax)',
	'gen.comment.upgradeIpExclude': '# Skip Basic Auth for upgrade.php from server internal IP (for auto-updates)',
	'gen.comment.htpasswdPathPlaceholder': '# REPLACE THIS: Change to the actual full path to .htpasswd on your server',
	'gen.comment.serverIpPlaceholder': '# REPLACE THIS: Change to the actual server internal IP (e.g. 127.0.0.1)',
	'gen.comment.blockPhp': '# Disable PHP file execution',
};
