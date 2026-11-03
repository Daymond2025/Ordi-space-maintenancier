import type { SVGProps } from "react";

/**
 * Icônes ligne minimalistes, dessinées à la main (pas de dépendance externe)
 * — sous-ensemble copié de Cordinateur_App_Web/src/components/icons.tsx.
 */

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6 0 9.5 6.5 9.5 6.5a13.5 13.5 0 0 1-3 3.6M6.4 6.4C4 8 2.5 10.5 2.5 11.5S6 18 12 18a10.6 10.6 0 0 0 2.7-.35" />
      <path d="M9.5 9.8a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="12" height="9" rx="1" />
      <path d="M14 10h4l4 3v3h-8z" />
      <circle cx="6.5" cy="18" r="1.7" />
      <circle cx="16.5" cy="18" r="1.7" />
    </svg>
  );
}

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5a9.3 9.3 0 0 0-8 14l-1 4.2 4.3-1.1a9.3 9.3 0 1 0 4.7-17.1Zm0 1.9a7.4 7.4 0 0 1 6.3 11.3 7.35 7.35 0 0 1-8.9 3l-.4-.2-2.6.7.7-2.5-.2-.4a7.4 7.4 0 0 1 5.1-11.9Z" />
      <path d="M9 7.4c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.3s1 2.7 1.2 2.9c.1.2 2 3.1 4.9 4.2 2.4.9 2.9.7 3.4.7.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4s-1.6-.8-1.9-.9c-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.5-.9-2.2Z" />
    </svg>
  );
}

export function PhoneFilledIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.6 2.5 3.5 5.6c-.6.6-.8 1.5-.5 2.3C4.9 13 11 19.1 16.1 21c.8.3 1.7.1 2.3-.5l3.1-3.1c.7-.7.5-1.9-.4-2.3l-3.7-1.7c-.6-.3-1.3-.1-1.8.3l-1.3 1.3c-1.9-1.1-3.9-3.1-5-5l1.3-1.3c.4-.5.6-1.2.3-1.8L9.2 2.9c-.4-.9-1.6-1.1-2.3-.4Z" />
    </svg>
  );
}

export function CameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 8.5c0-.8.7-1.5 1.5-1.5h2l1-1.5h7l1 1.5h2c.8 0 1.5.7 1.5 1.5v9c0 .8-.7 1.5-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
      <circle cx="12" cy="13" r="3.3" />
    </svg>
  );
}

export function ImageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 17 5-5 3.5 3.5L17 11l3.5 3.5" />
    </svg>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

export function MapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 4.5 4 6.5v13l5-2 6 2 5-2v-13l-5 2-6-2Z" />
      <path d="M9 4.5v13M15 6.5v13" />
    </svg>
  );
}

export function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.3 2.3 2.3 4.7-4.9" />
    </svg>
  );
}

/** Flèche longue et fine — remplace le prix sur la carte mission "active" (Space). */
export function LongArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 8h36M30 2l7 6-7 6" />
    </svg>
  );
}

/** Coche seule, sans cercle — pour un chip qui dessine déjà son propre fond. */
export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m4 12.5 6 6L20 6" />
    </svg>
  );
}

/** Croix seule, sans cercle — pour un chip qui dessine déjà son propre fond. */
export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

/** Deux flèches en boucle — "réinitialiser" (écran Filtres). */
export function RefreshIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 11a8 8 0 0 0-14.3-4.5L4 8.5M4 4v4.5h4.5" />
      <path d="M4 13a8 8 0 0 0 14.3 4.5l1.7-2M20 20v-4.5h-4.5" />
    </svg>
  );
}

/** Écran "Comment paye le client ?" — pictogramme Mobile Money. */
export function QrCodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <path d="M14 14h3v3h-3zM20 14v3M17 20h4" />
    </svg>
  );
}

/** Écran "Comment paye le client ?" — pictogramme paiement en espèces. */
export function CashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="6" width="16" height="11" rx="2" />
      <circle cx="10.5" cy="11.5" r="2.5" />
      <path d="M6 11.5h.01M15 11.5h.01" />
      <path d="M20 9v9a2 2 0 0 1-2 2H7" />
    </svg>
  );
}

export function XCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9 9 6 6m0-6-6 6" />
    </svg>
  );
}

export function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6" />
    </svg>
  );
}

/** N'existe pas dans le set copié — nécessaire pour l'onglet "Space" (écran d'accueil). */
export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5.5h4V20h3a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 10a6 6 0 0 1 12 0c0 4.5 1.5 6 1.5 6h-15S6 14.5 6 10Z" />
      <path d="M10 19.5a2 2 0 0 0 4 0" />
    </svg>
  );
}

