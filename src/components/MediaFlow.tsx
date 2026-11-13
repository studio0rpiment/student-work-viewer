import { useCallback, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import Label from './Label'
import { packSkyline, type Rect } from '../lib/skyline'
import type { MediaItem } from '../content/types'

export interface FlowItem extends MediaItem {
  /** Shown on hover: the group ("Group 1 · Abigail, Allie, …") or the person. */
  who: string
}

interface Props {
  items: FlowItem[]
  /** Longest side of a tile, in rem. */
  tile?: number
  onSelect: (item: FlowItem) => void
  /** For typefaces: the family to set the sentence in, and the sentence. */
  fontFamily?: (src: string) => string
  specimen?: string
  /** Tiles can be dragged anywhere on the page; a click without a drag still selects. */
  draggable?: boolean
}

/** How far the pointer moves before a press becomes a drag, in px. */
const DRAG_START = 4

/** A typeface runs as a line of text: twice a tile wide, a short band tall. */
const TEXT_RATIO = 3.2

/** SVGs and transparent exports are drawn in the text colour, through a mask. */
const isMark = (i: MediaItem) => i.src.endsWith('.svg') || !!i.ink

const GAP_REM = 0.3125 // 5px, as on the image showcases

/**
 * Images and videos packed like the knolling page (skyline, see ImageFlow):
 * each at its real aspect ratio, measured when it loads, longest side = `tile`.
 * Videos play muted on a loop. SVGs and transparent exports are drawn in the text colour.
 * A typeface is a line of text packed with the rest. The `who` shows on hover.
 */
export default function MediaFlow({ items, tile = 20, onSelect, fontFamily, specimen, draggable }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [ratios, setRatios] = useState<Record<string, number>>({})

  useLayoutEffect(() => {
    const el = host.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Where each dragged tile has moved from its packed place, and the stacking order (last dragged on top).
  const [moved, setMoved] = useState<Record<string, { x: number; y: number }>>({})
  const [stack, setStack] = useState<string[]>([])
  const drag = useRef<{ src: string; id: number; x0: number; y0: number; dx: number; dy: number; on: boolean } | null>(null)
  const dragged = useRef(false)

  const down = (src: string) => (e: PointerEvent<HTMLElement>) => {
    if (!draggable || e.button !== 0) return
    const m = moved[src] ?? { x: 0, y: 0 }
    drag.current = { src, id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: m.x, dy: m.y, on: false }
    dragged.current = false
  }
  const move = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const x = e.clientX - d.x0
    const y = e.clientY - d.y0
    if (!d.on) {
      if (Math.hypot(x, y) < DRAG_START) return
      d.on = true
      dragged.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
      setStack((s) => [...s.filter((v) => v !== d.src), d.src])
    }
    setMoved((m) => ({ ...m, [d.src]: { x: d.dx + x, y: d.dy + y } }))
  }
  const up = (e: PointerEvent<HTMLElement>) => {
    if (drag.current?.id === e.pointerId) drag.current = null
  }

  const measure = useCallback((src: string, w: number, h: number) => {
    if (!w || !h) return
    setRatios((r) => (r[src] === w / h ? r : { ...r, [src]: w / h }))
  }, [])

  const { rects, height } = useMemo(() => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const long = tile * rem
    const sizes = items.map((i) => {
      if (i.kind === 'font') return { w: long * 2, h: (long * 2) / TEXT_RATIO }
      const r = ratios[i.src]
      if (!r) return { w: long, h: long } // unmeasured: reserve a square, hidden
      return r >= 1 ? { w: long, h: long / r } : { w: long * r, h: long }
    })
    return width > 0 ? packSkyline(sizes, width, GAP_REM * rem) : { rects: [] as Rect[], height: 0 }
  }, [items, ratios, tile, width])

  return (
    <div ref={host} className="flow media-flow" style={{ height }}>
      {items.map((i, n) => {
        const rect = rects[n]
        const measured = (i.kind === 'font' || i.src in ratios) && rect
        return (
          <figure
            key={i.src}
            className={`tile media-flow__tile ${draggable ? 'media-flow__drag' : ''} ${i.kind === 'font' ? 'media-flow__text' : isMark(i) ? 'media-flow__mark' : ''} ${measured ? '' : 'is-unmeasured'}`.replace(/\s+/g, ' ').trim()}
            style={
              rect
                ? {
                    left: rect.x,
                    top: rect.y,
                    width: rect.w,
                    height: rect.h,
                    ...(moved[i.src] && { transform: `translate(${moved[i.src].x}px, ${moved[i.src].y}px)` }),
                    ...(stack.includes(i.src) && { zIndex: 1 + stack.indexOf(i.src) }),
                  }
                : {}
            }
            onPointerDown={down(i.src)}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
          >
            <button
              type="button"
              className="tile__pick"
              onClick={() => (dragged.current ? (dragged.current = false) : onSelect(i))}
              aria-label={i.who}
            >
              {i.kind === 'font' ? (
                <span className="media-flow__specimen" style={{ fontFamily: fontFamily?.(i.src) }}>
                  {specimen}
                </span>
              ) : isMark(i) ? (
                <>
                  <span className="tile__img media-flow__svg" style={{ maskImage: `url("${i.src}")`, WebkitMaskImage: `url("${i.src}")` }} />
                  <img
                    hidden
                    src={i.src}
                    alt=""
                    onLoad={(e) => measure(i.src, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
                  />
                </>
              ) : i.kind === 'video' ? (
                <video
                  className="tile__img"
                  src={i.src}
                  muted
                  loop
                  autoPlay
                  playsInline
                  onLoadedMetadata={(e) => measure(i.src, e.currentTarget.videoWidth, e.currentTarget.videoHeight)}
                />
              ) : (
                <img
                  className="tile__img"
                  src={i.src}
                  alt={i.who}
                  loading="lazy"
                  onLoad={(e) => measure(i.src, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
                />
              )}
            </button>
            <figcaption className="tile__name">
              <Label className="label--student">{i.who}</Label>
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}
