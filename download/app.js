(function () {
  var links = window.ZENSEE_DOWNLOAD_LINKS || {};
  var placeholderPattern = /YOUR_APP_ID|YOUR_PACKAGE_NAME/;

  function isConfigured(url) {
    return typeof url === "string" && /^https?:\/\//.test(url) && !placeholderPattern.test(url);
  }

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

  function resolveAndroidLink(currentLocale, currentLinks, fallbackLink) {
    var zhCnLink = isConfigured(currentLinks.androidZhCn) ? currentLinks.androidZhCn : fallbackLink;
    var globalLink = isConfigured(currentLinks.androidGlobal)
      ? currentLinks.androidGlobal
      : (isConfigured(currentLinks.android) ? currentLinks.android : fallbackLink);

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

  var buttons = document.querySelectorAll("[data-download-button]");
  var primary = buttons.length > 0 ? buttons[0] : null;
  var pageFallback = primary ? primary.getAttribute("href") : "";
  var fallback = isConfigured(links.fallback) ? links.fallback :
    (isConfigured(pageFallback) ? pageFallback : "https://iveszhan.github.io/zensee-web/support/");
  var iosLink = isConfigured(links.ios) ? links.ios : fallback;
  var locale = normalizeLocale(document.documentElement.lang || navigator.language);
  var androidLink = resolveAndroidLink(locale, links, fallback);
  var androidReady = isConfigured(androidLink);
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
      if (!androidReady) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          var message = this.getAttribute("data-coming-soon") || "Coming soon";
          window.alert(message);
        });
      }
      continue;
    }

    if (platform === "android" && !androidReady) {
      button.href = androidLink;
      button.addEventListener("click", function (event) {
        event.preventDefault();
        var message = this.getAttribute("data-coming-soon") || "Coming soon";
        window.alert(message);
      });
      continue;
    }

    button.href = resolved;
  }
}());