/** Icône du colis affiché sur les cartes de mission — orange (actif) / gris (terminé). */
/** Identique à Cordinateur_App_Web/src/components/icons.tsx — même "carton" que la timeline de suivi. */
export function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3.5 8 12 4l8.5 4-8.5 4-8.5-4Z" />
      <path d="M3.5 8v8L12 20l8.5-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}

/** Écran "Mes paiements" — entrée créditée ("Livraison validée"). */
export function ArrowDownLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 7 7 17M7 8.5V17h8.5" />
    </svg>
  );
}

/** Écran "Mes paiements" — entrée débitée ("Retrait effectué"). */
export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  );
}

/** N'existe pas dans le set copié — nécessaire pour l'onglet "Paiements". */
export function WalletIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h11a2 2 0 0 1 2 2V8h-13a2 2 0 0 0-2-2Z" />
      <path d="M3.5 8v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-14a2 2 0 0 1-1-1.5" />
      <circle cx="16.5" cy="13.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Écran "Mon Profil" — bouton en haut à droite du header. */
export function StoreIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 9.5 5 4h14l1 5.5" />
      <path d="M4 9.5a2.3 2.3 0 0 0 4.5.7 2.3 2.3 0 0 0 4.5 0 2.3 2.3 0 0 0 4.5 0 2.3 2.3 0 0 0 4.5-.7" />
      <path d="M5 10v9.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
      <path d="M9.5 20.5V15a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5.5" />
    </svg>
  );
}

/** Carte véhicule sur "Mon Profil". */
export function MotoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="5.5" cy="17.5" r="2.5" />
      <circle cx="18.5" cy="17.5" r="2.5" />
      <path d="M8 17.5h6.5l2-6-3-2.5H10l-1.5 3" />
      <path d="M13.5 9h3.5l1.5 2.5" />
      <path d="M4 14.5 6 11h3" />
    </svg>
  );
}

/** Menu "Mes clients" sur "Mon Profil". */
export function GroupeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.9-3.6 3.4-5.5 6.5-5.5s5.6 1.9 6.5 5.5" />
      <path d="M16 4.7a3.5 3.5 0 0 1 0 6.6M18 14.8c1.8.7 3 2.4 3.5 5.2" />
    </svg>
  );
}

/** Menu "Confidentialité et UGC" sur "Mon Profil". */
export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3.5 5 6v6c0 5 3.5 7.5 7 8.5 3.5-1 7-3.5 7-8.5V6l-7-2.5Z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  );
}

/** Menu "Modifier mon profil" sur "Mon Profil". */
export function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m4 20 .9-4 11-11 3.1 3.1-11 11-4 .9Z" />
      <path d="m14.5 6.5 3 3" />
    </svg>
  );
}

/** Sélecteur de type de véhicule — option "Voiture". */
export function CarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 16.5v-3l2-4.5a2 2 0 0 1 1.9-1.3h8.2A2 2 0 0 1 18 8.9L20 13v3.5" />
      <path d="M4 16.5h16M4 13h16" />
      <circle cx="7.5" cy="16.5" r="1.7" />
      <circle cx="16.5" cy="16.5" r="1.7" />
    </svg>
  );
}

/** Sélecteur de type de véhicule — option "Vélo". */
export function BicycleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="5.5" cy="17.5" r="2.7" />
      <circle cx="18.5" cy="17.5" r="2.7" />
      <path d="M5.5 17.5 10 8.5h5l3 9" />
      <path d="M10 8.5 12.5 13h-6M14 5.5h2.5" />
    </svg>
  );
}

/** Sélecteur de type de véhicule — option "Tricycle". */
export function TricycleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="5" cy="17.5" r="2.3" />
      <circle cx="19" cy="17.5" r="2.3" />
      <path d="M5 17.5h5l3-9h4" />
      <path d="M10 8.5h3M7 12.5h5.5" />
    </svg>
  );
}

/** Badge vidéo sur l'image produit — écran "Détails". */
export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

/** Bouton panier flottant — écran "Boutique". */
export function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L20.5 8H6" />
      <circle cx="9.5" cy="20" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Pop-up lien affilié — bouton "Copier le lien". */
export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
      <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H5.5A1.5 1.5 0 0 0 4 6v8.5A1.5 1.5 0 0 0 5.5 16H8" />
    </svg>
  );
}

