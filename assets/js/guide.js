/**
 * guide.js — ガイドページ用エントリーポイント
 *
 * テーマの初期化・切り替えボタンのイベント登録・i18n 対応を行う。
 */

import { initTheme, setupThemeToggle, applyTheme } from './theme.js';
import { initLang, getLang, setLang, applyTranslations, t } from './i18n.js';

/**
 * lang-block の表示 / 非表示を現在の言語に合わせて切り替える
 */
const applyLangBlocks = () => {
	const lang = getLang();
	document.querySelectorAll('.lang-block').forEach((el) => {
		el.dataset.lang === lang
			? el.removeAttribute('hidden')
			: el.setAttribute('hidden', '');
	});
};

(async () => {
	initTheme();
	await initLang();
	applyLangBlocks();
	setupThemeToggle(t);

	// lang toggle ボタン
	const langToggleBtn = document.querySelector('.lang-toggle-btn');
	if (langToggleBtn) {
		langToggleBtn.addEventListener('click', async () => {
			const currentIsDark = document.documentElement.dataset.theme === 'dark';
			const next = getLang() === 'ja' ? 'en' : 'ja';
			await setLang(next);
			applyLangBlocks();
			applyTheme(currentIsDark, t);

			// ハンバーガーの aria-label を更新
			const hamburgerBtn = document.querySelector('.hamburger-btn');
			if (hamburgerBtn) {
				const isOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
				hamburgerBtn.setAttribute('aria-label', isOpen ? t('nav.close') : t('nav.open'));
			}
		});
	}

	// ハンバーガーナビ — 開閉 / Esc / 外クリックで閉じる
	const hamburgerBtn = document.querySelector('.hamburger-btn');
	const siteNav = document.querySelector('.site-nav');
	if (hamburgerBtn && siteNav) {
		// initLang() 完了後に初期 aria-label を正しい言語で設定する
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
