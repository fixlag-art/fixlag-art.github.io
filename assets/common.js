/* =========================================================
 * FIXLAG.ART common.js  (single source of truth)
 * v1.0-clean
 * - Subnav generator (#subnav-data)
 * - Current location highlight (left & subnav)
 * - Footer render (explicit via #site-footer)
 * - GA4 loader (only when data-ga="on")
 * ======================================================= */

(() => {
  // ---------- utils ----------
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const norm = p => { const x=(p||'').replace(/\/+$/,''); return x ? x.toLowerCase() : '/'; };
  const GA_ID = 'G-5FRL9XB7JS';

  // ---------- subnav ----------
  function renderSubnav(){
    const host = $('.subnav');
    const data = $('#subnav-data');
    if (!host || !data) return;
    let items = [];
    try { items = JSON.parse(data.textContent||'[]'); } catch(e){ console.error('[subnav] JSON parse error', e); return; }
    host.innerHTML = items.map(([label, href]) => `<a href="${href}">${label}</a>`).join('');
  }

  // ---------- highlight (left & subnav) ----------
  function highlight(anchors){
    const here = norm(location.pathname);
    anchors.forEach(a=>{
      const href = a.getAttribute('href')||'';
      const p = norm(new URL(href, location.origin).pathname);
      const active = (p === '/') ? (here === '/') : (here === p || here.startsWith(p + '/'));
      a.classList.toggle('active', active);
    });
  }

  // ---------- footer (explicit via #site-footer) ----------
  function buildFooterHTML(flags){
    const out = [];
    if ((flags.notice||'on') !== 'off'){
      out.push(`
        <h3 style="margin:.2rem 0 .6rem">Notice</h3>
        <ul class="site-notice" style="margin:0;padding-left:1.2em;line-height:1.5;">
          <li>This site uses Google Analytics (GA4) for traffic measurement. Cookies may be used.<br>
              本サイトは統計分析のため GA4 を利用します。Cookie を利用し、取得データは統計処理でサイト改善のみに用います。</li>
          <li>Cookies may be used to remember preferences and analyse traffic.<br>
              サイト設定の記憶やトラフィック解析のために Cookie を使用する場合があります。</li>
          <li>Materials are presented for educational/cultural purposes.<br>
              本サイト内の資料は教育・文化目的で公開しています。必要に応じてプライバシーに関する注意をご確認ください。</li>
          <li>Unauthorised reproduction is discouraged. All marks belong to their respective owners.<br>
              無断転載はご遠慮ください。各商標はそれぞれの権利者に帰属します。</li>
        </ul>
      `);
    }
    if ((flags.copyright||'on') !== 'off'){
      out.push(`<p style="margin:.6rem 0;color:var(--muted)">© FIXLAG.ART</p>`);
    }
    return out.join('');
  }

  function loadGA4Once(){
    if (window.__gaLoaded || !GA_ID) return;
    window.__gaLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    s.setAttribute('data-ga4','true');
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { transport_type:'beacon', anonymize_ip:true });
  }

  function renderFooterIfRequested(){
    const host = $('#site-footer');            // ← ここを唯一の前提に統一
    if (!host) return;                         // 明示がないページは何もしない
    if (host.dataset.rendered === '1') return; // 二重描画はしない（静かに無視）

    const flags = {
      notice:    (host.dataset.notice    || 'on').toLowerCase(),
      copyright: (host.dataset.copyright || 'on').toLowerCase(),
      ga:        (host.dataset.ga        || 'on').toLowerCase(),
    };

    host.classList.add('card');
    host.style.margin = '12px 0';
    host.innerHTML = buildFooterHTML(flags);
    host.dataset.rendered = '1';

    if (flags.ga !== 'off') loadGA4Once();
  }

  // ---------- boot ----------
  const run = () => {
    renderSubnav();
    highlight($$('.sidenav a'));
    highlight($$('.subnav a'));
    renderFooterIfRequested();

    // 初回フォーカス（スクロールさせない）
    const first = $('.sidenav a.active') || $('.sidenav a');
    first?.focus?.({ preventScroll:true });

    console.debug('[common.js v1.0-clean] loaded');
  };

  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', run, { once:true })
    : run();
})();
/* === Favicons (global inject) =============================== */
(function injectFavicons() {
  const ICON_BASE = "/assets/fixlag_favicons";
  const ICONS = [
    // 旧来ブラウザのデフォルト候補（sizes未指定）
    { rel: "icon", type: "image/png", sizes: "",       file: "favicon-32x32.png" },

    // 各種サイズ
    { rel: "icon", type: "image/png", sizes: "16x16",  file: "favicon-16x16.png" },
    { rel: "icon", type: "image/png", sizes: "32x32",  file: "favicon-32x32.png" },
    { rel: "icon", type: "image/png", sizes: "48x48",  file: "favicon-48x48.png" },
    { rel: "icon", type: "image/png", sizes: "64x64",  file: "favicon-64x64.png" },
    { rel: "icon", type: "image/png", sizes: "96x96",  file: "favicon-96x96.png" },
    { rel: "icon", type: "image/png", sizes: "128x128", file: "favicon-128x128.png" },
    { rel: "icon", type: "image/png", sizes: "180x180", file: "favicon-180x180.png" },
    { rel: "icon", type: "image/png", sizes: "192x192", file: "favicon-192x192.png" },
    { rel: "icon", type: "image/png", sizes: "256x256", file: "favicon-256x256.png" },
    { rel: "icon", type: "image/png", sizes: "512x512", file: "favicon-512x512.png" },

    // iOS「ホーム画面に追加」用
    { rel: "apple-touch-icon", sizes: "180x180", file: "favicon-180x180.png" },
  ];

  function alreadyHas(hrefTail) {
    const links = document.head.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]');
    return Array.from(links).some(l => (l.href || "").endsWith("/" + hrefTail));
  }

  function addLink({ rel, type, sizes, file }) {
    const href = `${ICON_BASE}/${file}`;
    if (alreadyHas(file)) return;
    const link = document.createElement("link");
    link.rel = rel;
    if (type)  link.type  = type;
    if (sizes) link.sizes = sizes;
    link.href = href;
    document.head.appendChild(link);
  }

  function run() { ICONS.forEach(addLink); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
