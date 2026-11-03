/**
 * Lien externe (itinéraire Google Maps…) venu de données saisies par un tiers — client,
 * fournisseur. Seuls http(s) sont suivis : un `javascript:` ou `data:` glissé dans l'adresse
 * s'exécuterait dans l'app du livreur, qui garde sa session dans le navigateur.
 * Renvoie l'adresse normalisée, ou null si elle est absente ou dangereuse.
 */
export function lienWebSur(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const adresse = new URL(url.trim());
    return adresse.protocol === "https:" || adresse.protocol === "http:" ? adresse.href : null;
  } catch {
    return null;
  }
}
