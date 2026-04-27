import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const GAP_PX = 12;

function slidesPerViewForWidth(width: number): number {
  if (width < 520) return 1;
  if (width < 720) return 2;
  if (width < 1024) return 3;
  return 4;
}

type HomeStripSliderProps<T> = {
  items: readonly T[];
  getKey: (item: T, index: number) => string;
  renderSlide: (item: T, index: number) => ReactNode;
  busy?: boolean;
  className?: string;
};

export function HomeStripSlider<T>({ items, getKey, renderSlide, busy, className }: HomeStripSliderProps<T>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(0);

  const perView = items.length > 0 ? Math.min(slidesPerViewForWidth(viewportW), items.length, 4) : 1;
  const slideSize =
    viewportW > 0 && perView > 0 ? (viewportW - GAP_PX * (perView - 1)) / perView : 0;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      axis: "x",
      direction: "rtl",
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      duration: 30,
    },
    [],
  );

  const setEmblaViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node;
      emblaRef(node);
      if (node) setViewportW(node.getBoundingClientRect().width);
    },
    [emblaRef],
  );

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setViewportW(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || slideSize <= 0) return;
    emblaApi.reInit();
  }, [emblaApi, slideSize, items.length]);

  const showArrows = items.length > perView;
  const basis = slideSize > 0 ? slideSize : 260;

  return (
    <div className={cn("flex items-stretch gap-2 sm:gap-3", busy && "opacity-70 transition-opacity", className)}>
      {showArrows ? (
        <div className="flex flex-col justify-center shrink-0">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors"
            aria-label="السابق"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      ) : null}

      <div ref={setEmblaViewportRef} className="min-h-[220px] min-w-0 flex-1 overflow-hidden">
        <div className="flex touch-pan-y" style={{ gap: GAP_PX }}>
          {items.map((item, index) => (
            <div
              key={getKey(item, index)}
              className="min-w-0 shrink-0"
              style={{ flex: `0 0 ${basis}px` }}
            >
              {renderSlide(item, index)}
            </div>
          ))}
        </div>
      </div>

      {showArrows ? (
        <div className="flex flex-col justify-center shrink-0">
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors"
            aria-label="التالي"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
