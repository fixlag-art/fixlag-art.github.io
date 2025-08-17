/* =========================================================
 * FIXLAG.ART common.js
 * - サブナビ生成
 * - 共通フッター描画（明示呼び出し専用）
 * ========================================================= */
(() => {
  // ===== 重複ロード検知 =====
  if (window.__fxCommonLoaded) {
    console.error('[fx] common.js loaded more than once. Check duplicate <script src="/assets/common.js"> in your HTML.');
  }
  window.__fxCommonLoaded = true;

  // ===== 公開APIオブジェクト =====
  window.FX = window.FX || {};

  /* ---------------------------------------------------------
   * Subnav Generator
   * - HTML 側に <nav class="subnav" data-base="/foo/"></nav>
   * - 直後に <script id="subnav-data" type="application/json">[...]</script>
   *   を置くと、自動でリンクリストを展開する
   * --------------------------------------------------------- */
  FX.renderSubnav = function renderSubnav() {
    const nav = document.querySelector('nav.subnav');
    const script = document.getElementById('subnav-data');
    if (!nav || !script) return;

    let items = [];
    try {
      items = JSON.parse(script.textContent);
    } catch (e) {
      console.error('[fx] subnav-data JSON parse error', e);
      return;
    }
    const base = nav.dataset.base || '/';
    const html = items.map(([label, href]) => {
      const url = href.startsWith('/') ? href : base + href;
      const active = (location.pathname === url.replace(/\/+$/, '/')) ? ' class="active"' : '';
      return `<a href="${url}"${active}>${label}</a>`;
    }).join('');
    nav.innerHTML = html;
  };

  /* ---------------------------------------------------------
   * Footer Renderer (explicit opt-in)
   * - HTML 側に <div id="site-footer"></div> を置く
   * - ページ末尾で FX.renderFooter('#site-footer') を呼ぶ
   * --------------------------------------------------------- */
  FX.renderFooter = function renderFooter(target = '#site-footer') {
    const host = document.querySelector(target);
    if (!host) {
      console.error(`[fx] footer target not found: ${target}`);
      return;
    }
    if (host.dataset.rendered === '1') {
      console.error('[fx] footer already rendered on this element.');
      return;
    }

    const box = document.createElement('section');
    box.id = 'site-footer';
    box.className = 'card';
    box.style.margin = '12px 0';
    box.style.background = 'var(--bg-muted)';
    box.style.padding = '0.8rem 1rem';

    box.innerHTML = `
      <h3 style="margin:.2rem 0 .6rem;">Notice</h3>
      <ul style="margin:0; padding-left:1.2rem; font-size:0.9rem; line-height:1.5;">
        <li>This site uses Google Analytics (GA4) for traffic measurement. Cookies may be used.<br>
            本サイトは統計分析のため GA4 を利用します。Cookie を利用し、取得データは集計処理でサイト改善のみに用います。</li>
        <li>Cookies may be used to remember preferences and analyse traffic.<br>
            サイト設定の記憶やトラフィック解析のために Cookie を使用する場合があります。</li>
        <li>Materials are presented for educational/cultural purposes.<br>
            本サイト内の資料は教育・文化目的で公開されています。必要に応じてプライバシーに関する注意をご確認ください。</li>
        <li>Unauthorised reproduction is discouraged. All marks belong to their respective owners.<br>
            無断転載はご遠慮ください。各商標はそれぞれの権利者に帰属します。</li>
      </ul>
      <p style="margin:.6rem 0; color:var(--muted); font-size:0.85rem;">© FIXLAG.ART</p>
    `;

    host.replaceWith(box);
    box.dataset.rendered = '1';
  };

  // ===== DOM Ready時に自動でサブナビ展開 =====
  document.addEventListener('DOMContentLoaded', () => {
    FX.renderSubnav();
  });
})();
