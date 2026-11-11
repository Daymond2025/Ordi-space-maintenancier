"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { DemandeSav, Pagination, ProfilTechnicien, StatutAffiche } from "@/lib/types";
import { BellIcon, CalendrierIcon, HorlogeIcon, UserIcon } from "@/components/icons";
import { InterrupteurDisponibilite } from "@/components/space/InterrupteurDisponibilite";
import { useRefetchOnFocus } from "@/lib/useRefetchOnFocus";
import {
  DEGRADE_BLEU,
  DEGRADE_HEADER,
  MOIS_BADGE,
  MOIS_COURTS,
  SERVICES_COURTS,
  debutJour,
  estAujourdhui,
  heure as formaterHeure,
  illustration,
  jourDeuxChiffres,
  nomClient,
  statutEtDate,
  telephoneCarte,
} from "@/lib/rendezVous";

const DEGRADE_CARTE_DEMANDE = "linear-gradient(90deg, #1673FF 0%, #00B6FF 100%)";

type Onglet = "tous" | "aujourdhui" | "a_venir";

const ONGLETS: { id: Onglet; label: string }[] = [
  { id: "tous", label: "Tous" },
  { id: "aujourdhui", label: "Aujourd'hui" },
  { id: "a_venir", label: "RDV À venir" },
];

const BADGES: Record<StatutAffiche, { label: string; style: React.CSSProperties }> = {
  demande: { label: "Demande", style: { border: "1.5px solid #FFFFFF" } },
  confirme: { label: "Confirmé", style: { background: "linear-gradient(90deg, #0B8F3A 0%, #35C55B 100%)" } },
  en_cours: { label: "En cours", style: { background: "linear-gradient(90deg, #0866FF 0%, #00B4FF 100%)" } },
  reporte: { label: "Reporter", style: { background: "linear-gradient(90deg, #FF7A00 0%, #FFC400 100%)" } },
  refuse: { label: "Refusé", style: { background: "linear-gradient(90deg, #A3102E 0%, #FF2A4F 100%)" } },
  termine: { label: "Terminée", style: { background: "linear-gradient(90deg, #101010 0%, #C2C2C2 100%)" } },
  annule: { label: "Annulée", style: { background: "linear-gradient(90deg, #A3102E 0%, #FF2A4F 100%)" } },
};

/** Ordre d'affichage : ce qui demande une action du technicien d'abord. */
const PRIORITE: Record<StatutAffiche, number> = { demande: 0, en_cours: 1, confirme: 2, reporte: 3, refuse: 4, annule: 5, termine: 6 };

type CarteRdv = {
  demande: DemandeSav;
  statut: StatutAffiche;
  date: Date;
};

function estAVenir(carte: CarteRdv): boolean {
  return debutJour(carte.date) > debutJour(new Date()) && carte.statut !== "termine" && carte.statut !== "refuse" && carte.statut !== "annule";
}

/** Une carte par demande SAV — voir statutEtDate(). */
function versCarte(demande: DemandeSav): CarteRdv {
  const { statut, date } = statutEtDate(demande);
  return { demande, statut, date };
}

function Puce({ claire, className = "", children }: { claire: boolean; className?: string; children: React.ReactNode }) {
  return (
    <span
      className={`flex h-[18px] shrink-0 items-center gap-1 rounded-[4px] px-1.5 text-[9px] font-medium ${
        claire ? "bg-white/25 text-white" : "bg-[#F1F2F4] text-[#2B2B2B]"
      } ${className}`}
    >
      {children}
    </span>
  );
}

