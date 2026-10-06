const urls = [
  ...document.querySelectorAll<HTMLMediaElement>("video, audio, source"),
]
  .map((el) => el.currentSrc || el.src)
  .filter(Boolean);
chrome.runtime.sendMessage({ type: "media-sources", urls: [...new Set(urls)] });
