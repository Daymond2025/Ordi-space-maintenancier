"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { type LienVente, type ReponseVentes, type StatutVente } from "@/lib/ventesBoutique";
import { ChevronLeftIcon } from "@/components/icons";
import { CarteLien } from "@/components/boutique/CarteLien";
import { CarteVente } from "@/components/boutique/CarteVente";
import { DEGRADE_BLEU } from "@/components/boutique/style";

const ONGLETS = [
  { id: "ventes", label: "Les ventes" },
  { id: "liens", label: "Vente par lien" },
] as const;

const FILTRES: { id: "tout" | StatutVente; label: string }[] = [
  { id: "tout", label: "Tout" },
  { id: "en_cours", label: "En cours" },
  { id: "en_attente", label: "En attente" },
  { id: "livree", label: "Livrée" },
  { id: "annulee", label: "Annulée" },
];

/**
 * "Centre des ventes" — onglet "Ventes" de la Boutique : les ventes réalisées
 * par le livreur et la commission qu'il en tire, lues sur GET /boutique/ventes
 * (de vraies commandes rattachées au livreur). L'onglet "Vente par lien"
 * liste ses liens de vente (GET /boutique/liens) : visites et devenir des
 * commandes passées par chaque lien. Pas de barre de navigation ici, comme
 * sur le mockup (retour = flèche de l'en-tête).
 */
export function EcranVentes() {
  const router = useRouter();
  const { token } = useAuth();
  const [reponse, setReponse] = useState<ReponseVentes | null>(null);
  const [erreur, setErreur] = useState(false);
  const [liens, setLiens] = useState<LienVente[] | null>(null);
  const [erreurLiens, setErreurLiens] = useState(false);
  const [onglet, setOnglet] = useState<(typeof ONGLETS)[number]["id"]>("ventes");
  const [filtre, setFiltre] = useState<(typeof FILTRES)[number]["id"]>("tout");

  useEffect(() => {
    if (!token) return;
    let annule = false;
    const parametres = new URLSearchParams({ per_page: "50" });
    if (filtre !== "tout") parametres.set("statut", filtre);

    apiFetch<ReponseVentes>(`/boutique/ventes?${parametres}`, { token })
      .then((donnees) => {
        if (annule) return;
        setReponse(donnees);
        setErreur(false);
      })
      .catch(() => {
        if (!annule) setErreur(true);
      });

    return () => {
      annule = true;
    };
  }, [token, filtre]);

  useEffect(() => {
    if (!token || onglet !== "liens") return;
    let annule = false;

    apiFetch<LienVente[]>("/boutique/liens", { token })
      .then((donnees) => {
        if (annule) return;
        setLiens(donnees);
        setErreurLiens(false);
      })
      .catch(() => {
        if (!annule) setErreurLiens(true);
      });

    return () => {
      annule = true;
    };
  }, [token, onglet]);

  const stats = reponse?.stats;
  const ventes = reponse?.ventes.data ?? [];

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#F7F8FF]">
      <div className="shrink-0" style={{ background: DEGRADE_BLEU }}>
        <div className="flex items-center gap-3 px-3.5 pb-3 pt-3.5">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Retour"
            className="flex h-[30px] w-8 shrink-0 items-center justify-center rounded-lg bg-white/25 text-white"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="text-white">
            <p className="text-[13px] font-extrabold uppercase leading-tight">Centre des ventes</p>
            <p className="mt-0.5 text-[9px] leading-tight text-white/90">
              {stats?.produits ?? 0} Produit{(stats?.produits ?? 0) > 1 ? "s" : ""} <span className="mx-0.5">•</span>{" "}
              {stats?.commandes ?? 0} Commande{(stats?.commandes ?? 0) > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`relative z-10 shrink-0 rounded-b-[20px] bg-white px-3 pt-3 ${onglet === "ventes" ? "pb-3.5" : "pb-5"}`}
        style={{ boxShadow: "0px 2px 3px 0px rgba(0, 0, 0, 0.16)" }}
      >
        <div className="flex h-[34px] rounded-full border border-[#E3E8F1] bg-[#F2F5FA] p-[3px]">
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOnglet(o.id)}
              className={`flex-1 rounded-full text-xs font-extrabold transition-colors ${onglet === o.id ? "text-white" : "text-brand-ink"}`}
              style={onglet === o.id ? { background: DEGRADE_BLEU } : undefined}
            >
              {o.label}
            </button>
          ))}
        </div>

        {onglet === "ventes" ? (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {FILTRES.map((f) => {
              const actif = filtre === f.id;
              const nombre = f.id === "tout" ? null : (stats?.par_statut[f.id] ?? 0);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFiltre(f.id)}
                  className={`h-[22px] shrink-0 rounded-full px-3 text-[9px] font-bold ${
                    actif ? "text-white" : "bg-[#F2F5FA] text-brand-ink"
                  }`}
                  style={actif ? { background: "#0077FF" } : undefined}
                >
                  {nombre !== null ? `${nombre} ` : ""}
                  {f.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {onglet === "ventes" ? (
        <div className="flex shrink-0 flex-col gap-4 px-3.5 pb-6 pt-10">
          {ventes.map((vente) => (
            <CarteVente key={vente.id} vente={vente} />
          ))}
          {reponse && ventes.length === 0 ? (
            <p className="pt-6 text-center text-sm text-brand-muted">Aucune vente pour le moment.</p>
          ) : null}
          {erreur ? <p className="pt-6 text-center text-sm text-red-500">Impossible de charger tes ventes.</p> : null}
        </div>
      ) : (
        <div className="flex shrink-0 flex-col gap-3 px-[22px] pb-6 pt-6">
          {(liens ?? []).map((lien) => (
            <CarteLien key={lien.id} lien={lien} onOuvrir={() => router.push(`/boutique/ventes/liens/${lien.id}`)} />
          ))}
          {liens && liens.length === 0 ? (
            <p className="pt-6 text-center text-sm text-brand-muted">
              Aucun lien pour le moment — génère-en un depuis « Vendre ce produit ».
            </p>
          ) : null}
          {erreurLiens ? <p className="pt-6 text-center text-sm text-red-500">Impossible de charger tes liens.</p> : null}
        </div>
      )}
    </div>
  );
}
