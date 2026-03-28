/**
 * main.js — エントリーポイント
 *
 * DOM 参照・イベント登録・テーマ切り替え・プリセット適用・
 * プレビュー更新・コピー・ダウンロード処理を担う。
 */

import { buildRoot, buildWpAdmin, buildUploads } from './generator.js';
import { PRESETS, DEFAULT_SETTINGS } from './presets.js';
import { initTheme, setupThemeToggle } from './theme.js';

// ─── DOM 参照 ─────────────────────────────────────────────────────

// Options
const elDisableMultiviews = document.querySelector('[name="disableMultiviews"]');
const elDisableIndexes = document.querySelector('[name="disableIndexes"]');
const elErrorDocument = document.querySelector('[name="errorDocument"]');

// File Protection
const elBlockXmlrpc = document.querySelector('[name="blockXmlrpc"]');
const elProtectWpConfig = document.querySelector('[name="protectWpConfig"]');
const elProtectHtaccess = document.querySelector('[name="protectHtaccess"]');
const elBlockDangerousExt = document.querySelector('[name="blockDangerousExt"]');
const elWpLoginBasicAuth = document.querySelector('[name="wpLoginBasicAuth"]');
const elLoginHtpasswdPath = document.querySelector('[name="loginHtpasswdPath"]');
const elLoginBasicAuthUser = document.querySelector('[name="loginBasicAuthUser"]');
const elLoginAuthFields = document.querySelector('.login-auth-fields');
const elLoginHtpasswdHint = document.querySelector('#login-htpasswd-hint');

// IP Block
const elIpBlockEnabled = document.querySelector('[name="ipBlockEnabled"]');
const elIpBlockList = document.querySelector('[name="ipBlockList"]');
const elIpBlockFields = document.querySelector('.ip-block-fields');
const elIpBlockHint = document.querySelector('#ip-block-hint');

// Rewrite
const elNormalizeSlashes = document.querySelector('[name="normalizeSlashes"]');
const elBlockBadBots = document.querySelector('[name="blockBadBots"]');
const elBadBotsSubFields = document.querySelector('#bad-bots-sub-fields');
const elBbNikto          = document.querySelector('[name="bbNikto"]');
const elBbSqlmap         = document.querySelector('[name="bbSqlmap"]');
const elBbMasscan        = document.querySelector('[name="bbMasscan"]');
const elBbNmap           = document.querySelector('[name="bbNmap"]');
const elBbZgrab          = document.querySelector('[name="bbZgrab"]');
const elBbWget           = document.querySelector('[name="bbWget"]');
const elBbCurl           = document.querySelector('[name="bbCurl"]');
const elBbHttpie         = document.querySelector('[name="bbHttpie"]');
const elBbPythonRequests = document.querySelector('[name="bbPythonRequests"]');
const elBbGoHttpClient   = document.querySelector('[name="bbGoHttpClient"]');
const elBbLibwwwPerl     = document.querySelector('[name="bbLibwwwPerl"]');
const elBbScrapy         = document.querySelector('[name="bbScrapy"]');
const elBbJava           = document.querySelector('[name="bbJava"]');
const elBbAhrefsbot      = document.querySelector('[name="bbAhrefsbot"]');
const elBbSemrushbot     = document.querySelector('[name="bbSemrushbot"]');
const elBbDotbot         = document.querySelector('[name="bbDotbot"]');
const elBbMj12bot        = document.querySelector('[name="bbMj12bot"]');
const elBlockBackdoors = document.querySelector('[name="blockBackdoors"]');
const elBlockWpNesting = document.querySelector('[name="blockWpNesting"]');
const elBlockWpIncludesDir = document.querySelector('[name="blockWpIncludesDir"]');
const elHttpsRedirect = document.querySelector('[name="httpsRedirect"]');
const elXForwardedProto = document.querySelector('[name="xForwardedProto"]');
const elBlockBadQuery = document.querySelector('[name="blockBadQuery"]');

// Cache
const elGzip = document.querySelector('[name="gzip"]');
const elExpires = document.querySelector('[name="expires"]');
const elExpiresSubFields   = document.querySelector('#expires-sub-fields');
const elExpiresScript      = document.querySelector('[name="expiresScript"]');
const elExpiresImage       = document.querySelector('[name="expiresImage"]');
const elExpiresIcon        = document.querySelector('[name="expiresIcon"]');
const elExpiresVideo       = document.querySelector('[name="expiresVideo"]');
const elExpiresFont        = document.querySelector('[name="expiresFont"]');
const elExpiresFeed        = document.querySelector('[name="expiresFeed"]');
const elExpiresDefault     = document.querySelector('[name="expiresDefault"]');
const elCacheControl = document.querySelector('[name="cacheControl"]');
const elEtagDisable = document.querySelector('[name="etagDisable"]');
const elMimeType = document.querySelector('[name="mimeType"]');


// Headers
const elHstsEnabled = document.querySelector('[name="hstsEnabled"]');
const elHstsIncludeSubDomains = document.querySelector('[name="hstsIncludeSubDomains"]');
const elHstsPreload = document.querySelector('[name="hstsPreload"]');
const elHstsSubFields = document.querySelector('.hsts-sub-fields');