function CarteRendezVous({ carte }: { carte: CarteRdv }) {
  const { demande, statut, date } = carte;
  const surBleu = statut === "demande";
  const client = demande.client?.user;
  const image = illustration(demande);
  const badge = BADGES[statut];
  const heure = formaterHeure(date);
  const jour = jourDeuxChiffres(date);

  return (
    <Link
      href={`/rendez-vous/${demande.id}`}
      className="relative flex items-center gap-3 rounded-[16px] p-[10px]"
      style={
        surBleu
          ? { background: DEGRADE_CARTE_DEMANDE, border: "1.5px solid #6FB4FF", boxShadow: "0px 10px 24px rgba(0, 119, 255, 0.25)" }
          : { background: "#FFFFFF", boxShadow: "0px 10px 24px rgba(0, 119, 255, 0.10)" }
      }
    >
      <span className={`flex h-[70px] w-[76px] shrink-0 items-center justify-center rounded-[10px] ${surBleu ? "bg-white/25" : "bg-[#EEF1F6]"}`}>
        {image ? <Image src={image} alt="" width={62} height={62} className="h-[58px] w-[62px] object-contain" /> : null}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={`flex h-6 min-w-0 flex-1 items-center gap-1.5 rounded-[6px] px-1.5 ${surBleu ? "bg-white/25" : "bg-[#F1F2F4]"}`}>
            <span className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2B2B2B] text-white">
              {client?.photo ? (
                <Image src={client.photo} alt="" width={16} height={16} className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-2.5 w-2.5" />
              )}
            </span>
            <span className={`truncate text-[11px] font-bold uppercase ${surBleu ? "text-white" : "text-[#111111]"}`}>
              {nomClient(demande)}
            </span>
          </span>

          <span className="flex h-6 w-[86px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={badge.style}>
            {badge.label}
          </span>
        </div>

        <p className={`mt-1.5 truncate text-[9px] ${surBleu ? "text-white/90" : "text-[#555555]"}`}>{SERVICES_COURTS}</p>

        <div className="mt-1.5 flex items-center gap-1.5 pr-8">
          {estAujourdhui(date) ? (
            <span className="flex h-[18px] shrink-0 items-center rounded-[4px] px-3 text-[9px] font-semibold text-white" style={{ background: DEGRADE_BLEU }}>
              Aujourd&apos;hui
            </span>
          ) : (
            <Puce claire={surBleu}>
              <CalendrierIcon className="h-2.5 w-2.5" />
              {jour} / {MOIS_COURTS[date.getMonth()]} / {date.getFullYear()}
            </Puce>
          )}
          <Puce claire={surBleu}>
            <HorlogeIcon className="h-2.5 w-2.5" />
            {heure}
          </Puce>
          {client?.telephone ? (
            <Puce claire={surBleu} className="min-w-0">
              <span className="truncate">{telephoneCarte(client.telephone)}</span>
            </Puce>
          ) : null}
        </div>
      </div>

      {statut !== "termine" && statut !== "annule" ? (
        <span
          className="absolute bottom-[14px] right-[12px] flex h-[22px] w-[22px] flex-col items-center justify-center rounded-[4px] leading-none text-white"
          style={{ background: DEGRADE_BLEU, border: surBleu ? "1px solid #FFFFFF" : undefined }}
        >
          <span className="text-[6px] font-bold">{jour}</span>
          <span className="mt-px text-[5px] font-semibold">{MOIS_BADGE[date.getMonth()]}</span>
        </span>
      ) : null}
    </Link>
  );
}

