/* ===== Unified footer & legal manager (English → Japanese) ===== */
(function(){
  // 0) 文言を一元管理（ここを書き換えれば全頁反映）
  const LEGAL_TEXT = {
    ga4Disclosure: {
      en: 'This site uses Google Analytics (GA4) to collect anonymised usage statistics for improvement.',
      ja: '本サイトは改善目的で Google Analytics（GA4）により匿名の利用統計を取得します。'
    },
    cookieBasic: {
      en: 'Cookies may be used to remember preferences and analyse traffic.',
      ja: 'サイト設定の記憶やトラフィック解析のためにCookieを使用する場合があります。'
    },
    amazon: {
      en: 'As an Amazon Associate I earn from qualifying purchases.',
      ja: '当サイトはAmazonアソシエイト・プログラムの参加者です。適格販売により収入を得る場合があります。'
    },
    privacy: {
      en: 'Materials are presented for educational/cultural purposes. See privacy notes where applicable.',
      ja: '本サイトの内容は教育・文化目的で掲載しています。必要に応じてプライバシーに関する注記をご確認ください。'
    },
    terms: {
      en: 'Unauthorised reproduction is discouraged. All marks belong to their respective owners.',
      ja: '無断転載はご遠慮ください。各商標はそれぞれの権利者に帰属します。'
    },
    contact: {
      en: 'For enquiries: ',
      ja: 'お問い合わせ: '
    }
  };

  // 1) ページ側の設定（なければ既定ON/OFF）
  //   使い方：<script id="footer-config" type="application/json">{ ... }</script>
  const DEFAULT_CFG = {
    // 法的文言表示
    show: {
      ga4Disclosure:  true,     // ← GA4の“表記”を出すか（文言）
      cookieBasic:    true,     // ← Cookieの簡易説明
      amazon:         false,    // ← Amazon表記（アフィのあるページだけtrue）
      privacy:        true,     // ← 簡易ポリシー
      terms:          true,     // ← 注意/免責
      contact:        true      // ← 連絡先ブロック
    },
    // 実タグの挙動
    ga4: {
      enable: true,                 // ← GA4タグを“実際に”挿入するか
      measurementId: 'G-XXXXXXX'    // ← あなたのGA4測定ID
    },
    backToTop: true,
    year: true,
    // 連絡先メール（ここを直せば全ページ統一）
    contactEmail: 'receipt.desk@fixlag.org'
  };

  let cfg = structuredClone(DEFAULT_CFG);
  const node = document.getElementById('footer-config');
  if (node) {
    try { 
      const userCfg = JSON.parse(node.textContent || "{}");
      // 深いマージ（最低限）
      if (userCfg.show) Object.assign(cfg.show, userCfg.show);
      if (userCfg.ga4)  Object.assign(cfg.ga4,  userCfg.ga4);
      if (userCfg.hasOwnProperty('backToTop')) cfg.backToTop = !!userCfg.backToTop;
      if (userCfg.hasOwnProperty('year'))      cfg.year      = !!userCfg.year;
      if (userCfg.contactEmail) cfg.contactEmail = userCfg.contactEmail;
    } catch(e){}
  }

  // 2) 必要なら GA4 “実タグ” を挿入（表記は下のフッターで制御）
  if (cfg.ga4.enable && cfg.ga4.measurementId && !window.__ga4Injected) {
    window.__ga4Injected = true;
    // gtag loader
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4.measurementId);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    gtag('js', new Date());
    gtag('config', cfg.ga4.measurementId);
  }

  // 3) フッター組み立て（順序固定・英→日。表示は show で切替）
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
          </div>
        </section>

        <section class="col col-side">
          <div class="block">
            <ul class="legal-list">
              ${cfg.show.ga4Disclosure ? `<li>${LEGAL_TEXT.ga4Disclosure.en}<br>${LEGAL_TEXT.ga4Disclosure.ja}</li>` : ''}
              ${cfg.show.cookieBasic   ? `<li>${LEGAL_TEXT.cookieBasic.en}<br>${LEGAL_TEXT.cookieBasic.ja}</li>` : ''}
              ${cfg.show.amazon        ? `<li>${LEGAL_TEXT.amazon.en}<br>${LEGAL_TEXT.amazon.ja}</li>` : ''}
              ${cfg.show.privacy       ? `<li>${LEGAL_TEXT.privacy.en}<br>${LEGAL_TEXT.privacy.ja}</li>` : ''}
              ${cfg.show.terms         ? `<li>${LEGAL_TEXT.terms.en}<br>${LEGAL_TEXT.terms.ja}</li>` : ''}
            </ul>
          </div>

          ${cfg.show.contact ? `
            <div class="block">
              <h4>Contact<br><small class="muted">お問い合わせ</small></h4>
              <p class="muted">
                ${LEGAL_TEXT.contact.en}<a href="mailto:${cfg.contactEmail}">${cfg.contactEmail}</a><br>
                ${LEGAL_TEXT.contact.ja}<a href="mailto:${cfg.contactEmail}">${cfg.contactEmail}</a>
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
  const y = footer.querySelector('#y'); if (y) y.textContent = new Date().getFullYear();

  (document.querySelector('.content') || document.body).appendChild(footer);
})();

/* === Google Analytics 4 (global) ===
 * Property: fixlag.art
 * Stream  : fixlag.art * Cloudflare
 * MEASUREMENT_ID: G-F5RL9XBTJS
 */
(function GA4() {
  if (window.__ga4Loaded) return;       // 二重読み込み防止
  window.__ga4Loaded = true;

  // gtag.js を非同期で読み込み
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-F5RL9XBTJS';
  document.head.appendChild(s);

  // 初期化＆設定
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', 'G-F5RL9XBTJS', {
    transport_type: 'beacon',      // なるべく確実に送る
    anonymize_ip: true             // 追加: IP 匿名化（任意だが推奨）
    // page_path は Workers リダイレクトでも自動で拾われます
  });
})();

