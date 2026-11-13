// Business HQ push notifications. Shows the alert and opens the right page
// when tapped. No caching, no fetch handling — only push.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  const title = String(d.title || "Business HQ").slice(0, 80);
  e.waitUntil(self.registration.showNotification(title, {
    body: String(d.body || "").slice(0, 180),
    tag: String(d.tag || "hq"),
    icon: "apple-touch-icon.png",
    badge: "apple-touch-icon.png",
    data: { url: typeof d.url === "string" && /^\.\/[\w\-./#]*$/.test(d.url) ? d.url : "./" },
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const target = new URL(e.notification.data && e.notification.data.url || "./", self.registration.scope).href;
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) { if ("focus" in c) { try { await c.navigate(target); } catch (_) {} return c.focus(); } }
    return self.clients.openWindow(target);
  })());
});
