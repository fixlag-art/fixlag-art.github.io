// 左ナビ＆サブナビ：現在地ハイライト（/ を特別扱いして誤判定を防ぐ）
(function(){
  const hereRaw = location.pathname;
  // 末尾スラッシュを取り、空になったら "/" に戻す
  const here = (hereRaw.replace(/\/+$/,'') || '/').toLowerCase();

  document.querySelectorAll('.sidenav a, .subnav a').forEach(a=>{
    const href = a.getAttribute('href');
    const pRaw = new URL(href, location.origin).pathname;
    const pNorm = pRaw.replace(/\/+$/,'');
    const p = (pNorm || '/').toLowerCase();

    let active = false;
    if (p === '/') {
      // ルートはルートのときだけ
      active = (here === '/');
    } else {
      // それ以外は「完全一致」か「配下パス」のとき
      active = (here === p) || here.startsWith(p + '/');
    }
    if (active) a.classList.add('active');
  });
})();

// 初回表示：現在地(=active)に自動フォーカス
const firstActive = document.querySelector('.sidenav a.active') || document.querySelector('.sidenav a');
if (firstActive) firstActive.focus({ preventScroll: true });
