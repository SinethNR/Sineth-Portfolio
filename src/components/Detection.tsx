import { forwardRef } from "react";

type DetectionFrameProps = {
  label: string;
  /** Confidence shown after the label, e.g. "0.99". Omit to render your own (see confRef). */
  confidence?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: "sm" | "md";
};

/**
 * YOLO-style bounding box: yellow outline, corner ticks and a filled label tab.
 * Purely visual; positioning and motion are up to the parent.
 */
const DetectionFrame = forwardRef<HTMLSpanElement, DetectionFrameProps>(function DetectionFrame(
  { label, confidence, className = "", style, size = "md" },
  confRef,
) {
  const tick = "absolute h-3 w-3 border-accent-yellow";
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`} style={style}>
      <div className="absolute inset-0 border-2 border-accent-yellow bg-accent-yellow/[0.06] shadow-[0_0_24px_rgb(250_204_21_/_0.25)]" />
      <span className={`${tick} -top-1 -left-1 border-t-4 border-l-4`} />
      <span className={`${tick} -top-1 -right-1 border-t-4 border-r-4`} />
      <span className={`${tick} -bottom-1 -left-1 border-b-4 border-l-4`} />
      <span className={`${tick} -right-1 -bottom-1 border-r-4 border-b-4`} />
      <span
        className={`absolute bottom-full -left-[2px] mb-0 bg-accent-yellow font-mono font-bold whitespace-nowrap text-navy-950 ${
          size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px] sm:text-xs"
        }`}
      >
        {label} <span ref={confRef}>{confidence}</span>
      </span>
    </div>
  );
});

export default DetectionFrame;
