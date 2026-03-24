(function () {
  var links = window.ZENSEE_DOWNLOAD_LINKS || {};
  var placeholderPattern = /YOUR_APP_ID|YOUR_PACKAGE_NAME/;

  function isConfigured(url) {
    return typeof url === "string" && /^https?:\/\//.test(url) && !placeholderPattern.test(url);
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

  var fallback = isConfigured(links.fallback) ? links.fallback : "https://iveszhan.github.io/zensee-legal/support/";
  var iosLink = isConfigured(links.ios) ? links.ios : fallback;
  var androidLink = isConfigured(links.android) ? links.android : fallback;
  var platform = detectPlatform();
  var resolved = platform === "ios" ? iosLink : (platform === "android" ? androidLink : fallback);

  var primary = document.querySelector("[data-download-button]");
  var hint = document.querySelector("[data-platform-hint]");

  if (primary) {
    primary.href = resolved;
  }

  if (hint) {
    var messages = {
      ios: hint.getAttribute("data-ios-text") || "",
      android: hint.getAttribute("data-android-text") || "",
      fallback: hint.getAttribute("data-fallback-text") || ""
    };

    hint.textContent = messages[platform] || "";
  }
}());
