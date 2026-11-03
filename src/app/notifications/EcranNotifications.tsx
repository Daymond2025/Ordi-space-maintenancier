"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { formaterDateHeure, formaterDateRelative, type NotificationUtilisateur, type Pagination } from "@/lib/types";
import { BellIcon, BoxIcon, ChevronLeftIcon, CheckCircleIcon, CloseIcon } from "@/components/icons";
import { useRefetchOnFocus } from "@/lib/useRefetchOnFocus";

const DEGRADE_HEADER = "linear-gradient(90deg, #0077FF 0%, #00BFFF 100%)";

/**
 * Icône + accent par type_notification — voir LivraisonController (déclenche
 * "mission_acceptee"/"livraison_validee") et Admin\ClientController::notifier()
 * (déclenche "admin"). Repli générique pour tout autre type futur.
 */
function iconePourType(type: string): { icone: React.ReactNode; classe: string } {
  switch (type) {
    case "mission_acceptee":
      return { icone: <BoxIcon className="h-4.5 w-4.5" />, classe: "bg-blue-50 text-[color:var(--brand-blue-end)]" };
    case "livraison_validee":
      return { icone: <CheckCircleIcon className="h-4.5 w-4.5" />, classe: "bg-emerald-50 text-emerald-500" };
    default:
      return { icone: <BellIcon className="h-4.5 w-4.5" />, classe: "bg-amber-50 text-amber-500" };
  }
}

function CarteNotification({ notification, onOuvrir }: { notification: NotificationUtilisateur; onOuvrir: (notification: NotificationUtilisateur) => void }) {
  const { icone, classe } = iconePourType(notification.type_notification);

  return (
    <button
      type="button"
      onClick={() => onOuvrir(notification)}
      className="flex w-full items-start gap-3 rounded-2xl bg-white p-3.5 text-left"
      style={{ boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.25)" }}
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${classe}`}>{icone}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-brand-ink">{notification.titre ?? "Notification"}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-brand-muted">{notification.contenu}</p>
        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-brand-muted/70">
          {formaterDateRelative(notification.date_envoi)}
        </p>
      </div>
      {!notification.lu ? <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[color:var(--brand-blue-end)]" /> : null}
    </button>
  );
}

/**
 * Détail d'une notification : le texte en entier, en gros caractères — la carte
 * de la liste n'en montre que les deux premières lignes.
 */
function DetailNotification({ notification, onFermer }: { notification: NotificationUtilisateur; onFermer: () => void }) {
  const { icone, classe } = iconePourType(notification.type_notification);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onFermer}>
      <div
        className="relative max-h-[85dvh] w-full max-w-xl overflow-y-auto rounded-t-[28px] bg-white px-5 pb-6 pt-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={notification.titre ?? "Notification"}
      >
        <button
          type="button"
          onClick={onFermer}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F5FA] text-brand-ink"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${classe}`}>{icone}</span>
        <h2 className="mt-3 pr-10 text-xl font-extrabold leading-tight text-brand-ink">{notification.titre ?? "Notification"}</h2>
        <p className="mt-1 text-xs font-semibold text-brand-muted">{formaterDateHeure(notification.date_envoi)}</p>

        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-brand-ink">{notification.contenu}</p>

        <button
          type="button"
          onClick={onFermer}
          className="mt-6 h-12 w-full rounded-xl text-sm font-extrabold text-white"
          style={{ background: DEGRADE_HEADER }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

/**
 * "Notifications" — GET /moi/notifications (NotificationOrdispace, déclenché
 * pour l'instant par acceptation/prise en charge de mission et livraison
 * validée — voir LivraisonController/Livraison::marquerLivree()). Sections
 * "NON LUES"/"LUES" séparées côté client à partir du même flux, pas deux
 * requêtes distinctes (l'API ne filtre pas par "lu").
 */
export function EcranNotifications() {
  const { token } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationUtilisateur[] | null>(null);
  const [ouverte, setOuverte] = useState<NotificationUtilisateur | null>(null);

  function recharger() {
    if (!token) return;
    apiFetch<Pagination<NotificationUtilisateur>>("/moi/notifications", { token })
      .then((page) => setNotifications(page.data))
      .catch(() => {});
  }

  useEffect(recharger, [token]);
  useRefetchOnFocus(recharger);

  async function onMarquerLue(id: number) {
    setNotifications((liste) => liste?.map((n) => (n.id === id ? { ...n, lu: true } : n)) ?? liste);
    if (!token) return;
    try {
      await apiFetch(`/moi/notifications/${id}/lue`, { method: "PATCH", token });
    } catch {
      setNotifications((liste) => liste?.map((n) => (n.id === id ? { ...n, lu: false } : n)) ?? liste);
    }
  }

  /** Ouvre le détail et, si elle était non lue, la marque comme lue. */
  function onOuvrir(notification: NotificationUtilisateur) {
    setOuverte({ ...notification, lu: true });
    if (!notification.lu) void onMarquerLue(notification.id);
  }

  const nonLues = notifications?.filter((n) => !n.lu) ?? [];
  const lues = notifications?.filter((n) => n.lu) ?? [];

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f2f5fa]">
      <div className="relative shrink-0 rounded-b-[30px] pb-6 pt-6" style={{ background: DEGRADE_HEADER }}>
        <div className="flex items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Retour"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <p className="text-lg font-extrabold text-white">Notifications</p>
            <p className="text-xs font-semibold text-white/80">
              {notifications === null ? "…" : `${nonLues.length} non lue${nonLues.length > 1 ? "s" : ""} sur ${notifications.length}`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-4 py-5">
        {notifications !== null && notifications.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 text-center text-brand-muted">
            <BellIcon className="h-8 w-8" />
            <p className="text-sm font-semibold">Aucune notification pour le moment.</p>
          </div>
        ) : null}

        {nonLues.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wide text-brand-muted">Non lues</p>
            {nonLues.map((notification) => (
              <CarteNotification key={notification.id} notification={notification} onOuvrir={onOuvrir} />
            ))}
          </div>
        ) : null}

        {lues.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wide text-brand-muted">Lues</p>
            {lues.map((notification) => (
              <CarteNotification key={notification.id} notification={notification} onOuvrir={onOuvrir} />
            ))}
          </div>
        ) : null}
      </div>

      {ouverte ? <DetailNotification notification={ouverte} onFermer={() => setOuverte(null)} /> : null}
    </div>
  );
}
