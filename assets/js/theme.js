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
 */
const applyTheme = (isDark) => {
	if (isDark) {
		document.documentElement.setAttribute('data-theme', DARK_THEME);
	} else {
		document.documentElement.removeAttribute('data-theme');
	}

	const btn = document.querySelector('.theme-toggle-btn');
	if (!btn) return;
	btn.setAttribute('aria-label', isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え');
	btn.setAttribute('aria-pressed', String(isDark));
	const icon = btn.querySelector('.theme-toggle-icon');
	const label = btn.querySelector('.theme-toggle-label');
	if (icon) icon.textContent = isDark ? '☀️' : '🌙';
	if (label) label.textContent = isDark ? 'ライト' : 'ダーク';
};

/**
 * localStorage からテーマを復元して適用
 */
const initTheme = () => {
	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	const isDark = stored === DARK_THEME;
	applyTheme(isDark);
};

/**
 * テーマ切り替えボタンにイベントを登録
 */
const setupThemeToggle = () => {
	document.querySelector('.theme-toggle-btn')?.addEventListener('click', () => {
		const isDark = document.documentElement.getAttribute('data-theme') !== DARK_THEME;
		localStorage.setItem(THEME_STORAGE_KEY, isDark ? DARK_THEME : 'light');
		applyTheme(isDark);
	});
};

export { THEME_STORAGE_KEY, DARK_THEME, applyTheme, initTheme, setupThemeToggle };
