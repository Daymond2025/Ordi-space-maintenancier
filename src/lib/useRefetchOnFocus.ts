"use client";

import { useEffect } from "react";

/**
 * Recharge les données quand l'onglet redevient visible ou que la page est
 * restaurée depuis le bfcache du navigateur (bouton précédent/geste retour).
 * Sans ça, revenir en arrière depuis l'écran d'une mission (après une action
 * qui change son statut côté serveur) peut réafficher un instantané figé de
 * "Space" pris avant même que son premier chargement ne soit terminé — les
 * statuts semblent alors "statiques" au lieu de refléter le backend, alors
 * qu'un rechargement complet de la page montre bien les bonnes données.
 */
export function useRefetchOnFocus(recharger: () => void) {
  useEffect(() => {
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) recharger();
    }
    function onVisibilityChange() {
      if (document.visibilityState === "visible") recharger();
    }

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [recharger]);
}
