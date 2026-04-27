import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, getImageUrl } from "@/services/api";
import { prepareArticleBodyForClient } from "@/lib/articleHtml";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, CalendarDays, User, ChevronLeft } from "lucide-react";

const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const homeQuery = useQuery({ queryKey: ["home"], queryFn: api.getHome, staleTime: 5 * 60 * 1000 });

  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => api.getProject(slug!),
    enabled: !!slug,
  });

  const bodyHtml = useMemo(() => prepareArticleBodyForClient(project?.bodyHtml ?? ""), [project?.bodyHtml]);

  useEffect(() => {
    if (project?.title) {
      document.title = `${project.title} — المشاريع`;
    }
    return () => {
      document.title = "حركة أبناء سوريا";
    };
  }, [project?.title]);

  const publishedLabel =
    project?.publishedAt &&
    new Intl.DateTimeFormat("ar", { year: "numeric", month: "long", day: "numeric" }).format(new Date(project.publishedAt));

  if (isError) {
    const msg = error instanceof Error ? error.message : "";
    const is404 = msg.includes("(404)") || msg.includes("404");
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar categories={homeQuery.data?.categories} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-heading font-bold mb-2">{is404 ? "المشروع غير متوفر" : "تعذّر التحميل"}</h1>
            <p className="text-muted-foreground mb-6">{is404 ? "قد يكون الرابط غير صحيح أو المشروع غير منشور." : msg}</p>
            <Link to="/projects" className="text-primary font-medium underline underline-offset-4 inline-flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              العودة إلى المشاريع
            </Link>
          </div>
        </main>
        <Footer socialLinks={homeQuery.data?.socialLinks} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar categories={homeQuery.data?.categories} />

      <main className="flex-1">
        {isLoading || !project ? (
          <div className="container mx-auto px-4 py-16 space-y-6 max-w-3xl animate-pulse">
            <div className="h-10 w-2/3 rounded bg-muted" />
            <div className="h-64 rounded-3xl bg-muted" />
            <div className="h-40 rounded-xl bg-muted" />
          </div>
        ) : (
          <>
            <header className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-primary/90 via-emerald-900 to-slate-900" />
              <div className="container relative mx-auto px-4 pt-10 pb-28 md:pb-32 max-w-4xl text-center">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-sm text-primary-foreground/85 hover:text-white mb-6 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  المشاريع والمبادرات
                </Link>
                <span className="inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-medium text-white/95 mb-4 backdrop-blur-sm">
                  {project.sectionTitle}
                </span>
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight drop-shadow-sm">{project.title}</h1>
                {project.summary?.trim() ? (
                  <p className="mt-5 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">{project.summary}</p>
                ) : null}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/85">
                  {publishedLabel ? (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" aria-hidden />
                      {publishedLabel}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-2">
                    <Eye className="h-4 w-4" aria-hidden />
                    {project.viewCount.toLocaleString("ar-EG")} مشاهدة
                  </span>
                  {project.authorDisplayName?.trim() ? (
                    <span className="inline-flex items-center gap-2">
                      <User className="h-4 w-4" aria-hidden />
                      {project.authorDisplayName}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="container relative mx-auto px-4 -mt-20 md:-mt-24 max-w-4xl">
                <div className="rounded-3xl border-4 border-background shadow-2xl overflow-hidden bg-card aspect-[21/9] md:aspect-[2.4/1]">
                  <img src={getImageUrl(project.coverImageUrl)} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </header>

            <article className="container mx-auto px-4 py-14 md:py-20 max-w-3xl">
              <div className="article-body ql-snow rounded-2xl border border-border/50 bg-card/40 p-6 md:p-10 shadow-inner">
                <div className="ql-editor max-w-none text-foreground text-lg leading-relaxed [&_img]:rounded-xl" dir="rtl" lang="ar" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
              </div>
            </article>
          </>
        )}
      </main>

      <Footer socialLinks={homeQuery.data?.socialLinks} />
    </div>
  );
};

export default ProjectDetailPage;
