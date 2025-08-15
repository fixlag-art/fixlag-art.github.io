// 共通サブナビ生成（各ページの <script id="subnav-data"> からリンクを作る）
(function () {
  const el = document.querySelector('nav.subnav[data-base]');
  const dataEl = document.querySelector('#subnav-data');
  if (!el || !dataEl) return;

  // JSON: [ ["ラベル", "パス"], ... ] を想定
  let items = [];
  try { items = JSON.parse(dataEl.textContent.trim()); } catch { return; }

  const base = el.getAttribute('data-base') || '/';
  const frag = document.createDocumentFragment();

  items.forEach(([label, path]) => {
    const a = document.createElement('a');
    a.className = 'chip';
    // base と path を結合（絶対/相対どちらでもOK）
    a.href = new URL(path, location.origin + base).pathname;
    a.textContent = label;
    frag.appendChild(a);
  });

  // 生成して挿入
  el.appendChild(frag);

  // --- 現在地ハイライト（common.jsに依存せず自前でも付与） ---
  const hereRaw = location.pathname;
  const here = (hereRaw.replace(/\/+$/, '') || '/').toLowerCase();

  el.querySelectorAll('a.chip').forEach(a => {
    const pRaw = new URL(a.getAttribute('href'), location.origin).pathname;
    const pNorm = pRaw.replace(/\/+$/, '');
    const p = (pNorm || '/').toLowerCase();

    let active = false;
    if (p === '/') active = (here === '/');
    else active = (here === p) || here.startsWith(p + '/');

    if (active) a.classList.add('active');
  });
})();