function CarteStat({ valeur, label, puce }: { valeur: string; label: string; puce: string }) {
  return (
    <div
      className="flex h-[113px] flex-col items-center justify-center rounded-[18px] bg-white px-1 text-center"
      style={{ boxShadow: "0px 4px 14px rgba(16, 24, 40, 0.10)" }}
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${puce}`}>{valeur}</span>
      <p className="mt-2 whitespace-pre-line text-[11px] leading-tight text-[#2B2B2B]">{label}</p>
    </div>
  );
}

/**
 * "Space" — accueil de l'app Maintenancier : rendez-vous du technicien
 * (GET /sav/demandes, déjà scopée côté backend : les miennes + les
 * nouvelles non affectées), bascule "En ligne" (PATCH /moi/disponibilite).
 */
export function EcranSpace() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [demandes, setDemandes] = useState<DemandeSav[] | null>(null);
  const [profil, setProfil] = useState<ProfilTechnicien | null>(null);
  const [notificationsNonLues, setNotificationsNonLues] = useState(false);
  const [onglet, setOnglet] = useState<Onglet>("tous");
  const [chargementDispo, setChargementDispo] = useState(false);

  const charger = useCallback(() => {
    if (!token) return;
    apiFetch<Pagination<DemandeSav>>("/sav/demandes?per_page=50", { token })
      .then((page) => setDemandes(page.data))
      .catch(() => setDemandes((d) => d ?? []));
    apiFetch<ProfilTechnicien>("/moi/profil", { token }).then(setProfil).catch(() => {});
    apiFetch<Pagination<{ lu: boolean }>>("/moi/notifications", { token })
      .then((page) => setNotificationsNonLues(page.data.some((n) => !n.lu)))
      .catch(() => {});
  }, [token]);

  useEffect(charger, [charger]);

  // Revenir sur l'accueil après avoir traité un rendez-vous ailleurs ne doit
  // pas réafficher un instantané figé (bfcache) — voir useRefetchOnFocus.
  useRefetchOnFocus(charger);

  async function onBasculerDisponibilite(valeur: boolean) {
    if (!token || chargementDispo) return;
    setChargementDispo(true);
    setProfil((p) => (p ? { ...p, disponible: valeur } : p));
    try {
      await apiFetch("/moi/disponibilite", { method: "PATCH", token, body: { disponible: valeur } });
    } catch {
      setProfil((p) => (p ? { ...p, disponible: !valeur } : p));
    } finally {
      setChargementDispo(false);
    }
  }

  const cartes = useMemo(() => {
    if (!demandes) return null;
    return demandes
      .map(versCarte)
      .sort((a, b) => PRIORITE[a.statut] - PRIORITE[b.statut] || b.date.getTime() - a.date.getTime());
  }, [demandes]);

  const cartesFiltrees =
    cartes?.filter((c) => (onglet === "aujourdhui" ? estAujourdhui(c.date) : onglet === "a_venir" ? estAVenir(c) : true)) ?? null;

  const rdvAujourdhui = cartes?.filter((c) => estAujourdhui(c.date) && c.statut !== "refuse" && c.statut !== "annule").length ?? null;
  const rdvAVenir = cartes?.filter(estAVenir).length ?? null;
  const terminees = cartes?.filter((c) => c.statut === "termine").length ?? null;

  const nomComplet = profil ? `${profil.prenom ? `${profil.prenom} ` : ""}${profil.nom}` : user ? `${user.prenom ? `${user.prenom} ` : ""}${user.nom}` : "";
  const enLigne = profil?.disponible ?? false;

  return (
    <div className="flex min-h-full flex-col bg-[#F2F5FA]">
      <div className="bg-white pb-4">
        <div className="relative px-[31px] pb-[66px] pt-[27px]" style={{ background: DEGRADE_HEADER, borderRadius: "0 0 30px 30px" }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-[62px] w-[62px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] border-2 border-white bg-white/20">
                {profil?.photo ? (
                  <Image src={profil.photo} alt="" width={62} height={62} className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-7 w-7 text-white" />
                )}
              </span>
              <div>
                <p className="text-[15px] font-medium text-white">Bonjour, 👋</p>
                <p className="text-xl font-extrabold uppercase leading-tight text-white">{nomComplet}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/notifications")}
              aria-label="Notifications"
              className="relative mt-[7px] flex h-8 w-8 items-center justify-center rounded-[8px] border-[1.5px] border-white text-white"
            >
              <BellIcon className="h-[18px] w-[18px]" />
              {notificationsNonLues ? <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" /> : null}
            </button>
          </div>

          <div
            className="mt-[10px] flex h-[26px] items-center gap-2.5 rounded-[4px] px-2.5"
            style={{ background: "rgba(255, 255, 255, 0.29)", border: "1px solid rgba(255, 255, 255, 0.35)" }}
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${enLigne ? "bg-[#23E755]" : "bg-white/60"}`} />
            <p className="flex-1 text-[13px] font-medium text-white">{enLigne ? "En ligne" : "Hors ligne"}</p>
            <InterrupteurDisponibilite actif={enLigne} chargement={chargementDispo || !profil} onChange={onBasculerDisponibilite} />
          </div>
        </div>

        <div className="relative z-10 -mt-[48px] grid grid-cols-3 gap-[11px] px-4">
          <CarteStat valeur={rdvAujourdhui !== null ? String(rdvAujourdhui) : "—"} label={"Rendez-vous\naujourd'hui"} puce="bg-[#EAF3FF] text-[#1E7BFF]" />
          <CarteStat valeur={rdvAVenir !== null ? String(rdvAVenir) : "—"} label={"Rendez-vous\nà venir"} puce="bg-[#FFF1E8] text-[#FF8A1F]" />
          <CarteStat valeur={terminees !== null ? String(terminees) : "—"} label={"Intervention\nterminée"} puce="bg-[#E7F8EE] text-[#17A34A]" />
        </div>

        <div className="mt-6 flex gap-4 px-4">
          {ONGLETS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOnglet(o.id)}
              className={`h-[30px] flex-1 rounded-full text-[13px] font-medium transition-colors ${
                onglet === o.id ? "text-white" : "bg-[#EFEFEF] text-[#3A3A3A]"
              }`}
              style={onglet === o.id ? { background: "#0A6CFF", boxShadow: "0 0 0 2px #A9CCFF" } : undefined}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[22px] border-t border-[#E3E6EC] px-4 pb-6 pt-4">
        {cartesFiltrees === null ? (
          <p className="py-10 text-center text-sm text-brand-muted">Chargement…</p>
        ) : cartesFiltrees.length === 0 ? (
          <p className="py-10 text-center text-sm text-brand-muted">Aucun rendez-vous dans cette catégorie.</p>
        ) : (
          cartesFiltrees.map((carte) => <CarteRendezVous key={carte.demande.id} carte={carte} />)
        )}
      </div>
    </div>
  );
}
