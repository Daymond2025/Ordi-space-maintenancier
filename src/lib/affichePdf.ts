import QRCode from "qrcode";
import { formaterTelephone } from "@/lib/types";

/**
 * Affiche A4 "Vitrine & QR" du livreur (onglet Profil de la Boutique) —
 * générée dans le navigateur, sans passer par le serveur : le même QR que
 * l'écran Profil, un nom et un téléphone propres au livreur, le reste est
 * identique pour tous (affiche intemporelle : aucun produit ni prix, qui
 * changent). Dessinée en 300 dpi sur un canvas puis posée en pleine page dans
 * un PDF ; les dimensions ci-dessous sont en millimètres.
 */
export type DonneesAffiche = {
  /** Adresse encodée dans le QR (vitrine + ?src=qr). */
  urlQr: string;
  /** Adresse affichée en clair sous le QR, pour ceux qui ne peuvent pas scanner. */
  urlAffichee: string;
  nom: string;
  telephone: string;
};

const LARGEUR = 210;
const HAUTEUR = 297;
const DPI = 300;
const PX_PAR_MM = DPI / 25.4;

const BLEU_DEBUT = "#0077FF";
const BLEU_FIN = "#00BFFF";
const ORANGE_DEBUT = "#FF7A00";
const ORANGE_FIN = "#FFB800";
const ENCRE = "#0B1B3A";
const GRIS = "#64748B";

type Ctx = CanvasRenderingContext2D;

function degrade(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, debut: string, fin: string): CanvasGradient {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, debut);
  g.addColorStop(1, fin);
  return g;
}

/** Écrit `texte` centré en x, en réduisant la taille jusqu'à ce qu'il tienne dans `largeurMax`. */
function texteCentre(ctx: Ctx, texte: string, x: number, y: number, opts: { police: string; poids: number; taille: number; largeurMax?: number; couleur: string | CanvasGradient }) {
  let taille = opts.taille;
  ctx.font = `${opts.poids} ${taille}px ${opts.police}`;
  while (opts.largeurMax && ctx.measureText(texte).width > opts.largeurMax && taille > 2) {
    taille -= 0.25;
    ctx.font = `${opts.poids} ${taille}px ${opts.police}`;
  }
  ctx.fillStyle = opts.couleur;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(texte, x, y);
}

/** Icône 24×24 (tracés des icônes de l'app) dessinée en trait, centrée en (cx, cy) sur `taille` mm. */
function icone(ctx: Ctx, chemins: string[], cx: number, cy: number, taille: number, couleur: string) {
  const echelle = taille / 24;
  ctx.save();
  ctx.translate(cx - taille / 2, cy - taille / 2);
  ctx.scale(echelle, echelle);
  ctx.strokeStyle = couleur;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const d of chemins) ctx.stroke(new Path2D(d));
  ctx.restore();
}

const CHEMINS_CAMION = ["M2 7h12v9H2z", "M14 10h4l4 3v3h-8z", "M8.2 18a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 0 1 3.4 0Z", "M18.2 18a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 0 1 3.4 0Z"];
const CHEMINS_BOUCLIER = ["M12 3.5 5 6v6c0 5 3.5 7.5 7 8.5 3.5-1 7-3.5 7-8.5V6l-7-2.5Z", "m9 12 2 2 4-4.5"];
const CHEMINS_PORTEFEUILLE = [
  "M3.5 7.5A2 2 0 0 1 5.5 5.5h11a2 2 0 0 1 2 2V8h-13a2 2 0 0 0-2-2Z",
  "M3.5 8v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-14a2 2 0 0 1-1-1.5",
  "M17.8 13.5a1.3 1.3 0 1 1-2.6 0 1.3 1.3 0 0 1 2.6 0Z",
];

function dessinerQr(ctx: Ctx, texte: string, x: number, y: number, taille: number) {
  const { modules } = QRCode.create(texte, { errorCorrectionLevel: "Q" });
  const n = modules.size;
  const cellule = taille / n;
  ctx.fillStyle = ENCRE;
  for (let ligne = 0; ligne < n; ligne++) {
    for (let colonne = 0; colonne < n; colonne++) {
      // +0.08 mm (≈ 1 px à 300 dpi) : évite les fines coutures blanches entre modules voisins.
      if (modules.get(ligne, colonne)) ctx.fillRect(x + colonne * cellule, y + ligne * cellule, cellule + 0.08, cellule + 0.08);
    }
  }
}

