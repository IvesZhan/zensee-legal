(function () {
  var defaultDownloadLinks = {
    ios: "https://apps.apple.com/app/6760809128",
    androidZhCn: "https://www.pgyer.com/zensee-android",
    androidGlobal: "https://raw.githubusercontent.com/IvesZhan/zensee-android/main/downloads/latest/ZenSee-android-latest.apk",
    fallback: "https://iveszhan.github.io/zensee-web/download/"
  };
  var host = document.getElementById("shared-header");
  if (!host) {
    return;
  }

  var locale = normalizeLocale(host.getAttribute("data-header-locale") || document.documentElement.lang);
  var homeUrl = host.getAttribute("data-header-home-url") || "./";
  var supportUrl = host.getAttribute("data-header-support-url") || homeUrl;
  var brandUrl = host.getAttribute("data-header-brand-url") || homeUrl;
  var iconSrc = host.getAttribute("data-header-icon-src") || "";
  var subtitle = host.getAttribute("data-header-subtitle") || "";
  var comingSoon = host.getAttribute("data-header-coming-soon") || "";
  var copy = localeCopy(locale);
  var links = parseLinks(host.getAttribute("data-header-links"));
  var actionLabel = host.getAttribute("data-header-action-label") || "";
  var actionUrl = host.getAttribute("data-header-action-url") || supportUrl;
  var actionIsDownload = host.getAttribute("data-header-action-download") === "true";
  var mobileLabelAttr = host.getAttribute("data-header-mobile-label");
  var mobileUrlAttr = host.getAttribute("data-header-mobile-url");
  var mobileLabel = mobileLabelAttr !== null ? mobileLabelAttr : copy.download;
  var mobileUrl = mobileUrlAttr !== null ? mobileUrlAttr : supportUrl;
  var mobileIsDownload = host.hasAttribute("data-header-mobile-download")
    ? host.getAttribute("data-header-mobile-download") === "true"
    : !host.hasAttribute("data-header-mobile-label");
  var navLinks = links !== null ? links : defaultLinks(copy, homeUrl);

  host.outerHTML = [
    '<nav class="nav">',
    '<div class="nav-inner">',
    '<a class="brand-lockup" href="' + escapeAttribute(brandUrl) + '">',
    '<div class="brand-icon">',
    '<img src="' + escapeAttribute(iconSrc) + '" alt="' + escapeAttribute(copy.iconAlt) + '" />',
    "</div>",
    '<div class="brand-text">',
    "<strong>" + escapeHtml(copy.brand) + "</strong>",
    "<span>" + escapeHtml(subtitle || copy.subtitle) + "</span>",
    "</div>",
    "</a>",
    '<div class="nav-cluster">',
    '<div class="nav-links">' + renderLinks(navLinks) + "</div>",
    renderAction("nav-action", actionLabel, actionUrl, actionIsDownload, comingSoon),
    "</div>",
    renderAction("mobile-nav-link", mobileLabel, mobileUrl, mobileIsDownload, comingSoon),
    "</div>",
    "</nav>"
  ].join("");

  attachDownloadLinks();

  function normalizeLocale(value) {
    var lang = String(value || "").toLowerCase();
    if (lang.indexOf("zh-hant") === 0) {
      return "zh-hant";
    }
    if (
      lang.indexOf("zh-tw") === 0 ||
      lang.indexOf("zh-hk") === 0 ||
      lang.indexOf("zh-mo") === 0
    ) {
      return "zh-hant";
    }
    if (lang.indexOf("ja") === 0) {
      return "ja";
    }
    if (lang.indexOf("en") === 0) {
      return "en";
    }
    return "zh-cn";
  }

  function localeCopy(currentLocale) {
    var table = {
      "zh-cn": {
        brand: "禅·见",
        subtitle: "禅修记录与静心练习",
        experience: "体验",
        features: "功能",
        philosophy: "理念",
        download: "下载APP",
        iconAlt: "禅·见 App Icon"
      },
      "zh-hant": {
        brand: "禪·見",
        subtitle: "禪修記錄與靜心練習",
        experience: "體驗",
        features: "功能",
        philosophy: "理念",
        download: "下載APP",
        iconAlt: "禪·見 App Icon"
      },
      "ja": {
        brand: "禅·見",
        subtitle: "禅修の記録と静かな実践",
        experience: "体験",
        features: "機能",
        philosophy: "思想",
        download: "ダウンロード",
        iconAlt: "禅·見 App Icon"
      },
      "en": {
        brand: "ZenSee",
        subtitle: "Curating digital peace",
        experience: "Experience",
        features: "Features",
        philosophy: "Philosophy",
        download: "Download App",
        iconAlt: "ZenSee App Icon"
      }
    };

    return table[currentLocale] || table["zh-cn"];
  }

  function parseLinks(raw) {
    if (raw === null) {
      return null;
    }

    return String(raw)
      .split("||")
      .map(function (item) {
        var value = String(item || "").trim();
        if (!value) {
          return null;
        }

        var parts = value.split("::");
        var href = String(parts.shift() || "").trim();
        var label = String(parts.join("::") || "").trim();
        if (!href || !label) {
          return null;
        }

        return { href: href, label: label };
      })
      .filter(Boolean);
  }

  function defaultLinks(copyTable, base) {
    return [
      { href: link(base, "experience"), label: copyTable.experience },
      { href: link(base, "features"), label: copyTable.features },
      { href: link(base, "philosophy"), label: copyTable.philosophy }
    ];
  }

  function renderLinks(items) {
    return items.map(function (item) {
      return '<a href="' + escapeAttribute(item.href) + '">' + escapeHtml(item.label) + "</a>";
    }).join("");
  }

  function renderAction(className, label, href, isDownload, comingSoonLabel) {
    if (!label || !href) {
      return "";
    }

    return '<a class="' + escapeAttribute(className) + '"' +
      (isDownload ? ' data-download-button' : "") +
      (isDownload && comingSoonLabel ? ' data-coming-soon="' + escapeAttribute(comingSoonLabel) + '"' : "") +
      ' href="' + escapeAttribute(href) + '">' + escapeHtml(label) + "</a>";
  }

  function attachDownloadLinks() {
    var buttons = document.querySelectorAll("[data-download-button]");
    if (!buttons.length) {
      return;
    }

    var links = window.ZENSEE_DOWNLOAD_LINKS || {};
    var fallback = isConfigured(links.fallback) ? links.fallback : defaultDownloadLinks.fallback;
    var iosLink = isConfigured(links.ios) ? links.ios : defaultDownloadLinks.ios;
    var androidLink = resolveAndroidLink(locale, links);
    var platform = detectPlatform();
    var resolved = platform === "ios" ? iosLink : (platform === "android" ? androidLink : fallback);

    for (var i = 0; i < buttons.length; i += 1) {
      var button = buttons[i];
      var target = button.getAttribute("data-platform");

      if (target === "ios") {
        button.href = iosLink;
        continue;
      }

      if (target === "android") {
        button.href = androidLink;
        continue;
      }

      button.href = resolved;
    }
  }

  function resolveAndroidLink(currentLocale, links) {
    var zhCnLink = isConfigured(links.androidZhCn) ? links.androidZhCn : defaultDownloadLinks.androidZhCn;
    var globalLink = isConfigured(links.androidGlobal)
      ? links.androidGlobal
      : (isConfigured(links.android) ? links.android : defaultDownloadLinks.androidGlobal);

    return currentLocale === "zh-cn" ? zhCnLink : globalLink;
  }

  function detectPlatform() {
    var ua = navigator.userAgent || "";
    var isAndroid = /Android/i.test(ua);
    var isIOS = /iPhone|iPad|iPod/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      return "ios";
    }
    if (isAndroid) {
      return "android";
    }
    return "fallback";
  }

  function isConfigured(url) {
    return typeof url === "string" && /^https?:\/\//.test(url);
  }

  function link(base, hash) {
    return String(base || "./").replace(/#.*$/, "") + "#" + hash;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }
}());
