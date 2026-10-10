// Compatibilite : les anciens composants (billet, badge, confirmation) lisent
// ces champs. La source unique est desormais lib/content.ts.
import { EVENT as CONTENT_EVENT, PROGRAM as CONTENT_PROGRAM } from "./content";

export const EVENT = {
  name: `${CONTENT_EVENT.name} ${CONTENT_EVENT.edition}`,
  organizer: `Groupe ${CONTENT_EVENT.group}`,
  tagline: CONTENT_EVENT.slogan,
  date: CONTENT_EVENT.startsAt,
  dateLabel: CONTENT_EVENT.dateLabel,
  timeLabel: "20h",
  venue: CONTENT_EVENT.venueConfirmed
    ? CONTENT_EVENT.venue
    : `${CONTENT_EVENT.city} (lieu à confirmer)`,
  city: CONTENT_EVENT.city,
};

export const PROGRAM = CONTENT_PROGRAM.map((p) => ({ time: "", label: p.title }));
