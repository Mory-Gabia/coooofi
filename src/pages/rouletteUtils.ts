export const WHEEL_COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
  '#ff6bd6', '#ff9a3c', '#a06ef5', '#4ecdc4',
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
