// Thème des écrans de connexion/inscription de cette app (kit
// d'authentification : CadreAuth, MascotteVivante, DecorAuth…). Chaque app a
// le sien : couleurs, décor animé, accessoire de la mascotte et répliques.

export type ThemeAuth = {
  espace: string;
  slogan: string;
  degrade: string;
  halos: [string, string, string];
  accent: string;
  accentFin: string;
  accentHalo: string;
  accentOmbre: string;
  decor: "constellation" | "etincelles" | "colis" | "route" | "etiquettes" | "engrenages" | "bulles" | "radar";
  posture: "flotte" | "roule";
  accessoire: "aucun" | "engrenage" | "logo" | "radar" | "etoile" | "coeur" | "colis" | "casque";
  logo?: string;
  confettis: string[];
  badge: string;
  repliques: {
    salut: string;
    repos: string;
    telephone: string;
    telephoneOk: string;
    email: string;
    emailOk: string;
    mdp: string;
    erreur: string;
    code: string;
    succes: string;
    nom: string;
  };
};

export const THEME_AUTH: ThemeAuth = {
  "espace": "Maintenancier",
  "slogan": "Diagnostique, répare et suis tes interventions SAV.",
  "degrade": "linear-gradient(160deg,#0f172a 0%,#1e3a8a 45%,#0891b2 100%)",
  "halos": [
    "rgba(34,211,238,0.3)",
    "rgba(99,102,241,0.3)",
    "rgba(255,255,255,0.12)"
  ],
  "accent": "#0891b2",
  "accentFin": "#22d3ee",
  "accentHalo": "rgba(8,145,178,0.18)",
  "accentOmbre": "rgba(8,145,178,0.38)",
  "decor": "engrenages",
  "posture": "flotte",
  "accessoire": "engrenage",
  "confettis": [
    "#0891b2",
    "#22d3ee",
    "#a5f3fc",
    "#ffffff",
    "#818cf8"
  ],
  "badge": "Connexion sécurisée · code WhatsApp",
  "repliques": {
    "telephone": "Ton numéro WhatsApp 📱",
    "telephoneOk": "Parfait, je t'envoie le code 🚀",
    "email": "Ton adresse e-mail 📧",
    "emailOk": "Cet e-mail me va ✅",
    "mdp": "Je ne regarde pas 🙈",
    "code": "Regarde WhatsApp 💬",
    "salut": "Des pannes à réparer ? 🔧",
    "repos": "Prêt pour une intervention ? 🛠️",
    "erreur": "Oups… on resserre ça 😅",
    "succes": "Au travail, expert ! 🛠️",
    "nom": "Comment tu t'appelles ? ✍️"
  }
};
