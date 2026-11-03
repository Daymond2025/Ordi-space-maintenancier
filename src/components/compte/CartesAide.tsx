import { ChevronRightIcon, HeadsetIcon, ShieldIcon } from "@/components/icons";

const OMBRE = "0px 6px 16px 0px rgba(0, 119, 255, 0.1)";

/**
 * Carte "Support Partenaire WhatsApp" (Profil boutique, Mes infos) : ouvre une
 * conversation WhatsApp avec le support Ordi'Space — numéro unique fixé par
 * l'Admin (GET /support). Sans numéro, la carte n'est pas affichée.
 */
export function CarteSupportWhatsApp({ whatsappUrl }: { whatsappUrl: string | null }) {
  if (!whatsappUrl) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-[14px] bg-white px-3 py-3"
      style={{ boxShadow: OMBRE }}
    >
      <span className="flex h-9 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D9F5E6] text-[#12A15A]">
        <HeadsetIcon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-extrabold leading-tight text-[#0B1B3A]">Support Partenaire WhatsApp</p>
        <p className="mt-0.5 text-[10.5px] font-semibold leading-tight text-[#16A34A]">Disponible 7j/7 avec votre agent dédié</p>
      </div>
    </a>
  );
}

/**
 * Carte "Confidentialité et UGC". Pas encore branchée : la page cible
 * (politique de confidentialité / contenus utilisateurs) n'existe pas.
 */
export function CarteConfidentialite({ onOuvrir }: { onOuvrir?: () => void }) {
  return (
    <button
      type="button"
      onClick={onOuvrir}
      className="flex w-full items-center gap-3 rounded-[14px] bg-white px-3 py-3.5 text-left"
      style={{ boxShadow: OMBRE }}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#DCE5FF] text-[#4F46E5]">
        <ShieldIcon className="h-4 w-4" />
      </span>
      <span className="ml-2 flex-1 text-xs font-extrabold text-[#0B1B3A]">Confidentialité et UGC</span>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-[#4B5563]" />
    </button>
  );
}
