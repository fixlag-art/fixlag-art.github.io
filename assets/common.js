
// ==== Footer (notice) - global with attempt counter & optional prompt ====
(function () {
  // 1) 試行回数カウント（ページ内での実行回数）
  window.__footerAttemptCount = (window.__footerAttemptCount || 0) + 1;
  const attempt = window.__footerAttemptCount;

  // 2) すでに注入済みなら、以降はスキップ（決定打）
  if (window.__siteFooterInjected) {
    console.warn(`[footer] skipped: already injected (attempt #${attempt})`);
    maybePrompt(attempt, 'already-injected');
    return;
  }

  // 3) 注入プロセス開始
  function injectFooter() {
    try {
      // data-footer="off" なら描画しない
      const wantFooter = (document.body.getAttribute('data-footer') !== 'off');
      if (!wantFooter) {
        console.info('[footer] skipped by data-footer="off"');
        maybePrompt(attempt, 'disabled');
        return;
      }

      // 念のため DOM に既にあるなら中止（保険）
      if (document.querySelector('.site-footer')) {
        console.warn(`[footer] DOM already has .site-footer (attempt #${attempt})`);
        maybePrompt(attempt, 'dom-exists');
        return;
      }

      // ここで “注入済み” フラグを立てる（同時多重を防ぐ）
      window.__siteFooterInjected = true;

      const host = document.querySelector('.content') || document.body;

      const footer = document.createElement('footer');
      footer.className = 'site-footer';
      footer.style.cssText = [
        'margin:20px 0',
        'padding:14px',
        'background:#f9f9f9',
        'border-top:1px solid #ddd',
        'font-size:.9rem',
        'line-height:1.6'
      ].join(';');

      footer.innerHTML = `
        <div class="card" style="margin:0">
          <h3 style="margin:0;padding-left:.2rem">Notice</h3>
          <ul style="margin:.2rem 0 .6rem">
            <li>This site uses Google Analytics (GA4) for traffic measurement. Cookies may be used.<br>
                本サイトは主に計測のため GA4 を利用します。Cookie を利用し、取得データは集計処理でサイト改善のみに用います。</li>
            <li>Cookies may be used to remember preferences and analyse traffic.<br>
                サイト設定の記憶やトラフィック解析のために Cookie を使用する場合があります。</li>
            <li>Materials are presented for educational/cultural purposes.<br>
                本サイト内の資料は 教育・文化目的で公開されています。必要に応じてプライバシーに関する注意をご確認ください。</li>
            <li>Unauthorised reproduction is discouraged. All marks belong to their respective owners.<br>
                無断転載はご遠慮ください。各商標はそれぞれの権利者に帰属します。</li>
          </ul>
          <p style="margin:.6rem 0; color:var(--muted)">© FIXLAG.ART</p>
        </div>
      `;

      (host || document.body).appendChild(footer);
      console.log(`[footer] injected (attempt #${attempt})`);
      maybePrompt(attempt, 'injected');
    } catch (e) {
      console.error('[footer] failed:', e);
      maybePrompt(attempt, 'error');
    }
  }

  // 4) DOM 準備後に 1 回だけ実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter, { once: true });
  } else {
    injectFooter();
  }

  // ---- ユーザーに見せない“運用者向け”プロンプト ----
  //  ?debugFooter=1 または localStorage.debugFooter="1" のときのみ alert を出す
  function maybePrompt(count, phase) {
    const params = new URLSearchParams(location.search);
    const debugOn = params.get('debugFooter') === '1' || localStorage.getItem('debugFooter') === '1';
    if (!debugOn) return;

    // 2回目以降、またはエラー系で通知（本番ユーザーには出ない）
    if (count > 1 || phase === 'error') {
      alert(`[footer] attempt #${count} (${phase}) on ${location.pathname}`);
    }
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

