"use client";

import { useState } from "react";
import { CheckCircleIcon, CloseIcon, EclairBicoloreIcon, ShareIcon } from "@/components/icons";

type Props = {
  url: string;
  onFermer: () => void;
};

const COULEUR_PARTAGER = "rgba(255, 151, 0, 1)";

/**
 * Pop-up "Vendre ce produit" — le lien affilié vient d'être généré (ou
 * récupéré, voir BoutiqueController::genererLien()). Reproduit le mockup
 * fourni : carte centrée à bordure orange, deux tuiles Copier/Partager.
 */
export function PopupLienAffilie({ url, onFermer }: Props) {
  const [copie, setCopie] = useState(false);

  async function copierLien() {
    try {
      await navigator.clipboard.writeText(url);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // Presse-papiers indisponible (permissions navigateur) — rien à faire
      // de plus, le lien reste copiable manuellement depuis le partage.
    }
  }

  async function partager() {
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        // Partage annulé par l'utilisateur — pas une erreur à signaler.
      }
    } else {
      copierLien();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6" onClick={onFermer}>
      <div
        className="relative w-full max-w-[320px] rounded-[28px] border-[3px] border-orange-500 bg-white px-5 pb-6 pt-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onFermer}
          aria-label="Fermer"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-brand-line bg-white text-brand-ink"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>

        <p className="text-center text-lg font-extrabold leading-snug text-brand-ink">
          Créer un lien
          <br />
          de vente
        </p>

        <div className="mt-5 flex gap-4">
          <div className="flex flex-1 flex-col items-center gap-3">
            <button
              type="button"
              onClick={copierLien}
              aria-label="Copier le lien"
              className="flex h-24 w-full items-center justify-center rounded-2xl border-2 border-[color:var(--brand-blue-end)] bg-blue-50"
            >
              <EclairBicoloreIcon className="h-11 w-11" />
            </button>
            <button
              type="button"
              onClick={copierLien}
              className="bg-gradient-brand-blue w-full rounded-full py-2 text-xs font-extrabold text-white"
            >
              {copie ? "Copié !" : "Copier"}
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center gap-3">
            <button
              type="button"
              onClick={partager}
              aria-label="Partager le lien"
              className="flex h-24 w-full items-center justify-center rounded-2xl border-2 bg-orange-50"
              style={{ borderColor: COULEUR_PARTAGER }}
            >
              <ShareIcon className="h-10 w-10" style={{ color: COULEUR_PARTAGER }} />
            </button>
            <button
              type="button"
              onClick={partager}
              className="w-full rounded-full py-2 text-xs font-extrabold text-white"
              style={{ background: COULEUR_PARTAGER }}
            >
              Partager
            </button>
          </div>
        </div>

        {copie ? (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600">
            <CheckCircleIcon className="h-4 w-4" /> Lien copié dans le presse-papiers.
          </p>
        ) : null}
      </div>
    </div>
  );
}
