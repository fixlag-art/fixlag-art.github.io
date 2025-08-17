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

/* ===== Unified footer renderer (English → Japanese, toggle by per-page config) ===== */
(function(){
  // ① ページ側の設定を読む（無ければ既定ON/OFF）
  //   使い方：<script id="footer-config" type="application/json">{ "amazon": true, "contact": true }</script>
  let cfg = { amazon:false, contact:true, policy:true, backToTop:true, year:true };
  const node = document.getElementById('footer-config');
  if (node) {
    try { Object.assign(cfg, JSON.parse(node.textContent||"{}")); } catch(e){}
  }

  // ② フッターの DOM を組み立て（順序は常に固定、表示だけON/OFF）
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="wrap">
      <div class="row">
        <section class="col col-main">
          <h4>About this site<br><small class="muted">このサイトについて</small></h4>
          <p class="muted">
            A personal portal curating live notes, studies on industrial heritage, drives and gadgets.<br>
            日常メモ・産業遺構・ドライブ・ガジェットを穏やかな調子でまとめています。
          </p>
          <div class="links">
            <a href="/">Nexus</a>
            <a href="/sonic/">Sonic</a>
            <a href="/relic/">Relic</a>
            <a href="/velox/">Velox</a>
            <a href="/gizmo/">Gizmo</a>
            <a href="/about/">About</a>
          </div>
        </section>

        <section class="col col-side">
          ${cfg.contact ? `
            <div class="block">
              <h4>Contact<br><small class="muted">お問い合わせ</small></h4>
              <p class="muted">
                For enquiries: <a href="mailto:receit.desk@fixlag.org">receit.desk@fixlag.org</a><br>
                お問い合わせは <a href="mailto:receit.desk@fixlag.org">receit.desk@fixlag.org</a> へ。
              </p>
            </div>` : ''}

          ${cfg.policy ? `
            <div class="block">
              <h4>Policy<br><small class="muted">方針</small></h4>
              <p class="muted">Materials are presented for educational/cultural purposes. Unauthorized reproduction is discouraged.<br>
              本サイトの内容は教育・文化目的で掲載しています。無断転載はご遠慮ください。</p>
            </div>` : ''}

          ${cfg.amazon ? `
            <div class="block fine">
              <p>
                As an Amazon Associate I earn from qualifying purchases.<br>
                当サイトはAmazonアソシエイト・プログラムの参加者です。適格販売により収入を得る場合があります。<br>
                <span class="muted">※本記載はアフィリエイトリンクを含む当該ページに適用されます。</span>
              </p>
            </div>` : ''}

          ${cfg.backToTop ? `
            <div class="block">
              <a href="#" class="muted" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">
                Back to top / ページ上部へ
              </a>
            </div>` : ''}
        </section>
      </div>

      <div class="fine" style="margin-top:10px">
        ${cfg.year ? `© <span id="y"></span> FIXLAG.ART` : 'FIXLAG.ART'}
      </div>
    </div>
  `;
  // 年号
  const y = footer.querySelector('#y'); if (y) y.textContent = new Date().getFullYear();

  // ③ 本文末尾に追加
  (document.querySelector('.content') || document.body).appendChild(footer);
})();
