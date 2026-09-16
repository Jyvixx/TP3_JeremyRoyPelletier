// script/pwa.js — enregistrement du Service Worker de TRouvé.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((registration) => {
        console.log("[TRouvé] Service Worker enregistré :", registration.scope);
      })
      .catch((err) => {
        console.error("[TRouvé] Échec de l'enregistrement du Service Worker :", err);
      });
  });
}
