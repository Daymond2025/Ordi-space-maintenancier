// Service worker minimal — présent pour satisfaire le critère d'installabilité
// PWA de Chrome/Android, et pour recevoir les notifications push (nouvelle
// livraison disponible, voir App\Services\PushNotificationService côté
// backend). Toujours aucun cache, aucune donnée hors ligne : pas de fetch
// handler, chaque requête (API incluse) part directement au réseau.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let donnees = { titre: "Ordi'Space Livreur", corps: "Nouvelle activité." };
  try {
    if (event.data) donnees = event.data.json();
  } catch {
    // Payload non-JSON (improbable, le backend envoie toujours du JSON) —
    // on garde le texte par défaut plutôt que de planter le worker.
  }

  event.waitUntil(
    self.registration.showNotification(donnees.titre ?? "Ordi'Space Livreur", {
      body: donnees.corps ?? "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: donnees.donnees ?? {},
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  // Une seule destination possible aujourd'hui : l'écran "Space" (accueil),
  // où la nouvelle mission apparaît dans le vivier — pas de deep-link vers
  // une mission précise pour l'instant (id pas indispensable ici, le livreur
  // voit et accepte depuis la liste).
  event.waitUntil(self.clients.openWindow("/"));
});
