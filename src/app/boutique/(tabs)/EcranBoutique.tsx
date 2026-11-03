"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { Pagination } from "@/lib/types";
import type { ResumePortefeuille } from "@/lib/portefeuille";
import { formaterMontantPoints } from "@/lib/ventesBoutique";
import { categorieBoutique, type ProduitBoutique } from "@/lib/produitsBoutique";
import { BellIcon, ChevronLeftIcon, ChevronRightIcon, WalletIcon } from "@/components/icons";
import { GrilleProduitsBoutique } from "@/components/boutique/GrilleProduitsBoutique";

const DEGRADE_HEADER = "linear-gradient(90deg, #0077FF 0%, #00BFFF 100%)";

const CATEGORIES = [
  { id: "tout", label: "Tout" },
  { id: "ordinateurs", label: "Ordinateurs" },
  { id: "accessoires", label: "Accessoires" },
  { id: "logiciels", label: "Logiciels" },
] as const;

/**
 * "Boutique" — accessible depuis l'icône boutique de "Mon Profil". Le
 * livreur revend de vrais produits publiés par Fournisseur/Coordinateur/
 * Admin (GET /produits, public) en échange de la commission renseignée sur
 * chaque produit (`commission_apporteur` — le livreur a rejoint le
 * maintenancier comme "apporteur d'affaire", retour du PDG) — seuls les
 * produits où ce champ est renseigné apparaissent ici, les autres ne sont
 * pas ouverts à la revente.
 * Les cartes (vente par lien, détail) sont celles de GrilleProduitsBoutique ;
 * le filtre détaillé (marque, RAM…) est l'onglet "Catégorie".
 */
export function EcranBoutique() {
  const router = useRouter();
  const { token } = useAuth();
  const [categorie, setCategorie] = useState<(typeof CATEGORIES)[number]["id"]>("tout");
  const [produits, setProduits] = useState<ProduitBoutique[] | null>(null);
  const [resume, setResume] = useState<ResumePortefeuille | null>(null);

  // Commission disponible de l'en-tête : le même solde que sur "Portefeuille".
  useEffect(() => {
    if (!token) return;
    let annule = false;
    apiFetch<ResumePortefeuille>("/boutique/portefeuille", { token })
      .then((soldes) => {
        if (!annule) setResume(soldes);
      })
      .catch(() => {});
    return () => {
      annule = true;
    };
  }, [token]);

  useEffect(() => {
    apiFetch<Pagination<ProduitBoutique>>("/produits?per_page=50", { token: token ?? undefined })
      .then((page) => setProduits(page.data.filter((p) => p.commission_apporteur !== null)))
      .catch(() => setProduits([]));
  }, [token]);

  const produitsFiltres = produits?.filter((p) => categorie === "tout" || categorieBoutique(p.categorie?.nom_categorie) === categorie);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f2f5fa]">
      <div className="relative shrink-0 pb-4 pt-5" style={{ background: DEGRADE_HEADER, borderRadius: "0 0 30px 30px" }}>
        <div className="flex items-center justify-between px-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Retour"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => router.push("/notifications")}
            aria-label="Notifications"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white"
          >
            <BellIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="mt-2 flex flex-col items-center">
          <p className="text-xs font-semibold text-white/80">Commission disponible</p>
          <p className="mt-0.5 text-[28px] font-extrabold leading-tight text-white">{formaterMontantPoints(resume?.disponible ?? 0)} FCFA</p>
          <button
            type="button"
            onClick={() => router.push("/boutique/portefeuille")}
            className="mt-3 flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-bold text-white"
          >
            <WalletIcon className="h-4 w-4" />
            Voir mon portefeuille
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mx-6 mt-4 h-px bg-white/25" />

        <div className="mt-3 flex gap-2 overflow-x-auto px-4 pb-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategorie(cat.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                categorie === cat.id ? "bg-white text-[color:var(--brand-blue-end)]" : "bg-white/20 text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {produitsFiltres === null || produitsFiltres === undefined ? (
        <p className="py-10 text-center text-sm text-brand-muted">Chargement…</p>
      ) : produitsFiltres.length === 0 ? (
        <p className="py-10 text-center text-sm text-brand-muted">Aucun produit à revendre dans cette catégorie.</p>
      ) : (
        <GrilleProduitsBoutique produits={produitsFiltres} />
      )}
    </div>
  );
}
