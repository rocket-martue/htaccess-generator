/**
 * generator.js — .htaccess ディレクティブ生成ロジック
 *
 * 設定オブジェクトを受け取り、行の配列を返す純粋関数群。
 * DOM 操作は一切行わない。
 */

// ─── 定数 ─────────────────────────────────────────────────────────

/** 悪意のあるボット・スクリプトの UA リスト */
const BAD_BOTS = [
	'wget', 'curl', 'nikto', 'sqlmap', 'python-requests',
	'go-http-client', 'libwww-perl', 'masscan', 'nmap',
	'zgrab', 'httpie', 'scrapy', 'java/', 'ahrefsbot',
	'semrushbot', 'dotbot', 'mj12bot',
];

/** 既知のバックドア / マルウェア探索パターン */
const BACKDOOR_PATTERNS = [
	'alfa\\.php', 'alfaindex\\.php', 'c99\\.php', 'r57\\.php',
	'shell\\.php', 'webshell\\.php', 'b374k\\.php', 'wso\\.php',
	'about\\.php', 'lock360\\.php', 'dark\\.php',
	'FilesMan\\.php', 'cgialfa', 'wp-vcd\\.php',
];

/** 不正なクエリ文字列パラメータ */
const BAD_QUERY_PARAMS = [
	'w',
];

// ─── ヘルパー ─────────────────────────────────────────────────────

/**
 * ファイルアクセス拒否ブロックを生成する（Apache 2.2/2.4 両対応）
 * @param {string} filename ファイル名
 * @returns {string[]} 行の配列
 */
const buildDenyFilesBlock = (filename) => [
	`<Files ${filename}>`,
	'\t<IfModule mod_authz_core.c>',
	'\t\tRequire all denied',
	'\t</IfModule>',
	'\t<IfModule !mod_authz_core.c>',
	'\t\tOrder deny,allow',
	'\t\tDeny from all',
	'\t</IfModule>',
	'</Files>',
];

// ─── セクションビルダー ─────────────────────────────────────────────

/**
 * Options セクション（Options ディレクティブ + ErrorDocument）を生成する
 * @param {object} options
 * @returns {string[]}
 */
const buildOptionsSection = (options) => {
	const lines = [];
	const opts = [];

	if (options.disableMultiviews) {
		opts.push('-MultiViews');
	}
	if (options.disableIndexes) {
		opts.push('-Indexes');
	}

	if (opts.length > 0) {
		lines.push(`Options ${opts.join(' ')}`);
	}

	if (options.errorDocument) {
		lines.push('');
		lines.push('ErrorDocument 403 default');
		lines.push('ErrorDocument 404 default');
	}

	if (lines.length > 0) {
		lines.push('');
	}

	return lines;
};

/**
 * ファイルアクセス制限セクションを生成する
 * @param {object} fileProtection
 * @returns {string[]}
 */
const buildFileProtectionSection = (fileProtection) => {
	const lines = [];

	// xmlrpc.php ブロック
	if (fileProtection.blockXmlrpc) {
		lines.push('# XML-RPC へのアクセスを無効化');
		lines.push(...buildDenyFilesBlock('xmlrpc.php'));
		lines.push('');
	}

	// wp-config.php 保護
	if (fileProtection.protectWpConfig) {
		lines.push('# wp-config.php を保護');
		lines.push(...buildDenyFilesBlock('wp-config.php'));
		lines.push('');
	}

	// .htaccess 保護
	if (fileProtection.protectHtaccess) {
		lines.push('# .htaccess へのアクセス禁止');
		lines.push(...buildDenyFilesBlock('.htaccess'));
		lines.push('');
	}

	// 危険な拡張子ブロック
	if (fileProtection.blockDangerousExt) {
		lines.push('# 特定のファイルタイプへのアクセスを制限');
		lines.push('<FilesMatch "\\.(inc|log|sh|sql)$">');
		lines.push('\t<IfModule mod_authz_core.c>');
		lines.push('\t\tRequire all denied');
		lines.push('\t</IfModule>');
		lines.push('\t<IfModule !mod_authz_core.c>');
		lines.push('\t\tOrder deny,allow');
		lines.push('\t\tDeny from all');
		lines.push('\t</IfModule>');
		lines.push('</FilesMatch>');
		lines.push('');
	}

	// wp-login.php Basic 認証
	if (fileProtection.wpLoginBasicAuth && fileProtection.htpasswdPath) {
		lines.push('# wp-login.php を保護');
		lines.push(`# htpasswd -c ${fileProtection.htpasswdPath} ${fileProtection.basicAuthUser || 'ユーザー名'}`);
		lines.push('<Files wp-login.php>');
		lines.push(`\tAuthUserFile "${fileProtection.htpasswdPath}"`);
		lines.push('\tAuthName "Member Site"');
		lines.push('\tAuthType BASIC');
		lines.push('\trequire valid-user');
		lines.push('</Files>');
		lines.push('');
	}

	return lines;
};

