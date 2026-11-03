import type { ComponentType, ReactNode, SVGProps } from "react";
import { PhoneFilledIcon, WhatsappIcon } from "@/components/icons";
import { lienWebSur } from "@/lib/liens";

type Icone = ComponentType<SVGProps<SVGSVGElement>>;

const OMBRE = "0px 8px 20px 0px rgba(0, 119, 255, 0.1)";

function Ligne({ icone: IconeLigne, label, valeur, actions }: { icone: Icone; label: string; valeur: string; actions?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#EEF1F6] py-3 last:border-b-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#E8F1FE] text-[color:var(--brand-blue-end)]">
        <IconeLigne className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-[#64748B]">{label}</p>
        <p className="text-[15px] font-extrabold leading-snug text-[#1E2A3B]">{valeur}</p>
      </div>
      {actions}
    </div>
  );
}

/** Boutons ronds WhatsApp + appel d'une ligne "Téléphone". */
function ActionsContact({ telephone, whatsappUrl }: { telephone: string; whatsappUrl: string | null }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Écrire sur WhatsApp"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDF7E8] text-[#16A34A]"
        >
          <WhatsappIcon className="h-5 w-5" />
        </a>
      ) : null}
      <a
        href={`tel:${telephone}`}
        aria-label="Appeler"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F1FE] text-[color:var(--brand-blue-end)]"
      >
        <PhoneFilledIcon className="h-[18px] w-[18px]" />
      </a>
    </div>
  );
}

export type LignePartenaire = { icone: Icone; label: string; valeur: string | null };

/**
 * Carte "partenaire" de l'écran "Mes infos" — en-tête (logo, nom, rôle) puis
 * lignes Téléphone / Adresse / Horaires / Zone couverte : la fiche du
 * coordinateur du livreur. Une ligne dont la valeur est vide n'est pas
 * affichée ; le téléphone porte les boutons WhatsApp et appel.
 */
export function CartePartenaire({
  logo,
  nom,
  sousTitre,
  telephone,
  whatsappUrl,
  lignes = [],
  action,
}: {
  logo: ReactNode;
  nom: string;
  sousTitre: string;
  telephone: string | null;
  whatsappUrl: string | null;
  lignes?: LignePartenaire[];
  /** Bouton pleine largeur sous les lignes (ex. "Itinéraire vers le fournisseur"). */
  action?: { libelle: string; href: string };
}) {
  return (
    <div className="rounded-[28px] bg-white px-[19px] pb-3 pt-[21px]" style={{ boxShadow: OMBRE }}>
      <div className="flex items-center gap-3 rounded-xl bg-[#E8F1FE] px-3 py-2.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(0,0,0,0.12)]">
          {logo}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-extrabold uppercase text-[#0B1B3A]">{nom}</p>
          <p className="text-[10px] font-semibold text-[#0B6FD6]">{sousTitre}</p>
        </div>
      </div>

      <div className="mt-1">
        {telephone ? (
          <Ligne
            icone={PhoneFilledIcon}
            label="Téléphone"
            valeur={telephone}
            actions={<ActionsContact telephone={telephone} whatsappUrl={whatsappUrl} />}
          />
        ) : null}
        {lignes
          .filter((l): l is LignePartenaire & { valeur: string } => Boolean(l.valeur))
          .map((l) => (
            <Ligne key={l.label} icone={l.icone} label={l.label} valeur={l.valeur} />
          ))}
      </div>

      {action && lienWebSur(action.href) ? (
        <a
          href={lienWebSur(action.href) ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-1 mt-2 flex h-11 items-center justify-center rounded-xl text-[13px] font-extrabold text-white"
          style={{ background: "linear-gradient(90deg, #0077FF 0%, #00BFFF 100%)" }}
        >
          {action.libelle}
        </a>
      ) : null}
    </div>
  );
}
