import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DOMPurify from "dompurify";
import { getImageUrl } from "@/services/api";
import { sliderOverlayStyle, sliderThemeDefaults } from "@/lib/sliderTheme";
import type { SliderSlideDto } from "@/types/api";

interface HeroSliderProps {
  slides: SliderSlideDto[];
}

const pick = (v: string | null | undefined, d: string) => (v?.trim() ? v.trim() : d);

const HeroSlider = ({ slides }: HeroSliderProps) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlides = slides.filter((s) => s.isActive).sort((a, b) => a.displayOrder - b.displayOrder);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPaused, next, activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const slide = activeSlides[current];

  const titleColor = pick(slide.titleColor, sliderThemeDefaults.titleColor);
  const subtitleText = pick(slide.subtitleTextColor, sliderThemeDefaults.subtitleTextColor);
  const subBg = pick(slide.subtitleBadgeBackgroundColor, sliderThemeDefaults.subtitleBadgeBackgroundColor);
  const subBorder = pick(slide.subtitleBadgeBorderColor, sliderThemeDefaults.subtitleBadgeBorderColor);
  const contentColor = pick(slide.contentHtmlColor, sliderThemeDefaults.contentHtmlColor);
  const ctaBg = pick(slide.ctaBackgroundColor, sliderThemeDefaults.ctaBackgroundColor);
  const ctaFg = pick(slide.ctaTextColor, sliderThemeDefaults.ctaTextColor);
  const navBg = pick(slide.navArrowBackgroundColor, sliderThemeDefaults.navArrowBackgroundColor);
  const navIcon = pick(slide.navArrowIconColor, sliderThemeDefaults.navArrowIconColor);
  const dotOn = pick(slide.dotActiveColor, sliderThemeDefaults.dotActiveColor);
  const dotOff = pick(slide.dotInactiveColor, sliderThemeDefaults.dotInactiveColor);

  const renderCta = () => {
    const btnStyle = { backgroundColor: ctaBg, color: ctaFg } as const;
    if (slide.linkTargetType === 1 && slide.externalUrl) {
      return (
        <a
          href={slide.externalUrl}
          target={slide.openInNewTab ? "_blank" : undefined}
          rel={slide.openInNewTab ? "noopener noreferrer" : undefined}
          className="inline-block mt-6 px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all hover:scale-105"
          style={btnStyle}
        >
          اقرأ المزيد
        </a>
      );
    }
    if (slide.linkTargetType === 2 && slide.articleSlug) {
      return (
        <Link
          to={`/articles/${slide.articleSlug}`}
          className="inline-block mt-6 px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all hover:scale-105"
          style={btnStyle}
        >
          اقرأ المزيد
        </Link>
      );
    }
    return null;
  };

  return (
    <div
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${getImageUrl(slide.backgroundImageUrl ?? undefined)})` }}
      >
        <div className="absolute inset-0" style={sliderOverlayStyle(slide)} />
      </div>

      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl animate-fade-up text-start" key={current}>
            {slide.subtitle && (
              <span
                className="inline-block px-4 py-1 mb-4 rounded-full text-sm font-medium border"
                style={{
                  color: subtitleText,
                  backgroundColor: subBg,
                  borderColor: subBorder,
                }}
              >
                {slide.subtitle}
              </span>
            )}
            <h2 className="text-4xl md:text-6xl font-heading font-bold leading-tight" style={{ color: titleColor }}>
              {slide.title ?? ""}
            </h2>
            {slide.contentHtml && (
              <div
                className="mt-4 max-w-xl prose prose-invert prose-sm [&_a]:underline"
                style={{ color: contentColor }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(slide.contentHtml) }}
              />
            )}
            {renderCta()}
          </div>
        </div>
      </div>

      {activeSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 p-3 rounded-full backdrop-blur-sm transition-colors shadow-sm"
            style={{ backgroundColor: navBg, color: navIcon }}
            aria-label="الشريحة السابقة"
          >
            <ArrowLeft className="h-6 w-6" aria-hidden />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 p-3 rounded-full backdrop-blur-sm transition-colors shadow-sm"
            style={{ backgroundColor: navBg, color: navIcon }}
            aria-label="الشريحة التالية"
          >
            <ArrowRight className="h-6 w-6" aria-hidden />
          </button>
        </>
      )}

      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                width: i === current ? "2rem" : "0.625rem",
                backgroundColor: i === current ? dotOn : dotOff,
              }}
              aria-label={`شريحة ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
