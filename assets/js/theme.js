/**
 * theme.js — テーマ切り替え共通モジュール
 *
 * ライト / ダークテーマの初期化・切り替え処理を提供する。
 * ジェネレーターページ・ガイドページの両方から利用する。
 */

const THEME_STORAGE_KEY = 'htaccess-theme';
const DARK_THEME = 'dark';

/**
 * テーマの適用（DOM 属性 + ボタン状態の更新）
 * @param {boolean} isDark
 * @param {Function|null} t 翻訳関数（省略時は日本語固定）
 */
const applyTheme = (isDark, t = null) => {
	if (isDark) {
		document.documentElement.setAttribute('data-theme', DARK_THEME);
	} else {
		document.documentElement.removeAttribute('data-theme');
	}

	const btn = document.querySelector('.theme-toggle-btn');
	if (!btn) return;
	btn.setAttribute('aria-label', isDark
		? (t ? t('theme.light') : 'ライトモードに切り替え')
		: (t ? t('theme.dark') : 'ダークモードに切り替え'));
	btn.setAttribute('aria-pressed', String(isDark));
	const icon = btn.querySelector('.theme-toggle-icon');
	const label = btn.querySelector('.theme-toggle-label');
	if (icon) icon.textContent = isDark ? '☀️' : '🌙';
	if (label) label.textContent = isDark
		? (t ? t('theme.light.label') : 'ライト')
		: (t ? t('theme.dark.label') : 'ダーク');
};

/**
 * localStorage からテーマを復元して適用
 */
const initTheme = () => {
	let stored = null;
	try {
		stored = localStorage.getItem(THEME_STORAGE_KEY);
	} catch (e) {
		// localStorage 利用不可の場合はデフォルト（ライト）を使用
	}
	applyTheme(stored === DARK_THEME);
};

/**
 * テーマ切り替えボタンにイベントを登録
 * @param {Function|null} t 翻訳関数（省略時は日本語固定）
 */
const setupThemeToggle = (t = null) => {
	document.querySelector('.theme-toggle-btn')?.addEventListener('click', () => {
		const isDark = document.documentElement.getAttribute('data-theme') !== DARK_THEME;
		try {
			localStorage.setItem(THEME_STORAGE_KEY, isDark ? DARK_THEME : 'light');
		} catch (e) {
			// localStorage 利用不可の場合は非永続で切り替えのみ実行
		}
		applyTheme(isDark, t);
	});
};

export { THEME_STORAGE_KEY, DARK_THEME, applyTheme, initTheme, setupThemeToggle };
