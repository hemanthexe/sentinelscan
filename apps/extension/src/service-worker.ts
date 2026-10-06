chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "media-sources")
    chrome.storage.session.set({
      [String(sender.tab?.id ?? "page")]: message.urls,
    });
});
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = details.url.toLowerCase();
    if (/\.(m3u8|mpd|m4s|ts|mp4|webm)(?:[?#]|$)/.test(url))
      chrome.storage.session.set({
        [`request:${details.requestId}`]: {
          url: details.url,
          type: details.type,
          time: Date.now(),
        },
      });
  },
  { urls: ["<all_urls>"] },
);
