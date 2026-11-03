/**
 * Écran "Catégorie" de la Boutique : l'état des filtres vit dans l'URL
 * (`/boutique/categorie?f=ordinateur&m=hp,dell&r=8,16%2B…`) — le retour depuis
 * les résultats retrouve donc la sélection, et la page de résultats lit la même
 * chaîne. `versParametresApi()` la traduit pour GET /produits
 * (voir FiltresCatalogue côté backend).
 */
export type Famille = "ordinateur" | "accessoires" | "logiciels";
export type TypeStockage = "tous" | "ssd" | "hdd";

export type Filtres = {
  famille: Famille;
  /** Ordinateur : id de la catégorie "portable" / "bureau" (un seul choix). */
  types: number[];
  /** Valeurs de MARQUES ; vide = toutes ("TOUT"). */
  marques: string[];
  processeurs: string[];
  stockageType: TypeStockage;
  /** Capacités "N Go et +", en Go. */
  stockages: number[];
  /** "8" = exactement 8 Go, "16+" = 16 Go et plus. */
  rams: string[];
  tailles: number[];
  /** Accessoires / logiciels : ids des tuiles choisies. */
  categories: number[];
};

export const FAMILLES: { id: Famille; label: string }[] = [
  { id: "ordinateur", label: "Ordinateur" },
  { id: "accessoires", label: "Accessoires" },
  { id: "logiciels", label: "Logiciels" },
];

export const MARQUES = [
  { valeur: "hp", label: "HP" },
  { valeur: "dell", label: "DELL" },
  { valeur: "lenovo", label: "LENOVO" },
  { valeur: "macbook", label: "Macbook" },
  { valeur: "asus", label: "ASUS" },
  { valeur: "toshiba", label: "TOSHIBA" },
  { valeur: "chromebook", label: "CHROMEBOOK" },
  { valeur: "autre", label: "AUTRE" },
];

export const PROCESSEURS = ["Celeron", "Dual core", "Core i3", "Core i4", "Core i5", "Core i7", "Core i9"];

export const STOCKAGES = [
  { go: 50, label: "50 GO +" },
  { go: 100, label: "100 GO +" },
  { go: 200, label: "200 GO +" },
  { go: 300, label: "300 GO +" },
  { go: 400, label: "400 GO +" },
  { go: 500, label: "500 GO +" },
  { go: 700, label: "700 GO +" },
  { go: 1000, label: "1 To +" },
  { go: 2000, label: "2 To +" },
];

export const TYPES_STOCKAGE: { valeur: TypeStockage; label: string }[] = [
  { valeur: "tous", label: "SSD & HDD" },
  { valeur: "ssd", label: "SSD" },
  { valeur: "hdd", label: "HDD" },
];

export const RAMS = [
  { valeur: "2", label: "2 GO" },
  { valeur: "4", label: "4 GO" },
  { valeur: "5", label: "5 GO" },
  { valeur: "6", label: "6 GO" },
  { valeur: "8", label: "8 GO" },
  { valeur: "10", label: "10 GO" },
  { valeur: "12", label: "12 GO" },
  { valeur: "16+", label: "16 GO +" },
  { valeur: "32+", label: "32 GO +" },
];

export const TAILLES = [10, 11, 12, 13, 14, 15, 17];

export const FILTRES_VIDES: Filtres = {
  famille: "ordinateur",
  types: [],
  marques: [],
  processeurs: [],
  stockageType: "tous",
  stockages: [],
  rams: [],
  tailles: [],
  categories: [],
};

/** Choix renvoyés par GET /categories/filtres. */
export type ChoixCategorie = { id: number; nom: string };
export type ConfigFiltres = {
  ordinateur: { types: ChoixCategorie[] };
  accessoires: { categories: ChoixCategorie[] };
  logiciels: { groupes: { titre: string; categories: ChoixCategorie[] }[] };
};

const liste = (valeur: string | null): string[] => (valeur ? valeur.split(",").filter(Boolean) : []);
const nombres = (valeur: string | null): number[] => liste(valeur).map(Number).filter((n) => Number.isFinite(n));

export function lireFiltres(params: URLSearchParams): Filtres {
  const famille = params.get("f");
  const stockageType = params.get("st");
  return {
    famille: FAMILLES.some((f) => f.id === famille) ? (famille as Famille) : "ordinateur",
    types: nombres(params.get("t")),
    marques: liste(params.get("m")),
    processeurs: liste(params.get("p")),
    stockageType: stockageType === "ssd" || stockageType === "hdd" ? stockageType : "tous",
    stockages: nombres(params.get("s")),
    rams: liste(params.get("r")),
    tailles: nombres(params.get("z")),
    categories: nombres(params.get("c")),
  };
}

/** Chaîne d'URL de l'écran Catégorie / Résultats — seuls les filtres renseignés y figurent. */
export function ecrireFiltres(f: Filtres): string {
  const params = new URLSearchParams({ f: f.famille });
  if (f.types.length) params.set("t", f.types.join(","));
  if (f.marques.length) params.set("m", f.marques.join(","));
  if (f.processeurs.length) params.set("p", f.processeurs.join(","));
  if (f.stockageType !== "tous") params.set("st", f.stockageType);
  if (f.stockages.length) params.set("s", f.stockages.join(","));
  if (f.rams.length) params.set("r", f.rams.join(","));
  if (f.tailles.length) params.set("z", f.tailles.join(","));
  if (f.categories.length) params.set("c", f.categories.join(","));
  return params.toString();
}

/**
 * Paramètres de GET /produits : seuls les filtres de la famille affichée
 * comptent (les choix faits sur un autre onglet restent mémorisés mais ne
 * filtrent pas). La Boutique ne montre que les produits ouverts à la revente.
 */
export function versParametresApi(f: Filtres): URLSearchParams {
  const params = new URLSearchParams({ revente: "1", famille: f.famille });

  if (f.famille === "ordinateur") {
    f.types.forEach((id) => params.append("categories[]", String(id)));
    f.processeurs.forEach((p) => params.append("processeurs[]", p));
    if (f.stockages.length) params.set("stockage_min", String(Math.min(...f.stockages)));
    if (f.stockageType !== "tous") params.set("stockage_type", f.stockageType);
    f.rams.filter((r) => !r.endsWith("+")).forEach((r) => params.append("rams[]", r));
    const ramsMin = f.rams.filter((r) => r.endsWith("+")).map((r) => parseInt(r, 10));
    if (ramsMin.length) params.set("ram_min", String(Math.min(...ramsMin)));
    f.tailles.forEach((t) => params.append("tailles[]", String(t)));
  } else {
    f.categories.forEach((id) => params.append("categories[]", String(id)));
  }

  if (f.famille !== "logiciels") f.marques.forEach((m) => params.append("marques[]", m));
  return params;
}

/** Nombre de filtres actifs sur la famille affichée (pastille de résumé). */
export function compterFiltres(f: Filtres): number {
  const params = versParametresApi(f);
  return [...params.keys()].filter((cle) => !["revente", "famille"].includes(cle)).length;
}
