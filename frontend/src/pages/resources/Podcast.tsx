import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Clock3,
  Headphones,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  X,
} from "lucide-react";
import {
  EDITORIAL_EASE,
  EDITORIAL_SERIF_STYLE,
  EditorialPageHero,
  EditorialReveal,
  EditorialSection,
  EditorialSectionHeader,
} from "@/components/editorial/EditorialPagePrimitives";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getPodcasts } from "../../api/strapi";
import "./Podcast.css";

type Episode = {
  id: number;
  title: string;
  description: string;
  url: string;
  date: string;
};

const artwork = "/assets/images/developmentlens.png";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function SoundwaveBars({
  playing,
  tone = "emerald",
}: {
  playing: boolean;
  tone?: "emerald" | "cream";
}) {
  const reduced = useReducedMotion();
  const barColor = tone === "cream" ? "bg-[#E9E6B2]" : "bg-[#187347]";
  return (
    <span
      className={cn(
        "podcast-eq",
        playing && !reduced && "podcast-eq--playing",
      )}
      aria-hidden="true"
    >
      <span className={cn("podcast-eq-bar", barColor)} />
      <span className={cn("podcast-eq-bar", barColor)} />
      <span className={cn("podcast-eq-bar", barColor)} />
      <span className={cn("podcast-eq-bar", barColor)} />
    </span>
  );
}