const elCspEnabled = document.querySelector('[name="cspEnabled"]');
const elCspSubFields = document.querySelector('.csp-sub-fields');
const elCspDefaultSrcEnabled = document.querySelector('[name="cspDefaultSrcEnabled"]');
const elCspDefaultSrcValue = document.querySelector('[name="cspDefaultSrcValue"]');
const elCspScriptSrcEnabled = document.querySelector('[name="cspScriptSrcEnabled"]');
const elCspScriptSrcValue = document.querySelector('[name="cspScriptSrcValue"]');
const elCspScriptUnsafeInline = document.querySelector('[name="cspScriptUnsafeInline"]');
const elCspScriptUnsafeEval = document.querySelector('[name="cspScriptUnsafeEval"]');
const elCspStyleSrcEnabled = document.querySelector('[name="cspStyleSrcEnabled"]');
const elCspStyleSrcValue = document.querySelector('[name="cspStyleSrcValue"]');
const elCspStyleUnsafeInline = document.querySelector('[name="cspStyleUnsafeInline"]');
const elCspImgSrcEnabled = document.querySelector('[name="cspImgSrcEnabled"]');
const elCspImgSrcValue = document.querySelector('[name="cspImgSrcValue"]');
const elCspFontSrcEnabled = document.querySelector('[name="cspFontSrcEnabled"]');
const elCspFontSrcValue = document.querySelector('[name="cspFontSrcValue"]');
const elCspConnectSrcEnabled = document.querySelector('[name="cspConnectSrcEnabled"]');
const elCspConnectSrcValue = document.querySelector('[name="cspConnectSrcValue"]');
const elCspFrameSrcEnabled = document.querySelector('[name="cspFrameSrcEnabled"]');
const elCspFrameSrcValue = document.querySelector('[name="cspFrameSrcValue"]');
const elCspFrameSrcYoutube = document.querySelector('[name="cspFrameSrcYoutube"]');
const elCspFrameSrcGoogleMaps = document.querySelector('[name="cspFrameSrcGoogleMaps"]');
const elCspFrameAncestorsEnabled = document.querySelector('[name="cspFrameAncestorsEnabled"]');
const elCspFrameAncestorsValue = document.querySelector('[name="cspFrameAncestorsValue"]');

const elXContentType = document.querySelector('[name="xContentType"]');

const elXFrameOptions = document.querySelector('[name="xFrameOptions"]');
const elXfoSubFields = document.querySelector('.xfo-sub-fields');

const elReferrerPolicy = document.querySelector('[name="referrerPolicy"]');
const elRpSubFields = document.querySelector('.rp-sub-fields');

const elPermissionsPolicy = document.querySelector('[name="permissionsPolicy"]');
const elPpCamera = document.querySelector('[name="ppCamera"]');
const elPpMicrophone = document.querySelector('[name="ppMicrophone"]');
const elPpPayment = document.querySelector('[name="ppPayment"]');
const elPpUsb = document.querySelector('[name="ppUsb"]');
const elPpGyroscope = document.querySelector('[name="ppGyroscope"]');
const elPpMagnetometer = document.querySelector('[name="ppMagnetometer"]');
const elPpGeolocation = document.querySelector('[name="ppGeolocation"]');
const elPpSubFields = document.querySelector('.pp-sub-fields');

// wp-admin
const elWpAdminBasicAuth = document.querySelector('[name="wpAdminBasicAuth"]');
const elAdminHtpasswdPath = document.querySelector('[name="adminHtpasswdPath"]');
const elAdminBasicAuthUser = document.querySelector('[name="adminBasicAuthUser"]');
const elAdminHtpasswdHint = document.querySelector('#admin-htpasswd-hint');
const elAjaxExclude = document.querySelector('[name="ajaxExclude"]');
const elUpgradeIpExclude = document.querySelector('[name="upgradeIpExclude"]');
const elServerIp = document.querySelector('[name="serverIp"]');
const elWpAdminFields = document.querySelector('.wp-admin-fields');

// Uploads
const elBlockPhp = document.querySelector('[name="blockPhp"]');

// Preview
const elPreviewCode = document.querySelector('.preview-code');
const elCopyBtn = document.querySelector('.btn-copy');
const elDownloadBtn = document.querySelector('.btn-download');

// Tabs
const elTabList = document.querySelector('.tab-list');
const elTabBtnRoot = document.querySelector('[data-tab="root"]');
const elTabBtnAdmin = document.querySelector('[data-tab="wp-admin"]');
const elTabBtnUploads = document.querySelector('[data-tab="uploads"]');

// Presets
const elPresetGroup = document.querySelector('.preset-group');

// ─── 状態管理 ─────────────────────────────────────────────────────

let currentTab = 'root';
let generatedRoot = [];
let generatedAdmin = [];
let generatedUploads = [];

// ─── 設定値の取得 ─────────────────────────────────────────────────

