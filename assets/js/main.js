/**
 * main.js — エントリーポイント
 *
 * DOM 参照・イベント登録・テーマ切り替え・プリセット適用・
 * プレビュー更新・コピー・ダウンロード処理を担う。
 */

import { buildRoot, buildWpAdmin, buildUploads, isValidHtpasswdPath, isValidIpV4OrCidr } from './generator.js';
import { PRESETS, DEFAULT_SETTINGS } from './presets.js';
import { applyTheme, initTheme, setupThemeToggle, DARK_THEME } from './theme.js';
import { t, getLang, setLang, initLang } from './i18n.js';

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
const elBlockDangerousExtList = document.querySelector('[name="blockDangerousExtList"]');
const elDangerousExtFields = document.querySelector('.dangerous-ext-fields');
const elWpLoginBasicAuth = document.querySelector('[name="wpLoginBasicAuth"]');
const elLoginHtpasswdPath = document.querySelector('[name="loginHtpasswdPath"]');
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
const elBbNikto = document.querySelector('[name="bbNikto"]');
const elBbSqlmap = document.querySelector('[name="bbSqlmap"]');
const elBbMasscan = document.querySelector('[name="bbMasscan"]');
const elBbNmap = document.querySelector('[name="bbNmap"]');
const elBbZgrab = document.querySelector('[name="bbZgrab"]');
const elBbWget = document.querySelector('[name="bbWget"]');
const elBbCurl = document.querySelector('[name="bbCurl"]');
const elBbHttpie = document.querySelector('[name="bbHttpie"]');
const elBbPythonRequests = document.querySelector('[name="bbPythonRequests"]');
const elBbGoHttpClient = document.querySelector('[name="bbGoHttpClient"]');
const elBbLibwwwPerl = document.querySelector('[name="bbLibwwwPerl"]');
const elBbScrapy = document.querySelector('[name="bbScrapy"]');
const elBbJava = document.querySelector('[name="bbJava"]');
const elBbAhrefsbot = document.querySelector('[name="bbAhrefsbot"]');
const elBbSemrushbot = document.querySelector('[name="bbSemrushbot"]');
const elBbDotbot = document.querySelector('[name="bbDotbot"]');
const elBbMj12bot = document.querySelector('[name="bbMj12bot"]');
const elBlockBackdoors = document.querySelector('[name="blockBackdoors"]');
const elBlockWpNesting = document.querySelector('[name="blockWpNesting"]');
const elBlockWpIncludesDir = document.querySelector('[name="blockWpIncludesDir"]');
const elHttpsRedirect = document.querySelector('[name="httpsRedirect"]');
const elHttpsSubFields = document.querySelector('#https-sub-fields');
const elXForwardedProto = document.querySelector('[name="xForwardedProto"]');
const elBlockBadQuery = document.querySelector('[name="blockBadQuery"]');
const elBadQueryParams = document.querySelector('[name="badQueryParams"]');
const elBadQueryFields = document.querySelector('.bad-query-fields');

// Cache
const elGzip = document.querySelector('[name="gzip"]');
const elExpires = document.querySelector('[name="expires"]');
const elExpiresSubFields = document.querySelector('#expires-sub-fields');
const elCacheControl = document.querySelector('[name="cacheControl"]');
const elCacheControlSubFields = document.querySelector('#cache-control-sub-fields');
const elEtagDisable = document.querySelector('[name="etagDisable"]');
const elMimeType = document.querySelector('[name="mimeType"]');


// Headers
const elHstsEnabled = document.querySelector('[name="hstsEnabled"]');
const elHstsMaxAge = document.querySelector('[name="hstsMaxAge"]');
const elHstsIncludeSubDomains = document.querySelector('[name="hstsIncludeSubDomains"]');
const elHstsPreload = document.querySelector('[name="hstsPreload"]');
const elHstsSubFields = document.querySelector('.hsts-sub-fields');
const elHstsPreloadWarn = document.querySelector('#hsts-preload-warn');