/**
 * IP ブロックセクションを生成する
 * @param {object} ipBlock
 * @returns {string[]}
 */
const buildIpBlockSection = (ipBlock) => {
	if (!ipBlock.enabled || !ipBlock.list.trim()) {
		return [];
	}

	const ips = ipBlock.list.split('\n').map((s) => s.trim()).filter(Boolean);
	if (ips.length === 0) {
		return [];
	}

	const lines = [];
	lines.push('# 既知の攻撃 IP をブロック');
	lines.push('<RequireAll>');
	lines.push('\tRequire all granted');
	for (const ip of ips) {
		lines.push(`\tRequire not ip ${ip}`);
	}
	lines.push('</RequireAll>');
	lines.push('');

	return lines;
};

/**
 * リライトルールセクションを生成する
 * @param {object} rewrite
 * @returns {string[]}
 */
const buildRewriteSection = (rewrite) => {
	const rules = [];

	// スラッシュ重複の正規化
	if (rewrite.normalizeSlashes) {
		rules.push('');
		rules.push('\t# スラッシュの重複（//）を正規化');
		rules.push('\tRewriteCond %{THE_REQUEST} \\s[^\\s]*//');
		rules.push('\tRewriteRule ^ %{REQUEST_URI} [R=301,L,NE]');
	}

	// 悪意のあるボットブロック
	if (rewrite.blockBadBots) {
		rules.push('');
		rules.push('\t# 悪意のあるボット・スクリプトをブロック');
		rules.push(`\tRewriteCond %{HTTP_USER_AGENT} (${BAD_BOTS.join('|')}) [NC]`);
		rules.push('\tRewriteRule .* - [F,L]');
	}

	// バックドア探索ブロック
	if (rewrite.blockBackdoors) {
		rules.push('');
		rules.push('\t# バックドア / マルウェア探索をブロック');
		rules.push(`\tRewriteCond %{REQUEST_URI} (${BACKDOOR_PATTERNS.join('|')}) [NC]`);
		rules.push('\tRewriteRule .* - [F,L]');
	}

	// wp-* ネスト防止
	if (rewrite.blockWpNesting) {
		rules.push('');
		rules.push('\t# wp-* ディレクトリの多重ネストリクエストをブロック');
		rules.push('\tRewriteCond %{REQUEST_URI} wp-(content|admin|includes)/.*wp-(content|admin|includes)/ [NC]');
		rules.push('\tRewriteRule .* - [F,L]');
	}

	// wp-includes ディレクトリブラウズブロック
	if (rewrite.blockWpIncludesDir) {
		rules.push('');
		rules.push('\t# wp-includes/ ディレクトリの直接ブラウズをブロック');
		rules.push('\tRewriteCond %{REQUEST_URI} ^/wp-includes/ [NC]');
		rules.push('\tRewriteCond %{REQUEST_FILENAME} -d');
		rules.push('\tRewriteRule .* - [F,L]');
	}

	// HTTPS リダイレクト
	if (rewrite.httpsRedirect) {
		rules.push('');
		rules.push('\t# HTTPS リダイレクト');
		rules.push('\tRewriteCond %{HTTPS} !=on [NC]');
		if (rewrite.xForwardedProto) {
			rules.push('\tRewriteCond %{HTTP:X-Forwarded-Proto} !https [NC]');
		}
		rules.push('\tRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]');
	}

	// 不正クエリ文字列ブロック
	if (rewrite.blockBadQuery) {
		rules.push('');
		rules.push('\t# 不正なクエリ文字列をブロック');
		for (const param of BAD_QUERY_PARAMS) {
			rules.push(`\tRewriteCond %{QUERY_STRING} (^|&)${param}=[^&]+(&|$) [NC]`);
			rules.push('\tRewriteRule ^ - [R=410,L]');
		}
	}

	if (rules.length === 0) {
		return [];
	}

	const lines = [];
	lines.push('<IfModule mod_rewrite.c>');
	lines.push('\tRewriteEngine On');
	lines.push(...rules);
	lines.push('');
	lines.push('</IfModule>');
	lines.push('');

	return lines;
};