const getCurrentSettings = () => ({
	options: {
		disableMultiviews: elDisableMultiviews?.checked ?? false,
		disableIndexes: elDisableIndexes?.checked ?? false,
		errorDocument: elErrorDocument?.checked ?? false,
	},
	fileProtection: {
		blockXmlrpc: elBlockXmlrpc?.checked ?? false,
		protectWpConfig: elProtectWpConfig?.checked ?? false,
		protectHtaccess: elProtectHtaccess?.checked ?? false,
		blockDangerousExt: elBlockDangerousExt?.checked ?? false,
		wpLoginBasicAuth: elWpLoginBasicAuth?.checked ?? false,
		htpasswdPath: elLoginHtpasswdPath?.value.trim() ?? '',
		basicAuthUser: elLoginBasicAuthUser?.value.trim() ?? '',
	},
	ipBlock: {
		enabled: elIpBlockEnabled?.checked ?? false,
		list: elIpBlockList?.value ?? '',
	},
	rewrite: {
		normalizeSlashes: elNormalizeSlashes?.checked ?? false,
		blockBadBots: elBlockBadBots?.checked ?? false,
		bbNikto: elBbNikto?.checked ?? true,
		bbSqlmap: elBbSqlmap?.checked ?? true,
		bbMasscan: elBbMasscan?.checked ?? true,
		bbNmap: elBbNmap?.checked ?? true,
		bbZgrab: elBbZgrab?.checked ?? true,
		bbWget: elBbWget?.checked ?? true,
		bbCurl: elBbCurl?.checked ?? true,
		bbHttpie: elBbHttpie?.checked ?? true,
		bbPythonRequests: elBbPythonRequests?.checked ?? true,
		bbGoHttpClient: elBbGoHttpClient?.checked ?? true,
		bbLibwwwPerl: elBbLibwwwPerl?.checked ?? true,
		bbScrapy: elBbScrapy?.checked ?? true,
		bbJava: elBbJava?.checked ?? true,
		bbAhrefsbot: elBbAhrefsbot?.checked ?? true,
		bbSemrushbot: elBbSemrushbot?.checked ?? true,
		bbDotbot: elBbDotbot?.checked ?? true,
		bbMj12bot: elBbMj12bot?.checked ?? true,
		blockBackdoors: elBlockBackdoors?.checked ?? false,
		blockWpNesting: elBlockWpNesting?.checked ?? false,
		blockWpIncludesDir: elBlockWpIncludesDir?.checked ?? false,
		httpsRedirect: elHttpsRedirect?.checked ?? false,
		xForwardedProto: elXForwardedProto?.checked ?? false,
		blockBadQuery: elBlockBadQuery?.checked ?? false,
	},
	cache: {
		gzip: elGzip?.checked ?? false,
		expires: elExpires?.checked ?? false,
		expiresScript: elExpiresScript?.value ?? '1 year',
		expiresImage: elExpiresImage?.value ?? '1 month',
		expiresIcon: elExpiresIcon?.value ?? '1 year',
		expiresVideo: elExpiresVideo?.value ?? '1 month',
		expiresFont: elExpiresFont?.value ?? '1 year',
		expiresFeed: elExpiresFeed?.value ?? '1 hour',
		expiresDefault: elExpiresDefault?.value ?? '1 month',
		cacheControl: elCacheControl?.checked ?? false,
		etagDisable: elEtagDisable?.checked ?? false,
		mimeType: elMimeType?.checked ?? false,

	},
	headers: {
		hstsEnabled: elHstsEnabled?.checked ?? false,
		hstsIncludeSubDomains: elHstsIncludeSubDomains?.checked ?? true,
		hstsPreload: elHstsPreload?.checked ?? true,

		cspEnabled: elCspEnabled?.checked ?? false,
		cspDefaultSrcEnabled: elCspDefaultSrcEnabled?.checked ?? false,
		cspDefaultSrcValue: elCspDefaultSrcValue?.value.trim() ?? '',
		cspScriptSrcEnabled: elCspScriptSrcEnabled?.checked ?? false,
		cspScriptSrcValue: elCspScriptSrcValue?.value.trim() ?? '',
		cspScriptUnsafeInline: elCspScriptUnsafeInline?.checked ?? false,
		cspScriptUnsafeEval: elCspScriptUnsafeEval?.checked ?? false,
		cspStyleSrcEnabled: elCspStyleSrcEnabled?.checked ?? false,
		cspStyleSrcValue: elCspStyleSrcValue?.value.trim() ?? '',
		cspStyleUnsafeInline: elCspStyleUnsafeInline?.checked ?? false,
		cspImgSrcEnabled: elCspImgSrcEnabled?.checked ?? false,
		cspImgSrcValue: elCspImgSrcValue?.value.trim() ?? '',
		cspFontSrcEnabled: elCspFontSrcEnabled?.checked ?? false,
		cspFontSrcValue: elCspFontSrcValue?.value.trim() ?? '',
		cspConnectSrcEnabled: elCspConnectSrcEnabled?.checked ?? false,
		cspConnectSrcValue: elCspConnectSrcValue?.value.trim() ?? '',
		cspFrameSrcEnabled: elCspFrameSrcEnabled?.checked ?? false,
		cspFrameSrcValue: elCspFrameSrcValue?.value.trim() ?? '',
		cspFrameSrcYoutube: elCspFrameSrcYoutube?.checked ?? false,
		cspFrameSrcGoogleMaps: elCspFrameSrcGoogleMaps?.checked ?? false,
		cspFrameAncestorsEnabled: elCspFrameAncestorsEnabled?.checked ?? false,
		cspFrameAncestorsValue: elCspFrameAncestorsValue?.value.trim() ?? '',

		xContentType: elXContentType?.checked ?? false,

		xFrameOptions: elXFrameOptions?.checked ?? false,
		xFrameOptionsValue: document.querySelector('[name="xFrameOptionsValue"]:checked')?.value ?? 'SAMEORIGIN',

		referrerPolicy: elReferrerPolicy?.checked ?? false,
		referrerPolicyValue: document.querySelector('[name="referrerPolicyValue"]:checked')?.value ?? 'strict-origin-when-cross-origin',

		permissionsPolicy: elPermissionsPolicy?.checked ?? false,
		ppCamera: elPpCamera?.checked ?? true,
		ppMicrophone: elPpMicrophone?.checked ?? true,
		ppPayment: elPpPayment?.checked ?? true,
		ppUsb: elPpUsb?.checked ?? true,
		ppGyroscope: elPpGyroscope?.checked ?? true,
		ppMagnetometer: elPpMagnetometer?.checked ?? true,
		ppGeolocation: elPpGeolocation?.checked ?? true,
	},
	wpAdmin: {
		basicAuth: elWpAdminBasicAuth?.checked ?? false,
		htpasswdPath: elAdminHtpasswdPath?.value.trim() ?? '',
		basicAuthUser: elAdminBasicAuthUser?.value.trim() ?? '',
		ajaxExclude: elAjaxExclude?.checked ?? true,
		upgradeIpExclude: elUpgradeIpExclude?.checked ?? false,
		serverIp: elServerIp?.value.trim() ?? '',
	},
	uploads: {
		blockPhp: elBlockPhp?.checked ?? false,
	},
});

