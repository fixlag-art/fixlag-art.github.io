// 左ナビ＆サブナビ：現在地ハイライト
(function(){
  const here = location.pathname.replace(/\/+$/,'').toLowerCase();
  document.querySelectorAll('.sidenav a, .subnav a').forEach(a=>{
    const p = new URL(a.getAttribute('href'), location.origin).pathname.replace(/\/+$/,'').toLowerCase();
    if(here === p || (p !== '/' && here.startsWith(p+'/'))) a.classList.add('active');
  });
})();