/**
 * キャッシュ & パフォーマンスセクションを生成する
 * @param {object} cache
 * @returns {string[]}
 */
const buildCacheSection = (cache) => {
	const lines = [];

	// Gzip 圧縮
	if (cache.gzip) {
		lines.push('# Gzip 圧縮');
		lines.push('<IfModule mod_deflate.c>');
		lines.push('\tSetOutputFilter DEFLATE');
		lines.push('\tAddOutputFilterByType DEFLATE text/html text/plain text/xml text/css');
		lines.push('\tAddOutputFilterByType DEFLATE application/javascript application/x-javascript application/json');
		lines.push('\tAddOutputFilterByType DEFLATE application/xml application/xhtml+xml application/rss+xml');
		lines.push('\tAddOutputFilterByType DEFLATE image/svg+xml');
		lines.push('\tAddOutputFilterByType DEFLATE font/ttf font/otf font/woff font/woff2');
		lines.push('</IfModule>');
		lines.push('');
	}

	// ブラウザキャッシュ（Expires）
	if (cache.expires) {
		lines.push('# ブラウザキャッシュ設定');
		lines.push('<IfModule mod_expires.c>');
		lines.push('\tExpiresActive On');
		lines.push('\tExpiresDefault "access plus 1 month"');
		lines.push('\tExpiresByType text/css "access plus 1 year"');
		lines.push('\tExpiresByType application/javascript "access plus 1 year"');
		lines.push('\tExpiresByType application/x-javascript "access plus 1 year"');
		lines.push('\tExpiresByType text/javascript "access plus 1 year"');
		lines.push('\tExpiresByType image/jpeg "access plus 1 month"');
		lines.push('\tExpiresByType image/png "access plus 1 month"');
		lines.push('\tExpiresByType image/gif "access plus 1 month"');
		lines.push('\tExpiresByType image/webp "access plus 1 month"');
		lines.push('\tExpiresByType image/svg+xml "access plus 1 month"');
		lines.push('\tExpiresByType image/x-icon "access plus 1 year"');
		lines.push('\tExpiresByType image/vnd.microsoft.icon "access plus 1 year"');
		lines.push('\tExpiresByType video/mp4 "access plus 1 month"');
		lines.push('\tExpiresByType video/webm "access plus 1 month"');
		lines.push('\tExpiresByType video/ogg "access plus 1 month"');
		lines.push('\tExpiresByType font/woff "access plus 1 year"');
		lines.push('\tExpiresByType font/woff2 "access plus 1 year"');
		lines.push('\tExpiresByType font/ttf "access plus 1 year"');
		lines.push('\tExpiresByType font/otf "access plus 1 year"');
		lines.push('\tExpiresByType application/atom+xml "access plus 1 hour"');
		lines.push('\tExpiresByType application/rdf+xml "access plus 1 hour"');
		lines.push('\tExpiresByType application/rss+xml "access plus 1 hour"');
		lines.push('\tExpiresByType application/json "access plus 0 seconds"');
		lines.push('\tExpiresByType application/ld+json "access plus 0 seconds"');
		lines.push('\tExpiresByType application/xml "access plus 0 seconds"');
		lines.push('\tExpiresByType text/xml "access plus 0 seconds"');
		lines.push('\tExpiresByType application/manifest+json "access plus 1 week"');
		lines.push('\tExpiresByType text/html "access plus 0 seconds"');
		lines.push('</IfModule>');
		lines.push('');
	}

	// Cache-Control ヘッダー
	if (cache.cacheControl) {
		lines.push('# Cache-Control ヘッダー');
		lines.push('<IfModule mod_headers.c>');
		lines.push('\t<FilesMatch "\\.(css|js|jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|otf)$">');
		lines.push('\t\tHeader set Cache-Control "public, max-age=31536000, immutable"');
		lines.push('\t</FilesMatch>');
		lines.push('\t<FilesMatch "\\.(html|htm)$">');
		lines.push('\t\tHeader set Cache-Control "no-cache, must-revalidate"');
		lines.push('\t</FilesMatch>');
		lines.push('</IfModule>');
		lines.push('');
	}

	// MIME Type
	if (cache.mimeType) {
		lines.push('# MIME Type');
		lines.push('<IfModule mime_module>');
		lines.push('\tAddType image/x-icon .ico');
		lines.push('\tAddType image/svg+xml .svg');
		lines.push('\tAddType application/x-font-ttf .ttf');
		lines.push('\tAddType application/x-font-woff .woff');
		lines.push('\tAddType application/x-font-opentype .otf');
		lines.push('\tAddType application/vnd.ms-fontobject .eot');
		lines.push('</IfModule>');
		lines.push('');
	}

	// ETag 無効化
	if (cache.etagDisable) {
		lines.push('# ETags を無効化');
		lines.push('<IfModule mod_headers.c>');
		lines.push('\tHeader unset ETag');
		lines.push('</IfModule>');
		lines.push('FileETag None');
		lines.push('');
	}

	// Keep-Alive
	if (cache.keepAlive) {
		lines.push('# Keep-Alive を有効化');
		lines.push('<IfModule mod_headers.c>');
		lines.push('\tHeader set Connection keep-alive');
		lines.push('</IfModule>');
		lines.push('');
	}

	return lines;
};

