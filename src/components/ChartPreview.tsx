import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import type { ChartConfig } from "./types";

export function ChartPreview({ config }: { config: ChartConfig }) {
  const { title, subtitle, unit, chartType, items, barColor, bgColor, textColor, gridColor, refLines } = config;

  const data = items.map((it) => ({ label: it.label, value: Number(it.value) || 0 }));
  const maxLabelLen = Math.max(...items.map((i) => i.label.length), 10);
  const leftMargin = chartType === "bar-h" ? Math.min(280, maxLabelLen * 8 + 20) : 40;

  const axisTick = { fill: textColor, fontSize: 12 };
  const mutedTick = { fill: "#9a9a9a", fontSize: 12 };

  const renderChart = () => {
    switch (chartType) {
      case "bar-h":
        return (
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 60, left: leftMargin, bottom: 20 }}>
            <CartesianGrid horizontal={false} stroke={gridColor} />
            <XAxis
              type="number"
              orientation="top"
              stroke={gridColor}
              tick={mutedTick}
              tickLine={false}
              axisLine={false}
              label={{ value: unit, position: "insideTopRight", fill: "#9a9a9a", fontSize: 12, offset: -10 }}
            />
            <YAxis type="category" dataKey="label" stroke={gridColor} tick={axisTick} tickLine={false} axisLine={false} width={leftMargin - 10} />
            {refLines.map((r, i) => (
              <ReferenceLine
                key={i}
                x={r.value}
                stroke={r.color}
                strokeWidth={2}
                label={{ value: r.label, position: "bottom", fill: r.color, fontSize: 12, dy: 14 }}
              />
            ))}
            <Bar dataKey="value" fill={barColor} radius={[0, 2, 2, 0]} maxBarSize={28}>
              <LabelList dataKey="value" position="insideRight" fill="#111" fontSize={12} fontWeight={700} offset={8} />
            </Bar>
          </BarChart>
        );
      case "bar-v":
        return (
          <BarChart data={data} margin={{ top: 30, right: 20, left: 20, bottom: 40 }}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis dataKey="label" stroke={gridColor} tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis stroke={gridColor} tick={mutedTick} tickLine={false} axisLine={false} label={{ value: unit, position: "insideTopLeft", fill: "#9a9a9a", fontSize: 12, offset: -10 }} />
            {refLines.map((r, i) => (
              <ReferenceLine key={i} y={r.value} stroke={r.color} strokeWidth={2} label={{ value: r.label, position: "right", fill: r.color, fontSize: 12 }} />
            ))}
            <Bar dataKey="value" fill={barColor} radius={[2, 2, 0, 0]} maxBarSize={48}>
              <LabelList dataKey="value" position="top" fill={textColor} fontSize={12} fontWeight={700} />
            </Bar>
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid stroke={gridColor} />
            <XAxis dataKey="label" stroke={gridColor} tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis stroke={gridColor} tick={mutedTick} tickLine={false} axisLine={false} label={{ value: unit, position: "insideTopLeft", fill: "#9a9a9a", fontSize: 12, offset: -10 }} />
            {refLines.map((r, i) => (
              <ReferenceLine key={i} y={r.value} stroke={r.color} strokeWidth={2} label={{ value: r.label, position: "right", fill: r.color, fontSize: 12 }} />
            ))}
            <Line type="monotone" dataKey="value" stroke={barColor} strokeWidth={3} dot={{ r: 4, fill: barColor, stroke: barColor }} activeDot={{ r: 6 }}>
              <LabelList dataKey="value" position="top" fill={textColor} fontSize={12} fontWeight={700} />
            </Line>
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid stroke={gridColor} />
            <XAxis dataKey="label" stroke={gridColor} tick={axisTick} tickLine={false} axisLine={false} />
            <YAxis stroke={gridColor} tick={mutedTick} tickLine={false} axisLine={false} label={{ value: unit, position: "insideTopLeft", fill: "#9a9a9a", fontSize: 12, offset: -10 }} />
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={barColor} stopOpacity={0.6} />
                <stop offset="100%" stopColor={barColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={barColor} strokeWidth={3} fill="url(#areaFill)" />
          </AreaChart>
        );
      case "pie": {
        const paletteBase = [barColor, "#00e5ff", "#ffb000", "#ff3d71", "#a855f7", "#22c55e", "#f59e0b"];
        return (
          <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius="75%"
              stroke={bgColor}
              strokeWidth={2}
              label={({ label, value }) => `${label}: ${value}`}
              labelLine={{ stroke: "#666" }}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={items[i].color || paletteBase[i % paletteBase.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      }
    }
  };

  return (
    <div
      className="rounded-xl p-6 border"
      style={{ background: bgColor, borderColor: gridColor, color: textColor }}
    >
      <div className="text-center mb-2">
        <h2 className="text-2xl font-light tracking-tight" style={{ color: textColor }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm" style={{ color: barColor }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="w-full" style={{ height: 460 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() as any}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
