import type { CSSProperties } from "react";
import type { SliderSlideDto } from "@/types/api";

/** Site defaults when slide theme fields are null. */
export const sliderThemeDefaults = {
  titleColor: "#ffffff",
  subtitleTextColor: "#e2e8f0",
  subtitleBadgeBackgroundColor: "rgba(226, 232, 240, 0.2)",
  subtitleBadgeBorderColor: "rgba(226, 232, 240, 0.3)",
  contentHtmlColor: "rgba(255, 255, 255, 0.92)",
  ctaBackgroundColor: "hsl(38 55% 45%)",
  ctaTextColor: "hsl(40 30% 97%)",
  navArrowBackgroundColor: "rgba(255, 255, 255, 0.2)",
  navArrowIconColor: "#ffffff",
  dotActiveColor: "hsl(38 55% 45%)",
  dotInactiveColor: "rgba(255, 255, 255, 0.4)",
  overlayBottomColor: "rgba(15, 23, 42, 0.9)",
  overlayMiddleColor: "rgba(15, 23, 42, 0.5)",
  overlayTopColor: "rgba(15, 23, 42, 0.2)",
} as const;

export function sliderOverlayStyle(slide: SliderSlideDto): CSSProperties {
  const b = slide.overlayBottomColor?.trim() || sliderThemeDefaults.overlayBottomColor;
  const m = slide.overlayMiddleColor?.trim() || sliderThemeDefaults.overlayMiddleColor;
  const t = slide.overlayTopColor?.trim() || sliderThemeDefaults.overlayTopColor;
  return { background: `linear-gradient(to top, ${b}, ${m}, ${t})` };
}