/**
 * セキュリティレスポンスヘッダーセクションを生成する
 * @param {object} headers
 * @returns {string[]}
 */
const buildHeadersSection = (headers) => {
	const directives = [];

	// HSTS
	if (headers.hstsEnabled) {
		const hstsValue = 'max-age=63072000; includeSubDomains; preload';
		directives.push('\t# HSTS（HTTPS 接続時のみ送信）');
		directives.push(`\tHeader always set Strict-Transport-Security "${hstsValue}" "expr=%{HTTPS} == 'on' || %{HTTP:X-Forwarded-Proto} == 'https'"`);
	}

	// CSP
	if (headers.cspEnabled) {
		directives.push('');
		directives.push('\t# CSP');
		directives.push('\tHeader always set Content-Security-Policy "upgrade-insecure-requests;"');
	}

	// X-Content-Type-Options
	if (headers.xContentType) {
		directives.push('');
		directives.push('\t# X-Content-Type-Options');
		directives.push('\tHeader always set X-Content-Type-Options "nosniff"');
	}

	// X-Frame-Options
	if (headers.xFrameOptions) {
		directives.push('');
		directives.push('\t# X-Frame-Options');
		directives.push('\tHeader always set X-Frame-Options "SAMEORIGIN"');
	}

	// Referrer-Policy
	if (headers.referrerPolicy) {
		directives.push('');
		directives.push('\t# Referrer-Policy');
		directives.push('\tHeader always set Referrer-Policy "strict-origin-when-cross-origin"');
	}

	// Permissions-Policy
	if (headers.permissionsPolicy) {
		directives.push('');
		directives.push('\t# Permissions-Policy');
		directives.push('\tHeader always set Permissions-Policy "camera=(), microphone=(), payment=(), usb=(), gyroscope=(), magnetometer=(), geolocation=()"');
	}

	if (directives.length === 0) {
		return [];
	}

	const lines = [];
	lines.push('<IfModule mod_headers.c>');
	lines.push(...directives);
	lines.push('</IfModule>');
	lines.push('');

	return lines;
};

// ─── メインビルダー ─────────────────────────────────────────────────

/**
 * ルート .htaccess のディレクティブを生成する
 * @param {object} settings 全設定オブジェクト
 * @returns {string[]} 行の配列
 */
