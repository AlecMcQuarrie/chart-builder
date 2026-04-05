import { useEffect, useRef, useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";

const CHECKER =
  "bg-[conic-gradient(#666_25%,#999_0_50%,#666_0_75%,#999_0)] bg-[length:8px_8px]";

export function ColorPicker({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn("h-8 w-8 rounded border border-input cursor-pointer overflow-hidden", CHECKER)}
        title={value}
      >
        <span className="block h-full w-full" style={{ background: value }} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 rounded-md border bg-popover p-2 shadow-md bg-card">
          <HexAlphaColorPicker color={value} onChange={onChange} />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 h-7 w-[200px] rounded border border-input bg-transparent px-2 text-xs font-mono"
          />
        </div>
      )}
    </div>
  );
}
