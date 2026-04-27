import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, getImageUrl } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prepareArticleBodyForClient } from "@/lib/articleHtml";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProjectHubCardDto } from "@/types/api";

const SECTION_TAB_LABELS: Record<number, string> = {
  1: "ماذا تقدم الحركة عملياً",
  2: "مشاريع خدمية أو توعوية",
  3: "خطط مستقبلية",
};

function groupItemsBySection(items: ProjectHubCardDto[]) {
  const order: number[] = [];
  const map = new Map<number, { sectionTitle: string; items: ProjectHubCardDto[] }>();
  for (const item of items) {
    let g = map.get(item.section);
    if (!g) {
      g = { sectionTitle: item.sectionTitle, items: [] };
      map.set(item.section, g);
      order.push(item.section);
    }
    g.items.push(item);
  }
  return order.map((sec) => ({ section: sec, sectionTitle: map.get(sec)!.sectionTitle, items: map.get(sec)!.items }));
}

function ProjectCard({ item }: { item: ProjectHubCardDto }) {
  const date =
    item.publishedAt &&
    new Intl.DateTimeFormat("ar", { year: "numeric", month: "short", day: "numeric" }).format(new Date(item.publishedAt));
  return (
    <Link
      to={`/projects/${item.slug}`}
      className="group flex flex-col rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/30 transition-all text-start h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={getImageUrl(item.coverImageUrl)}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90" />
        <div className="absolute top-2 end-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/95 max-w-[85%] truncate">
          {item.sectionTitle}
        </div>
        <div className="absolute bottom-0 right-0 left-0 p-4">
          <h3 className="text-lg font-bold text-white leading-snug drop-shadow-sm line-clamp-2">{item.title}</h3>
          {date ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-white/85">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              {date}
            </p>
          ) : null}
        </div>
      </div>
      {item.summary?.trim() ? (
        <p className="p-4 text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">{item.summary}</p>
      ) : (
        <div className="p-4 flex-1" />
      )}
      <div className="px-4 pb-4 flex items-center justify-between gap-2 border-t border-border/50 pt-3 mt-auto">
        <span className="text-sm font-medium text-primary">التفاصيل</span>
        <ArrowLeft className="h-4 w-4 text-primary transition-transform group-hover:-translate-x-1" aria-hidden />
      </div>
    </Link>
  );
}

const PAGE_SIZE = 12;

const ProjectsHubPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page") || "1");
  const page = Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
  const sectionFromUrl = Number(searchParams.get("section"));
  const sectionFilter = sectionFromUrl >= 1 && sectionFromUrl <= 3 ? sectionFromUrl : null;
  const searchText = searchParams.get("q")?.trim() ?? "";

  const homeQuery = useQuery({ queryKey: ["home"], queryFn: api.getHome, staleTime: 5 * 60 * 1000 });
  const hubQuery = useQuery({
    queryKey: ["projects-hub", page, PAGE_SIZE, sectionFilter, searchText],
    queryFn: () => api.getProjectsHub({ page, pageSize: PAGE_SIZE, section: sectionFilter, search: searchText || undefined }),
    staleTime: 2 * 60 * 1000,
  });

  const introHtml = useMemo(() => prepareArticleBodyForClient(hubQuery.data?.introHtml ?? ""), [hubQuery.data?.introHtml]);

  const groupedSections = useMemo(
    () => (hubQuery.data?.items?.length ? groupItemsBySection(hubQuery.data.items) : []),
    [hubQuery.data?.items],
  );

  const totalPages = hubQuery.data ? Math.max(1, Math.ceil(hubQuery.data.totalCount / hubQuery.data.pageSize)) : 1;

  const updateParams = (next: { page?: number; section?: number | null; q?: string }) => {
    const sp = new URLSearchParams(searchParams);
    if (next.page !== undefined) {
      const safePage = Math.max(1, next.page);
      if (safePage === 1) sp.delete("page");
      else sp.set("page", String(safePage));
    }
    if (next.section !== undefined) {
      if (next.section != null && next.section >= 1 && next.section <= 3) sp.set("section", String(next.section));
      else sp.delete("section");
    }
    if (next.q !== undefined) {
      const trimmed = next.q.trim();
      if (trimmed) sp.set("q", trimmed);
      else sp.delete("q");
    }
    setSearchParams(sp);
  };

  const changeSection = (next: number | null) => {
    updateParams({ section: next, page: 1 });
  };

  const changeSearch = (value: string) => {
    updateParams({ q: value, page: 1 });
  };

  if (hubQuery.isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar categories={homeQuery.data?.categories} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">تعذّر تحميل الصفحة</h1>
            <p className="text-muted-foreground mb-6">تحقّق من الاتصال بالخادم ثم أعد المحاولة.</p>
            <Link to="/" className="text-primary font-medium underline underline-offset-4">
              العودة للرئيسية
            </Link>
          </div>
        </main>
        <Footer socialLinks={homeQuery.data?.socialLinks} />
      </div>
    );
  }

  if (!hubQuery.isLoading && hubQuery.data === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar categories={homeQuery.data?.categories} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">المشاريع والمبادرات</h1>
            <p className="text-muted-foreground mb-6">هذه الصفحة غير متاحة حالياً.</p>
            <Link to="/" className="text-primary font-medium underline underline-offset-4">
              العودة للرئيسية
            </Link>
          </div>
        </main>
        <Footer socialLinks={homeQuery.data?.socialLinks} />
      </div>
    );
  }

  const data = hubQuery.data;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar categories={homeQuery.data?.categories} />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/95 via-primary to-emerald-900 text-primary-foreground">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_45%),radial-gradient(circle_at_80%_0%,#fde68a,transparent_35%)]" />
          <div className="container relative mx-auto px-4 py-16 md:py-20 text-center">
            {hubQuery.isLoading ? (
              <div className="h-24 max-w-2xl mx-auto rounded-xl bg-primary-foreground/10 animate-pulse" />
            ) : data ? (
              <>
                <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">{data.title}</h1>
                {data.leadText?.trim() ? (
                  <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">{data.leadText}</p>
                ) : null}
              </>
            ) : null}
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
          <div className="mb-8">
            <Input
              type="search"
              value={searchText}
              onChange={(e) => changeSearch(e.target.value)}
              placeholder="ابحث في المشاريع والمبادرات..."
              className="max-w-xl"
              aria-label="البحث في المشاريع"
            />
          </div>

          {!hubQuery.isLoading && data && data.totalCount > 0 ? (
            <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => changeSection(null)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  sectionFilter === null ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
                }`}
              >
                الكل
              </button>
              {([1, 2, 3] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => changeSection(s)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors max-w-[220px] truncate ${
                    sectionFilter === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
                  }`}
                  title={SECTION_TAB_LABELS[s]}
                >
                  {SECTION_TAB_LABELS[s]}
                </button>
              ))}
            </div>
          ) : null}

          {hubQuery.isLoading ? (
            <div className="space-y-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-8 w-48 rounded bg-muted animate-pulse" />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="h-64 rounded-2xl bg-muted animate-pulse" />
                    <div className="h-64 rounded-2xl bg-muted animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : data ? (
            <div className="space-y-14">
              {introHtml.trim() ? (
                <section className="rounded-2xl border border-border/60 bg-card/90 p-6 md:p-8 shadow-sm text-start">
                  <div className="article-body ql-snow">
                    <div className="ql-editor max-w-none text-foreground [&_img]:rounded-lg" dir="rtl" lang="ar" dangerouslySetInnerHTML={{ __html: introHtml }} />
                  </div>
                </section>
              ) : null}

              {data.totalCount === 0 ? (
                <p className="text-center text-muted-foreground py-14 rounded-2xl border border-dashed border-border">لا مشاريع منشورة بعد.</p>
              ) : groupedSections.length === 0 ? (
                <p className="text-center text-muted-foreground py-14 rounded-2xl border border-dashed border-border">لا عناصر في هذه الصفحة.</p>
              ) : (
                groupedSections.map((sec) => (
                  <section key={sec.section} className="space-y-6">
                    <div className="flex flex-col gap-2 border-s-4 border-primary ps-4 text-start">
                      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{sec.sectionTitle}</h2>
                      <p className="text-sm text-muted-foreground">مشاريع ومبادرات ضمن هذا المحور</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sec.items.map((item) => (
                        <ProjectCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                ))
              )}

              {data.totalCount > 0 ? (
                <nav className="flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-border/60" aria-label="ترقيم الصفحات">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => updateParams({ page: page - 1 })}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden />
                    السابق
                  </button>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    صفحة {data.page} من {totalPages} ({data.totalCount} عنصراً)
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => updateParams({ page: page + 1 })}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                  </button>
                </nav>
              ) : null}
            </div>
          ) : null}
        </div>
      </main>

      <Footer socialLinks={homeQuery.data?.socialLinks} />
    </div>
  );
};

export default ProjectsHubPage;
