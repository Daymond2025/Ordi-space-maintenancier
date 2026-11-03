"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { formaterMontantPoints, type ReponseLien } from "@/lib/ventesBoutique";
import { ChevronLeftIcon, ShareIcon } from "@/components/icons";
import { CarteLien } from "@/components/boutique/CarteLien";
import { CarteVente } from "@/components/boutique/CarteVente";
import { PopupLienAffilie } from "@/components/boutique/PopupLienAffilie";
import { DEGRADE_BLEU } from "@/components/boutique/style";

/**
 * "Vente par lien" (détail) — ouvert en tapant un lien dans l'onglet "Vente
 * par lien" du Centre des ventes : la carte du lien, le gain qu'il a rapporté
 * et les commandes passées par lui (GET /boutique/liens/{id}). Le bouton
 * partage renvoie le lien de vente lui-même (partage natif, pop-up Copier/
 * Partager en repli sur navigateur de bureau).
 */
export function EcranLienVente({ lienId }: { lienId: number }) {
  const router = useRouter();
  const { token } = useAuth();
  const [reponse, setReponse] = useState<ReponseLien | null>(null);
  const [erreur, setErreur] = useState(false);
  const [popupUrl, setPopupUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let annule = false;

    apiFetch<ReponseLien>(`/boutique/liens/${lienId}?per_page=50`, { token })
      .then((donnees) => {
        if (!annule) setReponse(donnees);
      })
      .catch(() => {
        if (!annule) setErreur(true);
      });

    return () => {
      annule = true;
    };
  }, [token, lienId]);

  async function onPartager() {
    if (!reponse) return;
    const { url, nom_produit: titre } = reponse.lien;
    if (navigator.share) {
      try {
        await navigator.share({ title: titre, text: `${titre} — Ordi'Space`, url });
      } catch {
        // Partage annulé par l'utilisateur — pas une erreur à signaler.
      }
    } else {
      setPopupUrl(url);
    }
  }

  const gain = reponse ? formaterMontantPoints(reponse.gain_total) : "0";

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#F7F8FF]">
      <div className="relative z-10 shrink-0 rounded-b-[20px] bg-white pb-6" style={{ boxShadow: "0px 2px 3px 0px rgba(0, 0, 0, 0.16)" }}>
        <div className="flex items-start gap-3.5 rounded-b-[32px] px-[18px] pb-[49px] pt-[19px]" style={{ background: DEGRADE_BLEU }}>
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Retour"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/25 text-white"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1 text-white">
            <p className="text-[13px] font-extrabold uppercase leading-tight">Vente par lien</p>
            <p className="mt-0.5 text-[9px] leading-tight text-white/90">
              Gain total : <span className="font-extrabold">{gain} FCFA</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onPartager}
            disabled={!reponse}
            aria-label="Partager le lien de vente"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-ink disabled:opacity-60"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="relative -mt-[30px] px-5">{reponse ? <CarteLien lien={reponse.lien} /> : <div className="h-16 rounded-[10px] bg-white" />}</div>
      </div>

      <div className="flex shrink-0 flex-col gap-4 px-3.5 pb-6 pt-[17px]">
        {(reponse?.ventes.data ?? []).map((vente) => (
          <CarteVente key={vente.id} vente={vente} />
        ))}
        {reponse && reponse.ventes.data.length === 0 ? (
          <p className="pt-6 text-center text-sm text-brand-muted">Aucune commande n&apos;est encore passée par ce lien.</p>
        ) : null}
        {erreur ? <p className="pt-6 text-center text-sm text-red-500">Impossible de charger ce lien.</p> : null}
      </div>

      {popupUrl ? <PopupLienAffilie url={popupUrl} onFermer={() => setPopupUrl(null)} /> : null}
    </div>
  );
}