// ─── プレビュー更新 ─────────────────────────────────────────────

const updatePreview = () => {
	const settings = getCurrentSettings();

	generatedRoot = buildRoot(settings);
	generatedAdmin = buildWpAdmin(settings);
	generatedUploads = buildUploads(settings);

	// タブの表示/非表示（チェックボックス ON でタブ表示、生成内容の有無は問わない）
	const isAdminEnabled = elWpAdminBasicAuth?.checked ?? false;
	const isUploadsEnabled = elBlockPhp?.checked ?? false;

	if (elTabBtnAdmin) {
		elTabBtnAdmin.hidden = !isAdminEnabled;
	}
	if (elTabBtnUploads) {
		elTabBtnUploads.hidden = !isUploadsEnabled;
	}

	// 非表示タブが選択中ならルートに戻す
	if (currentTab === 'wp-admin' && !isAdminEnabled) {
		switchTab('root');
		return;
	}
	if (currentTab === 'uploads' && !isUploadsEnabled) {
		switchTab('root');
		return;
	}

	renderCurrentTab();
};

const WP_ADMIN_PLACEHOLDER = '# ユーザー名と .htpasswd のフルパスを入力してください';

const renderCurrentTab = () => {
	let lines;
	let placeholder = '# オプションを選択してください';

	switch (currentTab) {
		case 'wp-admin':
			lines = generatedAdmin;
			placeholder = WP_ADMIN_PLACEHOLDER;
			break;
		case 'uploads':
			lines = generatedUploads;
			break;
		default:
			lines = generatedRoot;
	}

	if (elPreviewCode) {
		elPreviewCode.textContent = lines.length > 0
			? lines.join('\n')
			: placeholder;
	}
};

// ─── タブ切り替え ─────────────────────────────────────────────────

const switchTab = (tabId) => {
	currentTab = tabId;

	// アクティブ状態の更新
	elTabList?.querySelectorAll('.tab-btn').forEach((btn) => {
		const isActive = btn.dataset.tab === tabId;
		btn.classList.toggle('active', isActive);
		btn.setAttribute('aria-selected', String(isActive));
	});

	renderCurrentTab();
};

// ─── プリセット適用 ─────────────────────────────────────────────