export default function Podcast() {
  const reduced = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const requestRef = useRef(0);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lengths, setLengths] = useState<Record<number, number>>({});

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPodcasts() {
      try {
        const podcasts = await getPodcasts();
        const mediaBase = `${import.meta.env.VITE_STRAPI_URL.replace(/\/(api\/?)?$/, "")}/`;
        const loadedEpisodes = podcasts.map((podcast) => {
          const audioUrl = podcast.podcast_audio?.[0]?.url;
          return {
            id: podcast.id,
            title: podcast.title,
            description: podcast.description,
            date: podcast.release_date || podcast.createdAt,
            url: audioUrl ? new URL(audioUrl, mediaBase).href : "",
          };
        });
        loadedEpisodes.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        if (!cancelled) setEpisodes(loadedEpisodes);
      } catch {
        if (!cancelled) {
          setFetchError("Unable to load podcasts. Please try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadPodcasts();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const probes = episodes
      .filter((episode) => episode.url)
      .map((episode) => {
        const audio = new Audio();
        audio.preload = "metadata";
        audio.onloadedmetadata = () => {
          if (Number.isFinite(audio.duration)) {
            setLengths((previous) => ({
              ...previous,
              [episode.id]: audio.duration,
            }));
          }
        };
        audio.src = episode.url;
        return audio;
      });
    return () => {
      probes.forEach((audio) => {
        audio.onloadedmetadata = null;
        audio.removeAttribute("src");
        audio.load();
      });
    };
  }, [episodes]);

  async function playEpisode(episode: Episode) {
    const audio = audioRef.current;
    if (!audio || !episode.url) return;
    const request = ++requestRef.current;
    setError("");
    if (activeEpisode?.id !== episode.id) {
      audio.pause();
      audio.src = episode.url;
      setCurrentTime(0);
      setDuration(lengths[episode.id] ?? 0);
      setActiveEpisode(episode);
    }
    try {
      await audio.play();
    } catch (cause) {
      if (
        request === requestRef.current &&
        !(cause instanceof DOMException && cause.name === "AbortError")
      ) {
        setError("Unable to play this episode. Please try again.");
      }
    }
  }

  function toggleEpisode(episode: Episode) {
    if (activeEpisode?.id === episode.id && playing) {
      requestRef.current += 1;
      audioRef.current?.pause();
    } else {
      void playEpisode(episode);
    }
  }

  function seek(time: number) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(time, audio.duration));
    setCurrentTime(audio.currentTime);
  }

  function closePlayer() {
    requestRef.current += 1;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setActiveEpisode(null);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError("");
  }

  const latestEpisode = episodes[0];
  const latestIsPlaying = activeEpisode?.id === latestEpisode?.id && playing;
  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div
      className={cn(
        "podcast-editorial-page min-h-screen bg-white text-[#202B20]",
        activeEpisode && "pb-36 sm:pb-28",
      )}
    >

      <EditorialPageHero
        titleId="podcast-title"
        badges={[
          { label: "The Podcast", tone: "cream" },
          { label: "FIRE Global Development & Design", tone: "sage" },
        ]}
        title={
          <>
            The Development{" "}
            <em className="font-normal italic text-[#E9E6B2]">Lens</em>
          </>
        }
        subtitle={
          <div className="space-y-3">
            <p className="text-lg font-medium text-[#E9E6B2] sm:text-xl">
              Thoughtful conversations. More ethical development.
            </p>
            <p className="text-sm leading-relaxed text-[#E8F0E5] sm:text-base">
              Explore how ethical, sustainable, and human-centered choices shape
              real-world projects. Join our student team, faculty mentor, and
              community partners as we unpack case studies, share research
              stories, and put the Development Ethics Toolkit into practice.
            </p>
            <p className="text-sm leading-relaxed text-[#E8F0E5]/90 sm:text-base">
              From Africa to the Philippines, we reflect on what works, what
              challenges us, and how to design projects that center the people
              they serve.
            </p>
          </div>
        }
        actions={
          <>
            <button
              type="button"
              disabled={!latestEpisode?.url}
              onClick={() => {
                if (latestEpisode) toggleEpisode(latestEpisode);
              }}
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[#E9E6B2] px-6 py-3.5 text-sm font-semibold text-[#202B20] shadow-sm transition-all duration-200 hover:bg-[#f2efbf] focus:outline-none focus:ring-2 focus:ring-[#E9E6B2] focus:ring-offset-2 focus:ring-offset-[#3F673C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {latestIsPlaying ? (
                <Pause className="size-4 fill-current" aria-hidden="true" />
              ) : (
                <Play className="size-4 fill-current" aria-hidden="true" />
              )}
              {latestIsPlaying ? "Pause Latest Episode" : "Play Latest Episode"}
            </button>

            <a
              href="#episodes-section"
              className="inline-flex items-center gap-2 rounded-full border border-[#9AB887] bg-[#2E502B] px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#254223]"
            >
              <Headphones className="size-4 text-[#E9E6B2]" aria-hidden="true" />
              {loading
                ? "Loading episodes…"
                : `${episodes.length} ${episodes.length === 1 ? "Episode" : "Episodes"}`}
            </a>
          </>
        }
        aside={
          <div className="mx-auto max-w-sm lg:ml-auto lg:mr-0">
            <div className="relative overflow-hidden rounded-2xl border-[1.5px] border-[#E9E6B2] bg-[#202B20] p-3.5 shadow-2xl">
              <div className="relative overflow-hidden rounded-xl border border-[#9AB887]/40 bg-[#2E502B]">
                <img
                  src={artwork}
                  alt="The Development Lens podcast cover"
                  className="block aspect-square w-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#192419]/90 via-[#192419]/35 to-transparent"
                />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-xl border border-[#94B985] bg-white/95 px-3.5 py-2.5 text-[#202B20] shadow-md backdrop-blur-sm">
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#187347]">
                      {playing ? "Now Playing" : "Featured Series"}
                    </p>
                    <p className="truncate text-xs font-semibold text-[#202B20]">
                      {activeEpisode?.title ??
                        latestEpisode?.title ??
                        "The Development Lens"}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {playing ? (
                      <SoundwaveBars playing tone="emerald" />
                    ) : (
                      <Volume2
                        className="size-4 text-[#187347]"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <EditorialSection
        id="episodes-section"
        tone="sage"
        ariaLabelledBy="episodes-title"
      >
        <EditorialSectionHeader
          eyebrow="01 / Listen & Explore"
          title="All Episodes"
          titleId="episodes-title"
          description="Stream conversations directly in your browser. Click any episode below to launch the persistent audio bar."
          action={
            <span className="inline-flex items-center gap-2 rounded-full border border-[#94B985] bg-white px-4 py-1.5 font-mono text-xs font-medium text-[#284B26]">
              <Headphones className="size-3.5 text-[#187347]" aria-hidden="true" />
              {episodes.length}{" "}
              {episodes.length === 1 ? "episode" : "episodes"}
            </span>
          }
        />

        <div className="mt-8 space-y-4">
          {loading && (
            <div className="space-y-4" role="status" aria-label="Loading podcasts">
              <p className="sr-only">Loading podcasts...</p>
              {Array.from({ length: 3 }, (_, idx) => (
                <Skeleton
                  key={idx}
                  className="h-36 w-full rounded-2xl border border-[#B2C9A8] bg-white/80"
                />
              ))}
            </div>
          )}

          {fetchError && (
            <div
              role="alert"
              className="rounded-2xl border-[1.5px] border-destructive/40 bg-white p-6 text-sm text-[#202B20]"
            >
              <p className="font-semibold" style={EDITORIAL_SERIF_STYLE}>
                Could not load episodes
              </p>
              <p className="mt-1 text-[#596556]">{fetchError}</p>
            </div>
          )}

          {!loading && !fetchError && episodes.length === 0 && (
            <div className="rounded-2xl border-[1.5px] border-dashed border-[#94B985] bg-white p-10 text-center">
              <p
                className="text-lg font-semibold text-[#202B20]"
                style={EDITORIAL_SERIF_STYLE}
              >
                No podcasts available yet.
              </p>
              <p className="mt-1.5 text-sm text-[#596556]">
                Check back soon for new conversations from our research cohorts
                and global partners.
              </p>
            </div>
          )}

          {episodes.map((episode, index) => {
            const isActive = activeEpisode?.id === episode.id;
            const isPlaying = isActive && playing;
            const episodeNumber = String(episode.id).padStart(2, "0");

            return (
              <EditorialReveal key={episode.id} delay={Math.min(index * 0.04, 0.2)}>
                <article
                  className={cn(
                    "group flex flex-col gap-5 rounded-2xl border-[1.5px] p-5 transition-all duration-200 sm:p-6 md:flex-row md:items-center md:gap-6",
                    isActive
                      ? "border-[#3F673C] bg-[#FAFDF8] shadow-md ring-1 ring-[#3F673C]/15"
                      : "border-[#B2C9A8] bg-white hover:-translate-y-0.5 hover:border-[#3F673C] hover:bg-[#FAFDF8] hover:shadow-md motion-reduce:hover:translate-y-0",
                  )}
                >
                  {/* Episode Number + Live Soundwave */}
                  <div className="flex items-center gap-3 md:flex-col md:items-center md:gap-2">
                    <span
                      className={cn(
                        "flex size-12 shrink-0 items-center justify-center rounded-xl border text-lg font-semibold tabular-nums transition-colors",
                        isActive
                          ? "border-[#3F673C] bg-gradient-to-br from-[#3F673C] to-[#187347] text-[#E9E6B2]"
                          : "border-[#B2C9A8] bg-[#F2F6EF] text-[#284B26] group-hover:border-[#3F673C]",
                      )}
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {episodeNumber}
                    </span>
                    {isPlaying && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#94B985] bg-[#EDF4E8] px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-[#187347]">
                        <SoundwaveBars playing tone="emerald" />
                        Live
                      </span>
                    )}
                  </div>

                  {/* Episode Copy & Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#596556]">
                      <time
                        dateTime={episode.date}
                        className="rounded-full border border-[#D5E3D9] bg-[#F2F6EF] px-2.5 py-0.5 font-mono text-[11px] text-[#284B26]"
                      >
                        Released{" "}
                        {new Date(episode.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#D6CE8A] bg-[#FAF8E4] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#6F6057] tabular-nums">
                        <Clock3 className="size-3" aria-hidden="true" />
                        {lengths[episode.id]
                          ? formatTime(lengths[episode.id])
                          : "Length unavailable"}
                      </span>
                    </div>

                    <h3
                      className="mt-2.5 text-xl font-semibold leading-snug text-[#202B20] transition-colors group-hover:text-[#187347]"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {episode.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#394838]">
                      {episode.description}
                    </p>
                  </div>

                  {/* Tactile Play/Pause Emerald Pill */}
                  <div className="shrink-0">
                    <button
                      type="button"
                      disabled={!episode.url}
                      onClick={() => toggleEpisode(episode)}
                      aria-label={
                        episode.url
                          ? `${isPlaying ? "Pause" : "Play"} ${episode.title}`
                          : `Audio unavailable for ${episode.title}`
                      }
                      className={cn(
                        "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F673C] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        isActive
                          ? "bg-gradient-to-r from-[#3F673C] to-[#187347] text-white shadow-sm hover:brightness-110"
                          : "border-[1.5px] border-[#3F673C] bg-white text-[#284B26] hover:bg-[#187347] hover:text-white",
                      )}
                    >
                      {isPlaying ? (
                        <Pause
                          className="size-4 fill-current"
                          aria-hidden="true"
                        />
                      ) : (
                        <Play
                          className="size-4 fill-current"
                          aria-hidden="true"
                        />
                      )}
                      <span>
                        {!episode.url
                          ? "Audio unavailable"
                          : isPlaying
                            ? "Pause"
                            : "Play episode"}
                      </span>
                    </button>
                  </div>
                </article>
              </EditorialReveal>
            );
          })}
        </div>
      </EditorialSection>

      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onLoadedMetadata={(event) =>
          setDuration(
            Number.isFinite(event.currentTarget.duration)
              ? event.currentTarget.duration
              : 0,
          )
        }
        onError={() => {
          setPlaying(false);
          setError("Unable to load the audio. Please try again.");
        }}
      />

      {/* Sticky Bottom Dark Forest Editorial Audio Player */}
      <AnimatePresence>
        {activeEpisode && (
          <motion.section
            key="podcast-audio-player"
            aria-label="Podcast audio player"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 96 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 96 }}
            transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
            className="podcast-sticky-player fixed inset-x-0 bottom-0 z-[70] border-t-2 border-[#94B985] bg-[#202B20] text-white shadow-[0_-12px_36px_rgba(20,34,20,0.42)]"
          >
            <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 lg:px-8">
              <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 md:grid-cols-[minmax(0,1fr)_minmax(280px,1.35fr)_auto] md:gap-6">
                {/* Now Playing Info */}
                <div className="flex min-w-0 items-center gap-3.5">
                  <img
                    src={artwork}
                    alt=""
                    className="size-12 shrink-0 rounded-xl border border-[#E9E6B2]/70 object-cover shadow-sm"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E9E6B2]">
                        {playing ? "Now Playing" : "Ready to Listen"}
                      </span>
                      {playing && <SoundwaveBars playing tone="cream" />}
                    </div>
                    <strong
                      className="mt-0.5 block truncate text-sm font-semibold text-white"
                      style={EDITORIAL_SERIF_STYLE}
                    >
                      {activeEpisode.title}
                    </strong>
                  </div>
                </div>

                {/* Transport Controls + Scrubber */}
                <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      aria-label="Skip back 15 seconds"
                      onClick={() =>
                        seek((audioRef.current?.currentTime ?? 0) - 15)
                      }
                      disabled={!duration}
                      className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-full border border-[#9AB887]/40 bg-[#2E502B]/70 px-3 font-mono text-[11px] font-medium text-[#EDF4E8] transition-colors hover:border-[#E9E6B2] hover:text-[#E9E6B2] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                      <span>15s</span>
                    </button>

                    <button
                      type="button"
                      aria-label={playing ? "Pause" : "Play"}
                      onClick={() => toggleEpisode(activeEpisode)}
                      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-[#E9E6B2] text-[#202B20] shadow-md transition-transform hover:scale-105 hover:bg-[#f2efbf] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E9E6B2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#202B20]"
                    >
                      {playing ? (
                        <Pause
                          className="size-5 fill-current"
                          aria-hidden="true"
                        />
                      ) : (
                        <Play
                          className="ml-0.5 size-5 fill-current"
                          aria-hidden="true"
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      aria-label="Skip forward 15 seconds"
                      onClick={() =>
                        seek((audioRef.current?.currentTime ?? 0) + 15)
                      }
                      disabled={!duration}
                      className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-full border border-[#9AB887]/40 bg-[#2E502B]/70 px-3 font-mono text-[11px] font-medium text-[#EDF4E8] transition-colors hover:border-[#E9E6B2] hover:text-[#E9E6B2] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <span>15s</span>
                      <RotateCw className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <span className="w-10 text-right font-mono text-[11px] text-[#E9E6B2] tabular-nums">
                      {formatTime(currentTime)}
                    </span>
                    <input
                      aria-label="Playback position"
                      type="range"
                      min={0}
                      max={duration || 1}
                      step={0.1}
                      value={Math.min(currentTime, duration || 1)}
                      disabled={!duration}
                      onChange={(event) => seek(Number(event.target.value))}
                      className="podcast-scrubber flex-1"
                      style={{
                        background: `linear-gradient(to right, #E9E6B2 0%, #E9E6B2 ${progressPct}%, rgba(148, 185, 133, 0.3) ${progressPct}%, rgba(148, 185, 133, 0.3) 100%)`,
                      }}
                    />
                    <span className="w-10 font-mono text-[11px] text-[#C8DAC1] tabular-nums">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  aria-label="Close player and stop audio"
                  onClick={closePlayer}
                  className="col-start-2 row-start-1 inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#9AB887]/45 bg-[#2E502B]/70 text-[#EDF4E8] transition-colors hover:border-[#E9E6B2] hover:bg-[#3F673C] hover:text-[#E9E6B2] md:col-start-3"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>

              {error && (
                <p
                  className="mt-2.5 rounded-lg border border-red-400/40 bg-red-950/60 px-3 py-1.5 text-center text-xs text-red-200"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
