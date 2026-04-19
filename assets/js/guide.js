/**
 * guide.js — ガイドページ用エントリーポイント
 *
 * テーマの初期化・切り替えボタンのイベント登録を行う。
 */

import { initTheme, setupThemeToggle, applyTheme, DARK_THEME } from './theme.js';
import { messagesJa, messagesEn } from './i18n-messages.js';

const lang = document.documentElement.lang === 'en' ? 'en' : 'ja';
const messages = lang === 'en' ? messagesEn : messagesJa;
const t = (key) => messages[key] ?? key;

(() => {
	initTheme();

	const currentIsDark = document.documentElement.getAttribute('data-theme') === DARK_THEME;
	applyTheme(currentIsDark, t);
	setupThemeToggle(t);

	// ハンバーガーナビ — 開閉 / Esc / 外クリックで閉じる
	const hamburgerBtn = document.querySelector('.hamburger-btn');
	const siteNav = document.querySelector('.site-nav');
	if (hamburgerBtn && siteNav) {
		// 初期 aria-label を正しい言語で設定する
		const isOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
		hamburgerBtn.setAttribute('aria-label', isOpen ? t('nav.close') : t('nav.open'));

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

	// フッター年の動的更新
	const elFooterYear = document.getElementById('footer-year');
	if (elFooterYear) {
		elFooterYear.textContent = new Date().getFullYear();
	}
})();
