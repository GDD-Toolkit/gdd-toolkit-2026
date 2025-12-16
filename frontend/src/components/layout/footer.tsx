export default function Footer() {
  return (
    <footer>
      <section className="text-white bg-black">
        <div className="max-w-7xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">
          
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-[#A07CFF]">Development Ethics Toolkit</h3>
            <p className="mt-3 text-white/80 text-sm leading-6">
              Practical tools, case studies, and methods to design and evaluate responsible projects.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white/90">Tools</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><a className="hover:text-[#A07CFF]" href="https://main.dn6y4rvhmhz3f.amplifyapp.com/"> AI Business Ethics Canvas</a></li>
              <li><a className="hover:text-[#A07CFF]" href="https://main.dc0y8ib3ovhbx.amplifyapp.com/"> AI Dashboard</a></li>
              <li><a className="hover:text-[#A07CFF]" href="/ethics-of-innovation">Ethics of Innovation</a></li>
              <li><a className="hover:text-[#A07CFF]" href="/human-centered-design">Human Centered Design</a></li>
              <li><a className="hover:text-[#A07CFF]" href="/project-planning">Project Planning</a></li>
              <li><a className="hover:text-[#A07CFF]" href="/project-evaluation">Project Evaluation</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white/90">Resources</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><a className="hover:text-[#A07CFF]" href="/funding-sources">Funding Sources</a></li>
                <li><a className="hover:text-[#A07CFF]" href="/podcast">Podcast</a></li>
              <li><a className="hover:text-[#A07CFF]" href="/acknowledgements">Acknowledgments</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white/90">Contact</h3>
            <p className="mt-3 text-sm text-white/70">Questions or feedback?</p>
            <a
              href="mailto:gddfire@gmail.com"
              className="mt-2 inline-block rounded-full bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] px-4 py-2 text-sm font-medium text-black hover:brightness-85 hover:saturate-70"
            >
              Email Us
            </a>
          </div>
        </div>

        <div className="bg-black">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between text-sm text-white/60">
            <span>© {new Date().getFullYear()} Development Ethics Toolkit</span>
            <nav className="flex gap-4">
              <a href="/Privacy_Statement.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-[#A07CFF]">Privacy Policy</a>
            </nav>
          </div>
        </div>

      </section>
    </footer>
  );
}
