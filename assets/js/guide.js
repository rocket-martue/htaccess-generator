/**
 * guide.js — ガイドページ用エントリーポイント
 *
 * テーマの初期化・切り替えボタンのイベント登録を行う。
 */

import { initTheme, setupThemeToggle } from './theme.js';

initTheme();
setupThemeToggle();

// フッター年の動的更新
const elFooterYear = document.getElementById('footer-year');
if (elFooterYear) {
	elFooterYear.textContent = new Date().getFullYear();
}
