/**
 * guide.js — ガイドページ用エントリーポイント
 *
 * テーマの初期化・切り替えボタンのイベント登録を行う。
 */

import { initTheme, setupThemeToggle } from './theme.js';

initTheme();
setupThemeToggle();

// ハンバーガーナビ — 開閉 / Esc / 外クリックで閉じる
const hamburgerBtn = document.querySelector('.hamburger-btn');
const siteNav = document.querySelector('.site-nav');
if (hamburgerBtn && siteNav) {
	const setOpen = (val) => {
		hamburgerBtn.setAttribute('aria-expanded', String(val));
		hamburgerBtn.setAttribute('aria-label', val ? 'メニューを閉じる' : 'メニューを開く');
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
