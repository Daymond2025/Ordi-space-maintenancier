"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError, apiFetch } from "@/lib/api";
import { formaterDateHeure, formaterTelephone, type Pagination, type ProfilTechnicien } from "@/lib/types";
import { formaterMontantPoints } from "@/lib/ventesBoutique";
import {
  LIBELLE_STATUT_COMMISSION,
  LIBELLE_STATUT_RETRAIT,
  LOGO_OPERATEUR,
  NOM_OPERATEUR,
  type CommissionPortefeuille,
  type ResumePortefeuille,
  type RetraitCommission,
  type StatutCommission,
  type StatutRetrait,
} from "@/lib/portefeuille";
import { ChevronLeftIcon, LongArrowRightIcon, WalletIcon } from "@/components/icons";
import { FeuilleRetrait } from "@/components/boutique/FeuilleRetrait";
import { DEGRADE_BLEU } from "@/components/boutique/style";

const ONGLETS = [
  { id: "commissions", label: "Mes commissions" },
  { id: "retraits", label: "Mes retraits" },
] as const;

const STYLE_COMMISSION: Record<StatutCommission, { fond: string; texte: string }> = {
  acquise: { fond: "#DDF7E8", texte: "#16A34A" },
  en_attente: { fond: "#FFF0D3", texte: "#C2740A" },
  annulee: { fond: "#ECEEF3", texte: "#6B7280" },
};

const STYLE_RETRAIT: Record<StatutRetrait, { fond: string; texte: string }> = {
  en_attente: { fond: "#FFF0D3", texte: "#C2740A" },
  valide: { fond: "#DDF7E8", texte: "#16A34A" },
  refuse: { fond: "#FDE2E2", texte: "#E02424" },
  annule: { fond: "#ECEEF3", texte: "#6B7280" },
};

function CarteSolde({ libelle, montant }: { libelle: string; montant: number }) {
  return (
    <div className="min-w-0 flex-1 rounded-xl border border-white/30 bg-white/20 px-3.5 py-2.5 text-white">
      <p className="flex items-center gap-1.5 text-[9px] font-semibold text-white/90">
        <WalletIcon className="h-3 w-3 shrink-0" />
        <span className="truncate">{libelle}</span>
      </p>
      <p className="mt-1 truncate text-lg font-extrabold leading-tight">{formaterMontantPoints(montant)} FCFA</p>
    </div>
  );
}

