import type { SVGProps } from "react";

type Icone = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

const trait = (chemins: React.ReactNode): Icone =>
  function IconePrestation(props: SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
        {chemins}
      </svg>
    );
  };

const Stethoscope = trait(<><path d="M5 3v6a5 5 0 0 0 10 0V3" /><path d="M10 14v2a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="12" r="2" /></>);
const Etincelles = trait(<><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6Z" /><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8Z" /><path d="M5 15l.6 1.4L7 17l-1.4.6L5 19l-.6-1.4L3 17l1.4-.6Z" /></>);
const Portable = trait(<><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 19h20" /></>);
const Document = trait(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>);
const Bouclier = trait(<path d="M12 3.5 5 6v6c0 5 3.5 7.5 7 8.5 3.5-1 7-3.5 7-8.5V6Z" />);
const Vent = trait(<><path d="M3 8h11a3 3 0 1 0-3-3" /><path d="M3 12h16a3 3 0 1 1-3 3" /><path d="M3 16h7" /></>);
const Eclair = trait(<path d="M13 2 4 14h7l-1 8 9-12h-7Z" />);
const Puce = trait(<><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>);
const Memoire = trait(<><rect x="2" y="7" width="20" height="9" rx="1.5" /><path d="M6 16v3M10 16v3M14 16v3M18 16v3M6 10.5h2M11 10.5h2M16 10.5h2" /></>);
const Batterie = trait(<><rect x="2" y="7" width="17" height="10" rx="2" /><path d="M22 11v2M6 10v4M9.5 10v4M13 10v4" /></>);
const Clavier = trait(<><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" /></>);
const Base = trait(<><ellipse cx="12" cy="5.5" rx="7" ry="2.5" /><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13" /><path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" /></>);
const Wifi = trait(<><path d="M2 8.5a15 15 0 0 1 20 0" /><path d="M5 12a10.5 10.5 0 0 1 14 0" /><path d="M8.5 15.5a5.5 5.5 0 0 1 7 0" /><path d="M12 19h.01" /></>);
const Imprimante = trait(<><path d="M6 9V3h12v6" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M6 14h12v7H6Z" /></>);
const Toque = trait(<><path d="M2 9.5 12 5l10 4.5-10 4.5Z" /><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" /></>);
const Bouee = trait(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6" /></>);
const Copie = trait(<><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>);

/** Grille "Prestations réalisées" de l'écran "Marquer terminé" — couleur d'icône d'après la maquette. */
export const PRESTATIONS: { label: string; Icone: Icone; couleur: string }[] = [
  { label: "Diagnostic", Icone: Stethoscope, couleur: "#8B5CF6" },
  { label: "Réparation", Icone: Etincelles, couleur: "#1E7BFF" },
  { label: "Installation Windows", Icone: Portable, couleur: "#1E7BFF" },
  { label: "Installation Office", Icone: Document, couleur: "#1E7BFF" },
  { label: "Antivirus", Icone: Bouclier, couleur: "#16A34A" },
  { label: "Nettoyage", Icone: Vent, couleur: "#EC4899" },
  { label: "Optimisation", Icone: Eclair, couleur: "#F59E0B" },
  { label: "SSD", Icone: Puce, couleur: "#8B5CF6" },
  { label: "RAM", Icone: Memoire, couleur: "#16A34A" },
  { label: "Batterie", Icone: Batterie, couleur: "#65A30D" },
  { label: "Écran", Icone: Portable, couleur: "#1E7BFF" },
  { label: "Clavier", Icone: Clavier, couleur: "#A855F7" },
  { label: "Chargeur", Icone: Eclair, couleur: "#F97316" },
  { label: "Récupération de données", Icone: Base, couleur: "#EF4444" },
  { label: "Sauvegarde", Icone: Base, couleur: "#8B5CF6" },
  { label: "Réseau", Icone: Wifi, couleur: "#1E7BFF" },
  { label: "Imprimante", Icone: Imprimante, couleur: "#0EA5A5" },
  { label: "Formation", Icone: Toque, couleur: "#F59E0B" },
  { label: "Assistance", Icone: Bouee, couleur: "#16A34A" },
  { label: "Clonage", Icone: Copie, couleur: "#1E7BFF" },
];

export const PIECES = [
  "Écran",
  "Nappe d'écran",
  "Clavier",
  "Pavé tactile",
  "Batterie",
  "Chargeur",
  "Connecteur de charge",
  "Disque dur",
  "SSD",
  "Barrette de RAM",
  "Carte mère",
  "Ventilateur",
  "Pâte thermique",
  "Charnière",
  "Carte Wi-Fi",
  "Haut-parleurs",
  "Webcam",
];
