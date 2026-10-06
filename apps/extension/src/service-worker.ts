const sensitive =
  /^(token|auth|authorization|signature|sig|key|secret|access_token|session|credential|cookie|set-cookie|api[-_]?key|x-api-key)$/i;
function safeUrl(raw: string): string {
  try {
    const url = new URL(raw);
    if (url.username) url.username = "[REDACTED]";
    if (url.password) url.password = "[REDACTED]";
    for (const key of [...url.searchParams.keys()])
      if (sensitive.test(key)) url.searchParams.set(key, "[REDACTED]");
    if (url.hash) url.hash = "#[REDACTED]";
    return url.toString();
  } catch {
    return "[INVALID URL]";
  }
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "media-sources")
    chrome.storage.session.set({
      [String(sender.tab?.id ?? "page")]: (message.urls as string[]).map(
        safeUrl,
      ),
    });
});
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = details.url.toLowerCase();
    if (/\.(m3u8|mpd|m4s|ts|mp4|webm)(?:[?#]|$)/.test(url))
      chrome.storage.session.set({
        [`request:${details.requestId}`]: {
          url: safeUrl(details.url),
          type: details.type,
          time: Date.now(),
        },
      });
  },
  { urls: ["<all_urls>"] },
);
