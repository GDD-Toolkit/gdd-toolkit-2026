import { useEffect, useState } from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { niceStep } from "./format";

interface AmountSliderProps {
  min: number;
  max: number;
  value: [number, number];
  /** How a thumb value reads, e.g. "10k". */
  format: (value: number) => string;
  onCommit: (value: [number, number]) => void;
}

const THUMB =
  "relative block size-4 shrink-0 cursor-pointer rounded-full border-2 border-[#3F673C] bg-white shadow-sm ring-[#3F673C]/30 transition-[color,box-shadow,transform] select-none after:absolute after:-inset-2 hover:scale-110 hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden active:ring-4";

/** Two-thumb amount range. Labels its thumbs itself, which the shared Slider wrapper cannot. */
export function AmountSlider({ min, max, value, format, onCommit }: AmountSliderProps) {
  const [local, setLocal] = useState<[number, number]>(value);
  useEffect(() => setLocal(value), [value]);
  const step = niceStep(max - min);

  return (
    <div>
      <SliderPrimitive.Root
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={1}
        value={local}
        onValueChange={(next) => setLocal([next[0] ?? min, next[1] ?? max])}
        onValueCommit={(next) => onCommit([next[0] ?? min, next[1] ?? max])}
        className="relative flex w-full touch-none items-center py-2.5 select-none"
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#E3EBDE]">
          <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-[#3F673C] to-[#187347]" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={THUMB} aria-label="Minimum amount" aria-valuetext={format(local[0])} />
        <SliderPrimitive.Thumb className={THUMB} aria-label="Maximum amount" aria-valuetext={format(local[1])} />
      </SliderPrimitive.Root>
      <div className="mt-1 flex justify-between font-mono text-xs font-medium text-[#284B26] tabular-nums">
        <span className="rounded-md border border-[#D5E3D9] bg-[#F2F6EF] px-2 py-0.5">{format(local[0])}</span>
        <span className="rounded-md border border-[#D5E3D9] bg-[#F2F6EF] px-2 py-0.5">
          {format(local[1])}
          {local[1] >= max ? "+" : ""}
        </span>
      </div>
    </div>
  );
}
