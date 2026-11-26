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
  "relative block size-4 shrink-0 rounded-full border border-[#6D83F2] bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3";

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
        className="relative flex w-full touch-none items-center py-2 select-none"
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Range className="absolute h-full bg-[#6D83F2]" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={THUMB} aria-label="Minimum amount" aria-valuetext={format(local[0])} />
        <SliderPrimitive.Thumb className={THUMB} aria-label="Maximum amount" aria-valuetext={format(local[1])} />
      </SliderPrimitive.Root>
      <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>{format(local[0])}</span>
        <span>
          {format(local[1])}
          {local[1] >= max ? "+" : ""}
        </span>
      </div>
    </div>
  );
}
