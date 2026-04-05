export type ChartType = "bar-h" | "bar-v" | "line" | "area" | "pie";

export interface DataItem {
  label: string;
  value: number;
  color?: string;
}

export interface RefLine {
  value: number;
  label: string;
  color: string;
}

export interface ChartConfig {
  title: string;
  subtitle: string;
  unit: string;
  chartType: ChartType;
  items: DataItem[];
  barColor: string;
  bgColor: string;
  textColor: string;
  gridColor: string;
  refLines: RefLine[];
}
