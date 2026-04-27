import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { getImageUrl } from "@/services/api";
import { HomeStripSlider } from "@/components/HomeStripSlider";
import type { HomeProjectSlideDto, HomeProjectsSectionDto } from "@/types/api";

interface HomeProjectsSectionProps {
  initial: HomeProjectsSectionDto;
}

function ProjectStripCard({ item }: { item: HomeProjectSlideDto }) {
  const date =
    item.publishedAt &&
    new Intl.DateTimeFormat("ar", { year: "numeric", month: "short", day: "numeric" }).format(new Date(item.publishedAt));
  return (
    <Link
      to={`/projects/${item.slug}`}
      className="group flex h-full min-h-0 min-w-0 flex-col rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/30 transition-all text-start w-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted shrink-0">
        <img
          src={getImageUrl(item.coverImageUrl)}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-90" />
        <div className="absolute top-3 end-3">
          <span className="inline-block rounded-full bg-black/45 px-2.5 py-0.5 text-[11px] font-medium text-white/95 backdrop-blur-sm">
            {item.sectionTitle}
          </span>
        </div>
        <div className="absolute bottom-0 right-0 left-0 p-4">
          <h3 className="text-base font-bold text-white leading-snug drop-shadow-sm line-clamp-2">{item.title}</h3>
          {date ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-white/85">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              {date}
            </p>
          ) : null}
        </div>
      </div>
      {item.summary?.trim() ? (
        <p className="p-3 text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1 min-h-0">{item.summary}</p>
      ) : (
        <div className="p-3 flex-1 min-h-[2.5rem] shrink-0" />
      )}
      <div className="px-3 pb-3 flex items-center justify-between gap-2 border-t border-border/50 pt-2 mt-auto shrink-0">
        <span className="text-sm font-medium text-primary">التفاصيل</span>
        <ArrowLeft className="h-4 w-4 text-primary transition-transform group-hover:-translate-x-1 rtl:rotate-180" aria-hidden />
      </div>
    </Link>
  );
}

const HomeProjectsSection = ({ initial }: HomeProjectsSectionProps) => {
  const row = initial;
  const isSingle = row.items.length === 1;
  const isPair = row.items.length === 2;

  const heading = useMemo(() => {
    const t = row.title?.trim();
    return t || "المشاريع والمبادرات";
  }, [row.title]);

  return (
    <section className="py-20 bg-background border-y border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{heading}</h2>
            <div className="mt-3 w-20 h-1 rounded-full bg-secondary" />
            {row.leadText?.trim() ? <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed">{row.leadText}</p> : null}
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors shrink-0"
          >
            <span>عرض الكل</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </Link>
        </div>

        {row.items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">لا توجد مشاريع منشورة حالياً.</p>
        ) : isSingle || isPair ? (
          <div
            className={
              isSingle
                ? "mx-auto max-w-xl"
                : "mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2"
            }
          >
            {row.items.map((item) => (
              <ProjectStripCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <HomeStripSlider
            items={row.items}
            getKey={(p) => p.id}
            renderSlide={(item) => <ProjectStripCard item={item} />}
          />
        )}
      </div>
    </section>
  );
};

export default HomeProjectsSection;
