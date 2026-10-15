import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, Headphones, Pause, Play, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import "./Podcast.css";

type Episode = {
  id: number;
  title: string;
  description: string;
  date: string;
  url: string;
};

// Replace these records with Strapi data when the endpoint is connected.
const episodes: Episode[] = [
  {
    id: 1,
    title: "The Development Lens · Episode 1",
    description: "Listen to the first episode of The Development Lens, a podcast from FIRE Global Development & Design.",
    date: "2025-12-08",
    url: "/assets/The_Development_Lens_EP1.mp3",
  },
];
const artwork = "/assets/images/developmentlens.png";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export default function Podcast() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const requestRef = useRef(0);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lengths, setLengths] = useState<Record<number, number>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    const probes = episodes.map(episode => {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        if (Number.isFinite(audio.duration)) {
          setLengths(previous => ({ ...previous, [episode.id]: audio.duration }));
        }
      };
      audio.src = episode.url;
      return audio;
    });
    return () => {
      probes.forEach(audio => {
        audio.onloadedmetadata = null;
        audio.removeAttribute("src");
        audio.load();
      });
    };
  }, []);

  async function playEpisode(episode: Episode) {
    const audio = audioRef.current;
    if (!audio) return;
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
      if (request === requestRef.current && !(cause instanceof DOMException && cause.name === "AbortError")) {
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

  return (
    <div className={`podcast-page${activeEpisode ? " podcast-page--with-player" : ""}`}>
      <div className="podcast-shell">
        <div className="podcast-eyebrow"><Headphones size={16} /> THE PODCAST</div>
        <section className="podcast-hero" aria-labelledby="podcast-title">
          <div className="podcast-artwork"><img src={artwork} alt="The Development Lens podcast cover" /></div>
          <div className="podcast-introduction">
            <span className="podcast-tag">FIRE Global Development &amp; Design</span>
            <h1 id="podcast-title">The Development Lens<span>.</span></h1>
            <p className="podcast-deck">Thoughtful conversations. More ethical development.</p>
            <p>Explore how ethical, sustainable, and human-centered choices shape real-world projects. Join our student team, faculty mentor, and community partners as we unpack case studies, share research stories, and put the Development Ethics Toolkit into practice.</p>
            <p>From Africa to the Philippines, we reflect on what works, what challenges us, and how to design projects that center the people they serve.</p>
            <Button className="podcast-primary" onClick={() => toggleEpisode(episodes[0])}>
              {playing ? <Pause size={17} /> : <Play size={17} />} {playing ? "Pause episode" : "Listen to the latest episode"}
            </Button>
          </div>
        </section>

        <section className="podcast-episodes" aria-labelledby="episodes-title">
          <div className="podcast-section-heading">
            <div><span className="podcast-eyebrow">LISTEN &amp; EXPLORE</span><h2 id="episodes-title">All episodes</h2></div>
            <span className="podcast-count">{episodes.length} {episodes.length === 1 ? "episode" : "episodes"}</span>
          </div>
          <div className="podcast-episode-list">
            {episodes.map(episode => {
              const isPlaying = activeEpisode?.id === episode.id && playing;
              return (
                <article key={episode.id} className={`podcast-episode${activeEpisode?.id === episode.id ? " podcast-episode--active" : ""}`}>
                  <span className="podcast-episode-number">{String(episode.id).padStart(2, "0")}</span>
                  <div className="podcast-episode-body">
                    <div className="podcast-episode-meta">
                      <time dateTime={episode.date}>Uploaded {new Date(`${episode.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
                      <span><Clock3 size={14} />{lengths[episode.id] ? formatTime(lengths[episode.id]) : "Length unavailable"}</span>
                    </div>
                    <h3>{episode.title}</h3>
                    <p>{episode.description}</p>
                  </div>
                  <Button variant="outline" className="podcast-episode-play" onClick={() => toggleEpisode(episode)} aria-label={`${isPlaying ? "Pause" : "Play"} ${episode.title}`}>
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}<span>{isPlaying ? "Pause" : "Play episode"}</span>
                  </Button>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <audio ref={audioRef} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onTimeUpdate={event => setCurrentTime(event.currentTarget.currentTime)} onLoadedMetadata={event => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)} onError={() => { setPlaying(false); setError("Unable to load the audio. Please try again."); }} />

      {activeEpisode && (
        <section className="podcast-player" aria-label="Podcast audio player">
          <div className="podcast-player-inner">
            <div className="podcast-now-playing">
              <img src={artwork} alt="" />
              <div><span>{playing ? "NOW PLAYING" : "READY TO LISTEN"}</span><strong>{activeEpisode.title}</strong></div>
            </div>
            <div className="podcast-playback">
              <div className="podcast-player-controls">
                <Button variant="ghost" className="podcast-skip" aria-label="Skip back 15 seconds" onClick={() => seek((audioRef.current?.currentTime ?? 0) - 15)} disabled={!duration}><ArrowLeft size={17} /><span>15s</span></Button>
                <Button className="podcast-primary podcast-player-toggle" aria-label={playing ? "Pause" : "Play"} onClick={() => toggleEpisode(activeEpisode)}>{playing ? <Pause size={20} /> : <Play size={20} />}</Button>
                <Button variant="ghost" className="podcast-skip" aria-label="Skip forward 15 seconds" onClick={() => seek((audioRef.current?.currentTime ?? 0) + 15)} disabled={!duration}><span>15s</span><ArrowRight size={17} /></Button>
              </div>
              <div className="podcast-progress"><span>{formatTime(currentTime)}</span><input aria-label="Playback position" type="range" min={0} max={duration || 1} step={0.1} value={Math.min(currentTime, duration || 1)} disabled={!duration} onChange={event => seek(Number(event.target.value))} /><span>{formatTime(duration)}</span></div>
            </div>
            <Button variant="ghost" className="podcast-close" aria-label="Close player and stop audio" onClick={closePlayer}><X size={20} /></Button>
            {error && <p className="podcast-player-error" role="alert">{error}</p>}
          </div>
        </section>
      )}
    </div>
  );
}
