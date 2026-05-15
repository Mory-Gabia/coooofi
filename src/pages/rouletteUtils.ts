export const WHEEL_COLORS = [
  'oklch(70% 0.17 25)',   // coral
  'oklch(80% 0.14 85)',   // gold
  'oklch(64% 0.13 175)',  // mint
  'oklch(62% 0.16 240)',  // blue
  'oklch(54% 0.15 320)',  // plum
  'oklch(74% 0.15 50)',   // peach
  'oklch(60% 0.14 145)',  // forest
  'oklch(68% 0.12 280)',  // lavender
]

export function getWinnerIndex(rotation: number, count: number): number {
  const sliceAngle = 360 / count
  const normalized = ((rotation % 360) + 360) % 360
  const pointerAngle = (360 - normalized) % 360
  return Math.floor(pointerAngle / sliceAngle) % count
}

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export function slicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, r, startDeg)
  const end = polarToCartesian(cx, cy, r, endDeg)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return `M${cx},${cy} L${start.x},${start.y} A${r},${r} 0 ${largeArc},1 ${end.x},${end.y} Z`
}
