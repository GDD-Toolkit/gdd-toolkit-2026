import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050507] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand & Attribution */}
          <div className="md:col-span-4">
            <Link
              to="/"
              aria-label="Development Ethics Toolkit Home"
              className="inline-flex items-center"
            >
              <Logo size="sm" className="text-white" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Built by University of Maryland FIRE Global Development &amp;
              Design student researchers, mentored by Dr. Ben Huffman &amp; Dr.
              Stacy Kosko, with international partners DICT &amp; OWLI.
            </p>
          </div>

          {/* Tools */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-[#A07CFF]">
              Tools
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <a
                  className="transition-colors hover:text-[#C4B5FD]"
                  href="https://main.dn6y4rvhmhz3f.amplifyapp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AI Business Ethics Canvas
                </a>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/ai-ethics-dashboard"
                >
                  AI Ethics Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/ethics-of-innovation"
                >
                  Ethics of Innovation
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/human-centered-design"
                >
                  Human Centered Design
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/project-planning"
                >
                  Project Planning
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/project-evaluation"
                >
                  Project Evaluation
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/geopolitical-analysis"
                >
                  Geopolitical Analysis
                </Link>
              </li>
            </ul>
          </div>

          {/* Research & Resources */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-[#A07CFF]">
              Research &amp; Resources
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/development-ethics"
                >
                  Development Ethics
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/worthwhile-development"
                >
                  Worthwhile Development
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/capability-approach"
                >
                  The Capability Approach
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/case-studies"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/funding-sources"
                >
                  Funding Sources
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/podcast"
                >
                  The Development Lens Podcast
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-[#C4B5FD]"
                  to="/acknowledgements"
                >
                  Acknowledgements
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-[#A07CFF]">
              Contact
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Feedback or partnership inquiries?
            </p>
            <a
              href="mailto:gddfire@gmail.com"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-110"
            >
              Email Us
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <span>
            &copy; {new Date().getFullYear()} Development Ethics Toolkit ·
            University of Maryland FIRE
          </span>
          <nav className="flex items-center gap-4">
            <a
              href="/Privacy_Statement.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#C4B5FD]"
            >
              Privacy Policy
            </a>
            <span aria-hidden="true">&middot;</span>
            <a
              href="mailto:gddfire@gmail.com"
              className="transition-colors hover:text-[#C4B5FD]"
            >
              gddfire@gmail.com
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
