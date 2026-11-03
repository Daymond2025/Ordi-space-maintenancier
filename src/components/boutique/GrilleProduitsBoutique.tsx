"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { formaterPrix } from "@/lib/types";
import { LIBELLE_ETAT_PRODUIT, resumerSpecs, type ProduitBoutique } from "@/lib/produitsBoutique";
import { ImageIcon } from "@/components/icons";
import { PopupLienAffilie } from "@/components/boutique/PopupLienAffilie";

const COULEUR_BOUTON_VENDRE = "rgba(255, 151, 0, 1)";

function CarteProduitBoutique({
  produit,
  chargement,
  onVendre,
  onOuvrir,
}: {
  produit: ProduitBoutique;
  chargement: boolean;
  onVendre: () => void;
  onOuvrir: () => void;
}) {
  const specs = resumerSpecs(produit);
  const image = produit.images[0]?.url_image;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.25)" }}>
      <button type="button" onClick={onOuvrir} className="relative h-28 w-full text-left">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- domaine backend dynamique (dev/prod), pas de config next/image nécessaire ici
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F2F5FA] text-brand-muted">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        {produit.etat_produit ? (
          <span className="absolute left-2 top-2 rounded-md bg-amber-400 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
            {LIBELLE_ETAT_PRODUIT[produit.etat_produit]}
          </span>
        ) : null}
        {produit.pourcentage_reduction ? (
          <span className="absolute right-2 top-2 rounded-md bg-orange-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
            -{produit.pourcentage_reduction}%
          </span>
        ) : null}
      </button>

      <div className="flex flex-col gap-1.5 p-2.5">
        <button type="button" onClick={onOuvrir} className="text-left">
          <p className="line-clamp-2 text-xs font-extrabold leading-tight text-brand-ink">{produit.nom_produit}</p>
        </button>

        {specs.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {specs.map((spec) => (
              <span key={spec} className="rounded bg-[#F2F5FA] px-1.5 py-0.5 text-[9px] font-semibold text-brand-muted">
                {spec}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-baseline gap-1.5">
          <p className="text-sm font-extrabold text-brand-ink">
            {produit.prix_vente ? `${formaterPrix(produit.prix_vente)} CFA` : "Prix à venir"}
          </p>
          {produit.prix_barre ? (
            <p className="text-[10px] text-brand-muted line-through">{formaterPrix(produit.prix_barre)}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between rounded-lg bg-amber-50 px-2 py-1">
          <span className="text-[9px] font-bold text-amber-700">Commission</span>
          <span className="text-xs font-extrabold text-amber-700">
            {produit.commission_apporteur ? `${formaterPrix(produit.commission_apporteur)} CFA` : "—"}
          </span>
        </div>

        <button
          type="button"
          onClick={onVendre}
          disabled={chargement}
          className="mt-0.5 w-full text-[11px] font-extrabold text-white disabled:opacity-60"
          style={{ height: 30, borderRadius: 5, background: COULEUR_BOUTON_VENDRE }}
        >
          {chargement ? "…" : "Vendre ce produit"}
        </button>
      </div>
    </div>
  );
}

/**
 * Grille de cartes produit de la Boutique, commune à l'accueil et aux résultats
 * du filtre "Catégorie". "Vendre ce produit" génère le lien affilié réel
 * (POST /boutique/produits/{id}/lien) et l'affiche dans une pop-up
 * Copier/Partager ; taper la carte ouvre le détail produit.
 */
export function GrilleProduitsBoutique({ produits }: { produits: ProduitBoutique[] }) {
  const router = useRouter();
  const { token } = useAuth();
  const [chargementCarteId, setChargementCarteId] = useState<number | null>(null);
  const [lienActif, setLienActif] = useState<string | null>(null);

  async function onVendre(produit: ProduitBoutique) {
    if (!token || chargementCarteId) return;
    setChargementCarteId(produit.id);
    try {
      const reponse = await apiFetch<{ code: string; url: string }>(`/boutique/produits/${produit.id}/lien`, {
        method: "POST",
        token,
      });
      setLienActif(reponse.url);
    } catch {
      // Silencieux : le livreur peut simplement retenter.
    } finally {
      setChargementCarteId(null);
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 px-4 pb-24 pt-4">
        {produits.map((produit) => (
          <CarteProduitBoutique
            key={produit.id}
            produit={produit}
            chargement={chargementCarteId === produit.id}
            onVendre={() => onVendre(produit)}
            onOuvrir={() => router.push(`/boutique/produits/${produit.id}`)}
          />
        ))}
      </div>
      {lienActif ? <PopupLienAffilie url={lienActif} onFermer={() => setLienActif(null)} /> : null}
    </>
  );
}
