import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
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
}

/** A typeface runs as a line of text: twice a tile wide, a short band tall. */
const TEXT_RATIO = 3.2

const isSvg = (src: string) => src.endsWith('.svg')

const GAP_REM = 0.3125 // 5px, as on the image showcases

/**
 * Images and videos packed like the knolling page (skyline, see ImageFlow):
 * each at its real aspect ratio, measured when it loads, longest side = `tile`.
 * Videos play muted on a loop. SVGs are drawn in the text colour (as a mask).
 * A typeface is a line of text packed with the rest. The `who` shows on hover.
 */
export default function MediaFlow({ items, tile = 20, onSelect, fontFamily, specimen }: Props) {
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
            className={`tile media-flow__tile ${i.kind === 'font' ? 'media-flow__text' : isSvg(i.src) ? 'media-flow__mark' : ''} ${measured ? '' : 'is-unmeasured'}`.replace(/\s+/g, ' ').trim()}
            style={rect ? { left: rect.x, top: rect.y, width: rect.w, height: rect.h } : {}}
          >
            <button type="button" className="tile__pick" onClick={() => onSelect(i)} aria-label={i.who}>
              {i.kind === 'font' ? (
                <span className="media-flow__specimen" style={{ fontFamily: fontFamily?.(i.src) }}>
                  {specimen}
                </span>
              ) : isSvg(i.src) ? (
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
