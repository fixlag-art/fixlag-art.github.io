/* design.js — site-wide UI renderer (sidenav, subnav, headings, footer) */
(function () {
  if (window.__designInjected__) return;
  window.__designInjected__ = true;

  // ---- Site config (編集はここだけでも運用できる) ----
  const SITE = {
    title: 'FIXLAG.ART',
    nav: [                       // 縦帯（左メニュー）の順序とリンク
      ['Nexus', '/'],
      ['Sonic', '/sonic/'],
      ['Relic', '/relic/'],
      ['Velox', '/velox/'],
      ['Gizmo', '/gizmo/'],
    ],
  };

  // ---- helpers ----
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, attrs = {}, html = '') => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') n.className = v;
      else if (k === 'style' && typeof v === 'object')
        Object.assign(n.style, v);
      else n.setAttribute(k, v);
    }
    if (html) n.innerHTML = html;
    return n;
  };

  // ---- read per-page config ----
  function readPageData() {
    const node = $('#page-data[type="application/json"]');
    if (!node) return {};
    try { return JSON.parse(node.textContent || '{}'); }
    catch { return {}; }
  }

  // ---- renderers ----
  function renderSidenav(container) {
    if (!container) return;
    const nav = el('nav', { class: 'sidenav', 'aria-label': 'Global' });
    nav.append(el('div', { class: 'logo' }, SITE.title));
    SITE.nav.forEach(([label, href]) => {
      const a = el('a', { href }, label);
      if (location.pathname === href ||
          (href !== '/' && location.pathname.startsWith(href))) {
        a.classList.add('active');
      }
      nav.append(a);
    });
    nav.append(el('div', { class: 'sep' }));
    container.replaceChildren(nav);
  }

  function renderSubnav(container, base, items) {
    if (!container) return;
    const nav = el('nav', { class: 'subnav', 'aria-label': 'Section', 'data-base': base || '/' });
    // items: [["Top","/"],["About","/about/"]]
    (items || []).forEach(([label, href]) => {
      const a = el('a', { href }, label);
      const isActive = (href === '/' ? location.pathname === '/' : location.pathname === href);
      if (isActive) a.classList.add('active');
      nav.append(a);
    });
    container.replaceChildren(nav);
  }

  function renderHeading(container, title, leadEn, leadJa) {
    if (!container) return;
    const article = el('article', { class: 'page' });
    if (title) article.append(el('h1', { style: 'margin:6px 0 12px' }, title));
    if (leadEn || leadJa) {
      const card = el('div', { class: 'card', style: 'margin-bottom:12px' });
      if (leadEn) card.append(el('p', { class: 'lead', style: 'margin:.2rem 0 .6rem' }, leadEn));
      if (leadJa) card.append(el('p', { style: 'margin:.6rem 0' }, leadJa));
      article.append(card);
    }
    container.prepend(article); // 見出しを本文の先頭に
  }

  function renderFooter(container, flags = { notice: 'on', copyright: 'on' }) {
    if (!container) return;
    const host = $('#site-footer') || el('div', { id: 'site-footer' });
    host.className = 'site-footer card';
    host.style.margin = '0';
    host.style.padding = '12px';
    host.style.background = 'var(--bg-soft)';
    host.style.borderTop = '1px solid var(--border)';

    const items = [];
    if (flags.notice !== 'off') {
      items.push(`
        <h3 class="site-notice" style="margin:0 0 .6rem;line-height:1.5">Notice</h3>
        <ul class="site-notice" style="margin:0;padding-left:1.2em;line-height:1.5">
          <li>This site uses Google Analytics (GA4) for traffic measurement. Cookies may be used.</li>
          <li>本サイトは統計分析のため GA4 を利用します。Cookie を利用し、 取得データは統計処理でサイト改善のみに用います。</li>
          <li>Cookies may be used to remember preferences and analyse traffic.<br>サイト設定の記憶やトラフィック解析のために Cookie を使用する場合があります。</li>
          <li>Materials are presented for educational/cultural purposes.<br>本サイト内の資料は教育・文化目的で公開しています。必要に応じてプライバシーに関する注意をご確認ください。</li>
          <li>Unauthorised reproduction is discouraged. All marks belong to their respective owners.<br>無断転載はご遠慮ください。各商標はそれぞれの権利者に帰属します。</li>
        </ul>
      `);
    }
    if (flags.copyright !== 'off') {
      items.push(`<p style="margin:.6rem 0;color:var(--muted)">© FIXLAG.ART</p>`);
    }
    host.innerHTML = items.join('');
    container.append(host);
  }

  // ---- boot ----
  function boot() {
    const page = readPageData();

    // 1) 縦帯
    let sideHost = $('.sidenav-host');
    if (!sideHost) {
      // 既存の .sidenav があれば包む／無ければ layout に追加
      const layout = $('.layout') || document.body;
      sideHost = el('div', { class: 'sidenav-host' });
      layout.prepend(sideHost);
    }
    renderSidenav(sideHost);

    // 2) 横帯
    if (page.subnav) {
      let subHost = $('.subnav-host');
      if (!subHost) {
        subHost = el('div', { class: 'subnav-host' });
        const content = $('.content') || $('.layout') || document.body;
        content.prepend(subHost);
      }
      renderSubnav(subHost, page.base || '/', page.subnav || []);
    }

    // 3) 見出し＋リード
    if (page.title || page.lead_en || page.lead_ja) {
      const content = $('.content') || $('.layout') || document.body;
      renderHeading(content, page.title, page.lead_en, page.lead_ja);
    }

    // 4) フッター
    const content = $('.content') || document.body;
    renderFooter(content, page.footer || { notice: 'on', copyright: 'on' });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

(function () {
  /**
   * モバイルでサブナビを開閉式にする
   * - nav.subnav があれば自動適用
   * - data-collapsible="off" が付いている場合は無効
   */
  function setupMobileSubnav() {
    const nav = document.querySelector('.subnav');
    if (!nav) return;
    if (nav.getAttribute('data-collapsible') === 'off') return;

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    // 初期化は1回だけ
    if (nav.dataset.enhanced === '1') return;
    nav.dataset.enhanced = '1';

    // 最初のリンク（= Top 想定）
    const firstLink = nav.querySelector('a');
    if (!firstLink) return;

    // 既に caret 済みならスキップ
    if (!firstLink.querySelector('.subnav-caret')) {
      // ▼/▲ の開閉ボタンを Top ピルの右に追加（押すと開閉、Top ラベル自体は遷移）
      const caret = document.createElement('button');
      caret.type = 'button';
      caret.className = 'subnav-caret';
      caret.setAttribute('aria-expanded', 'false');
      caret.title = 'Show/Hide';
      caret.textContent = '▾';
      firstLink.appendChild(caret);

      caret.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const open = nav.classList.toggle('is-open');
        nav.classList.toggle('is-collapsed', !open);
        caret.setAttribute('aria-expanded', String(open));
        caret.textContent = open ? '▴' : '▾';
      });
    }

    // モバイル初期状態：閉じる
    function applyState() {
      if (isMobile()) {
        nav.classList.add('is-collapsed');
        nav.classList.remove('is-open');
        const caret = nav.querySelector('.subnav-caret');
        if (caret) {
          caret.setAttribute('aria-expanded', 'false');
          caret.textContent = '▾';
        }
      } else {
        // PC は常に展開
        nav.classList.remove('is-collapsed');
        nav.classList.remove('is-open');
      }
    }

    applyState();
    window.addEventListener('resize', applyState);
  }

  // DOM 準備後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileSubnav);
  } else {
    setupMobileSubnav();
  }
})();
