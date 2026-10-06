const target = document.getElementById("sources")!;
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  const id = tabs[0]?.id;
  const data =
    id === undefined ? undefined : await chrome.storage.session.get(String(id));
  const urls = (data?.[String(id)] as string[] | undefined) ?? [];
  target.replaceChildren();
  if (!urls.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No accessible media elements found.";
    target.append(empty);
    return;
  }
  for (const url of urls) {
    const source = document.createElement("div");
    source.className = "source";
    const host = document.createElement("strong");
    host.textContent = (() => {
      try {
        return new URL(url).hostname;
      } catch {
        return "Invalid source";
      }
    })();
    const safe = document.createElement("span");
    safe.className = "muted";
    safe.textContent = url.split("?")[0] ?? "";
    source.append(host, document.createElement("br"), safe);
    target.append(source);
  }
});
document
  .getElementById("open")
  ?.addEventListener("click", () =>
    chrome.tabs.create({ url: "http://localhost:5173" }),
  );
