/* =========================================================
 * common.js  (FIXLAG.ART)
 * - Subnav renderer
 * - Footer renderer (explicit opt-in via #footer)
 * - GA4 loader (dedup)
 * =======================================================*/
(() => {
  // ---------- Constants ----------
  const GA_ID = 'G-5FRL9XB7JS';            // GA4 Measurement ID
  const BRAND = 'FIXLAG.ART';

  // ---------- Small helpers ----------
  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const onReady = (fn) => {
    (document.readyState === 'loading')
      ? document.addEventListener('DOMContentLoaded', fn, { once: true })
      : fn();
  };

  // ======================================================
  // 1) Subnav renderer  (reads JSON from #subnav-data)
  //    <nav class="subnav" data-base="/about/"></nav>
  //    <script id="subnav-data" type="application/json">[["Top","/"],["About","/about/"]]</script>
  // ======================================================
  function renderSubnav() {
    const host = $('.subnav');
    if (!host) return;

    let items = [];
    try {
      const json = $('#subnav-data')?.textContent?.trim();
      items = json ? JSON.parse(json) : [];
    } catch (err) {
      console.error('[subnav] JSON parse error:', err);
      return;
    }

    // active 判定：data-base を prefix として使う
    const base = host.dataset.base || '';
    const html = items.map(([label, href]) => {
      const isActive = base && href.startsWith(base);
      return `<a href="${href}" class="${isActive ? 'active' : ''}">${label}</a>`;
    }).join('');

    host.innerHTML = html;
  }

  // ======================================================
  // 2) Footer renderer (explicit opt-in)
  //    置き場所：<div id="footer" data-notice="on|off" data-copyright="on|off" data-ga="on|off"></div>
  //    ・#footer が無ければ何もしない
  //    ・重複挿入ガード付き
  // ======================================================
  function buildFooterHTML(flags) {
    const items = [];

    if (flags.notice !== 'off') {
      items.push(`
        <h3 style="margin:.2rem 0 .6rem">Notice</h3>
        <ul class="site-notice" style="margin:0;padding-left:1.2em;line-height:1.5;">
          <li>This site uses Google Analytics (GA4) for traffic measurement. Cookies may be used.<br>
              本サイトは統計分析のため GA4 を利用します。Cookie を利用し、取得データは統計処理でサイト改善のみに用います。</li>
          <li>Cookies may be used to remember preferences and analyse traffic.<br>
              サイト設定の記憶やトラフィック解析のため Cookie を使用する場合があります。</li>
          <li>Materials are presented for educational/cultural purposes.<br>
              本サイト内の資料は教育・文化目的で公開しています。必要に応じてプライバシーに関する注意をご確認ください。</li>
          <li>Unauthorised reproduction is discouraged. All marks belong to their respective owners.<br>
              無断転載はご遠慮ください。各商標はそれぞれの権利者に帰属します。</li>
        </ul>
      `);
    }

    if (flags.copyright !== 'off') {
      items.push(`<p style="margin:.6rem 0;color:var(--muted)">© ${BRAND}</p>`);
    }

    return items.join('');
  }

  function renderFooter() {
    // 明示的に #footer がないページはスキップ
    const host = $('#footer');
    if (!host) return;

    // 多重挿入ガード
    if (window.__footerInjected) return;
    window.__footerInjected = true;

    // data-* フラグを読む（デフォルトは "on"）
    const flags = {
      notice:     (host.dataset.notice     || 'on').toLowerCase(),
      copyright:  (host.dataset.copyright  || 'on').toLowerCase(),
      ga:         (host.dataset.ga         || 'on').toLowerCase(),
    };

    // 見た目（共通カード）
    host.className = 'card';
    host.style.margin = '12px 0';
    host.style.background = 'var(--bg-muted)';
    host.style.padding = '0 .8rem 0';

    // 本文
    host.innerHTML = buildFooterHTML(flags);

    // 必要なら GA4 をロード
    if (flags.ga !== 'off') loadGA4();
  }

  // ======================================================
  // 3) GA4 loader (dedup)
  // ======================================================
  function loadGA4() {
    if (window.__gaLoaded || !GA_ID) return;
    window.__gaLoaded = true;

    // gtag.js を注入
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);

    // 初期化
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
      transport_type: 'beacon',
      anonymize_ip: true,
      // page_path は Workers リダイレクトでも自動解決されるため省略
    });
  }

  // ---------- Boot ----------
  onReady(() => {
    renderSubnav();
    renderFooter();
  });
})();
