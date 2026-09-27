// Donnees de configuration de l'evenement. A terme, ces valeurs peuvent
// venir d'une base de donnees (voir section 13 du brief) ; pour l'instant
// elles sont centralisees ici pour rester faciles a mettre a jour.

export const EVENT = {
  name: "CÉLÉBRATION NIGHT",
  organizer: "HAGIAZO Ministry",
  tagline: "Une génération. Une foi. Une célébration.",
  date: "2026-11-14T18:00:00",
  dateLabel: "Samedi 14 Novembre 2026",
  timeLabel: "18h00",
  venue: "À confirmer",
};

export const PROGRAM = [
  { time: "18:00", label: "Accueil" },
  { time: "18:30", label: "Ouverture" },
  { time: "19:00", label: "Session musicale" },
  { time: "20:00", label: "HAGIAZO Ministry" },
  { time: "21:30", label: "Celebration Night" },
  { time: "22:30", label: "Clôture" },
];
