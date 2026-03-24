export default function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100svh-56px)] overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-80"
        src="/hero.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/35" />

      {/* Title + blurb (20% from top) */}
      <div className="absolute inset-x-0 top-[20%]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight
        bg-gradient-to-r from-[#A07CFF] to-[#6D83F2]
        bg-clip-text text-transparent
        drop-shadow-md leading-[1.05]"
        >
            Development Ethics Toolkit
          </h1>
          <p className="mt-4 mx-auto max-w-3xl text-center text-base sm:text-lg md:text-xl text-white/90 font-medium">
          Our toolkit is a free, open-access platform that helps practitioners, policymakers, and scholars design, evaluate, and improve social impact projects ethically and effectively, with practical tools, resources, and AI-powered applications that support values-based and human-centered decision-making.
          </p>
        </div>
      </div>
    </section>
  );
}
