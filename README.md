# Chart Builder

Lightweight React + Vite + TypeScript + Tailwind + shadcn/ui + Recharts app for designing
clean data charts in a neon-lime-on-charcoal style, with PNG export (alpha supported).

## Run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Features

- Editable title, subtitle, unit/axis label
- 5 chart types: horizontal bar, vertical bar, line, area, pie
- Live color pickers for accent, background, text, grid
- Inline data-row editor (label / value / per-item color / delete)
- Reference lines with colored labels (like "bright room" in the reference)
- Export current config as JSON

## Styling

Defaults to the reference aesthetic: `#1a1a1a` background, `#D4FF00` neon-lime accent,
subtle `#333` grid, off-white text. All colors are editable live.
