"use client";

import { useState } from "react";
import Link from "next/link";
import { Music, Play, Pause, Volume2, Download, BookOpen, Sparkles, ArrowRight } from "lucide-react";

interface Song {
  id: string;
  title: string;
  duration: string;
  theme: string;
  key: string;
  lyrics: string;
  bibleVerse: string;
}

const SONGS: Song[] = [
  {
    id: "song-1",
    title: "HAGIAZO LIVE (Le Chant de la Sanctification)",
    duration: "06:45",
    theme: "Consécration & Gloire",
    key: "Mi majeur (E)",
    bibleVerse: "« Saint, saint, saint est le Seigneur Dieu, le Tout-Puissant, qui était, qui est, et qui vient ! » — Apocalypse 4:8",
    lyrics: `[Couplet 1]
Devant le trône de ta majesté
Nos couronnes déposées à tes pieds
Le souffle coupé par ta clarté
Nous proclamons ta royauté

[Refrain]
Hagiazo ! Dieu sanctifié !
Hagiazo ! Élevé pour l'éternité !
Que ton feu purifie nos pensées
Une génération pour t'adorer !

[Pont]
Ni par la force, ni par la puissance
Mais par ton Esprit de grâce
Nous nous tenons devant ta face
Remplis de ta sainte présence !`,
  },
  {
    id: "song-2",
    title: "Brûle en moi",
    duration: "07:20",
    theme: "Réveil & Onction",
    key: "Sol majeur (G)",
    bibleVerse: "« Notre Dieu est aussi un feu dévorant. » — Hébreux 12:29",
    lyrics: `[Couplet 1]
Comme un feu qui ne s'éteint jamais
Brûle en mon âme, Seigneur de paix
Consume mes peurs et mes détours
Inonde ma vie de ton amour

[Refrain]
Brûle en moi, Esprit de Dieu
Brûle en moi, descends des cieux
Fais de mon cœur un autel vivant
Pour proclamer ton nom triomphant !`,
  },
  {
    id: "song-3",
    title: "Yahweh Règne (Afro-Worship)",
    duration: "05:50",
    theme: "Jubilation & Victoire",
    key: "Ré majeur (D)",
    bibleVerse: "« L'Éternel règne : les peuples tremblent. » — Psaume 99:1",
    lyrics: `[Couplet 1]
Du lever du soleil jusqu'à son couchant
Ton règne est sans fin, Dieu tout-puissant
Les tambours résonnent pour t'acclamer
Nos voix s'unissent pour te célébrer

[Refrain]
Yahweh règne ! Alléluia !
Yahweh règne ! Hosanna !
Aucun géant ne peut tenir
Quand ton armée se met à retentir !`,
  },
  {
    id: "song-4",
    title: "Sainteté (Le Sanctuaire)",
    duration: "08:15",
    theme: "Adoration Intime",
    key: "Si mineur (Bm)",
    bibleVerse: "« Adorez l'Éternel avec des ornements sacrés. » — 1 Chroniques 16:29",
    lyrics: `[Couplet 1]
Dans le lieu secret où tu demeures
Je viens te contempler à cette heure
Laisse mon cœur battre à ton rythme
Loin du bruit et des artifices

[Refrain]
Sainteté à l'Éternel
Sainteté au Dieu fidèle
Tout ce que j'ai, je te le donne
Sous l'éclat de ta couronne.`,
  },
];