/** Pop-up lien affilié — tuile "Copier". */
export function EclairBicoloreIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M14 2 5 13.5h5.5L9 22l10-11.5h-5.5L14 2Z" fill="#0077FF" />
      <path d="M9 22l1.5-8.5H6L11 7l-1 6.5h4.5L9 22Z" fill="#FACC15" />
    </svg>
  );
}

/** Pop-up lien affilié — bouton "Partager". */
export function ShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="m8.3 10.7 7.4-3.4M8.3 13.3l7.4 3.4" />
    </svg>
  );
}

/** Nav "Boutique" — onglets Catégorie/Ventes/Profil. */
export function GridIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.8" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.8" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.8" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.8" />
    </svg>
  );
}

/** Menu "Contactez le service" sur "Mon Profil". */
export function HeadsetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19v1a2 2 0 0 1-2 2h-3" />
    </svg>
  );
}

/** Pictos des tuiles de caractéristiques — fiche produit "Boutique". */
export function ProcesseurIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
    </svg>
  );
}

export function DisqueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3 14h18" />
      <path d="M7 16.5h.01M10 16.5h.01" />
    </svg>
  );
}

export function MemoireIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="7" width="19" height="9" rx="1.5" />
      <path d="M6 10v3M10 10v3M14 10v3M18 10v3" />
      <path d="M5 16v2.5M9 16v2.5M13 16v2.5M17 16v2.5" />
    </svg>
  );
}

export function CarteGraphiqueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="6.5" width="19" height="10" rx="2" />
      <circle cx="9" cy="11.5" r="2.5" />
      <path d="M15 10h3.5M15 13h3.5" />
      <path d="M5 16.5v2M9 16.5v2" />
    </svg>
  );
}

export function EcranIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4.5" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16.5V20" />
    </svg>
  );
}

export function FenetresIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 5.6 10.5 4.5v6.7H3V5.6Zm8.7-1.3L21 3v8.2h-9.3V4.3ZM3 12.8h7.5v6.7L3 18.4v-5.6Zm8.7 0H21V21l-9.3-1.3v-6.9Z" />
    </svg>
  );
}

/** Engrenage — pastille "Garantie" de la fiche produit "Boutique". */
export function EngrenageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

/** Source de vente "Commande manuelle" — écran "Centre des ventes". */
export function PresspapiersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="4.5" width="14" height="17" rx="2.5" />
      <path d="M9 4.5V4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v.5" />
      <path d="M9 11h6M9 15h4" />
    </svg>
  );
}

/** Source de vente "Lien WhatsApp" — écran "Centre des ventes". */
export function BulleMessageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v9a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 14.5v-9Z" />
      <path d="M8.5 8.5h7M8.5 12h4" />
    </svg>
  );
}

/** Client d'une vente — écran "Centre des ventes". */
export function UtilisateurCocheIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9.5" cy="8" r="3.8" />
      <path d="M2.5 20c.4-3.6 3.2-6 7-6s6.6 2.4 7 6" />
      <path d="m16.5 10.5 2 2 3.7-4" />
    </svg>
  );
}

/** Tuile "Mon Lien de vente" — onglet Profil de la Boutique. */
export function LienChaineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </svg>
  );
}

/** Bouton "Télécharger A4" — onglet Profil de la Boutique. */
export function ImprimanteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 9V3.5h10V9" />
      <rect x="3" y="9" width="18" height="8" rx="2" />
      <rect x="7" y="14" width="10" height="6.5" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Bouton "Se déconnecter" — écran "Mes infos". */
export function DeconnexionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H9" />
      <path d="M15 8l4 4-4 4M19 12H9" />
    </svg>
  );
}

/** Menu "⋮" en haut à droite — écran "Mes infos". */
export function PlusVerticalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

/** Ligne "Horaires" — carte partenaire de "Mes infos". */
export function CalendrierIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

/** Clé + tournevis croisés — onglet "Intervention" de la barre du bas. */
export function OutilsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a5.5 5.5 0 0 1-7.3 7.3l-6.6 6.6a2 2 0 0 1-2.8-2.8l6.6-6.6a5.5 5.5 0 0 1 7.3-7.3Z" />
      <path d="M3 3l1.2 2.8 1.8.6 5 5" />
      <path d="m13.5 13.5 1-1 6.2 6.2a1.4 1.4 0 0 1 0 2l-.1.1a1.4 1.4 0 0 1-2 0l-6.2-6.2 1-1" />
    </svg>
  );
}

export function HorlogeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