function LigneCommission({ commission }: { commission: CommissionPortefeuille }) {
  const style = STYLE_COMMISSION[commission.statut];

  return (
    <div className="flex items-center gap-3 rounded-[14px] bg-white px-3.5 py-3" style={{ boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.16)" }}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-extrabold text-brand-ink">{commission.nom_produit ?? "Produit"}</p>
        <p className="mt-0.5 truncate text-[10px] text-brand-muted">
          {commission.client || "Client"} · {formaterDateHeure(commission.date)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className={`text-[15px] font-extrabold ${commission.statut === "annulee" ? "text-brand-muted line-through" : "text-brand-ink"}`}>
          +{formaterMontantPoints(commission.montant)} F
        </p>
        <span className="rounded-full px-2 py-0.5 text-[8px] font-bold" style={{ background: style.fond, color: style.texte }}>
          {LIBELLE_STATUT_COMMISSION[commission.statut]}
        </span>
      </div>
    </div>
  );
}

function LigneRetrait({ retrait, onAnnuler, annulation }: { retrait: RetraitCommission; onAnnuler: () => void; annulation: boolean }) {
  const statut = STYLE_RETRAIT[retrait.statut];
  const logo = LOGO_OPERATEUR[retrait.operateur];

  return (
    <div className="rounded-[14px] bg-white px-3.5 py-3" style={{ boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.16)" }}>
      <div className="flex items-center gap-3">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- logo local statique
          <img src={logo} alt={retrait.operateur} className="h-10 w-10 shrink-0 rounded-full border border-[#E9EDF5] object-cover" />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ECEEF3] text-[10px] font-extrabold text-brand-ink">
            {retrait.operateur.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-extrabold text-brand-ink">
            {NOM_OPERATEUR[retrait.operateur] ?? retrait.operateur} · {formaterTelephone(retrait.telephone)}
          </p>
          <p className="mt-0.5 text-[10px] text-brand-muted">{formaterDateHeure(retrait.created_at)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <p className="text-[15px] font-extrabold text-brand-ink">{formaterMontantPoints(retrait.montant)} F</p>
          <span className="rounded-full px-2 py-0.5 text-[8px] font-bold" style={{ background: statut.fond, color: statut.texte }}>
            {LIBELLE_STATUT_RETRAIT[retrait.statut]}
          </span>
        </div>
      </div>

      {retrait.statut === "valide" && retrait.reference ? (
        <p className="mt-2 rounded-lg bg-[#F1FBF5] px-2.5 py-1.5 text-[10px] font-semibold text-[#16A34A]">Réf : {retrait.reference}</p>
      ) : null}
      {retrait.statut === "refuse" && retrait.remarque ? (
        <p className="mt-2 rounded-lg bg-[#FEF2F2] px-2.5 py-1.5 text-[10px] font-semibold text-[#E02424]">{retrait.remarque}</p>
      ) : null}
      {retrait.statut === "en_attente" ? (
        <button
          type="button"
          onClick={onAnnuler}
          disabled={annulation}
          className="mt-2.5 h-8 w-full rounded-lg border border-[#F5C2C2] text-[11px] font-bold text-[#E02424] disabled:opacity-60"
        >
          {annulation ? "Annulation…" : "Annuler la demande"}
        </button>
      ) : null}
    </div>
  );
}

/**
 * "Portefeuille" (Boutique) — la commission du livreur : soldes en en-tête,
 * onglet "Mes commissions" (une ligne par vente) et onglet "Mes retraits"
 * (ses demandes). Même logique que le portefeuille Daymond : le livreur
 * demande un retrait (minimum 1 000 F, jamais plus que le disponible), le
 * montant est réservé, l'Admin paie hors de l'app puis valide (avec la
 * référence du transfert) ou refuse (avec un motif) — voir
 * PortefeuilleController et Admin\RetraitController côté backend.
 */
export function EcranPortefeuille() {
  const router = useRouter();
  const { token } = useAuth();
  const [resume, setResume] = useState<ResumePortefeuille | null>(null);
  const [commissions, setCommissions] = useState<CommissionPortefeuille[] | null>(null);
  const [retraits, setRetraits] = useState<RetraitCommission[] | null>(null);
  const [telephone, setTelephone] = useState("");
  const [erreur, setErreur] = useState(false);
  const [onglet, setOnglet] = useState<(typeof ONGLETS)[number]["id"]>("commissions");
  const [feuilleOuverte, setFeuilleOuverte] = useState(false);
  const [annulationId, setAnnulationId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  /** Recharge soldes et listes (montage, retrait envoyé, demande annulée). */
  function charger(jeton: string, annule: () => boolean = () => false) {
    return Promise.all([
      apiFetch<ResumePortefeuille>("/boutique/portefeuille", { token: jeton }),
      apiFetch<Pagination<CommissionPortefeuille>>("/boutique/portefeuille/commissions?per_page=50", { token: jeton }),
      apiFetch<Pagination<RetraitCommission>>("/boutique/retraits?per_page=50", { token: jeton }),
    ])
      .then(([soldes, listeCommissions, listeRetraits]) => {
        if (annule()) return;
        setResume(soldes);
        setCommissions(listeCommissions.data);
        setRetraits(listeRetraits.data);
        setErreur(false);
      })
      .catch(() => {
        if (!annule()) setErreur(true);
      });
  }

  useEffect(() => {
    if (!token) return;
    let annule = false;
    charger(token, () => annule);
    // Numéro proposé par défaut dans la feuille de retrait : celui du compte.
    apiFetch<ProfilTechnicien>("/moi/profil", { token })
      .then((p) => {
        if (!annule) setTelephone(p.telephone ?? "");
      })
      .catch(() => {});

    return () => {
      annule = true;
    };
  }, [token]);

  function onRetraitEnvoye() {
    setFeuilleOuverte(false);
    setOnglet("retraits");
    setMessage("Demande envoyée. L'administrateur va la traiter.");
    if (token) charger(token);
  }

  async function annuler(retrait: RetraitCommission) {
    if (!token || annulationId !== null) return;
    setAnnulationId(retrait.id);
    setMessage(null);
    try {
      await apiFetch(`/boutique/retraits/${retrait.id}/annuler`, { method: "PUT", token });
      setMessage("Demande annulée, le montant est de nouveau disponible.");
      await charger(token);
    } catch (e) {
      setMessage(e instanceof ApiRequestError ? e.message : "Impossible d'annuler la demande.");
    } finally {
      setAnnulationId(null);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#F7F8FF]">
      <div className="shrink-0 rounded-b-[30px] px-[18px] pb-5 pt-[26px]" style={{ background: DEGRADE_BLEU }}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Retour"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/25 text-white"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <p className="flex-1 text-xs font-extrabold uppercase text-white">Portefeuille</p>
          <button
            type="button"
            onClick={() => setFeuilleOuverte(true)}
            disabled={!resume}
            className="flex h-[30px] items-center gap-2 rounded-lg border border-white/45 bg-white/15 px-3.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            Retrait
            <LongArrowRightIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 text-center text-white">
          <p className="text-[11px] font-semibold text-white/90">Commission disponible</p>
          <p className="mt-1 text-[40px] font-extrabold leading-none">{formaterMontantPoints(resume?.disponible ?? 0)}</p>
        </div>

        <div className="mt-5 flex gap-2.5">
          <CarteSolde libelle="Gain total cumulé" montant={resume?.gain_total ?? 0} />
          <CarteSolde libelle="En attente de validation" montant={resume?.en_attente_validation ?? 0} />
        </div>
      </div>

      <div className="flex shrink-0 border-b border-[#D9DEE8] bg-white">
        {ONGLETS.map((o) => {
          const actif = onglet === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setOnglet(o.id)}
              className={`relative flex-1 py-3.5 text-[13px] font-extrabold ${actif ? "text-[color:var(--brand-blue-end)]" : "text-brand-ink"}`}
            >
              {o.label}
              {actif ? <span className="absolute inset-x-[22%] bottom-0 h-[3px] rounded-full bg-[color:var(--brand-blue-end)]" /> : null}
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 flex-col gap-3 px-4 pb-8 pt-4">
        {message ? <p className="rounded-xl bg-[#E8F0FE] px-3 py-2 text-xs font-semibold text-[#2563EB]">{message}</p> : null}
        {erreur ? <p className="pt-6 text-center text-sm text-red-500">Impossible de charger ton portefeuille.</p> : null}

        {onglet === "commissions" ? (
          <>
            {(commissions ?? []).map((c) => (
              <LigneCommission key={c.id} commission={c} />
            ))}
            {commissions && commissions.length === 0 ? (
              <p className="pt-10 text-center text-sm text-brand-muted">Aucune commission pour le moment. Elles apparaissent dès qu&apos;une vente est enregistrée.</p>
            ) : null}
          </>
        ) : (
          <>
            {(retraits ?? []).map((r) => (
              <LigneRetrait key={r.id} retrait={r} onAnnuler={() => annuler(r)} annulation={annulationId === r.id} />
            ))}
            {retraits && retraits.length === 0 ? (
              <p className="pt-10 text-center text-sm text-brand-muted">Aucune demande de retrait.</p>
            ) : null}
          </>
        )}
      </div>

      {feuilleOuverte && resume ? (
        <FeuilleRetrait
          disponible={resume.disponible}
          minimum={resume.retrait_minimum}
          telephoneInitial={telephone}
          onFermer={() => setFeuilleOuverte(false)}
          onEnvoye={onRetraitEnvoye}
        />
      ) : null}
    </div>
  );
}