export default function WorshipSessionPage() {
  const [activeSongId, setActiveSongId] = useState<string>(SONGS[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeSong = SONGS.find((s) => s.id === activeSongId) || SONGS[0];

  const togglePlay = (songId: string) => {
    if (activeSongId === songId) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveSongId(songId);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#17165A] text-white">
      {/* Hero Header */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#38217F]/60 blur-[130px]"
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-[#F5B900]">
            Immersion Musicale & Spirituelle
          </p>
          <h1 className="mt-4 font-heading text-5xl sm:text-7xl uppercase tracking-wider text-white">
            Worship Session
          </h1>
          <p className="mt-4 font-body text-base sm:text-lg text-cn-gray-300 max-w-2xl mx-auto">
            Écoutez les chants originaux de HAGIAZO Ministry, accédez aux paroles, accords et
            méditations pour votre édification personnelle ou pour votre équipe de louange locale.
          </p>
        </div>
      </section>

      {/* Lecteur et Playlist */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Liste des chants (Colonne gauche) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="font-heading text-2xl uppercase tracking-wide text-[#F5B900] mb-4 flex items-center gap-2">
              <Music size={20} /> Répertoire Officiel
            </h2>

            {SONGS.map((song) => {
              const isCurrent = activeSong.id === song.id;
              return (
                <div
                  key={song.id}
                  onClick={() => togglePlay(song.id)}
                  className={`cursor-pointer rounded-xl border p-4 sm:p-5 transition-all ${
                    isCurrent
                      ? "border-[#F5B900] bg-gradient-to-r from-[#38217F] to-[#17165A] shadow-[0_4px_20px_rgba(245,185,0,0.15)]"
                      : "border-white/10 bg-[#111111]/40 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Écouter ${song.title}`}
                        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                          isCurrent && isPlaying
                            ? "bg-[#F5B900] text-[#111111]"
                            : "bg-white/10 text-white hover:bg-[#F5B900] hover:text-[#111111]"
                        }`}
                      >
                        {isCurrent && isPlaying ? (
                          <Pause size={18} />
                        ) : (
                          <Play size={18} className="ml-0.5" />
                        )}
                      </button>
                      <div>
                        <h3 className="font-heading text-lg sm:text-xl uppercase tracking-wide text-white">
                          {song.title}
                        </h3>
                        <p className="text-xs text-cn-gray-300">
                          {song.theme} • {song.key}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-cn-gray-500">{song.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lecteur / Détail du chant sélectionné (Colonne droite) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#111111]/60 p-6 sm:p-8 backdrop-blur-md">
              {/* Carte lecteur audio simulé haute fidélité */}
              <div className="rounded-xl border border-white/10 bg-gradient-to-r from-[#17165A] to-[#38217F] p-5 sm:p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#F5B900]">
                      En lecture audio
                    </span>
                    <h3 className="font-heading text-2xl uppercase tracking-wide text-white mt-1">
                      {activeSong.title}
                    </h3>
                    <p className="text-xs text-cn-gray-300 mt-0.5">
                      HAGIAZO Ministry • Tonalité : {activeSong.key}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="self-start sm:self-auto flex items-center gap-2 rounded-full bg-[#F5B900] px-5 py-2.5 font-body text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-[#FFD84A] shadow-lg transition-transform hover:scale-105"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    <span>{isPlaying ? "En pause" : "Écouter l'extrait"}</span>
                  </button>
                </div>

                {/* Barre de progression interactive */}
                <div className="mt-6">
                  <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                    <div
                      className={`h-full bg-[#F5B900] transition-all duration-300 ${
                        isPlaying ? "w-2/3" : "w-1/4"
                      }`}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] font-mono text-cn-gray-500">
                    <span>{isPlaying ? "03:45" : "01:10"}</span>
                    <span>{activeSong.duration}</span>
                  </div>
                </div>
              </div>

              {/* Verset Biblique d'ancrage */}
              <div className="rounded-xl border border-[#F5B900]/30 bg-[#38217F]/30 p-4 sm:p-5 mb-8">
                <div className="flex items-start gap-3">
                  <BookOpen size={18} className="text-[#F5B900] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-medium italic text-cn-gold-light leading-relaxed">
                    {activeSong.bibleVerse}
                  </p>
                </div>
              </div>

              {/* Paroles (Lyrics) */}
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <h4 className="font-heading text-xl uppercase tracking-wide text-white">
                    Paroles officielles (Lyrics)
                  </h4>
                  <button
                    type="button"
                    onClick={() => alert(`Téléchargement de la partition et des paroles pour ${activeSong.title}`)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#F5B900] hover:underline uppercase tracking-wider font-semibold"
                  >
                    <Download size={14} /> Partitions & Accords
                  </button>
                </div>

                <div className="rounded-xl bg-black/40 p-6 border border-white/5 font-mono text-xs sm:text-sm leading-relaxed text-cn-gray-300 whitespace-pre-line max-h-96 overflow-y-auto">
                  {activeSong.lyrics}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Billetterie */}
        <div className="mt-16 text-center">
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 rounded-md bg-[#F5B900] px-8 py-4 font-body text-xs font-bold uppercase tracking-widest text-[#111111] shadow-xl hover:bg-[#FFD84A] transition-all hover:scale-105"
          >
            Venez chanter avec nous le 14 Novembre <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
