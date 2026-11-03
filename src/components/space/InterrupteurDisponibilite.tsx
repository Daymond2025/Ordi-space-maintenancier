"use client";

/** Toggle "En ligne / Hors ligne" de l'accueil — même rendu que la pastille "En ligne" de l'app Livreur. */
export function InterrupteurDisponibilite({
  actif,
  chargement,
  onChange,
}: {
  actif: boolean;
  chargement?: boolean;
  onChange: (valeur: boolean) => void;
}) {
  return (
    <button
      type="button"
      disabled={chargement}
      onClick={() => onChange(!actif)}
      aria-pressed={actif}
      aria-label={actif ? "Passer hors ligne" : "Passer en ligne"}
      className="relative h-[18px] w-[34px] shrink-0 rounded-full transition-colors disabled:opacity-60"
      style={{
        background: actif ? "rgba(190, 255, 229, 1)" : "rgba(229, 231, 235, 1)",
        border: `1px solid ${actif ? "rgba(137, 247, 206, 1)" : "rgba(209, 213, 219, 1)"}`,
      }}
    >
      <span
        className="absolute top-1/2 h-[14px] w-[14px] -translate-y-1/2 rounded-full shadow transition-all"
        style={{ left: actif ? 17 : 1, background: actif ? "rgba(35, 231, 85, 1)" : "rgba(255, 255, 255, 1)" }}
      />
    </button>
  );
}