const applySettingsToForm = (settings) => {
	// Options
	if (elDisableMultiviews) elDisableMultiviews.checked = settings.options.disableMultiviews;
	if (elDisableIndexes) elDisableIndexes.checked = settings.options.disableIndexes;
	if (elErrorDocument) elErrorDocument.checked = settings.options.errorDocument;

	// File Protection
	if (elBlockXmlrpc) elBlockXmlrpc.checked = settings.fileProtection.blockXmlrpc;
	if (elProtectWpConfig) elProtectWpConfig.checked = settings.fileProtection.protectWpConfig;
	if (elProtectHtaccess) elProtectHtaccess.checked = settings.fileProtection.protectHtaccess;
	if (elBlockDangerousExt) elBlockDangerousExt.checked = settings.fileProtection.blockDangerousExt;
	if (elWpLoginBasicAuth) elWpLoginBasicAuth.checked = settings.fileProtection.wpLoginBasicAuth;
	if (elLoginHtpasswdPath) elLoginHtpasswdPath.value = settings.fileProtection.htpasswdPath;
	if (elLoginBasicAuthUser) elLoginBasicAuthUser.value = settings.fileProtection.basicAuthUser;

	// IP Block
	if (elIpBlockEnabled) elIpBlockEnabled.checked = settings.ipBlock.enabled;
	if (elIpBlockList) elIpBlockList.value = settings.ipBlock.list;

	// Rewrite
	if (elNormalizeSlashes) elNormalizeSlashes.checked = settings.rewrite.normalizeSlashes;
	if (elBlockBadBots) elBlockBadBots.checked = settings.rewrite.blockBadBots;
	if (elBbNikto) elBbNikto.checked = settings.rewrite.bbNikto;
	if (elBbSqlmap) elBbSqlmap.checked = settings.rewrite.bbSqlmap;
	if (elBbMasscan) elBbMasscan.checked = settings.rewrite.bbMasscan;
	if (elBbNmap) elBbNmap.checked = settings.rewrite.bbNmap;
	if (elBbZgrab) elBbZgrab.checked = settings.rewrite.bbZgrab;
	if (elBbWget) elBbWget.checked = settings.rewrite.bbWget;
	if (elBbCurl) elBbCurl.checked = settings.rewrite.bbCurl;
	if (elBbHttpie) elBbHttpie.checked = settings.rewrite.bbHttpie;
	if (elBbPythonRequests) elBbPythonRequests.checked = settings.rewrite.bbPythonRequests;
	if (elBbGoHttpClient) elBbGoHttpClient.checked = settings.rewrite.bbGoHttpClient;
	if (elBbLibwwwPerl) elBbLibwwwPerl.checked = settings.rewrite.bbLibwwwPerl;
	if (elBbScrapy) elBbScrapy.checked = settings.rewrite.bbScrapy;
	if (elBbJava) elBbJava.checked = settings.rewrite.bbJava;
	if (elBbAhrefsbot) elBbAhrefsbot.checked = settings.rewrite.bbAhrefsbot;
	if (elBbSemrushbot) elBbSemrushbot.checked = settings.rewrite.bbSemrushbot;
	if (elBbDotbot) elBbDotbot.checked = settings.rewrite.bbDotbot;
	if (elBbMj12bot) elBbMj12bot.checked = settings.rewrite.bbMj12bot;
	if (elBlockBackdoors) elBlockBackdoors.checked = settings.rewrite.blockBackdoors;
	if (elBlockWpNesting) elBlockWpNesting.checked = settings.rewrite.blockWpNesting;
	if (elBlockWpIncludesDir) elBlockWpIncludesDir.checked = settings.rewrite.blockWpIncludesDir;
	if (elHttpsRedirect) elHttpsRedirect.checked = settings.rewrite.httpsRedirect;
	if (elXForwardedProto) elXForwardedProto.checked = settings.rewrite.xForwardedProto;
	if (elBlockBadQuery) elBlockBadQuery.checked = settings.rewrite.blockBadQuery;

	// Cache
	if (elGzip) elGzip.checked = settings.cache.gzip;
	if (elExpires) elExpires.checked = settings.cache.expires;
	if (elExpiresScript) elExpiresScript.value = settings.cache.expiresScript;
	if (elExpiresImage) elExpiresImage.value = settings.cache.expiresImage;
	if (elExpiresIcon) elExpiresIcon.value = settings.cache.expiresIcon;
	if (elExpiresVideo) elExpiresVideo.value = settings.cache.expiresVideo;
	if (elExpiresFont) elExpiresFont.value = settings.cache.expiresFont;
	if (elExpiresFeed) elExpiresFeed.value = settings.cache.expiresFeed;
	if (elExpiresDefault) elExpiresDefault.value = settings.cache.expiresDefault;
	if (elCacheControl) elCacheControl.checked = settings.cache.cacheControl;
	if (elEtagDisable) elEtagDisable.checked = settings.cache.etagDisable;
	if (elMimeType) elMimeType.checked = settings.cache.mimeType;


	// Headers
	if (elHstsEnabled) elHstsEnabled.checked = settings.headers.hstsEnabled;
	if (elHstsIncludeSubDomains) elHstsIncludeSubDomains.checked = settings.headers.hstsIncludeSubDomains;
	if (elHstsPreload) elHstsPreload.checked = settings.headers.hstsPreload;
	if (elCspEnabled) elCspEnabled.checked = settings.headers.cspEnabled;
	if (elCspDefaultSrcEnabled) elCspDefaultSrcEnabled.checked = settings.headers.cspDefaultSrcEnabled;
	if (elCspDefaultSrcValue) elCspDefaultSrcValue.value = settings.headers.cspDefaultSrcValue;
	if (elCspScriptSrcEnabled) elCspScriptSrcEnabled.checked = settings.headers.cspScriptSrcEnabled;
	if (elCspScriptSrcValue) elCspScriptSrcValue.value = settings.headers.cspScriptSrcValue;
	if (elCspScriptUnsafeInline) elCspScriptUnsafeInline.checked = settings.headers.cspScriptUnsafeInline;
	if (elCspScriptUnsafeEval) elCspScriptUnsafeEval.checked = settings.headers.cspScriptUnsafeEval;
	if (elCspStyleSrcEnabled) elCspStyleSrcEnabled.checked = settings.headers.cspStyleSrcEnabled;
	if (elCspStyleSrcValue) elCspStyleSrcValue.value = settings.headers.cspStyleSrcValue;
	if (elCspStyleUnsafeInline) elCspStyleUnsafeInline.checked = settings.headers.cspStyleUnsafeInline;
	if (elCspImgSrcEnabled) elCspImgSrcEnabled.checked = settings.headers.cspImgSrcEnabled;
	if (elCspImgSrcValue) elCspImgSrcValue.value = settings.headers.cspImgSrcValue;
	if (elCspFontSrcEnabled) elCspFontSrcEnabled.checked = settings.headers.cspFontSrcEnabled;
	if (elCspFontSrcValue) elCspFontSrcValue.value = settings.headers.cspFontSrcValue;
	if (elCspConnectSrcEnabled) elCspConnectSrcEnabled.checked = settings.headers.cspConnectSrcEnabled;
	if (elCspConnectSrcValue) elCspConnectSrcValue.value = settings.headers.cspConnectSrcValue;
	if (elCspFrameSrcEnabled) elCspFrameSrcEnabled.checked = settings.headers.cspFrameSrcEnabled;
	if (elCspFrameSrcValue) elCspFrameSrcValue.value = settings.headers.cspFrameSrcValue;
	if (elCspFrameSrcYoutube) elCspFrameSrcYoutube.checked = settings.headers.cspFrameSrcYoutube;
	if (elCspFrameSrcGoogleMaps) elCspFrameSrcGoogleMaps.checked = settings.headers.cspFrameSrcGoogleMaps;
	if (elCspFrameAncestorsEnabled) elCspFrameAncestorsEnabled.checked = settings.headers.cspFrameAncestorsEnabled;
	if (elCspFrameAncestorsValue) elCspFrameAncestorsValue.value = settings.headers.cspFrameAncestorsValue;
	if (elXContentType) elXContentType.checked = settings.headers.xContentType;
	if (elXFrameOptions) elXFrameOptions.checked = settings.headers.xFrameOptions;
	const xfoRadio = document.querySelector(`[name="xFrameOptionsValue"][value="${settings.headers.xFrameOptionsValue}"]`);
	if (xfoRadio) xfoRadio.checked = true;
	if (elReferrerPolicy) elReferrerPolicy.checked = settings.headers.referrerPolicy;
	const rpRadio = document.querySelector(`[name="referrerPolicyValue"][value="${settings.headers.referrerPolicyValue}"]`);
	if (rpRadio) rpRadio.checked = true;
	if (elPermissionsPolicy) elPermissionsPolicy.checked = settings.headers.permissionsPolicy;
	if (elPpCamera) elPpCamera.checked = settings.headers.ppCamera;
	if (elPpMicrophone) elPpMicrophone.checked = settings.headers.ppMicrophone;
	if (elPpPayment) elPpPayment.checked = settings.headers.ppPayment;
	if (elPpUsb) elPpUsb.checked = settings.headers.ppUsb;
	if (elPpGyroscope) elPpGyroscope.checked = settings.headers.ppGyroscope;
	if (elPpMagnetometer) elPpMagnetometer.checked = settings.headers.ppMagnetometer;
	if (elPpGeolocation) elPpGeolocation.checked = settings.headers.ppGeolocation;

	// wp-admin
	if (elWpAdminBasicAuth) elWpAdminBasicAuth.checked = settings.wpAdmin.basicAuth;
	if (elAdminHtpasswdPath) elAdminHtpasswdPath.value = settings.wpAdmin.htpasswdPath;
	if (elAdminBasicAuthUser) elAdminBasicAuthUser.value = settings.wpAdmin.basicAuthUser;
	if (elAjaxExclude) elAjaxExclude.checked = settings.wpAdmin.ajaxExclude;
	if (elUpgradeIpExclude) elUpgradeIpExclude.checked = settings.wpAdmin.upgradeIpExclude;
	if (elServerIp) elServerIp.value = settings.wpAdmin.serverIp;

	// Uploads
	if (elBlockPhp) elBlockPhp.checked = settings.uploads.blockPhp;

	// 条件付きフィールドの表示/非表示
	updateConditionalFields();

	updatePreview();
};