function dessiner(ctx: Ctx, donnees: DonneesAffiche, police: string) {
  // Fond
  ctx.fillStyle = "#F4F7FF";
  ctx.fillRect(0, 0, LARGEUR, HAUTEUR);

  // Bandeau bleu à pied arrondi + décor
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, -20, LARGEUR, 146, [0, 0, 18, 18]);
  ctx.clip();
  ctx.fillStyle = degrade(ctx, 0, 0, LARGEUR, 126, BLEU_DEBUT, BLEU_FIN);
  ctx.fillRect(0, 0, LARGEUR, 126);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.arc(192, 10, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.arc(8, 112, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Marque + accroche
  ctx.letterSpacing = "1.2px";
  texteCentre(ctx, "ORDI'SPACE", LARGEUR / 2, 21, { police, poids: 800, taille: 8, couleur: "#FFFFFF" });
  ctx.letterSpacing = "0px";
  texteCentre(ctx, "Votre ordinateur,", LARGEUR / 2, 47, { police, poids: 800, taille: 16, couleur: "#FFFFFF", largeurMax: 180 });
  texteCentre(ctx, "livré chez vous.", LARGEUR / 2, 64, { police, poids: 800, taille: 16, couleur: "#FFFFFF", largeurMax: 180 });
  texteCentre(ctx, "Neufs, quasi neufs ou reconditionnés.", LARGEUR / 2, 80, { police, poids: 600, taille: 5.6, couleur: "rgba(255,255,255,0.94)", largeurMax: 170 });

  // Carte du QR
  const carte = { x: 35, y: 100, l: 140, h: 134 };
  ctx.save();
  ctx.shadowColor = "rgba(0, 60, 160, 0.22)";
  ctx.shadowBlur = 70;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.roundRect(carte.x, carte.y, carte.l, carte.h, 10);
  ctx.fill();
  ctx.restore();

  // Pastille "Scannez pour commander"
  const libelle = "SCANNEZ POUR COMMANDER";
  ctx.font = `800 5px ${police}`;
  ctx.letterSpacing = "0.4px";
  const largeurPastille = ctx.measureText(libelle).width + 14;
  ctx.fillStyle = degrade(ctx, LARGEUR / 2 - largeurPastille / 2, 0, LARGEUR / 2 + largeurPastille / 2, 0, ORANGE_DEBUT, ORANGE_FIN);
  ctx.beginPath();
  ctx.roundRect(LARGEUR / 2 - largeurPastille / 2, 108, largeurPastille, 12, 6);
  ctx.fill();
  texteCentre(ctx, libelle, LARGEUR / 2, 116, { police, poids: 800, taille: 5, couleur: "#FFFFFF" });
  ctx.letterSpacing = "0px";

  // QR + cadre de visée orange
  const tailleQr = 84;
  const qrX = (LARGEUR - tailleQr) / 2;
  const qrY = 128;
  dessinerQr(ctx, donnees.urlQr, qrX, qrY, tailleQr);
  ctx.strokeStyle = ORANGE_DEBUT;
  ctx.lineWidth = 1.3;
  ctx.lineCap = "round";
  const marge = 4;
  const bras = 9;
  const x0 = qrX - marge;
  const y0 = qrY - marge;
  const x1 = qrX + tailleQr + marge;
  const y1 = qrY + tailleQr + marge;
  for (const [cx, cy, dx, dy] of [
    [x0, y0, 1, 1],
    [x1, y0, -1, 1],
    [x0, y1, 1, -1],
    [x1, y1, -1, -1],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(cx + dx * bras, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * bras);
    ctx.stroke();
  }

  texteCentre(ctx, "Ouvrez l'appareil photo de votre téléphone", LARGEUR / 2, 225, { police, poids: 600, taille: 4, couleur: GRIS, largeurMax: 124 });
  texteCentre(ctx, donnees.urlAffichee, LARGEUR / 2, 230.5, { police, poids: 800, taille: 4, couleur: BLEU_DEBUT, largeurMax: 124 });

  // Trois arguments
  const arguments3 = [
    { chemins: CHEMINS_CAMION, lignes: ["Livraison", "à domicile"] },
    { chemins: CHEMINS_BOUCLIER, lignes: ["Garantie", "sur nos produits"] },
    { chemins: CHEMINS_PORTEFEUILLE, lignes: ["Paiement", "à la réception"] },
  ];
  arguments3.forEach((a, i) => {
    const cx = 46 + i * 59;
    ctx.fillStyle = "#E4EEFF";
    ctx.beginPath();
    ctx.arc(cx, 250, 8.5, 0, Math.PI * 2);
    ctx.fill();
    icone(ctx, a.chemins, cx, 250, 9.5, BLEU_DEBUT);
    texteCentre(ctx, a.lignes[0], cx, 264.5, { police, poids: 800, taille: 4.2, couleur: ENCRE, largeurMax: 52 });
    texteCentre(ctx, a.lignes[1], cx, 269, { police, poids: 600, taille: 3.8, couleur: GRIS, largeurMax: 52 });
  });

  // Pied de page : le conseiller
  ctx.fillStyle = degrade(ctx, 0, 0, LARGEUR, 0, BLEU_DEBUT, BLEU_FIN);
  ctx.beginPath();
  ctx.roundRect(0, 276, LARGEUR, 30, [8, 8, 0, 0]);
  ctx.fill();
  texteCentre(ctx, "VOTRE CONSEILLER", LARGEUR / 2, 282.5, { police, poids: 700, taille: 3, couleur: "rgba(255,255,255,0.85)" });
  texteCentre(ctx, `${donnees.nom}  ·  ${formaterTelephone(donnees.telephone)}`, LARGEUR / 2, 288.5, {
    police,
    poids: 800,
    taille: 5.6,
    couleur: "#FFFFFF",
    largeurMax: 190,
  });
}

/** Construit le PDF A4 (blob) de l'affiche. À appeler dans le navigateur, au clic. */
export async function genererAffichePdf(donnees: DonneesAffiche): Promise<Blob> {
  const police = getComputedStyle(document.body).fontFamily;
  await Promise.all([document.fonts.load(`800 10px ${police}`), document.fonts.load(`600 10px ${police}`), document.fonts.load(`700 10px ${police}`)]);
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(LARGEUR * PX_PAR_MM);
  canvas.height = Math.round(HAUTEUR * PX_PAR_MM);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");
  ctx.scale(PX_PAR_MM, PX_PAR_MM);
  dessiner(ctx, donnees, police);

  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, LARGEUR, HAUTEUR);

  return pdf.output("blob");
}
