import { useRef, useState } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ColorPicker } from "@/components/ui/color-picker";
import { ChartPreview } from "./ChartPreview";
import type { ChartConfig, ChartType, DataItem, RefLine } from "./types";

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: "bar-h", label: "Horizontal Bar" },
  { value: "bar-v", label: "Vertical Bar" },
  { value: "line", label: "Line" },
  { value: "area", label: "Area" },
  { value: "pie", label: "Pie" },
];

const DEFAULT: ChartConfig = {
  title: "Top Channels by Subscribers",
  subtitle: "tracked over the last 30 days",
  unit: "millions",
  chartType: "bar-h",
  items: [
    { label: "MrBeast", value: 320 },
    { label: "T-Series", value: 275 },
    { label: "Cocomelon", value: 180 },
    { label: "SET India", value: 175 },
    { label: "Kids Diana Show", value: 125 },
  ],
  barColor: "#D4FF00",
  bgColor: "#1a1a1a",
  textColor: "#f5f5f5",
  gridColor: "#333333",
  refLines: [],
};

export function ChartBuilder() {
  const [config, setConfig] = useState<ChartConfig>(DEFAULT);
  const chartRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof ChartConfig>(key: K, value: ChartConfig[K]) =>
    setConfig((c) => ({ ...c, [key]: value }));

  const updateItem = (i: number, patch: Partial<DataItem>) =>
    setConfig((c) => ({ ...c, items: c.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }));

  const addItem = () =>
    setConfig((c) => ({ ...c, items: [...c.items, { label: "New", value: 0 }] }));

  const removeItem = (i: number) =>
    setConfig((c) => ({ ...c, items: c.items.filter((_, idx) => idx !== i) }));

  const addRef = () =>
    setConfig((c) => ({ ...c, refLines: [...c.refLines, { value: 0, label: "threshold", color: "#00e5ff" }] }));

  const updateRef = (i: number, patch: Partial<RefLine>) =>
    setConfig((c) => ({ ...c, refLines: c.refLines.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) }));

  const removeRef = (i: number) =>
    setConfig((c) => ({ ...c, refLines: c.refLines.filter((_, idx) => idx !== i) }));

  const exportPNG = async () => {
    if (!chartRef.current) return;
    const dataUrl = await toPng(chartRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${config.title.toLowerCase().replace(/\s+/g, "-") || "chart"}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Chart Builder</h1>
            <p className="text-xs text-muted-foreground">Design clean, data-forward charts with the neon style.</p>
          </div>
          <Button variant="outline" size="sm" onClick={exportPNG}>
            <Download className="h-4 w-4" /> Export PNG
          </Button>
        </div>
      </header>

      <main className="container grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 py-6">
        {/* Editor */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Chart</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={config.title} onChange={(e) => update("title", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Subtitle</Label>
                <Input value={config.subtitle} onChange={(e) => update("subtitle", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Unit / Axis Label</Label>
                <Input value={config.unit} onChange={(e) => update("unit", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Chart Type</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CHART_TYPES.map((t) => (
                    <Button
                      key={t.value}
                      variant={config.chartType === t.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => update("chartType", t.value)}
                    >
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ColorField label="Accent / Bars" value={config.barColor} onChange={(v) => update("barColor", v)} />
              <ColorField label="Background" value={config.bgColor} onChange={(v) => update("bgColor", v)} />
              <ColorField label="Text" value={config.textColor} onChange={(v) => update("textColor", v)} />
              <ColorField label="Grid" value={config.gridColor} onChange={(v) => update("gridColor", v)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm">Data</CardTitle>
              <Button variant="ghost" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {config.items.map((it, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_32px_28px] gap-1.5 items-center">
                  <Input
                    value={it.label}
                    onChange={(e) => updateItem(i, { label: e.target.value })}
                    placeholder="Label"
                    className="h-8 text-xs"
                  />
                  <Input
                    type="number"
                    value={it.value}
                    onChange={(e) => updateItem(i, { value: Number(e.target.value) })}
                    className="h-8 text-xs"
                  />
                  <ColorPicker
                    value={it.color || config.barColor}
                    onChange={(v) => updateItem(i, { color: v })}
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(i)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm">Reference Lines</CardTitle>
              <Button variant="ghost" size="sm" onClick={addRef}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {config.refLines.length === 0 && (
                <p className="text-xs text-muted-foreground">None. Add thresholds like "bright room" from the examples.</p>
              )}
              {config.refLines.map((r, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_32px_28px] gap-1.5 items-center">
                  <Input
                    value={r.label}
                    onChange={(e) => updateRef(i, { label: e.target.value })}
                    placeholder="Label"
                    className="h-8 text-xs"
                  />
                  <Input
                    type="number"
                    value={r.value}
                    onChange={(e) => updateRef(i, { value: Number(e.target.value) })}
                    className="h-8 text-xs"
                  />
                  <ColorPicker value={r.color} onChange={(v) => updateRef(i, { color: v })} />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeRef(i)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div ref={chartRef}>
            <ChartPreview config={config} />
          </div>
        </div>
      </main>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="flex-1">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 w-28 text-xs font-mono" />
      <ColorPicker value={value} onChange={onChange} />
    </div>
  );
}
