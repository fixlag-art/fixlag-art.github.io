// design.js — ハンバーガー / ドロワー制御（縦帯の一時表示）
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.sidenav-overlay');
  const sidenav = document.querySelector('.sidenav');

  function open()  { document.body.classList.add('is-drawer-open'); }
  function close() { document.body.classList.remove('is-drawer-open'); }

  if (toggle) toggle.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.toggle('is-drawer-open');
  });

  if (overlay) overlay.addEventListener('click', close);

  // サイドナビ内のクリックで閉じる（遷移も可）
  if (sidenav) {
    sidenav.addEventListener('click', (ev) => {
      const a = ev.target.closest('a');
      if (a) close();
    });
  }

  // ESC で閉じる
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') close();
  });
})();
