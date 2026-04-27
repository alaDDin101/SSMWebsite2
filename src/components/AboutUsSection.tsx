import { useMemo } from "react";
import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";
import { prepareArticleBodyForClient } from "@/lib/articleHtml";
import { getImageUrl } from "@/services/api";
import { SITE_LOGO_PATH } from "@/lib/siteImage";
import type { AboutUsPublicDto } from "@/types/api";

type Props = {
  data: AboutUsPublicDto | null | undefined;
};

export default function AboutUsSection({ data }: Props) {
  const bodyHtml = useMemo(() => prepareArticleBodyForClient(data?.bodyHtml ?? ""), [data?.bodyHtml]);

  if (!data) return null;

  const hasCustomAboutImage = Boolean(data.imageUrl?.trim());

  const sectionStyle: React.CSSProperties = {};
  if (data.sectionBackgroundColor?.trim()) sectionStyle.background = data.sectionBackgroundColor.trim();

  const cardStyle: React.CSSProperties = {};
  if (data.cardBackgroundColor?.trim()) cardStyle.backgroundColor = data.cardBackgroundColor.trim();

  const accent = data.accentColor?.trim() || undefined;

  const headingStyle: React.CSSProperties = {};
  if (data.headingTextColor?.trim()) headingStyle.color = data.headingTextColor.trim();

  const leadStyle: React.CSSProperties = {};
  if (data.mutedTextColor?.trim()) leadStyle.color = data.mutedTextColor.trim();

  const bodyStyle: React.CSSProperties = {};
  if (data.bodyTextColor?.trim()) bodyStyle.color = data.bodyTextColor.trim();

  return (
    <section
      id="about-us"
      style={sectionStyle}
      className={cn("scroll-mt-24 border-y border-border/60 py-14 md:py-20", !data.sectionBackgroundColor?.trim() && "about-brand-surface")}
    >
      <div className="container mx-auto max-w-5xl px-4">
        <div
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
          style={{
            ...cardStyle,
            borderInlineStartWidth: 4,
            borderInlineStartStyle: "solid",
            borderInlineStartColor: accent ?? "hsl(var(--secondary))",
          }}
        >
          <div className={cn("grid gap-0", "md:grid-cols-2")}>
            <div className="relative min-h-[220px] md:min-h-[360px]">
              <img src={getImageUrl(data.imageUrl)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 to-transparent md:bg-gradient-to-l" />
            </div>
            <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-4">
                {hasCustomAboutImage ? (
                  <img
                    src={SITE_LOGO_PATH}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-full border-2 border-border object-cover shadow-md"
                    width={56}
                    height={56}
                  />
                ) : null}
                <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl" style={headingStyle}>
                  {data.title}
                </h2>
              </div>
              {data.leadText?.trim() ? (
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg" style={leadStyle}>
                  {data.leadText}
                </p>
              ) : null}
              <div className="article-body ql-snow">
                <div
                  className="ql-editor max-w-none text-foreground [&_img]:rounded-lg"
                  dir="rtl"
                  lang="ar"
                  style={bodyStyle}
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
