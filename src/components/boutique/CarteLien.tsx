import { depuisIl, type LienVente } from "@/lib/ventesBoutique";
import { ImageIcon } from "@/components/icons";
import { OMBRE_CARTE } from "@/components/boutique/style";
import { STYLE_STATUT } from "@/components/boutique/CarteVente";

const STYLE_PASTILLE_LIEN = {
  vues: { fond: "#E8F0FE", texte: "#2563EB" },
  commandes: { fond: "#FFF1DC", texte: "#EA7A0B" },
  livree: STYLE_STATUT.livree,
  en_cours: { fond: "#E8F0FE", texte: "#0B6FD6" },
  en_attente: STYLE_STATUT.en_attente,
  annulee: STYLE_STATUT.annulee,
};

function PastilleLien({ style, children }: { style: { fond: string; texte: string }; children: string }) {
  return (
    <span
      className="flex h-[15px] shrink-0 items-center rounded-full px-1.5 text-[7.5px] font-semibold"
      style={{ background: style.fond, color: style.texte }}
    >
      {children}
    </span>
  );
}

export function CarteLien({ lien, onOuvrir }: { lien: LienVente; onOuvrir?: () => void }) {
  const { par_statut: statuts } = lien;
  const Racine = onOuvrir ? "button" : "div";

  return (
    <Racine
      {...(onOuvrir ? { type: "button" as const, onClick: onOuvrir } : {})}
      className="flex w-full shrink-0 items-center gap-3 rounded-[10px] bg-white px-2.5 py-2 text-left"
      style={{ boxShadow: OMBRE_CARTE }}
    >
      <div className="relative h-[46px] w-[46px] shrink-0">
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-[#E9EDF5] bg-[#F7F8FF] text-brand-muted">
          {lien.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- domaine backend dynamique, pas de config next/image nécessaire ici
            <img src={lien.image} alt="" className="h-full w-full object-contain p-1" />
          ) : (
            <ImageIcon className="h-5 w-5" />
          )}
        </div>
        <span
          aria-label={lien.actif ? "Lien actif" : "Lien inactif"}
          className={`absolute bottom-0.5 right-0.5 h-[7px] w-[7px] rounded-full ring-[3px] ${
            lien.actif ? "bg-green-500 ring-green-200" : "bg-slate-400 ring-slate-200"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 truncate text-[13px] font-extrabold leading-tight text-[#333]">{lien.nom_produit}</p>
          <p className="shrink-0 text-[9px] text-brand-muted">{depuisIl(lien.derniere_activite)}</p>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          <PastilleLien style={STYLE_PASTILLE_LIEN.vues}>{`${lien.vues} Vue${lien.vues > 1 ? "s" : ""}`}</PastilleLien>
          <PastilleLien style={STYLE_PASTILLE_LIEN.commandes}>{`${lien.commandes} CMD`}</PastilleLien>
          {statuts.livree > 0 ? (
            <PastilleLien style={STYLE_PASTILLE_LIEN.livree}>{`${statuts.livree} Livrée${statuts.livree > 1 ? "s" : ""}`}</PastilleLien>
          ) : null}
          {statuts.en_cours > 0 ? <PastilleLien style={STYLE_PASTILLE_LIEN.en_cours}>{`${statuts.en_cours} en cours`}</PastilleLien> : null}
          {statuts.en_attente > 0 ? (
            <PastilleLien style={STYLE_PASTILLE_LIEN.en_attente}>{`${statuts.en_attente} en attente`}</PastilleLien>
          ) : null}
          {statuts.annulee > 0 ? (
            <PastilleLien style={STYLE_PASTILLE_LIEN.annulee}>{`${statuts.annulee} annulée${statuts.annulee > 1 ? "s" : ""}`}</PastilleLien>
          ) : null}
        </div>
      </div>
    </Racine>
  );
}