const clearPresetActiveState = () => {
	if (!elPresetGroup) return;
	elPresetGroup.querySelectorAll('.preset-btn').forEach((btn) => {
		btn.classList.remove('active');
	});
};

const applyPreset = (presetId) => {
	const preset = PRESETS.find((p) => p.id === presetId);
	if (!preset) return;

	applySettingsToForm(preset.settings);

	// アクティブ状態
	if (!elPresetGroup) return;
	elPresetGroup.querySelectorAll('.preset-btn').forEach((btn) => {
		btn.classList.toggle('active', btn.dataset.presetId === presetId);
	});
};

// ─── 条件付きフィールドの表示/非表示 ─────────────────────────────

const updateConditionalFields = () => {
	// wp-login.php Basic 認証フィールド
	if (elLoginAuthFields) {
		elLoginAuthFields.hidden = !elWpLoginBasicAuth?.checked;
	}
	if (elLoginHtpasswdHint) {
		elLoginHtpasswdHint.hidden = !(elWpLoginBasicAuth?.checked && !elLoginHtpasswdPath?.value.trim());
	}

	// IP ブロックフィールド
	if (elIpBlockFields) {
		elIpBlockFields.hidden = !elIpBlockEnabled?.checked;
	}
	if (elIpBlockHint) {
		elIpBlockHint.hidden = !(elIpBlockEnabled?.checked && !elIpBlockList?.value.trim());
	}

	// ボットブロック サブフィールド
	if (elBadBotsSubFields) {
		const badBotsVisible = elBlockBadBots?.checked ?? false;
		elBadBotsSubFields.hidden = !badBotsVisible;
		elBlockBadBots?.setAttribute('aria-expanded', String(badBotsVisible));
	}

	// Expires サブフィールド
	if (elExpiresSubFields) {
		const expiresVisible = elExpires?.checked ?? false;
		elExpiresSubFields.hidden = !expiresVisible;
		elExpires?.setAttribute('aria-expanded', String(expiresVisible));
	}

	// wp-admin フィールド
	if (elWpAdminFields) {
		elWpAdminFields.hidden = !elWpAdminBasicAuth?.checked;
	}
	if (elAdminHtpasswdHint) {
		elAdminHtpasswdHint.hidden = !(elWpAdminBasicAuth?.checked && !elAdminHtpasswdPath?.value.trim());
	}

	// HSTS サブオプション
	if (elHstsSubFields) {
		const hstsVisible = elHstsEnabled?.checked ?? false;
		elHstsSubFields.hidden = !hstsVisible;
		elHstsEnabled?.setAttribute('aria-expanded', String(hstsVisible));
	}

	// preload は includeSubDomains が ON の場合のみ有効
	if (elHstsPreload) {
		const includeSubEnabled = elHstsIncludeSubDomains?.checked ?? true;
		elHstsPreload.disabled = !includeSubEnabled;
		if (!includeSubEnabled) {
			elHstsPreload.checked = false;
		}
	}

	// CSP サブオプション
	if (elCspSubFields) {
		const cspVisible = elCspEnabled?.checked ?? false;
		elCspSubFields.hidden = !cspVisible;
		elCspEnabled?.setAttribute('aria-expanded', String(cspVisible));
	}

	// frame-src の YouTube / Google Maps は cspFrameSrcEnabled が ON のときのみ有効
	const frameSrcExtraEls = [elCspFrameSrcYoutube, elCspFrameSrcGoogleMaps];
	frameSrcExtraEls.forEach((el) => {
		if (el) el.disabled = !(elCspFrameSrcEnabled?.checked ?? false);
	});

	// X-Frame-Options サブオプション
	if (elXfoSubFields) {
		const xfoVisible = elXFrameOptions?.checked ?? false;
		elXfoSubFields.hidden = !xfoVisible;
		elXFrameOptions?.setAttribute('aria-expanded', String(xfoVisible));
	}

	// Referrer-Policy サブオプション
	if (elRpSubFields) {
		const rpVisible = elReferrerPolicy?.checked ?? false;
		elRpSubFields.hidden = !rpVisible;
		elReferrerPolicy?.setAttribute('aria-expanded', String(rpVisible));
	}

	// Permissions-Policy サブオプション
	if (elPpSubFields) {
		const ppVisible = elPermissionsPolicy?.checked ?? false;
		elPpSubFields.hidden = !ppVisible;
		elPermissionsPolicy?.setAttribute('aria-expanded', String(ppVisible));
	}
};

