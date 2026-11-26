import { Link } from "react-router-dom";
import { WORTHWHILE_VALUES } from "../data/moduleTeams";

export default function SevenValuesStrip() {
  return (
    <section
      aria-label="Seven values of worthwhile development"
      className="w-full border-y border-[#B2C9A8] bg-[#F2F6EF] py-4"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#284B26]">
          7 Values of Worthwhile Development:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {WORTHWHILE_VALUES.map((value) => (
            <Link
              key={value}
              to="/worthwhile-development"
              className="rounded-full border border-[#94B985] bg-white px-3 py-1 text-xs font-medium text-[#284B26] transition-colors hover:border-[#3F673C] hover:bg-[#EDF4E8]"
            >
              {value}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

