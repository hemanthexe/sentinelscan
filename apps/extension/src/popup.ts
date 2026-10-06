const target = document.getElementById("sources")!;
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  const id = tabs[0]?.id;
  const data =
    id === undefined ? undefined : await chrome.storage.session.get(String(id));
  const urls = (data?.[String(id)] as string[] | undefined) ?? [];
  target.innerHTML = urls.length
    ? urls
        .map(
          (url) =>
            `<div class="source">${new URL(url).hostname}<br><span class="muted">${url.split("?")[0]}</span></div>`,
        )
        .join("")
    : '<p class="muted">No accessible media elements found.</p>';
});
document
  .getElementById("open")
  ?.addEventListener("click", () =>
    chrome.tabs.create({ url: "http://localhost:5173" }),
  );