// ─── コピー ─────────────────────────────────────────────────────

const handleCopy = async () => {
	const text = elPreviewCode?.textContent ?? '';
	if (!text || text === '# オプションを選択してください') return;

	try {
		await navigator.clipboard.writeText(text);
		if (elCopyBtn) {
			elCopyBtn.textContent = 'コピー済！';
			elCopyBtn.classList.add('copied');
			setTimeout(() => {
				elCopyBtn.textContent = 'コピー';
				elCopyBtn.classList.remove('copied');
			}, 2000);
		}
	} catch {
		if (elCopyBtn) {
			elCopyBtn.textContent = 'コピー失敗';
			setTimeout(() => {
				elCopyBtn.textContent = 'コピー';
			}, 2000);
		}
	}
};

// ─── ダウンロード ─────────────────────────────────────────────────

const handleDownload = () => {
	const text = elPreviewCode?.textContent ?? '';
	if (!text || text === '# オプションを選択してください') return;

	const blob = new Blob([text], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = '.htaccess';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};

// ─── プリセットボタン初期化 ─────────────────────────────────────

const initPresets = () => {
	PRESETS.forEach((preset) => {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'preset-btn';
		btn.dataset.presetId = preset.id;
		btn.textContent = preset.label;
		btn.setAttribute('aria-label', preset.description);
		btn.addEventListener('click', () => applyPreset(preset.id));
		elPresetGroup?.appendChild(btn);
	});

	// リセットボタン
	const resetBtn = document.createElement('button');
	resetBtn.type = 'button';
	resetBtn.className = 'preset-btn preset-reset-btn';
	resetBtn.textContent = 'リセット';
	resetBtn.setAttribute('aria-label', 'すべての設定を初期状態に戻す');
	resetBtn.addEventListener('click', () => {
		applySettingsToForm(DEFAULT_SETTINGS);
		clearPresetActiveState();
	});
	elPresetGroup?.appendChild(resetBtn);
};

// ─── イベント登録 ─────────────────────────────────────────────────

const initEvents = () => {
	// 全チェックボックスの change イベントでプレビュー更新
	const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
	allCheckboxes.forEach((cb) => {
		cb.addEventListener('change', () => {
			updateConditionalFields();
			updatePreview();
			clearPresetActiveState();
		});
	});

	// ボットブロック：サブ機能が全 OFF → メイントグルを自動で OFF に
	// メイントグルを ON にしたとき → サブ機能を全 ON にリセット（詰み状態の回避）
	const bbSubEls = [
		elBbNikto, elBbSqlmap, elBbMasscan, elBbNmap, elBbZgrab,
		elBbWget, elBbCurl, elBbHttpie, elBbPythonRequests, elBbGoHttpClient,
		elBbLibwwwPerl, elBbScrapy, elBbJava,
		elBbAhrefsbot, elBbSemrushbot, elBbDotbot, elBbMj12bot,
	];
	elBlockBadBots?.addEventListener('change', () => {
		if (elBlockBadBots.checked) {
			bbSubEls.forEach((el) => { if (el) el.checked = true; });
			updatePreview();
		}
	});
	bbSubEls.forEach((cb) => {
		cb?.addEventListener('change', () => {
			if (!bbSubEls.some((el) => el?.checked) && elBlockBadBots) {
				elBlockBadBots.checked = false;
				updateConditionalFields();
				updatePreview();
			}
		});
	});

	// Permissions-Policy：サブ機能が全 OFF → メイントグルを自動で OFF に
	// メイントグルを ON にしたとき → サブ機能を全 ON にリセット（詰み状態の回避）
	const ppSubEls = [elPpCamera, elPpMicrophone, elPpPayment, elPpUsb, elPpGyroscope, elPpMagnetometer, elPpGeolocation];
	elPermissionsPolicy?.addEventListener('change', () => {
		if (elPermissionsPolicy.checked) {
			ppSubEls.forEach((el) => { if (el) el.checked = true; });
			updatePreview();
		}
	});
	ppSubEls.forEach((cb) => {
		cb?.addEventListener('change', () => {
			if (!ppSubEls.some((el) => el?.checked) && elPermissionsPolicy) {
				elPermissionsPolicy.checked = false;
				updateConditionalFields();
				updatePreview();
			}
		});
	});

	// Expires セレクトボックスの change イベントでプレビュー更新
	const expiresSelects = [elExpiresScript, elExpiresImage, elExpiresIcon, elExpiresVideo, elExpiresFont, elExpiresFeed, elExpiresDefault];
	expiresSelects.forEach((sel) => {
		sel?.addEventListener('change', () => {
			updatePreview();
			clearPresetActiveState();
		});
	});

	// ヘッダーサブオプションのラジオボタン change イベントでプレビュー更新
	const headerRadios = document.querySelectorAll('[name="xFrameOptionsValue"], [name="referrerPolicyValue"]');
	headerRadios.forEach((radio) => {
		radio.addEventListener('change', () => {
			updatePreview();
			clearPresetActiveState();
		});
	});

	// テキスト入力の input イベントでプレビュー更新
	const textInputs = document.querySelectorAll('input[type="text"], textarea');
	textInputs.forEach((input) => {
		input.addEventListener('input', () => {
			updateConditionalFields();
			updatePreview();
			clearPresetActiveState();
		});
	});

	// タブ切り替え
	elTabList?.addEventListener('click', (e) => {
		const btn = e.target.closest('.tab-btn');
		if (!btn || btn.hidden) return;
		switchTab(btn.dataset.tab);
	});

	// コピー
	elCopyBtn?.addEventListener('click', handleCopy);

	// ダウンロード
	elDownloadBtn?.addEventListener('click', handleDownload);

	// テーマ切り替え
	setupThemeToggle();

	// ドロップダウンナビ — aria-expanded 管理・Esc で閉じる
	const dropdown = document.querySelector('.header-nav-dropdown');
	const dropdownBtn = dropdown?.querySelector('button');
	const dropdownMenu = dropdown?.querySelector('.dropdown-menu');
	if (dropdown && dropdownBtn) {
		const setExpanded = (val) => {
			dropdownBtn.setAttribute('aria-expanded', String(val));
			if (dropdownMenu) dropdownMenu.setAttribute('aria-hidden', String(!val));
		};
		setExpanded(false);
		dropdown.addEventListener('mouseenter', () => setExpanded(true));
		dropdown.addEventListener('mouseleave', () => {
			if (!dropdown.contains(document.activeElement)) setExpanded(false);
		});
		let escapingByKey = false;
		dropdown.addEventListener('focusin', () => {
			if (!escapingByKey) setExpanded(true);
		});
		dropdown.addEventListener('focusout', (e) => {
			if (!dropdown.contains(e.relatedTarget)) setExpanded(false);
		});
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && dropdownBtn.getAttribute('aria-expanded') === 'true') {
				e.preventDefault();
				escapingByKey = true;
				setExpanded(false);
				dropdownBtn.focus();
				escapingByKey = false;
			}
		});
	}
};

// ─── 起動 ─────────────────────────────────────────────────────

initTheme();
initPresets();
initEvents();
updateConditionalFields();
updatePreview();
