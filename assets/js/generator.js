/**
 * generator.js — .htaccess ディレクティブ生成ロジック
 *
 * 設定オブジェクトを受け取り、行の配列を返す純粋関数群。
 * DOM 操作は一切行わない。
 */

// ─── 定数 ─────────────────────────────────────────────────────────

/** 悪意のあるボット・スクリプトの UA マップ（設定キー → UA 文字列） */
const BAD_BOT_MAP = {
	bbNikto: 'nikto', bbSqlmap: 'sqlmap', bbMasscan: 'masscan', bbNmap: 'nmap', bbZgrab: 'zgrab',
	bbWget: 'wget', bbCurl: 'curl', bbHttpie: 'httpie', bbPythonRequests: 'python-requests',
	bbGoHttpClient: 'go-http-client', bbLibwwwPerl: 'libwww-perl', bbScrapy: 'scrapy', bbJava: 'java/',
	bbAhrefsbot: 'ahrefsbot', bbSemrushbot: 'semrushbot', bbDotbot: 'dotbot', bbMj12bot: 'mj12bot',
};

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

/** X-Frame-Options の許可値 */
const VALID_XFO_VALUES = ['SAMEORIGIN', 'DENY'];


/** Referrer-Policy の許可値 */
const VALID_RP_VALUES = [
	'no-referrer', 'no-referrer-when-downgrade', 'origin',
	'origin-when-cross-origin', 'same-origin', 'strict-origin',
	'strict-origin-when-cross-origin', 'unsafe-url',
];

/** ExpiresByType の許可値 */
const VALID_EXPIRES_VALUES = ['1 hour', '1 day', '1 week', '1 month', '3 months', '1 year'];

/** Cache-Control max-age の許可値（秒） */
const VALID_CC_MAX_AGE_VALUES = ['3600', '86400', '604800', '2592000', '7776000', '31536000'];
const VALID_HSTS_MAX_AGE_VALUES = ['300', '86400', '2592000', '31536000', '63072000'];

// ─── 入力バリデーション ───────────────────────────────────────────

const HTPASSWD_PATH_RE = /^\/[a-zA-Z0-9/_.\-]+$/;

const isValidHtpasswdPath = (path) => {
	if (typeof path !== 'string') return false;
	const trimmed = path.trim();
	if (trimmed.length === 0 || trimmed.length > 512) return false;
	return HTPASSWD_PATH_RE.test(trimmed);
};

const IPV4_RE = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
const IPV4_CIDR_RE = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\/(?:[0-9]|[12]\d|3[0-2])$/;

const isValidIpV4OrCidr = (value) => {
	if (typeof value !== 'string') return false;
	const trimmed = value.trim();
	return IPV4_RE.test(trimmed) || IPV4_CIDR_RE.test(trimmed);
};

