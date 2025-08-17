// ===== Footer (Notice) – global =====
(function () {
  // body に data-footer="off" を付けたページだけフッター非表示
  const wantFooter = (document.body.getAttribute('data-footer') !== 'off');

  function injectFooter() {
    try {
      if (!wantFooter) {
        console.debug('[footer] skipped by data-footer=off');
        return;
      }
      // 既に生成済みなら二重挿入しない
      if (document.querySelector('.site-footer')) {
        console.debug('[footer] already exists');
        return;
      }

      const host = document.querySelector('.content') || document.body;

      const footer = document.createElement('footer');
      footer.className = 'site-footer';
      footer.style.cssText = [
        'margin:20px 0',
        'padding:12px',
        'background:#f9f9f9',
        'border-top:1px solid var(--border)', // ← ここを修正
        'font-size:.9rem',
        'line-height:1.6'
      ].join(';');

      footer.innerHTML = `
        <div class="card" style="margin:0">
          <ul style="margin:0;padding-left:1.2rem">
            <li>
              This site uses Google Analytics (GA4) for traffic measurement. Cookies may be used.<br>
              本サイトは匿名計測のために GA4 を利用します。Cookie を利用し、取得データは統計処理でサイト改善のみに用います。
            </li>
            <li>
              Cookies may be used to remember preferences and analyse traffic.<br>
              サイト設定の記憶やトラフィック解析のために Cookie を使用する場合があります。
            </li>
            <li>
              Materials are presented for educational/cultural purposes.<br>
              本サイト内の資料は教育・文化目的で公開されています。必要に応じてプライバシーに関する注意をご確認ください。
            </li>
            <li>
              Unauthorised reproduction is discouraged. All marks belong to their respective owners.<br>
              無断転載はご遠慮ください。各商標はそれぞれの権利者に帰属します。
            </li>
          </ul>
          <p style="margin:.8rem 0 0;color:#666">© FIXLAG.ART</p>
        </div>
      `;

      host.appendChild(footer);
      console.debug('[footer] injected into', host === document.body ? 'body' : '.content');
    } catch (e) {
      console.error('[footer] failed:', e);
    }
  }

  // DOM 準備後に確実に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter, { once: true });
  } else {
    injectFooter();
  }
})();

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

// --- フッター生成 ---
const footer = document.createElement('footer');
footer.className = 'site-footer';
footer.style.cssText = 'margin:24px 0 0;padding:16px;background:#f9f9f9;border-top:1px solid #ddd;font-size:.85rem;line-height:1.6';

footer.innerHTML = `
  <div class="card" style="margin:0">
    <ul style="margin:0;padding-left:1.2rem">
      <li>
        This site uses Google Analytics (GA4) for traffic measurement. Cookies may be used.<br>
        本サイトは匿名計測のために GA4 を利用します。Cookie を利用し、取得データは統計処理でサイト改善のみに用います。
      </li>
      <li>
        Cookies may be used to remember preferences and analyse traffic.<br>
        サイト設定の記憶やトラフィック解析のために Cookie を使用する場合があります。
      </li>
      <li>
        Materials are presented for educational/cultural purposes.<br>
        本サイト内の資料は教育・文化目的で公開されています。必要に応じてプライバシーに関する注意をご確認ください。
      </li>
      <li>
        Unauthorised reproduction is discouraged. All marks belong to their respective owners.<br>
        無断転載はご遠慮ください。各商標はそれぞれの権利者に帰属します。
      </li>
    </ul>
    <p style="margin:.8rem 0 0;color:#666">© FIXLAG.ART</p>
  </div>
`;

// bodyの末尾に追加
(document.querySelector('.content') || document.body).appendChild(footer);

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

