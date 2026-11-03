import type { DemandeSav, Intervention, NiveauGravite } from "@/lib/types";
import { CalendrierIcon, HorlogeIcon, PhoneFilledIcon, PinIcon } from "@/components/icons";
import { DEGRADE_BLEU, SERVICES, dateLongue, heure, libelleDuree, statutEtDate, telephoneCarte } from "@/lib/rendezVous";

export const OMBRE_CARTE = "0px 6px 20px rgba(16, 24, 40, 0.08)";

const GRAVITES: { id: NiveauGravite; label: string }[] = [
  { id: "faible", label: "Faible" },
  { id: "moyenne", label: "Moyenne" },
  { id: "critique", label: "Critique" },
];

export function Carte({ titre, children, className = "px-[18px]" }: { titre: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[18px] bg-white pb-5 pt-4 ${className}`} style={{ boxShadow: OMBRE_CARTE }}>
      <h2 className="text-[13px] text-[#3A3A3A]">{titre}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function Pastille({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`flex h-[26px] items-center gap-2 rounded-[4px] bg-[#F3F4F6] px-2.5 text-[13px] text-[#111111] ${className}`}>{children}</span>;
}

/** Puces grises bordées (problèmes, prestations, pièces). */
export function Puces({ valeurs }: { valeurs: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2.5">
      {valeurs.map((v) => (
        <span key={v} className="rounded-full border border-[#DCDFE4] bg-[#F5F6F8] px-3 py-1 text-[9px] text-[#2B2B2B]">
          {v}
        </span>
      ))}
    </div>
  );
}

export function CarteMotif({ demande }: { demande: DemandeSav }) {
  return (
    <Carte titre="Motif du rendez-vous">
      <div className="flex flex-wrap gap-1.5">
        {SERVICES.map((s) => (
          <span key={s} className="rounded-full border border-[#DCDFE4] bg-[#F5F6F8] px-3 py-0.5 text-[9px] text-[#2B2B2B]">
            {s}
          </span>
        ))}
      </div>
      <p className="mt-5 flex min-h-[50px] items-center justify-center rounded-[4px] border border-[#E2E5EA] bg-[#F3F4F6] px-3 py-2 text-center text-[11px] text-[#2B2B2B]">
        {demande.description_probleme}
      </p>
    </Carte>
  );
}

export function CarteDateRendezVous({ demande }: { demande: DemandeSav }) {
  const { rdv, date } = statutEtDate(demande);

  return (
    <Carte titre="Date & heure du rendez-vous">
      {rdv ? (
        <div className="flex items-center gap-3">
          <Pastille className="min-w-0 flex-1 !gap-1.5 !px-2 !text-[12px]">
            <CalendrierIcon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{dateLongue(date)}</span>
          </Pastille>
          <Pastille className="w-[92px] shrink-0 !text-[12px]">
            <HorlogeIcon className="h-[18px] w-[18px] shrink-0" />
            <span className="flex-1 text-center">{heure(date)}</span>
          </Pastille>
        </div>
      ) : (
        <Pastille>
          <CalendrierIcon className="h-[18px] w-[18px] shrink-0" />À fixer en acceptant la demande
        </Pastille>
      )}
    </Carte>
  );
}

export function CarteCoordonneesClient({ demande }: { demande: DemandeSav }) {
  const client = demande.client?.user;
  const adresse = demande.client?.adresses?.[0];
  const libelleAdresse = adresse ? [adresse.localite?.nom ?? adresse.ville, adresse.rue].filter(Boolean).join(" ") : "Adresse non renseignée";

  return (
    <Carte titre="Coordonnées client">
      <Pastille>
        <PinIcon className="h-4 w-4 shrink-0" />
        <span className="truncate">{libelleAdresse}</span>
      </Pastille>
      <div className="mt-2.5 flex items-center gap-8">
        <Pastille className="min-w-0 flex-1">
          <PhoneFilledIcon className="h-4 w-4 shrink-0" />
          <span className="truncate">{client?.telephone ? telephoneCarte(client.telephone) : "—"}</span>
        </Pastille>
        {client?.telephone ? (
          <a
            href={`tel:${client.telephone}`}
            className="flex h-8 w-[114px] shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ background: DEGRADE_BLEU }}
          >
            Appeler le client
          </a>
        ) : null}
      </div>
    </Carte>
  );
}

/** Problème identifié, cause, gravité, temps estimé — écran intervention en cours et onglet "Info diagnostic". */
export function RecapDiagnostic({ intervention }: { intervention: Intervention }) {
  const problemes = intervention.problemes ?? [];

  return (
    <>
      <Carte titre="Problème identifié" className="px-[24px]">
        {problemes.length > 0 ? <Puces valeurs={problemes} /> : null}
        {intervention.probleme_identifie ? (
          <p className={`${problemes.length > 0 ? "mt-3" : ""} min-h-[58px] whitespace-pre-line rounded-[4px] border border-[#E2E5EA] bg-[#F5F6F8] px-4 py-3 text-[10px] text-[#111111]`}>
            {intervention.probleme_identifie}
          </p>
        ) : null}
        {problemes.length === 0 && !intervention.probleme_identifie ? <p className="text-[11px] text-brand-muted">Non renseigné</p> : null}
      </Carte>

      <Carte titre="Cause de la panne" className="px-[24px]">
        <p className="min-h-[58px] whitespace-pre-line rounded-[6px] border border-[#E2E5EA] px-5 py-3 text-[15px] leading-snug text-[#2B2B2B]">
          {intervention.cause_panne || "Non renseignée"}
        </p>
      </Carte>

      <Carte titre="Niveau de gravité" className="px-[24px]">
        <div className="flex h-[38px] items-center rounded-[4px] border border-[#E2E5EA] bg-[#F3F4F6] p-[3px]">
          {GRAVITES.map((g) => (
            <span
              key={g.id}
              className={`flex h-full flex-1 items-center justify-center rounded-[6px] text-[12px] ${intervention.niveau_gravite === g.id ? "font-medium text-white" : "text-[#2B2B2B]"}`}
              style={intervention.niveau_gravite === g.id ? { background: DEGRADE_BLEU, boxShadow: "0px 6px 12px rgba(0, 119, 255, 0.30)" } : undefined}
            >
              {g.label}
            </span>
          ))}
        </div>
      </Carte>

      <section className="flex items-center justify-between rounded-[18px] bg-white px-[24px] py-[12px]" style={{ boxShadow: OMBRE_CARTE }}>
        <h2 className="text-[13px] text-[#3A3A3A]">Temps estimé d&apos;intervention</h2>
        <span className="rounded-[6px] bg-[#F3F4F6] px-4 py-2.5 text-[12px] text-[#2B2B2B]">
          {intervention.duree_estimee_minutes ? libelleDuree(intervention.duree_estimee_minutes) : "—"}
        </span>
      </section>
    </>
  );
}