const sanitizeCspValue = (v) => {
	if (typeof v !== 'string') return '';
	return v.replace(/[\x00-\x1f\x7f"\\]/g, '');
};

// ─── ヘルパー ─────────────────────────────────────────────────────

/**
 * Expires 値をホワイトリストで検証し、不正値は '1 month' にフォールバックする
 * @param {string} val
 * @returns {string}
 */
const resolveExpires = (val) => VALID_EXPIRES_VALUES.includes(val) ? val : '1 month';

/**
 * Cache-Control max-age 値をホワイトリストで検証し、不正値は '31536000' にフォールバックする
 * @param {string} val
 * @returns {string}
 */
const resolveCcMaxAge = (val) => VALID_CC_MAX_AGE_VALUES.includes(String(val)) ? String(val) : '31536000';

/**
 * アクセス拒否ディレクティブ行を生成する
 * @param {string} indent インデント文字列
 * @param {string} apacheVersion 'both' | '2.4'
 * @returns {string[]} 行の配列
 */
const buildDenyDirectives = (indent, apacheVersion) => {
	const nestedIndent = `${indent}\t`;
	if (apacheVersion === '2.4') {
		return [`${indent}Require all denied`];
	}
	return [
		`${indent}<IfModule mod_authz_core.c>`,
		`${nestedIndent}Require all denied`,
		`${indent}</IfModule>`,
		`${indent}<IfModule !mod_authz_core.c>`,
		`${nestedIndent}Order deny,allow`,
		`${nestedIndent}Deny from all`,
		`${indent}</IfModule>`,
	];
};

/**
 * ファイルアクセス拒否ブロックを生成する
 * @param {string} filename ファイル名
 * @param {string} apacheVersion 'both' | '2.4'
 * @returns {string[]} 行の配列
 */
const buildDenyFilesBlock = (filename, apacheVersion) => [
	`<Files ${filename}>`,
	...buildDenyDirectives('\t', apacheVersion),
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
 * @param {string} apacheVersion 'both' | '2.4'
 * @param {Function} t 翻訳関数
 * @returns {string[]}
 */
const buildFileProtectionSection = (fileProtection, apacheVersion, t) => {
	const lines = [];

	// xmlrpc.php ブロック
	if (fileProtection.blockXmlrpc) {
		lines.push(t('gen.comment.blockXmlrpc'));
		lines.push(...buildDenyFilesBlock('xmlrpc.php', apacheVersion));
		lines.push('');
	}

	// wp-config.php 保護
	if (fileProtection.protectWpConfig) {
		lines.push(t('gen.comment.protectWpConfig'));
		lines.push(...buildDenyFilesBlock('wp-config.php', apacheVersion));
		lines.push('');
	}

	// .htaccess 保護
	if (fileProtection.protectHtaccess) {
		lines.push(t('gen.comment.protectHtaccess'));
		lines.push(...buildDenyFilesBlock('.htaccess', apacheVersion));
		lines.push('');
	}

	// 危険な拡張子ブロック
	if (fileProtection.blockDangerousExt) {
		const rawExts = [...new Set(
			(fileProtection.blockDangerousExtList ?? '.inc\n.log\n.sh\n.sql')
				.split('\n')
				.map((e) => e.trim().replace(/^\.+/, '').toLowerCase())
				.filter((e) => /^[a-z0-9_-]+$/.test(e))
		)];
		const extPattern = rawExts.length > 0
			? rawExts.join('|')
			: 'inc|log|sh|sql';
		lines.push(t('gen.comment.blockDangerousExt'));
		lines.push(`<FilesMatch "(?i)\\.(${extPattern})$">`);
		lines.push(...buildDenyDirectives('\t', apacheVersion));
		lines.push('</FilesMatch>');
		lines.push('');
	}

	// wp-login.php Basic 認証
	if (fileProtection.wpLoginBasicAuth && isValidHtpasswdPath(fileProtection.htpasswdPath)) {
		lines.push(t('gen.comment.wpLoginBasicAuth'));
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
 * @param {Function} t 翻訳関数
 * @returns {string[]}
 */
const buildIpBlockSection = (ipBlock, t) => {
	if (!ipBlock.enabled || !ipBlock.list.trim()) {
		return [];
	}

	const ips = ipBlock.list.split('\n').map((s) => s.trim()).filter((s) => isValidIpV4OrCidr(s));
	if (ips.length === 0) {
		return [];
	}

	const lines = [];
	lines.push(t('gen.comment.ipBlock'));
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
 * @param {Function} t 翻訳関数
 * @returns {string[]}
 */
const buildRewriteSection = (rewrite, t) => {
	const rules = [];

	// スラッシュ重複の正規化
	if (rewrite.normalizeSlashes) {
		rules.push('');
		rules.push(t('gen.comment.normalizeSlashes'));
		rules.push('	RewriteCond %{THE_REQUEST} \\s[^\\s?]*//');
		rules.push('\tRewriteRule ^ %{REQUEST_URI} [R=301,L,NE]');
	}

	// 悪意のあるボットブロック
	if (rewrite.blockBadBots) {
		const activeBots = Object.entries(BAD_BOT_MAP)
			.filter(([key]) => rewrite[key])
			.map(([, ua]) => ua);
		if (activeBots.length > 0) {
			rules.push('');
			rules.push(t('gen.comment.blockBadBots'));
			rules.push(`\tRewriteCond %{HTTP_USER_AGENT} (${activeBots.join('|')}) [NC]`);
			rules.push('\tRewriteRule .* - [F,L]');
		}
	}

	// バックドア探索ブロック
	if (rewrite.blockBackdoors) {
		rules.push('');
		rules.push(t('gen.comment.blockBackdoors'));
		rules.push(`\tRewriteCond %{REQUEST_URI} (${BACKDOOR_PATTERNS.join('|')}) [NC]`);
		rules.push('\tRewriteRule .* - [F,L]');
	}

	// wp-* ネスト防止
	if (rewrite.blockWpNesting) {
		rules.push('');
		rules.push(t('gen.comment.blockWpNesting'));
		rules.push('\tRewriteCond %{REQUEST_URI} wp-(content|admin|includes)/.*wp-(content|admin|includes)/ [NC]');
		rules.push('\tRewriteRule .* - [F,L]');
	}

	// wp-admin/includes・wp-includes PHP 直接アクセスブロック
	if (rewrite.blockWpIncludesDir) {
		rules.push('');
		rules.push(t('gen.comment.blockWpAdminIncludes'));
		rules.push('	RewriteCond %{REQUEST_URI} ^/wp-admin/includes(?:/|$) [NC]');
		rules.push('\tRewriteRule .* - [F,L]');
		rules.push('');
		rules.push(t('gen.comment.blockWpIncludes'));
		rules.push('\tRewriteCond %{REQUEST_URI} ^/wp-includes/[^/]+\\.php$ [NC]');
		rules.push('\tRewriteRule .* - [F,L]');
	}

	// HTTPS リダイレクト
	if (rewrite.httpsRedirect) {
		rules.push('');
		rules.push(t('gen.comment.httpsRedirect'));
		rules.push('\tRewriteCond %{HTTPS} !=on [NC]');
		if (rewrite.xForwardedProto) {
			rules.push('\tRewriteCond %{HTTP:X-Forwarded-Proto} !https [NC]');
		}
		rules.push('\tRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]');
	}

	// 不正クエリ文字列ブロック
	if (rewrite.blockBadQuery) {
		const rawParamsParsed = (rewrite.badQueryParams ?? BAD_QUERY_PARAMS.join('\n'))
			.split('\n')
			.map((p) => p.trim().toLowerCase())
			.filter((p, i, arr) => /^[a-z0-9_-]+$/.test(p) && arr.indexOf(p) === i);
		const rawParams = rawParamsParsed.length > 0 ? rawParamsParsed : BAD_QUERY_PARAMS;
		if (rawParams.length > 0) {
			rules.push('');
			rules.push(t('gen.comment.blockBadQuery'));
			for (const param of rawParams) {
				rules.push(`\tRewriteCond %{QUERY_STRING} (^|&)${param}=[^&]+(&|$) [NC]`);
				rules.push('\tRewriteRule ^ - [R=410,L]');
			}
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
 * @param {Function} t 翻訳関数
 * @returns {string[]}
 */
const buildCacheSection = (cache, t) => {
	const lines = [];

	// Gzip 圧縮
	if (cache.gzip) {
		lines.push(t('gen.comment.gzip'));
		lines.push('<IfModule mod_deflate.c>');
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
		const script = resolveExpires(cache.expiresScript);
		const image = resolveExpires(cache.expiresImage);
		const icon = resolveExpires(cache.expiresIcon);
		const video = resolveExpires(cache.expiresVideo);
		const font = resolveExpires(cache.expiresFont);
		const feed = resolveExpires(cache.expiresFeed);
		const def = resolveExpires(cache.expiresDefault);
		lines.push(t('gen.comment.expires'));
		lines.push('<IfModule mod_expires.c>');
		lines.push('\tExpiresActive On');
		lines.push(`\tExpiresDefault "access plus ${def}"`);
		lines.push(`\tExpiresByType text/css "access plus ${script}"`);
		lines.push(`\tExpiresByType application/javascript "access plus ${script}"`);
		lines.push(`\tExpiresByType application/x-javascript "access plus ${script}"`);
		lines.push(`\tExpiresByType text/javascript "access plus ${script}"`);
		lines.push(`\tExpiresByType image/jpeg "access plus ${image}"`);
		lines.push(`\tExpiresByType image/png "access plus ${image}"`);
		lines.push(`\tExpiresByType image/gif "access plus ${image}"`);
		lines.push(`\tExpiresByType image/webp "access plus ${image}"`);
		lines.push(`\tExpiresByType image/svg+xml "access plus ${image}"`);
		lines.push(`\tExpiresByType image/x-icon "access plus ${icon}"`);
		lines.push(`\tExpiresByType image/vnd.microsoft.icon "access plus ${icon}"`);
		lines.push(`\tExpiresByType video/mp4 "access plus ${video}"`);
		lines.push(`\tExpiresByType video/webm "access plus ${video}"`);
		lines.push(`\tExpiresByType video/ogg "access plus ${video}"`);
		lines.push(`\tExpiresByType font/woff "access plus ${font}"`);
		lines.push(`\tExpiresByType font/woff2 "access plus ${font}"`);
		lines.push(`\tExpiresByType font/ttf "access plus ${font}"`);
		lines.push(`\tExpiresByType font/otf "access plus ${font}"`);
		lines.push(`\tExpiresByType application/atom+xml "access plus ${feed}"`);
		lines.push(`\tExpiresByType application/rdf+xml "access plus ${feed}"`);
		lines.push(`\tExpiresByType application/rss+xml "access plus ${feed}"`);
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
		const ccScript = resolveCcMaxAge(cache.ccScript);
		const ccImage = resolveCcMaxAge(cache.ccImage);
		const ccFont = resolveCcMaxAge(cache.ccFont);
		const ccVideo = resolveCcMaxAge(cache.ccVideo);

		lines.push(t('gen.comment.cacheControl'));
		lines.push('<IfModule mod_headers.c>');
		lines.push('\t<FilesMatch "\\.(css|js)$">');
		lines.push(`\t\tHeader always set Cache-Control "public, max-age=${ccScript}, immutable"`);
		lines.push('\t</FilesMatch>');
		lines.push('\t<FilesMatch "\\.(jpg|jpeg|png|gif|webp|svg|ico)$">');
		lines.push(`\t\tHeader always set Cache-Control "public, max-age=${ccImage}"`);
		lines.push('\t</FilesMatch>');
		lines.push('\t<FilesMatch "\\.(woff|woff2|ttf|otf)$">');
		lines.push(`\t\tHeader always set Cache-Control "public, max-age=${ccFont}, immutable"`);
		lines.push('\t</FilesMatch>');
		lines.push('\t<FilesMatch "\\.(mp4|webm|ogv)$">');
		lines.push(`\t\tHeader always set Cache-Control "public, max-age=${ccVideo}"`);
		lines.push('\t</FilesMatch>');
		lines.push('\t<FilesMatch "\\.(html|htm)$">');
		lines.push('\t\tHeader always set Cache-Control "no-cache, must-revalidate"');
		lines.push('\t</FilesMatch>');
		lines.push('</IfModule>');
		lines.push('');
	}

	// MIME Type
	if (cache.mimeType) {
		lines.push(t('gen.comment.mimeType'));
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
		lines.push(t('gen.comment.etagDisable'));
		lines.push('<IfModule mod_headers.c>');
		lines.push('\tHeader unset ETag');
		lines.push('</IfModule>');
		lines.push('FileETag None');
		lines.push('');
	}


	return lines;
};

/**
 * セキュリティレスポンスヘッダーセクションを生成する
 * @param {object} headers
 * @param {Function} t 翻訳関数
 * @returns {string[]}
 */
const buildHeadersSection = (headers, t) => {
	const directives = [];

	// HSTS
	if (headers.hstsEnabled) {
		const hstsMaxAge = VALID_HSTS_MAX_AGE_VALUES.includes(String(headers.hstsMaxAge))
			? String(headers.hstsMaxAge)
			: '63072000';
		const hstsParts = [`max-age=${hstsMaxAge}`];
		if (headers.hstsIncludeSubDomains) {
			hstsParts.push('includeSubDomains');
		}
		if (headers.hstsPreload && headers.hstsIncludeSubDomains) {
			hstsParts.push('preload');
		}
		const hstsValue = hstsParts.join('; ');
		directives.push(t('gen.comment.hsts'));
		directives.push(`\tHeader always set Strict-Transport-Security "${hstsValue}" "expr=%{HTTPS} == 'on' || %{HTTP:X-Forwarded-Proto} == 'https'"`);
	}

	// CSP
	if (headers.cspEnabled) {
		// Report-Only モードでは upgrade-insecure-requests は無視されるため除外する
		const cspParts = headers.cspReportOnly ? [] : ['upgrade-insecure-requests'];

		const sanitize = sanitizeCspValue;

		const buildSrc = (enabled, value, extras = []) => {
			if (!enabled) return null;
			const base = sanitize(value).trim() || null;
			const parts = base ? [base] : [];
			parts.push(...extras.filter(Boolean));
			return parts.length > 0 ? parts.join(' ') : null;
		};

		const defaultSrc = buildSrc(headers.cspDefaultSrcEnabled, headers.cspDefaultSrcValue || "'self' https:");
		if (defaultSrc) cspParts.push(`default-src ${defaultSrc}`);

		const scriptSrc = buildSrc(headers.cspScriptSrcEnabled, headers.cspScriptSrcValue || "'self'");
		if (scriptSrc) cspParts.push(`script-src ${scriptSrc}`);

		const styleSrc = buildSrc(headers.cspStyleSrcEnabled, headers.cspStyleSrcValue || "'self' 'unsafe-inline'");
		if (styleSrc) cspParts.push(`style-src ${styleSrc}`);

		const imgSrc = buildSrc(headers.cspImgSrcEnabled, headers.cspImgSrcValue || "'self' data: https:");
		if (imgSrc) cspParts.push(`img-src ${imgSrc}`);

		const fontSrc = buildSrc(headers.cspFontSrcEnabled, headers.cspFontSrcValue || "'self'");
		if (fontSrc) cspParts.push(`font-src ${fontSrc}`);

		const connectSrc = buildSrc(headers.cspConnectSrcEnabled, headers.cspConnectSrcValue || "'self' https:");
		if (connectSrc) cspParts.push(`connect-src ${connectSrc}`);

		const frameSrcExtras = [
			headers.cspFrameSrcYoutube ? 'https://www.youtube.com' : null,
			headers.cspFrameSrcGoogleMaps ? 'https://www.google.com' : null,
		];
		const hasFrameExtras = frameSrcExtras.some(Boolean);
		const frameSrcBase = headers.cspFrameSrcValue || "'none'";
		const frameSrc = buildSrc(headers.cspFrameSrcEnabled, (frameSrcBase === "'none'" && hasFrameExtras) ? "'self'" : frameSrcBase, frameSrcExtras);
		if (frameSrc) cspParts.push(`frame-src ${frameSrc}`);

		const frameAncestors = buildSrc(headers.cspFrameAncestorsEnabled, headers.cspFrameAncestorsValue || "'self'");
		if (frameAncestors) cspParts.push(`frame-ancestors ${frameAncestors}`);

		const cspValue = cspParts.join('; ');

		// cspValue が空（Report-Only + 全ディレクティブ無効）の場合は # CSP コメントごとブロック全体を出力しない
		if (cspValue) {
			directives.push('');
			directives.push(t('gen.comment.csp'));

			const cspHeaderName = headers.cspReportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';

			// 管理画面 CSP: フロント CSP と同じディレクティブ構成をベースに、
			// script-src には 'unsafe-inline' / 'unsafe-eval' を、style-src には 'unsafe-inline' のみを追加して生成する。
			// script-src / style-src が未選択でも default-src が有効な場合は、
			// default-src の値を継承して明示的に上書きし、wp-admin が正常動作するようにする。
			const adminCspParts = headers.cspReportOnly ? [] : ['upgrade-insecure-requests'];
			if (defaultSrc) adminCspParts.push(`default-src ${defaultSrc}`);

			// 'none' は他のソースと併用不可のため、unsafe-* を付与するベース値として使用できない。
			// 'none' が指定されている場合は 'self' に置き換えて unsafe-* を付与する。
			const resolveAdminBase = (base) => (sanitize(base).trim() === "'none'" ? "'self'" : base);

			const adminScriptBase = headers.cspScriptSrcEnabled
				? (headers.cspScriptSrcValue || "'self'")
				: (headers.cspDefaultSrcEnabled ? (headers.cspDefaultSrcValue || "'self' https:") : null);
			if (adminScriptBase !== null) {
				const adminScriptSrc = buildSrc(true, resolveAdminBase(adminScriptBase), ["'unsafe-inline'", "'unsafe-eval'"]);
				if (adminScriptSrc) adminCspParts.push(`script-src ${adminScriptSrc}`);
			}

			const adminStyleBase = headers.cspStyleSrcEnabled
				? (headers.cspStyleSrcValue || "'self' 'unsafe-inline'")
				: (headers.cspDefaultSrcEnabled ? (headers.cspDefaultSrcValue || "'self' https:") : null);
			if (adminStyleBase !== null) {
				const adminStyleSrc = buildSrc(true, resolveAdminBase(adminStyleBase), ["'unsafe-inline'"]);
				if (adminStyleSrc) adminCspParts.push(`style-src ${adminStyleSrc}`);
			}

			if (imgSrc) adminCspParts.push(`img-src ${imgSrc}`);
			if (fontSrc) adminCspParts.push(`font-src ${fontSrc}`);
			if (connectSrc) adminCspParts.push(`connect-src ${connectSrc}`);
			if (frameSrc) adminCspParts.push(`frame-src ${frameSrc}`);
			if (frameAncestors) adminCspParts.push(`frame-ancestors ${frameAncestors}`);

			const adminCspValue = adminCspParts.join('; ');

			directives.push(`\t<If "%{REQUEST_URI} !~ m#(?:^|/)wp-(admin(?:/|$)|login\\.php)#">`);
			directives.push(`\t\tHeader always set ${cspHeaderName} "${cspValue}"`);
			directives.push('\t</If>');
			directives.push(`\t<If "%{REQUEST_URI} =~ m#(?:^|/)wp-(admin(?:/|$)|login\\.php)#">`);
			directives.push(`\t\tHeader always set ${cspHeaderName} "${adminCspValue}"`);
			directives.push('\t</If>');
		}
	}

	// X-Content-Type-Options
	if (headers.xContentType) {
		directives.push('');
		directives.push(t('gen.comment.xContentType'));
		directives.push('\tHeader always set X-Content-Type-Options "nosniff"');
	}

	// X-Frame-Options
	if (headers.xFrameOptions) {
		const xfoValue = VALID_XFO_VALUES.includes(headers.xFrameOptionsValue)
			? headers.xFrameOptionsValue
			: 'SAMEORIGIN';
		const xfoComment = (headers.cspEnabled && headers.cspFrameAncestorsEnabled)
			? t('gen.comment.xFrameOptionsWithCsp')
			: t('gen.comment.xFrameOptions');
		directives.push('');
		directives.push(xfoComment);
		directives.push(`\tHeader always set X-Frame-Options "${xfoValue}"`);
	}

	// Referrer-Policy
	if (headers.referrerPolicy) {
		const rpValue = VALID_RP_VALUES.includes(headers.referrerPolicyValue)
			? headers.referrerPolicyValue
			: 'strict-origin-when-cross-origin';
		directives.push('');
		directives.push(t('gen.comment.referrerPolicy'));
		directives.push(`\tHeader always set Referrer-Policy "${rpValue}"`);
	}

	// Permissions-Policy
	if (headers.permissionsPolicy) {
		const ppFeatures = [];
		if (headers.ppCamera) ppFeatures.push('camera=()');
		if (headers.ppMicrophone) ppFeatures.push('microphone=()');
		if (headers.ppPayment) ppFeatures.push('payment=()');
		if (headers.ppUsb) ppFeatures.push('usb=()');
		if (headers.ppGyroscope) ppFeatures.push('gyroscope=()');
		if (headers.ppMagnetometer) ppFeatures.push('magnetometer=()');
		if (headers.ppAccelerometer) ppFeatures.push('accelerometer=()');
		if (headers.ppFullscreen) ppFeatures.push('fullscreen=()');
		if (headers.ppAutoplay) ppFeatures.push('autoplay=()');
		if (headers.ppClipboardRead) ppFeatures.push('clipboard-read=()');
		if (headers.ppClipboardWrite) ppFeatures.push('clipboard-write=()');
		if (headers.ppPictureInPicture) ppFeatures.push('picture-in-picture=()');
		if (headers.ppScreenWakeLock) ppFeatures.push('screen-wake-lock=()');
		if (headers.ppWebShare) ppFeatures.push('web-share=()');
		if (headers.ppGeolocation === 'deny') {
			ppFeatures.push('geolocation=()');
		} else if (headers.ppGeolocation === 'google-maps') {
			// ダブルクォートを \" にエスケープして Apache 構文の衝突を回避する
			ppFeatures.push('geolocation=(self \\"https://www.google.com\\")');
		}

		if (ppFeatures.length > 0) {
			directives.push('');
			directives.push(t('gen.comment.permissionsPolicy'));
			directives.push(`\tHeader always set Permissions-Policy "${ppFeatures.join(', ')}"`);
		}
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
 * @param {Function} t 翻訳関数
 * @returns {string[]} 行の配列
 */
export const buildRoot = (settings, t = (key) => key) => {
	const lines = [];

	lines.push('# BEGIN HtaccessGenerator');
	lines.push('# Generated by .htaccess Generator - https://htaccess-generator-b46.pages.dev/');
	lines.push('');

	const apacheVersion = settings.apacheVersion ?? 'both';
	const optionsLines = buildOptionsSection(settings.options);
	const filesLines = buildFileProtectionSection(settings.fileProtection, apacheVersion, t);
	const ipLines = buildIpBlockSection(settings.ipBlock, t);
	const rewriteLines = buildRewriteSection(settings.rewrite, t);
	const cacheLines = buildCacheSection(settings.cache, t);
	const headerLines = buildHeadersSection(settings.headers, t);

	// Security Settings
	if (optionsLines.length > 0 || filesLines.length > 0 || ipLines.length > 0) {
		lines.push('# ===========================');
		lines.push(t('gen.section.security'));
		lines.push('# ===========================');
		lines.push(...optionsLines, ...filesLines, ...ipLines);
	}

	// Rewrite Rules
	if (rewriteLines.length > 0) {
		lines.push('# ===========================');
		lines.push(t('gen.section.rewrite'));
		lines.push('# ===========================');
		lines.push(...rewriteLines);
	}

	// Cache & Performance Settings
	if (cacheLines.length > 0) {
		lines.push('# ===========================');
		lines.push(t('gen.section.cache'));
		lines.push('# ===========================');
		lines.push(...cacheLines);
	}

	// Security Response Headers
	if (headerLines.length > 0) {
		lines.push('# ===========================');
		lines.push(t('gen.section.headers'));
		lines.push('# ===========================');
		lines.push(...headerLines);
	}

	lines.push('');
	lines.push('# END HtaccessGenerator');

	return lines;
};

/**
 * 管理画面用 .htaccess ディレクティブを生成する
 * @param {object} settings 全設定オブジェクト
 * @param {Function} t 翻訳関数
 * @returns {string[]} 行の配列
 */
export const buildWpAdmin = (settings, t = (key) => key) => {
	const admin = settings.wpAdmin;
	const apacheVersion = settings.apacheVersion ?? 'both';

	if (!admin.basicAuth || !isValidHtpasswdPath(admin.htpasswdPath)) {
		return [];
	}

	const lines = [];
	lines.push(t('gen.comment.wpAdminBasicAuth'));
	lines.push(`AuthUserFile "${admin.htpasswdPath}"`);
	lines.push('AuthName "Member Site"');
	lines.push('AuthType BASIC');
	lines.push('require valid-user');

	// admin-ajax.php の除外
	if (admin.ajaxExclude) {
		lines.push('');
		lines.push(t('gen.comment.ajaxExclude'));
		lines.push('<Files admin-ajax.php>');
		if (apacheVersion === '2.4') {
			lines.push('\tRequire all granted');
		} else {
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
		}
		lines.push('</Files>');
	}

	// upgrade.php のサーバー内部 IP 除外
	if (admin.upgradeIpExclude && isValidIpV4OrCidr(admin.serverIp)) {
		lines.push('');
		lines.push(t('gen.comment.upgradeIpExclude'));
		lines.push('<Files upgrade.php>');
		if (apacheVersion === '2.4') {
			lines.push('\t<RequireAny>');
			lines.push(`\t\tRequire ip ${admin.serverIp}`);
			lines.push('\t\tRequire valid-user');
			lines.push('\t</RequireAny>');
		} else {
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
		}
		lines.push('</Files>');
	}

	return lines;
};

/**
 * Uploads ディレクトリ用 .htaccess ディレクティブを生成する
 * @param {object} settings 全設定オブジェクト
 * @param {Function} t 翻訳関数
 * @returns {string[]} 行の配列
 */
export const buildUploads = (settings, t = (key) => key) => {
	if (!settings.uploads.blockPhp) {
		return [];
	}

	const apacheVersion = settings.apacheVersion ?? 'both';

	return [
		t('gen.comment.blockPhp'),
		'<FilesMatch "(?i)\\.(?:php|phar|phtml)$">',
		...buildDenyDirectives('\t', apacheVersion),
		'</FilesMatch>',
	];
};

export { isValidHtpasswdPath, isValidIpV4OrCidr };
