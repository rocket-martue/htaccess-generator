/**
 * i18n.js — 多言語対応モジュール
 *
 * 翻訳の適用・言語切り替え・localStorage への言語設定保存を担う。
 * ロケールファイルは動的 import() の静的条件分岐形式で読み込む
 * （fetch() は connect-src: none に抵触するため使用禁止）。
 */

const LANG_STORAGE_KEY = 'htaccess-lang';

let currentLang = 'ja';
let translations = {};

/**
 * 翻訳キーに対応するテキストを返す
 * @param {string} key
 * @returns {string}
 */
export const t = (key) => translations[key] ?? key;

/**
 * 現在の言語コードを返す
 * @returns {string}
 */
export const getLang = () => currentLang;

/**
 * DOM 内の翻訳属性を持つ要素にテキストを適用する
 *
 * - data-i18n       → textContent
 * - data-i18n-html  → innerHTML（ロケールデータは信頼済みのため安全）
 * - data-i18n-aria-label → aria-label 属性
 */
export const applyTranslations = () => {
	document.querySelectorAll('[data-i18n]').forEach((el) => {
		el.textContent = t(el.dataset.i18n);
	});
	document.querySelectorAll('[data-i18n-html]').forEach((el) => {
		el.innerHTML = t(el.dataset.i18nHtml);
	});
	document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
		el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
	});
	document.documentElement.lang = currentLang;
};

/**
 * ロケールファイルを動的 import() で読み込む
 * テンプレートリテラルによる動的パスは CSP 判定が不安定なため、
 * 静的条件分岐形式で記述する
 * @param {string} lang
 * @returns {Promise<object>}
 */
const loadLocale = async (lang) => {
	const mod = lang === 'en'
		? await import('./locales/en.js')
		: await import('./locales/ja.js');
	return mod.default;
};

/**
 * 言語を切り替え、localStorage に保存して翻訳を適用する
 * @param {string} lang 'ja' | 'en'
 */
export const setLang = async (lang) => {
	if (lang !== 'ja' && lang !== 'en') return;
	translations = await loadLocale(lang);
	currentLang = lang;
	try {
		localStorage.setItem(LANG_STORAGE_KEY, lang);
	} catch (e) {
		// localStorage 利用不可の場合は無視
	}
	applyTranslations();
};

/**
 * localStorage / URL パラメータから言語を復元して初期化する
 */
export const initLang = async () => {
	let lang = 'ja';
	const params = new URLSearchParams(window.location.search);
	const urlLang = params.get('lang');
	if (urlLang === 'en' || urlLang === 'ja') {
		lang = urlLang;
	} else {
		try {
			const stored = localStorage.getItem(LANG_STORAGE_KEY);
			if (stored === 'en' || stored === 'ja') lang = stored;
		} catch (e) {
			// localStorage 利用不可の場合はデフォルト（ja）を使用
		}
	}
	await setLang(lang);
};
