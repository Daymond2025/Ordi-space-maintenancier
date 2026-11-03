import type { ComponentType, SVGProps } from "react";
import { formaterPrix } from "@/lib/types";
import {
  formaterDateVente,
  LIBELLE_SOURCE_VENTE,
  LIBELLE_STATUT_VENTE,
  type SourceVente,
  type StatutVente,
  type VenteBoutique,
} from "@/lib/ventesBoutique";
import { BulleMessageIcon, ImageIcon, PresspapiersIcon, QrCodeIcon, UtilisateurCocheIcon } from "@/components/icons";
import { OMBRE_CARTE } from "@/components/boutique/style";

export const STYLE_STATUT: Record<StatutVente, { fond: string; texte: string }> = {
  livree: { fond: "#E1F7E8", texte: "#16A34A" },
  en_cours: { fond: "#CBE7FF", texte: "#0B6FD6" },
  en_attente: { fond: "#FFF0D3", texte: "#C2740A" },
  annulee: { fond: "#FDE2E2", texte: "#E02424" },
};

const STYLE_SOURCE: Record<SourceVente, { fond: string; icone: ComponentType<SVGProps<SVGSVGElement>> }> = {
  manuelle: { fond: "#DCE2F7", icone: PresspapiersIcon },
  whatsapp: { fond: "#ECEEF6", icone: BulleMessageIcon },
  qr: { fond: "#ECEEF6", icone: QrCodeIcon },
};

export function CarteVente({ vente }: { vente: VenteBoutique }) {
  const statut = STYLE_STATUT[vente.statut];
  const source = STYLE_SOURCE[vente.source];
  const IconeSource = source.icone;

  return (
    <div className="shrink-0 rounded-[10px] bg-white p-1.5" style={{ boxShadow: OMBRE_CARTE }}>
      <div className="flex gap-3">
        {vente.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- domaine backend dynamique, pas de config next/image nécessaire ici
          <img src={vente.image} alt="" className="h-[70px] w-[70px] shrink-0 rounded-md object-cover" />
        ) : (
          <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-md bg-[#F2F5FA] text-brand-muted">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 pr-1">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 min-w-0 text-[10.5px] font-extrabold leading-[1.2] text-brand-ink">{vente.nom_produit ?? "Produit"}</p>
            <div className="flex shrink-0 items-center gap-1.5">
              <span
                className="flex h-[17px] items-center gap-0.5 rounded-full px-1.5 text-[7.5px] font-semibold text-slate-600"
                style={{ background: source.fond }}
              >
                <IconeSource className="h-2.5 w-2.5" />
                {LIBELLE_SOURCE_VENTE[vente.source]}
              </span>
              <span
                className="flex h-[18px] w-[72px] items-center justify-center rounded-full text-[10px] font-semibold"
                style={{ background: statut.fond, color: statut.texte }}
              >
                {LIBELLE_STATUT_VENTE[vente.statut]}
              </span>
            </div>
          </div>
          <p className="text-[8px] text-brand-muted">{vente.specs.join(" • ")}</p>
          <div className="flex items-center justify-between gap-2">
            <p className="flex min-w-0 items-center gap-1 text-[11px] font-semibold text-brand-ink">
              <UtilisateurCocheIcon className="h-4 w-4 shrink-0 text-[#0077FF]" />
              <span className="truncate">{vente.client}</span>
            </p>
            <p className="shrink-0 text-[9px] text-brand-muted">{formaterDateVente(vente.date)}</p>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center rounded-md px-2.5 py-1.5" style={{ background: "#F3F5FF" }}>
        <div className="flex-1">
          <p className="text-[9px] font-semibold text-brand-muted">Prix Vente</p>
          <p className="mt-0.5 text-xs font-extrabold text-brand-ink">{formaterPrix(vente.prix_vente)} FCFA</p>
        </div>
        <span aria-hidden="true" className="mx-3 h-7 w-px bg-slate-300/70" />
        <div className="flex-1 text-right">
          <p className="text-[8px] font-bold text-[#7A4B0F]">Ta commission</p>
          <p className="mt-0.5 text-[15px] font-extrabold leading-tight" style={{ color: "#FF9700" }}>
            +{formaterPrix(vente.commission)} FCFA
          </p>
        </div>
      </div>
    </div>
  );
}