const elCspEnabled = document.querySelector('[name="cspEnabled"]');
const elCspSubFields = document.querySelector('.csp-sub-fields');
const elCspDefaultSrcEnabled = document.querySelector('[name="cspDefaultSrcEnabled"]');
const elCspDefaultSrcValue = document.querySelector('[name="cspDefaultSrcValue"]');
const elCspScriptSrcEnabled = document.querySelector('[name="cspScriptSrcEnabled"]');
const elCspScriptSrcValue = document.querySelector('[name="cspScriptSrcValue"]');
const elCspStyleSrcEnabled = document.querySelector('[name="cspStyleSrcEnabled"]');
const elCspStyleSrcValue = document.querySelector('[name="cspStyleSrcValue"]');
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
const elCspReportOnly = document.querySelector('[name="cspReportOnly"]');

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
const elPpAccelerometer = document.querySelector('[name="ppAccelerometer"]');
const elPpFullscreen = document.querySelector('[name="ppFullscreen"]');
const elPpAutoplay = document.querySelector('[name="ppAutoplay"]');
const elPpClipboardRead = document.querySelector('[name="ppClipboardRead"]');
const elPpClipboardWrite = document.querySelector('[name="ppClipboardWrite"]');
const elPpPictureInPicture = document.querySelector('[name="ppPictureInPicture"]');
const elPpScreenWakeLock = document.querySelector('[name="ppScreenWakeLock"]');
const elPpWebShare = document.querySelector('[name="ppWebShare"]');
const elPpGeolocation = document.querySelector('[name="ppGeolocation"]');
const elPpSubFields = document.querySelector('.pp-sub-fields');

// wp-admin
const elWpAdminBasicAuth = document.querySelector('[name="wpAdminBasicAuth"]');
const elAdminHtpasswdPath = document.querySelector('[name="adminHtpasswdPath"]');
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

// Apache バージョン
// ラジオボタンのため、値は document.querySelector('[name="apacheVersion"]:checked') で取得する

// Presets
const elPresetGroup = document.querySelector('.preset-group');

// ─── 状態管理 ─────────────────────────────────────────────────────

let currentTab = 'root';
let generatedRoot = [];
let generatedAdmin = [];
let generatedUploads = [];

// ─── 設定値の取得 ─────────────────────────────────────────────────

