/**
 * locales/en.js — English text definitions
 */
export default {
	// Navigation
	'skip.link': 'Skip to main content',
	'nav.open': 'Open menu',
	'nav.close': 'Close menu',
	'nav.aria': 'Site navigation',
	'nav.terms': 'Terms of Use',

	// Header
	'header.sub': 'for WordPress',
	'header.desc': 'Easily generate .htaccess security &amp; performance settings for WordPress<br><small>For Apache 2.4+ / WordPress</small>',
	'lang.btn.text': 'JA',
	'lang.btn.label': 'Switch language (日本語に切り替え)',

	// Section titles
	'section.preset': 'Presets',
	'section.apache': 'Target Apache Version',
	'section.options': 'Options & ErrorDocument',
	'section.options.aria': 'Options and ErrorDocument',
	'section.fileProtection': 'File Access Restrictions',
	'section.ipBlock': 'IP Address Block',
	'section.ipBlock.aria': 'IP Block',
	'section.rewrite': 'Rewrite Rules',
	'section.secHeaders': 'Security Response Headers',
	'section.secHeaders.aria': 'Security Headers',
	'section.cache': 'Cache & Performance',
	'section.cache.aria': 'Cache and Performance',
	'section.wpAdmin': 'wp-admin Basic Auth',
	'section.uploads': 'wp-content/uploads Protection',
	'section.preview': 'Preview',
	'section.preview.aria': '.htaccess Preview',

	// Apache version
	'apache.legend': 'Target Apache Version',
	'apache.v24': 'Output access control directives in Apache 2.4 format',
	'apache.both': 'Output access control directives in Apache 2.2 / 2.4 compatible format',
	'apache.hint': '⚠️ This switch only affects the format of access control directives. The entire generated .htaccess will not be Apache 2.2 compatible. On Apache 2.2, other Apache 2.4-specific directives may cause 500 errors.',

	// Options & ErrorDocument
	'toggle.disableMultiviews': 'Disable directory listing & content negotiation',
	'toggle.disableIndexes': 'Disable directory indexes',
	'options.hint': '⚠️ Some shared hosting providers prohibit changing Options directives. Enabling the Options settings above may cause 500 errors. In that case, disable the Options settings.',
	'toggle.errorDocument': 'Lightweight ErrorDocument (403 / 404)',

	// File Access Restrictions
	'toggle.blockXmlrpc': 'Block xmlrpc.php',
	'toggle.protectWpConfig': 'Protect wp-config.php',
	'toggle.protectHtaccess': 'Protect .htaccess',
	'toggle.blockDangerousExt': 'Block dangerous extensions',
	'input.blockDangerousExtList': 'Extensions to block (one per line)',
	'toggle.wpLoginBasicAuth': 'Basic Auth for wp-login.php',
	'input.htpasswdPath': 'Full path to .htpasswd',
	'hint.htpasswdPath': 'Enter the full path to .htpasswd to apply',

	// IP Block
	'toggle.ipBlock': 'Block by IP address',
	'input.ipBlockList': 'IPs to block (one per line)',
	'hint.ipBlock': 'Enter IP addresses to block',

	// Rewrite Rules
	'toggle.normalizeSlashes': 'Normalize duplicate slashes',
	'toggle.blockBadBots': 'Block malicious bots',
	'hint.badBots': 'Checked = block / Unchecked = allow',
	'group.attackTools': 'Attack tools',
	'group.genericClients': 'Generic clients',
	'group.seoBot': 'SEO crawlers',
	'toggle.blockBackdoors': 'Block backdoor / malware probes',
	'toggle.blockWpNesting': 'Prevent wp-* nested directory requests',
	'toggle.blockWpIncludesDir': 'Prevent direct access to wp-includes / wp-admin/includes',
	'toggle.httpsRedirect': 'HTTPS redirect',
	'toggle.xForwardedProto': 'X-Forwarded-Proto check (reverse proxy support)',
	'toggle.blockBadQuery': 'Block malicious query strings',
	'input.badQueryParams': 'Parameter names to block (one per line)',

	// Security Headers — HSTS
	'toggle.hstsEnabled': 'HSTS (Strict-Transport-Security)',
	'hsts.maxAgeLabel': 'max-age',
	'hsts.300': '300 (5 min · for testing)',
	'hsts.86400': '86400 (1 day)',
	'hsts.2592000': '2592000 (30 days)',
	'hsts.31536000': '31536000 (1 year)',
	'hsts.63072000': '63072000 (2 years)',
	'hint.hstsTest': 'Start with a short value (300 seconds) and verify there are no issues before increasing. Once cached by the browser, you cannot revert to HTTP.',
	'hint.hstsSubDomains': 'Make sure all subdomains support HTTPS before enabling. If any subdomain does not support HTTPS, browsers will refuse to connect.',
	'hint.hstsPreloadWarn': 'preload requires includeSubDomains and max-age of at least 1 year (31536000)',
	'hint.hstsPreload': 'This flag signals intent to be added to browser preload lists. Even with preload enabled, it will not appear in output if includeSubDomains is OFF. If using preload, enable includeSubDomains and set max-age to at least 1 year (31536000). Once registered, removal can take months — do not enable unless your HTTPS setup is complete.',

	// Security Headers — CSP
	'toggle.cspEnabled': 'CSP (Content-Security-Policy)',
	'hint.csp': 'Before applying CSP to production, check for violations in the browser DevTools (F12) → Console tab and adjust to match your site.',
	'toggle.cspReportOnly': 'Report-Only mode (for testing)',
	'hint.cspReportOnly': 'Outputs <code>Content-Security-Policy-Report-Only</code>. <code>upgrade-insecure-requests</code> is excluded. It is always included in non-Report-Only mode.',

	// Security Headers — X-Frame-Options
	'toggle.xContentType': 'X-Content-Type-Options: nosniff',
	'toggle.xFrameOptions': 'X-Frame-Options',
	'legend.xFrameOptions': 'X-Frame-Options value',
	'xfo.sameorigin': 'SAMEORIGIN (allow same domain only)',
	'xfo.deny': 'DENY (block all)',

	// Security Headers — Referrer-Policy
	'toggle.referrerPolicy': 'Referrer-Policy',
	'legend.referrerPolicy': 'Referrer-Policy value',
	'rp.recommended': 'strict-origin-when-cross-origin (recommended)',
	'rp.unsafe': 'unsafe-url (not recommended)',

	// Security Headers — Permissions-Policy
	'toggle.permissionsPolicy': 'Permissions-Policy',
	'hint.pp': 'Checked = restrict / Unchecked = exclude from policy (allow)',
	'pp.geolocation': 'geolocation',
	'pp.geolocation.deny': 'Disable completely',
	'pp.geolocation.googleMaps': 'Allow Google Maps',
	'pp.geolocation.off': 'Exclude from policy',

	// Cache & Performance
	'toggle.gzip': 'Gzip compression',
	'toggle.expires': 'Browser cache (Expires)',
	'cache.cssjs': 'CSS / JS',
	'legend.expiresScript': 'CSS / JS cache expiration',
	'time.1h': '1 hour',
	'time.1d': '1 day',
	'time.1w': '1 week',
	'time.1m': '1 month',
	'time.3m': '3 months',
	'time.1y': '1 year',
	'cache.image': 'Images',
	'legend.expiresImage': 'Image cache expiration',
	'cache.icon': 'Icons',
	'legend.expiresIcon': 'Icon cache expiration',
	'cache.video': 'Videos',
	'legend.expiresVideo': 'Video cache expiration',
	'cache.font': 'Fonts',
	'legend.expiresFont': 'Font cache expiration',
	'cache.feed': 'Feeds',
	'legend.expiresFeed': 'Feed cache expiration',
	'cache.other': 'Other (default)',
	'legend.expiresDefault': 'Other (default) cache expiration',
	'toggle.cacheControl': 'Cache-Control headers',
	'legend.ccScript': 'CSS / JS Cache-Control max-age',
	'cache.imageIcon': 'Images / Icons',
	'legend.ccImage': 'Images / Icons Cache-Control max-age',
	'legend.ccFont': 'Font Cache-Control max-age',
	'legend.ccVideo': 'Video Cache-Control max-age',
	'toggle.etagDisable': 'Disable ETag',
	'toggle.mimeType': 'Add MIME types',

	// wp-admin Basic Auth
	'toggle.wpAdminBasicAuth': 'Basic Auth for admin panel',
	'input.adminHtpasswdPath': 'Full path to .htpasswd',
	'hint.adminHtpasswdPath': 'Enter the full path to .htpasswd to apply',
	'toggle.ajaxExclude': 'Exclude admin-ajax.php',
	'toggle.upgradeIpExclude': 'Exclude upgrade.php for server internal IP',
	'input.serverIp': 'Server internal IP',

	// Uploads
	'toggle.blockPhp': 'Disable PHP execution',

	// Preview
	'tab.root': 'Root .htaccess',
	'tab.list.aria': 'Switch generated file',
	'preview.placeholder': '# Select options to generate',
	'preview.placeholder.wpAdmin': '# Enter the full path to .htpasswd',
	'btn.copy': 'Copy',
	'btn.copied': 'Copied!',
	'btn.copyFail': 'Copy failed',
	'btn.copy.aria': 'Copy current content to clipboard',
	'btn.download': 'Download',
	'btn.download.aria': 'Download current content as .htaccess file',

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

	// Preset group
	'preset.group.aria': 'Select preset',

	// Theme toggle
	'theme.dark': 'Switch to dark mode',
	'theme.light': 'Switch to light mode',
	'theme.dark.label': 'Dark',
	'theme.light.label': 'Light',

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
	'gen.comment.blockPhp': '# Disable PHP file execution',

	// Guide pages
	'guide.lang.btn.text': 'JA',
	'guide.lang.btn.label': 'Switch language (日本語に切り替え)',
	'guide.htaccess-basics.subtitle': 'What is .htaccess? A Beginner\'s Guide',
};
