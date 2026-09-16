// service-worker.js — TRouvé
// Stratégie : cache-first pour les fichiers statiques (app shell), avec une
// page de secours hors-ligne pour la navigation. Version le nom du cache et
// l'incrémenter à chaque changement de contenu force la mise à jour des
// visiteurs existants.

const CACHE_VERSION = "v1";
const CACHE_NAME = `trouve-cache-${CACHE_VERSION}`;

// Fichiers du "app shell" mis en cache dès l'installation, pour que le site
// soit consultable hors ligne dès la première visite.
const APP_SHELL = [
  "./",
  "./index.html",
  "./activites.html",
  "./evenements.html",
  "./proposer.html",
  "./confirmation.html",
  "./offline.html",
  "./manifest.json",
  "./css/normalize.css",
  "./css/style.css",
  "./script/validation.js",
  "./icons/icon-144.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/Adrenaline-urbaine.jpg",
  "./assets/albatros26_fiche-spectacle.jpg",
  "./assets/arcade-montvr.jpg",
  "./assets/cinema-tapis-rouge.jpg",
  "./assets/Delicesdautomne-foule.jpg",
  "./assets/Distillerie-Mariana.jpg",
  "./assets/Galette_Header.jpg",
  "./assets/grand-prix-canin-trois-rivieres.jpg",
  "./assets/lions-de-trois-rivieres.jpg",
  "./assets/Maikan-Aventure.jpg",
  "./assets/Martin-fontaine-Le-Memphis.jpg",
  "./assets/moffet26_fiche-spectacle.jpg",
  "./assets/MYCO.jpg",
  "./assets/pink-floyd.jpg",
  "./assets/sanctuaire-notre-dame-du-cap.jpg",
  "./assets/SEO_FIPTR.jpg",
  "./assets/soiree-pop.jpg",
];

// Ressources tierces (CDN) : on tente de les mettre en cache aussi, mais on
// ne bloque jamais l'installation si une ressource externe est inaccessible.
const THIRD_PARTY = [
  "https://cdn.tailwindcss.com",
  "https://cdn.jsdelivr.net/npm/daisyui@4.12.10/dist/full.min.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // App shell local : si un de ces fichiers manque, on veut le savoir
      // (l'installation échoue), donc on utilise addAll.
      await cache.addAll(APP_SHELL);

      // Ressources externes : best-effort, une erreur réseau ne doit pas
      // empêcher l'installation du Service Worker.
      await Promise.allSettled(
        THIRD_PARTY.map(async (url) => {
          try {
            const response = await fetch(url, { mode: "no-cors" });
            await cache.put(url, response);
          } catch (err) {
            console.warn("[service-worker] Impossible de mettre en cache :", url, err);
          }
        })
      );
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Supprime les anciennes versions du cache.
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("trouve-cache-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // On ne gère que les requêtes GET (formulaire "proposer" utilise une
  // navigation GET vers confirmation.html, donc elle passe par ici aussi).
  if (request.method !== "GET") {
    return;
  }

  // Navigation entre les pages : réseau d'abord (contenu à jour quand on est
  // en ligne), repli sur le cache, puis sur la page hors-ligne en dernier
  // recours.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preload = await event.preloadResponse;
          if (preload) return preload;

          const networkResponse = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (err) {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(request);
          return cached || cache.match("./offline.html");
        }
      })()
    );
    return;
  }

  // Tout le reste (CSS, JS, images, polices, CDN) : cache d'abord pour la
  // rapidité et le fonctionnement hors ligne, avec mise à jour silencieuse du
  // cache en arrière-plan quand le réseau est disponible (stale-while-revalidate).
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);

      const networkFetch = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          } else if (networkResponse && networkResponse.type === "opaque") {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => undefined);

      return cached || (await networkFetch) || cache.match("./offline.html");
    })()
  );
});