const getCurrentSettings = () => ({
	apacheVersion: document.querySelector('[name="apacheVersion"]:checked')?.value ?? '2.4',
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
		blockDangerousExtList: elBlockDangerousExtList?.value ?? DEFAULT_SETTINGS.fileProtection.blockDangerousExtList,
		wpLoginBasicAuth: elWpLoginBasicAuth?.checked ?? false,
		htpasswdPath: elLoginHtpasswdPath?.value.trim() ?? '',
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
		bbAhrefsbot: elBbAhrefsbot?.checked ?? false,
		bbSemrushbot: elBbSemrushbot?.checked ?? false,
		bbDotbot: elBbDotbot?.checked ?? false,
		bbMj12bot: elBbMj12bot?.checked ?? false,
		blockBackdoors: elBlockBackdoors?.checked ?? false,
		blockWpNesting: elBlockWpNesting?.checked ?? false,
		blockWpIncludesDir: elBlockWpIncludesDir?.checked ?? false,
		httpsRedirect: elHttpsRedirect?.checked ?? false,
		xForwardedProto: elXForwardedProto?.checked ?? false,
		blockBadQuery: elBlockBadQuery?.checked ?? false,
		badQueryParams: elBadQueryParams?.value ?? DEFAULT_SETTINGS.rewrite.badQueryParams,
	},
	cache: {
		gzip: elGzip?.checked ?? false,
		expires: elExpires?.checked ?? false,
		expiresScript: document.querySelector('[name="expiresScript"]:checked')?.value ?? '1 year',
		expiresImage: document.querySelector('[name="expiresImage"]:checked')?.value ?? '1 month',
		expiresIcon: document.querySelector('[name="expiresIcon"]:checked')?.value ?? '1 year',
		expiresVideo: document.querySelector('[name="expiresVideo"]:checked')?.value ?? '1 month',
		expiresFont: document.querySelector('[name="expiresFont"]:checked')?.value ?? '1 year',
		expiresFeed: document.querySelector('[name="expiresFeed"]:checked')?.value ?? '1 hour',
		expiresDefault: document.querySelector('[name="expiresDefault"]:checked')?.value ?? '1 month',
		cacheControl: elCacheControl?.checked ?? false,
		ccScript: document.querySelector('[name="ccScript"]:checked')?.value ?? '31536000',
		ccImage: document.querySelector('[name="ccImage"]:checked')?.value ?? '2592000',
		ccFont: document.querySelector('[name="ccFont"]:checked')?.value ?? '31536000',
		ccVideo: document.querySelector('[name="ccVideo"]:checked')?.value ?? '2592000',
		etagDisable: elEtagDisable?.checked ?? false,
		mimeType: elMimeType?.checked ?? false,

	},
	headers: {
		hstsEnabled: elHstsEnabled?.checked ?? false,
		hstsMaxAge: elHstsMaxAge?.value ?? DEFAULT_SETTINGS.headers.hstsMaxAge,
		hstsIncludeSubDomains: elHstsIncludeSubDomains?.checked ?? DEFAULT_SETTINGS.headers.hstsIncludeSubDomains,
		hstsPreload: elHstsPreload?.checked ?? DEFAULT_SETTINGS.headers.hstsPreload,

		cspEnabled: elCspEnabled?.checked ?? false,
		cspDefaultSrcEnabled: elCspDefaultSrcEnabled?.checked ?? false,
		cspDefaultSrcValue: elCspDefaultSrcValue?.value.trim() ?? '',
		cspScriptSrcEnabled: elCspScriptSrcEnabled?.checked ?? false,
		cspScriptSrcValue: elCspScriptSrcValue?.value.trim() ?? '',
		cspStyleSrcEnabled: elCspStyleSrcEnabled?.checked ?? false,
		cspStyleSrcValue: elCspStyleSrcValue?.value.trim() ?? '',
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
		cspReportOnly: elCspReportOnly?.checked ?? false,

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
		ppAccelerometer: elPpAccelerometer?.checked ?? true,
		ppFullscreen: elPpFullscreen?.checked ?? true,
		ppAutoplay: elPpAutoplay?.checked ?? false,
		ppClipboardRead: elPpClipboardRead?.checked ?? false,
		ppClipboardWrite: elPpClipboardWrite?.checked ?? false,
		ppPictureInPicture: elPpPictureInPicture?.checked ?? false,
		ppScreenWakeLock: elPpScreenWakeLock?.checked ?? false,
		ppWebShare: elPpWebShare?.checked ?? false,
		ppGeolocation: elPpGeolocation?.value ?? 'deny',
	},
	wpAdmin: {
		basicAuth: elWpAdminBasicAuth?.checked ?? false,
		htpasswdPath: elAdminHtpasswdPath?.value.trim() ?? '',
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

	generatedRoot = buildRoot(settings, t);
	generatedAdmin = buildWpAdmin(settings, t);
	generatedUploads = buildUploads(settings, t);

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

const renderCurrentTab = () => {
	let lines;
	let placeholderKey = 'preview.placeholder';

	switch (currentTab) {
		case 'wp-admin':
			lines = generatedAdmin;
			placeholderKey = 'preview.placeholder.wpAdmin';
			break;
		case 'uploads':
			lines = generatedUploads;
			break;
		default:
			lines = generatedRoot;
	}

	if (elPreviewCode) {
		if (lines.length > 0) {
			elPreviewCode.textContent = lines.join('\n');
			elPreviewCode.removeAttribute('data-empty');
		} else {
			elPreviewCode.textContent = t(placeholderKey);
			elPreviewCode.setAttribute('data-empty', '');
		}
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
	// Apache バージョン
	if (settings.apacheVersion !== undefined) {
		const avRadio = document.querySelector(`[name="apacheVersion"][value="${settings.apacheVersion}"]`);
		if (avRadio) avRadio.checked = true;
	}

	// Options
	if (elDisableMultiviews) elDisableMultiviews.checked = settings.options.disableMultiviews;
	if (elDisableIndexes) elDisableIndexes.checked = settings.options.disableIndexes;
	if (elErrorDocument) elErrorDocument.checked = settings.options.errorDocument;

	// File Protection
	if (elBlockXmlrpc) elBlockXmlrpc.checked = settings.fileProtection.blockXmlrpc;
	if (elProtectWpConfig) elProtectWpConfig.checked = settings.fileProtection.protectWpConfig;
	if (elProtectHtaccess) elProtectHtaccess.checked = settings.fileProtection.protectHtaccess;
	if (elBlockDangerousExt) elBlockDangerousExt.checked = settings.fileProtection.blockDangerousExt;
	if (elBlockDangerousExtList) elBlockDangerousExtList.value = settings.fileProtection.blockDangerousExtList ?? DEFAULT_SETTINGS.fileProtection.blockDangerousExtList;
	if (elWpLoginBasicAuth) elWpLoginBasicAuth.checked = settings.fileProtection.wpLoginBasicAuth;
	if (elLoginHtpasswdPath) elLoginHtpasswdPath.value = settings.fileProtection.htpasswdPath;

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
	if (elBadQueryParams) elBadQueryParams.value = settings.rewrite.badQueryParams ?? DEFAULT_SETTINGS.rewrite.badQueryParams;

	// Cache
	if (elGzip) elGzip.checked = settings.cache.gzip;
	if (elExpires) elExpires.checked = settings.cache.expires;
	['expiresScript', 'expiresImage', 'expiresIcon', 'expiresVideo', 'expiresFont', 'expiresFeed', 'expiresDefault'].forEach((key) => {
		const el = document.querySelector(`[name="${key}"][value="${settings.cache[key]}"]`);
		if (el) el.checked = true;
	});
	if (elCacheControl) elCacheControl.checked = settings.cache.cacheControl;
	['ccScript', 'ccImage', 'ccFont', 'ccVideo'].forEach((key) => {
		const el = document.querySelector(`[name="${key}"][value="${settings.cache[key]}"]`);
		if (el) el.checked = true;
	});
	if (elEtagDisable) elEtagDisable.checked = settings.cache.etagDisable;
	if (elMimeType) elMimeType.checked = settings.cache.mimeType;


	// Headers
	if (elHstsEnabled) elHstsEnabled.checked = settings.headers.hstsEnabled;
	if (elHstsMaxAge) {
		const maxAgeVal = String(settings.headers.hstsMaxAge ?? DEFAULT_SETTINGS.headers.hstsMaxAge);
		const validOption = Array.from(elHstsMaxAge.options).some((o) => o.value === maxAgeVal);
		elHstsMaxAge.value = validOption ? maxAgeVal : DEFAULT_SETTINGS.headers.hstsMaxAge;
	}
	if (elHstsIncludeSubDomains) elHstsIncludeSubDomains.checked = settings.headers.hstsIncludeSubDomains;
	if (elHstsPreload) elHstsPreload.checked = settings.headers.hstsPreload;
	if (elCspEnabled) elCspEnabled.checked = settings.headers.cspEnabled;
	if (elCspDefaultSrcEnabled) elCspDefaultSrcEnabled.checked = settings.headers.cspDefaultSrcEnabled;
	if (elCspDefaultSrcValue) elCspDefaultSrcValue.value = settings.headers.cspDefaultSrcValue;
	if (elCspScriptSrcEnabled) elCspScriptSrcEnabled.checked = settings.headers.cspScriptSrcEnabled;
	if (elCspScriptSrcValue) elCspScriptSrcValue.value = settings.headers.cspScriptSrcValue;
	if (elCspStyleSrcEnabled) elCspStyleSrcEnabled.checked = settings.headers.cspStyleSrcEnabled;
	if (elCspStyleSrcValue) elCspStyleSrcValue.value = settings.headers.cspStyleSrcValue;
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
	if (elCspReportOnly) elCspReportOnly.checked = settings.headers.cspReportOnly;
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
	if (elPpAccelerometer) elPpAccelerometer.checked = settings.headers.ppAccelerometer;
	if (elPpFullscreen) elPpFullscreen.checked = settings.headers.ppFullscreen ?? true;
	if (elPpAutoplay) elPpAutoplay.checked = settings.headers.ppAutoplay ?? false;
	if (elPpClipboardRead) elPpClipboardRead.checked = settings.headers.ppClipboardRead ?? false;
	if (elPpClipboardWrite) elPpClipboardWrite.checked = settings.headers.ppClipboardWrite ?? false;
	if (elPpPictureInPicture) elPpPictureInPicture.checked = settings.headers.ppPictureInPicture ?? false;
	if (elPpScreenWakeLock) elPpScreenWakeLock.checked = settings.headers.ppScreenWakeLock ?? false;
	if (elPpWebShare) elPpWebShare.checked = settings.headers.ppWebShare ?? false;
	if (elPpGeolocation) elPpGeolocation.value = settings.headers.ppGeolocation;

	// wp-admin
	if (elWpAdminBasicAuth) elWpAdminBasicAuth.checked = settings.wpAdmin.basicAuth;
	if (elAdminHtpasswdPath) elAdminHtpasswdPath.value = settings.wpAdmin.htpasswdPath;
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
		elLoginHtpasswdHint.hidden = !(elWpLoginBasicAuth?.checked && !isValidHtpasswdPath(elLoginHtpasswdPath?.value ?? ''));
	}

	// IP ブロックフィールド
	if (elIpBlockFields) {
		elIpBlockFields.hidden = !elIpBlockEnabled?.checked;
	}
	if (elIpBlockHint) {
		elIpBlockHint.hidden = !(elIpBlockEnabled?.checked && !elIpBlockList?.value?.trim());
	}

	// 危険拡張子 サブフィールド
	if (elDangerousExtFields) {
		const dangerousExtVisible = elBlockDangerousExt?.checked ?? false;
		elDangerousExtFields.hidden = !dangerousExtVisible;
		elBlockDangerousExt?.setAttribute('aria-expanded', String(dangerousExtVisible));
	}

	// HTTPS リダイレクト サブフィールド
	if (elHttpsSubFields) {
		const httpsVisible = elHttpsRedirect?.checked ?? false;
		elHttpsSubFields.hidden = !httpsVisible;
		elHttpsRedirect?.setAttribute('aria-expanded', String(httpsVisible));
		if (elXForwardedProto) {
			elXForwardedProto.disabled = !httpsVisible;
			if (!httpsVisible) {
				elXForwardedProto.checked = false;
			}
		}
	}

	// 不正クエリ サブフィールド
	if (elBadQueryFields) {
		const badQueryVisible = elBlockBadQuery?.checked ?? false;
		elBadQueryFields.hidden = !badQueryVisible;
		elBlockBadQuery?.setAttribute('aria-expanded', String(badQueryVisible));
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

	// Cache-Control サブフィールド
	if (elCacheControlSubFields) {
		const ccVisible = elCacheControl?.checked ?? false;
		elCacheControlSubFields.hidden = !ccVisible;
		elCacheControl?.setAttribute('aria-expanded', String(ccVisible));
	}

	// wp-admin フィールド
	if (elWpAdminFields) {
		elWpAdminFields.hidden = !elWpAdminBasicAuth?.checked;
	}
	if (elAdminHtpasswdHint) {
		elAdminHtpasswdHint.hidden = !(elWpAdminBasicAuth?.checked && !isValidHtpasswdPath(elAdminHtpasswdPath?.value ?? ''));
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

	// preload ON かつ max-age < 31536000 の場合は警告表示
	if (elHstsPreloadWarn) {
		const preloadOn = elHstsPreload?.checked ?? false;
		const maxAge = Number(elHstsMaxAge?.value ?? DEFAULT_SETTINGS.headers.hstsMaxAge);
		elHstsPreloadWarn.hidden = !(preloadOn && maxAge < 31536000);
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
	if (!text || elPreviewCode?.hasAttribute('data-empty')) return;

	try {
		await navigator.clipboard.writeText(text);
		if (elCopyBtn) {
			elCopyBtn.textContent = t('btn.copied');
			elCopyBtn.classList.add('copied');
			setTimeout(() => {
				elCopyBtn.textContent = t('btn.copy');
				elCopyBtn.classList.remove('copied');
			}, 2000);
		}
	} catch {
		if (elCopyBtn) {
			elCopyBtn.textContent = t('btn.copyFail');
			setTimeout(() => {
				elCopyBtn.textContent = t('btn.copy');
			}, 2000);
		}
	}
};

// ─── ダウンロード ─────────────────────────────────────────────────

const handleDownload = () => {
	const text = elPreviewCode?.textContent ?? '';
	if (!text || elPreviewCode?.hasAttribute('data-empty')) return;

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
		btn.dataset.i18n = `preset.${preset.id}.label`;
		btn.dataset.i18nAriaLabel = `preset.${preset.id}.desc`;
		btn.textContent = t(`preset.${preset.id}.label`);
		btn.setAttribute('aria-label', t(`preset.${preset.id}.desc`));
		btn.addEventListener('click', () => applyPreset(preset.id));
		elPresetGroup?.appendChild(btn);
	});

	// リセットボタン
	const resetBtn = document.createElement('button');
	resetBtn.type = 'button';
	resetBtn.className = 'preset-btn preset-reset-btn';
	resetBtn.dataset.i18n = 'preset.reset.label';
	resetBtn.dataset.i18nAriaLabel = 'preset.reset.desc';
	resetBtn.textContent = t('preset.reset.label');
	resetBtn.setAttribute('aria-label', t('preset.reset.desc'));
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
			bbSubEls.forEach((el) => {
				if (el) el.checked = DEFAULT_SETTINGS.rewrite[el.name] ?? true;
			});
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
	// メイントグルを ON にしたとき → サブ機能をデフォルト値にリセット（詰み状態の回避）
	// ※ ppGeolocation は <select> のため checkbox 群とは別に処理する
	const ppCheckboxEls = [elPpCamera, elPpMicrophone, elPpPayment, elPpUsb, elPpGyroscope, elPpMagnetometer, elPpAccelerometer, elPpFullscreen, elPpAutoplay, elPpClipboardRead, elPpClipboardWrite, elPpPictureInPicture, elPpScreenWakeLock, elPpWebShare];
	const isPpAnyEnabled = () =>
		ppCheckboxEls.some((el) => el?.checked) || ((elPpGeolocation?.value ?? 'off') !== 'off');
	elPermissionsPolicy?.addEventListener('change', () => {
		if (elPermissionsPolicy.checked) {
			ppCheckboxEls.forEach((el) => {
				if (el) el.checked = DEFAULT_SETTINGS.headers[el.name] ?? true;
			});
			if (elPpGeolocation) elPpGeolocation.value = DEFAULT_SETTINGS.headers.ppGeolocation ?? 'deny';
			updatePreview();
		}
	});
	ppCheckboxEls.forEach((cb) => {
		cb?.addEventListener('change', () => {
			if (!isPpAnyEnabled() && elPermissionsPolicy) {
				elPermissionsPolicy.checked = false;
				updateConditionalFields();
				updatePreview();
			}
		});
	});
	elPpGeolocation?.addEventListener('change', () => {
		if (!isPpAnyEnabled() && elPermissionsPolicy) {
			elPermissionsPolicy.checked = false;
			updateConditionalFields();
		}
		updatePreview();
		clearPresetActiveState();
	});

	// HSTS max-age セレクトの change イベント
	elHstsMaxAge?.addEventListener('change', () => {
		updateConditionalFields();
		updatePreview();
		clearPresetActiveState();
	});

	// Expires ラジオボタンの change イベントでプレビュー更新
	const expiresRadios = document.querySelectorAll('[name="expiresScript"], [name="expiresImage"], [name="expiresIcon"], [name="expiresVideo"], [name="expiresFont"], [name="expiresFeed"], [name="expiresDefault"]');
	expiresRadios.forEach((radio) => {
		radio.addEventListener('change', () => {
			updatePreview();
			clearPresetActiveState();
		});
	});

	// Cache-Control max-age ラジオボタンの change イベントでプレビュー更新
	const ccRadios = document.querySelectorAll('[name="ccScript"], [name="ccImage"], [name="ccFont"], [name="ccVideo"]');
	ccRadios.forEach((radio) => {
		radio.addEventListener('change', () => {
			updatePreview();
			clearPresetActiveState();
		});
	});

	// Apache バージョン ラジオボタンの change イベントでプレビュー更新
	document.querySelectorAll('[name="apacheVersion"]').forEach((radio) => {
		radio.addEventListener('change', () => {
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
	setupThemeToggle(t);

	// ハンバーガーナビ — 開閉 / Esc / 外クリックで閉じる
	const hamburgerBtn = document.querySelector('.hamburger-btn');
	const siteNav = document.querySelector('.site-nav');
	if (hamburgerBtn && siteNav) {
		const setOpen = (val) => {
			hamburgerBtn.setAttribute('aria-expanded', String(val));
			hamburgerBtn.setAttribute('aria-label', val ? t('nav.close') : t('nav.open'));
			if (val) {
				siteNav.removeAttribute('hidden');
				document.body.style.overflow = 'hidden';
			} else {
				siteNav.setAttribute('hidden', '');
				document.body.style.overflow = '';
			}
		};
		// 初期状態の aria-label を現在の言語で同期する
		setOpen(hamburgerBtn.getAttribute('aria-expanded') === 'true');
		hamburgerBtn.addEventListener('click', () => {
			setOpen(hamburgerBtn.getAttribute('aria-expanded') !== 'true');
		});
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && hamburgerBtn.getAttribute('aria-expanded') === 'true') {
				e.preventDefault();
				setOpen(false);
				hamburgerBtn.focus();
			}
		});
		siteNav.addEventListener('click', (e) => {
			if (!e.target.closest('.site-nav-card')) {
				setOpen(false);
				hamburgerBtn.focus();
			}
		});
	}
};

// ─── 言語切り替えボタン ────────────────────────────────────────

const initLangToggle = () => {
	const langBtn = document.querySelector('.lang-toggle-btn');
	if (!langBtn) return;

	langBtn.addEventListener('click', async () => {
		const newLang = getLang() === 'ja' ? 'en' : 'ja';
		await setLang(newLang);
		// 言語切り替え後にテーマボタン・ハンバーガーラベルを更新
		const isDark = document.documentElement.getAttribute('data-theme') === DARK_THEME;
		applyTheme(isDark, t);
		const hamburgerBtn = document.querySelector('.hamburger-btn');
		if (hamburgerBtn) {
			const isOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
			hamburgerBtn.setAttribute('aria-label', isOpen ? t('nav.close') : t('nav.open'));
		}
		updatePreview();
	});
};

// ─── 起動 ─────────────────────────────────────────────────────

(async () => {
	initTheme();
	await initLang();
	// initLang() 完了後、現在の言語でテーマボタンラベルを同期する
	applyTheme(document.documentElement.getAttribute('data-theme') === DARK_THEME, t);
	initPresets();
	initEvents();
	initLangToggle();
	updateConditionalFields();
	updatePreview();

	// フッター年の動的更新
	const elFooterYear = document.getElementById('footer-year');
	if (elFooterYear) {
		elFooterYear.textContent = new Date().getFullYear();
	}
})();