export const buildRoot = (settings) => {
	const lines = [];

	const optionsLines = buildOptionsSection(settings.options);
	const filesLines = buildFileProtectionSection(settings.fileProtection);
	const ipLines = buildIpBlockSection(settings.ipBlock);
	const rewriteLines = buildRewriteSection(settings.rewrite);
	const cacheLines = buildCacheSection(settings.cache);
	const headerLines = buildHeadersSection(settings.headers);

	// Security Settings
	if (optionsLines.length > 0 || filesLines.length > 0 || ipLines.length > 0) {
		lines.push('# ===========================');
		lines.push('# Security Settings');
		lines.push('# ===========================');
		lines.push(...optionsLines, ...filesLines, ...ipLines);
	}

	// Rewrite Rules
	if (rewriteLines.length > 0) {
		lines.push('# ===========================');
		lines.push('# Rewrite Rules');
		lines.push('# ===========================');
		lines.push(...rewriteLines);
	}

	// Cache & Performance Settings
	if (cacheLines.length > 0) {
		lines.push('# ===========================');
		lines.push('# Cache & Performance Settings');
		lines.push('# ===========================');
		lines.push(...cacheLines);
	}

	// Security Response Headers
	if (headerLines.length > 0) {
		lines.push('# ===========================');
		lines.push('# Security Response Headers');
		lines.push('# ===========================');
		lines.push(...headerLines);
	}

	return lines;
};

/**
 * 管理画面用 .htaccess ディレクティブを生成する
 * @param {object} settings 全設定オブジェクト
 * @returns {string[]} 行の配列
 */
export const buildWpAdmin = (settings) => {
	const admin = settings.wpAdmin;

	if (!admin.basicAuth || !admin.htpasswdPath) {
		return [];
	}

	const lines = [];
	lines.push(`# htpasswd -c ${admin.htpasswdPath} ${admin.basicAuthUser || 'ユーザー名'}`);
	lines.push(`AuthUserFile "${admin.htpasswdPath}"`);
	lines.push('AuthName "Member Site"');
	lines.push('AuthType BASIC');
	lines.push('require valid-user');

	// admin-ajax.php の除外
	if (admin.ajaxExclude) {
		lines.push('');
		lines.push('# admin-ajax.php へのアクセスを許可（フロントエンドの Ajax 用）');
		lines.push('<Files admin-ajax.php>');
		lines.push('\t<IfModule mod_authz_core.c>');
		lines.push('\t\t<RequireAny>');
		lines.push('\t\t\tRequire all granted');
		lines.push('\t\t</RequireAny>');
		lines.push('\t</IfModule>');
		lines.push('\t<IfModule !mod_authz_core.c>');
		lines.push('\t\tOrder allow,deny');
		lines.push('\t\tAllow from all');
		lines.push('\t\tSatisfy any');
		lines.push('\t</IfModule>');
		lines.push('</Files>');
	}

	// upgrade.php のサーバー内部 IP 除外
	if (admin.upgradeIpExclude && admin.serverIp) {
		lines.push('');
		lines.push('# upgrade.php はサーバー内部 IP のみ Basic 認証をスキップ（自動更新用）');
		lines.push('<Files upgrade.php>');
		lines.push('\t<IfModule mod_authz_core.c>');
		lines.push('\t\t<RequireAny>');
		lines.push(`\t\t\tRequire ip ${admin.serverIp}`);
		lines.push('\t\t\tRequire valid-user');
		lines.push('\t\t</RequireAny>');
		lines.push('\t</IfModule>');
		lines.push('\t<IfModule !mod_authz_core.c>');
		lines.push('\t\tOrder deny,allow');
		lines.push(`\t\tAllow from ${admin.serverIp}`);
		lines.push('\t\tSatisfy any');
		lines.push('\t</IfModule>');
		lines.push('</Files>');
	}

	return lines;
};

/**
 * Uploads ディレクトリ用 .htaccess ディレクティブを生成する
 * @param {object} settings 全設定オブジェクト
 * @returns {string[]} 行の配列
 */
export const buildUploads = (settings) => {
	if (!settings.uploads.blockPhp) {
		return [];
	}

	return [
		'# PHP 関連ファイルの実行を禁止',
		'<FilesMatch "(?i)\\.(?:php|phar|phtml)$">',
		'\t<IfModule mod_authz_core.c>',
		'\t\tRequire all denied',
		'\t</IfModule>',
		'\t<IfModule !mod_authz_core.c>',
		'\t\tOrder deny,allow',
		'\t\tDeny from all',
		'\t</IfModule>',
		'</FilesMatch>',
	];
};
