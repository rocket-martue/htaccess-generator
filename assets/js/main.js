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

// IP Block
const elIpBlockEnabled = document.querySelector('[name="ipBlockEnabled"]');
const elIpBlockList = document.querySelector('[name="ipBlockList"]');
const elIpBlockFields = document.querySelector('.ip-block-fields');

// Rewrite
const elNormalizeSlashes = document.querySelector('[name="normalizeSlashes"]');
const elBlockBadBots = document.querySelector('[name="blockBadBots"]');
const elBlockBackdoors = document.querySelector('[name="blockBackdoors"]');
const elBlockWpNesting = document.querySelector('[name="blockWpNesting"]');
const elBlockWpIncludesDir = document.querySelector('[name="blockWpIncludesDir"]');
const elHttpsRedirect = document.querySelector('[name="httpsRedirect"]');
const elXForwardedProto = document.querySelector('[name="xForwardedProto"]');
const elBlockBadQuery = document.querySelector('[name="blockBadQuery"]');

// Cache
const elGzip = document.querySelector('[name="gzip"]');
const elExpires = document.querySelector('[name="expires"]');
const elCacheControl = document.querySelector('[name="cacheControl"]');
const elEtagDisable = document.querySelector('[name="etagDisable"]');
const elMimeType = document.querySelector('[name="mimeType"]');


// Headers
const elHstsEnabled = document.querySelector('[name="hstsEnabled"]');
const elHstsIncludeSubDomains = document.querySelector('[name="hstsIncludeSubDomains"]');
const elHstsPreload = document.querySelector('[name="hstsPreload"]');
const elHstsSubFields = document.querySelector('.hsts-sub-fields');

const elCspEnabled = document.querySelector('[name="cspEnabled"]');
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
		cacheControl: elCacheControl?.checked ?? false,
		etagDisable: elEtagDisable?.checked ?? false,
		mimeType: elMimeType?.checked ?? false,

	},
	headers: {
		hstsEnabled: elHstsEnabled?.checked ?? false,
		hstsIncludeSubDomains: elHstsIncludeSubDomains?.checked ?? true,
		hstsPreload: elHstsPreload?.checked ?? true,

		cspEnabled: elCspEnabled?.checked ?? false,

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
	if (elBlockBackdoors) elBlockBackdoors.checked = settings.rewrite.blockBackdoors;
	if (elBlockWpNesting) elBlockWpNesting.checked = settings.rewrite.blockWpNesting;
	if (elBlockWpIncludesDir) elBlockWpIncludesDir.checked = settings.rewrite.blockWpIncludesDir;
	if (elHttpsRedirect) elHttpsRedirect.checked = settings.rewrite.httpsRedirect;
	if (elXForwardedProto) elXForwardedProto.checked = settings.rewrite.xForwardedProto;
	if (elBlockBadQuery) elBlockBadQuery.checked = settings.rewrite.blockBadQuery;

	// Cache
	if (elGzip) elGzip.checked = settings.cache.gzip;
	if (elExpires) elExpires.checked = settings.cache.expires;
	if (elCacheControl) elCacheControl.checked = settings.cache.cacheControl;
	if (elEtagDisable) elEtagDisable.checked = settings.cache.etagDisable;
	if (elMimeType) elMimeType.checked = settings.cache.mimeType;


	// Headers
	if (elHstsEnabled) elHstsEnabled.checked = settings.headers.hstsEnabled;
	if (elHstsIncludeSubDomains) elHstsIncludeSubDomains.checked = settings.headers.hstsIncludeSubDomains;
	if (elHstsPreload) elHstsPreload.checked = settings.headers.hstsPreload;
	if (elCspEnabled) elCspEnabled.checked = settings.headers.cspEnabled;
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

	// IP ブロックフィールド
	if (elIpBlockFields) {
		elIpBlockFields.hidden = !elIpBlockEnabled?.checked;
	}

	// wp-admin フィールド
	if (elWpAdminFields) {
		elWpAdminFields.hidden = !elWpAdminBasicAuth?.checked;
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

	// Permissions-Policy：サブ機能が全 OFF → メイントグルを自動で OFF に
	const ppSubEls = [elPpCamera, elPpMicrophone, elPpPayment, elPpUsb, elPpGyroscope, elPpMagnetometer, elPpGeolocation];
	ppSubEls.forEach((cb) => {
		cb?.addEventListener('change', () => {
			if (!ppSubEls.some((el) => el?.checked) && elPermissionsPolicy) {
				elPermissionsPolicy.checked = false;
				updateConditionalFields();
				updatePreview();
			}
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
		input.addEventListener('input', updatePreview);
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
