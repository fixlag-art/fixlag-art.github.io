document.addEventListener("DOMContentLoaded", () => {
  // Subnav builder
  const subnav = document.querySelector(".subnav");
  const data = document.getElementById("subnav-data");
  if (subnav && data) {
    try {
      const links = JSON.parse(data.textContent);
      links.forEach(([label, href]) => {
        const a = document.createElement("a");
        a.textContent = label;
        a.href = href;
        a.className = "pill";
        if (location.pathname === href || location.pathname === href + "index.html") {
          a.classList.add("active");
        }
        subnav.appendChild(a);
      });

      // Add hamburger menu to subnav
      const button = document.createElement("button");
      button.className = "hamburger";
      button.innerHTML = "&#9776;";
      button.addEventListener("click", () => {
        const sidenav = document.querySelector(".sidenav");
        sidenav.classList.toggle("open");
      });
      subnav.prepend(button);
    } catch (err) {
      console.error("Subnav JSON error", err);
    }
  }

  // Footer builder
  const content = document.querySelector(".page");
  if (content && content.dataset.footer !== "off") {
    const footer = document.createElement("footer");
    footer.innerHTML = `
      <div><strong>Notice</strong></div>
      <ul>
        <li>As an Amazon Associate I earn from qualifying purchases.</li>
        <li>当サイトはAmazonアソシエイト・プログラムの参加者です。</li>
      </ul>
      <div style="margin-top:0.5rem">
        &copy; 2025 FIXLAG.ART — <a href="mailto:receipt.desk@fixlag.org">receipt.desk@fixlag.org</a>
      </div>
    `;
    content.appendChild(footer);
  }

  // GA4 (optional)
  if (!window.GA_INITIALIZED) {
    window.GA_INITIALIZED = true;
    const gtagScript = document.createElement("script");
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"; // ← Replace with real ID
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", "G-XXXXXXXXXX"); // ← Replace with real ID
  }
});
