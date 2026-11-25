import "./ToolModal.css";
import {
  AlertTriangle,
  BookOpen,
  ClipboardCheck,
  ExternalLink,
  Layers,
  Lightbulb,
  ListChecks,
  Target,
  ThumbsUp,
  Video,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { EDITORIAL_SERIF_STYLE } from "@/components/editorial/EditorialPagePrimitives";

export type Bullet = {
  text: string;
  image?: string;
  sub_bullets: Bullet[];
};

export type ProjectPlanningTool = {
  name: string;
  type: string[];
  time: string[];
  image: string;
  learning_obj: Bullet[];
  characteristics: Bullet[];
  process: Bullet[];
  benefits: Bullet[];
  drawbacks: Bullet[];
  example: Bullet[];
  resources: Bullet[];
  use_case_video?: string;
  slideshow?: string;
  evaluation: Bullet[];
};

const TYPE_PILL_STYLES: Record<string, string> = {
  "Six Sigma": "border-[#A2B7D8] bg-[#EFF4FA] text-[#2F4868]",
  "Process Mapping": "border-[#D6CE8A] bg-[#FAF8E4] text-[#5C4E22]",
  "Decision Making": "border-[#D9B8C4] bg-[#FDF2F6] text-[#6B2D46]",
  "User-Centric": "border-[#94B985] bg-[#EDF4E8] text-[#187347]",
  "Efficiency/Innovation": "border-[#DFC09C] bg-[#FCF4EC] text-[#7A4419]",
  "Quality Management": "border-[#C4B8DF] bg-[#F4F1FA] text-[#4B367C]",
};

const TIME_PILL_STYLES: Record<string, string> = {
  "Short-term": "border-[#94B985] bg-[#EDF4E8] text-[#284B26]",
  "Long-term": "border-[#D6CE8A] bg-[#F6F4D8] text-[#5E5128]",
};

export default function ToolModal({
  tool,
  onClose,
  onRestoreFocus,
}: {
  tool: ProjectPlanningTool;
  onClose: () => void;
  onRestoreFocus: () => void;
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="planning-tool-dialog"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onRestoreFocus();
        }}
      >
        {/* Forest Green Editorial Modal Header */}
        <DialogHeader className="relative bg-[#3F673C] px-6 py-6 pr-14 text-left text-white sm:px-8 sm:py-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[#9AB887] bg-[#2E502B] px-3 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[#E9E6B2]">
              Planning Methodology Guide
            </span>
          </div>
          <DialogTitle
            className="mt-1 text-2xl font-semibold leading-tight text-white sm:text-3xl"
            style={EDITORIAL_SERIF_STYLE}
          >
            {tool.name}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm leading-relaxed text-[#E8F0E5]">
            Explore the process, benefits, and learning resources for{" "}
            {tool.name}.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Editorial Body */}
        <div className="space-y-6 bg-[#FAFDF8] p-5 sm:p-8">
          {/* Keywords Ribbon */}
          {(tool.type.length > 0 || tool.time.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border-[1.5px] border-[#B2C9A8] bg-[#F2F6EF] px-4 py-3">
              <span className="mr-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#187347]">
                Keywords
              </span>
              {tool.type.map((ty) => (
                <span
                  key={ty}
                  className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium ${
                    TYPE_PILL_STYLES[ty] ??
                    "border-[#B2C9A8] bg-white text-[#284B26]"
                  }`}
                >
                  {ty}
                </span>
              ))}
              {tool.time.map((ti) => (
                <span
                  key={ti}
                  className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium ${
                    TIME_PILL_STYLES[ti] ??
                    "border-[#B2C9A8] bg-white text-[#284B26]"
                  }`}
                >
                  {ti}
                </span>
              ))}
            </div>
          )}

          {/* Main Visual */}
          {tool.image && (
            <div className="overflow-hidden rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-4 shadow-xs">
              <img
                src={tool.image}
                alt={tool.name}
                className="mx-auto max-h-72 w-full object-contain"
              />
            </div>
          )}

          {/* Learning Objectives + Characteristics */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <section className="rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EDF4E8] text-[#187347]">
                  <Target className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3
                  className="text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Learning Objectives
                </h3>
              </div>
              <BulletList bullets={tool.learning_obj} />
            </section>

            <section className="rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EDF4E8] text-[#187347]">
                  <Layers className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3
                  className="text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Characteristics
                </h3>
              </div>
              <BulletList bullets={tool.characteristics} />
            </section>
          </div>

          {/* Process Callout */}
          <section className="rounded-xl border-[1.5px] border-[#94B985] bg-[#F2F6EF] p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3F673C] text-[#E9E6B2]">
                <ListChecks className="h-4 w-4" aria-hidden="true" />
              </span>
              <h3
                className="text-lg font-semibold text-[#202B20]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Process
              </h3>
            </div>
            <BulletList bullets={tool.process} />
          </section>

          {/* Benefits + Drawbacks */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <section className="rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EDF4E8] text-[#187347]">
                  <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3
                  className="text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Benefits
                </h3>
              </div>
              <BulletList bullets={tool.benefits} />
            </section>

            <section className="rounded-xl border-[1.5px] border-[#D6CE8A] bg-[#FAF9ED] p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F6F4D8] text-[#6F6057]">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3
                  className="text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Drawbacks
                </h3>
              </div>
              <BulletList bullets={tool.drawbacks} />
            </section>
          </div>

          {/* Example */}
          <section className="rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F6F4D8] text-[#284B26]">
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
              </span>
              <h3
                className="text-lg font-semibold text-[#202B20]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Example
              </h3>
            </div>
            <BulletList bullets={tool.example} />
          </section>

          {/* Resources + Use Case Video / Slideshow */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <section className="rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EDF4E8] text-[#187347]">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3
                  className="text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Resources
                </h3>
              </div>
              <BulletList bullets={tool.resources} isLink />
            </section>

            <section className="rounded-xl border-[1.5px] border-[#B2C9A8] bg-white p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EDF4E8] text-[#187347]">
                  <Video className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3
                  className="text-lg font-semibold text-[#202B20]"
                  style={EDITORIAL_SERIF_STYLE}
                >
                  Use Case Video / Slideshow
                </h3>
              </div>
              {tool.use_case_video ? (
                tool.use_case_video.endsWith(".mp4") ? (
                  <video
                    src={tool.use_case_video}
                    controls
                    className="h-56 w-full rounded-lg border border-[#DCE7D7] bg-[#202B20] object-contain"
                  />
                ) : (
                  <iframe
                    className="h-56 w-full rounded-lg border border-[#DCE7D7]"
                    src={tool.use_case_video}
                    title="Tool Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : tool.slideshow ? (
                <iframe
                  className="h-56 w-full rounded-lg border border-[#DCE7D7]"
                  src={tool.slideshow}
                  title="Tool Slideshow"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-[#B2C9A8] bg-[#F2F6EF]/60 px-4 text-center text-sm text-[#596556]">
                  No video or slideshow available.
                </div>
              )}
            </section>
          </div>

          {/* Evaluation */}
          <section className="rounded-xl border-[1.5px] border-[#94B985] bg-[#F2F6EF] p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3F673C] text-[#E9E6B2]">
                <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <h3
                className="text-lg font-semibold text-[#202B20]"
                style={EDITORIAL_SERIF_STYLE}
              >
                Evaluation
              </h3>
            </div>
            <BulletList bullets={tool.evaluation} />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BulletList({
  bullets,
  isLink,
}: {
  bullets: Bullet[];
  isLink?: boolean;
}) {
  if (!bullets.length) {
    return (
      <p className="text-sm italic text-[#596556]">
        No entries listed for this section.
      </p>
    );
  }

  const renderBullet = (b: Bullet) => (
    <>
      {isLink ? (
        <a
          href={b.text}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-baseline gap-1"
        >
          <span>{b.text}</span>
          <ExternalLink
            className="inline h-3 w-3 shrink-0 translate-y-[1px]"
            aria-hidden="true"
          />
        </a>
      ) : (
        b.text
      )}

      {b.sub_bullets.length > 0 && (
        <ul className="tool-modal-sub-bullets">
          {b.sub_bullets.map((sb, j) => (
            <li key={j}>{renderBullet(sb)}</li>
          ))}
        </ul>
      )}

      {b.image && (
        <img
          src={b.image}
          alt="Bullet illustration"
          className="mt-2.5 block max-w-full rounded-lg border border-[#DCE7D7] bg-white p-1"
        />
      )}
    </>
  );

  return (
    <ul className="tool-modal-bullets">
      {bullets.map((b, i) => (
        <li key={i}>{renderBullet(b)}</li>
      ))}
    </ul>
  );
}
