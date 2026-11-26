import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Headphones, Play, Sparkles } from "lucide-react";
import gddHeroPoster from "@/assets/images/gdd-hero.jpg";

export default function PlatformEcosystem() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      void videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      videoRef.current.currentTime = 1;
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.currentTime = 1;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 1;
    }
  };

  return (
    <section
      id="explainer-video"
      aria-labelledby="ecosystem-heading"
      className="w-full border-t border-[#B2C9A8] bg-[#F2F6EF] py-20 text-[#202B20] md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-[#187347]">
          04 / Watch, Listen &amp; Fund Ethical Work
        </p>
        <h2
          id="ecosystem-heading"
          className="mt-2 text-3xl font-semibold tracking-tight text-[#202B20] sm:text-4xl"
          style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
        >
          Explore the Full Platform Ecosystem
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card 1: Explainer Video */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5">
            <div>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#202B20]">
                <video
                  ref={videoRef}
                  src="/ToolkitHomeVideo.mp4"
                  poster={gddHeroPoster}
                  className="h-full w-full object-cover"
                  controls={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={handlePause}
                  onEnded={handleEnded}
                  onLoadedMetadata={handleLoadedMetadata}
                />
                {!isPlaying && (
                  <button
                    type="button"
                    onClick={handlePlay}
                    aria-label="Play explainer video"
                    className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-[#202B20]/45 transition-colors hover:bg-[#202B20]/30 focus:outline-none focus:ring-2 focus:ring-[#3F673C]"
                  >
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#E9E6B2] bg-gradient-to-r from-[#3F673C] to-[#187347] text-white shadow-lg transition-transform group-hover:scale-110">
                      <Play
                        className="ml-0.5 h-6 w-6 fill-current"
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                )}
              </div>

              <p className="mt-4 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                Explainer Video
              </p>
              <h3
                className="mt-1 text-xl font-semibold text-[#202B20]"
                style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
              >
                Learn More About the Toolkit
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#596556]">
                Watch how practitioners combine human-centered design, ethical
                AI, and global case studies to build responsible impact
                projects.
              </p>
            </div>
          </div>

          {/* Card 2: The Development Lens Podcast */}
          <div className="flex flex-col justify-between gap-5 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5">
            <div>
              <div className="flex items-center gap-4">
                <img
                  src="/assets/images/developmentlens.png"
                  alt="The Development Lens podcast cover"
                  className="h-24 w-24 shrink-0 rounded-xl border border-[#D5E3D9] object-cover"
                />
                <div>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                    <Headphones className="h-3 w-3" aria-hidden="true" />
                    The Podcast
                  </span>
                  <h3
                    className="mt-1 text-xl font-semibold leading-snug text-[#202B20]"
                    style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
                  >
                    The Development Lens
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#596556]">
                    Thoughtful conversations. More ethical development.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#596556]">
                Join our student team, faculty mentor, and international
                community partners from Africa to the Philippines as we unpack
                case studies and put the toolkit into practice.
              </p>
            </div>

            <Link
              to="/podcast"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#187347] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#105C37]"
            >
              <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              Listen to Latest Episode
            </Link>
          </div>

          {/* Card 3: Funding Sources Tracker */}
          <div className="flex flex-col justify-between gap-5 rounded-2xl border-[1.5px] border-[#B2C9A8] bg-white p-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#94B985] bg-[#EDF4E8] px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#187347]">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Refreshed Nightly
              </span>
              <h3
                className="mt-3 text-xl font-semibold text-[#202B20]"
                style={{ fontFamily: '"Noto Serif", Georgia, serif' }}
              >
                Funding Sources Tracker
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#596556]">
                Discover open grants, fellowships, and funding calls from
                verified public international funders—searchable by amount,
                deadline, and thematic alignment.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#B2C9A8] bg-[#F2F6EF] px-3 py-1 font-mono text-[11px] text-[#284B26]">
                  Open Calls
                </span>
                <span className="rounded-full border border-[#D6CE8A] bg-[#FAF8E4] px-3 py-1 font-mono text-[11px] text-[#6F6057]">
                  Closing Soon
                </span>
                <span className="rounded-full border border-[#B2C9A8] bg-[#F2F6EF] px-3 py-1 font-mono text-[11px] text-[#284B26]">
                  Public Funders
                </span>
              </div>
            </div>

            <Link
              to="/funding-sources"
              className="inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-[#3F673C] bg-white px-4 py-2 text-xs font-semibold text-[#284B26] transition-colors hover:bg-[#EDF4E8]"
            >
              Search Funding Database
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

