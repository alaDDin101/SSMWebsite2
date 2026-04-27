import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prepareArticleBodyForClient } from "@/lib/articleHtml";
import { Building2, UserCircle } from "lucide-react";

const OrganizationPage = () => {
  const homeQuery = useQuery({ queryKey: ["home"], queryFn: api.getHome, staleTime: 5 * 60 * 1000 });

  const orgQuery = useQuery({
    queryKey: ["organization"],
    queryFn: api.getOrganizationPage,
    staleTime: 2 * 60 * 1000,
  });

  const introHtml = useMemo(
    () => prepareArticleBodyForClient(orgQuery.data?.introHtml ?? ""),
    [orgQuery.data?.introHtml],
  );

  if (orgQuery.isError) {
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

  if (!orgQuery.isLoading && orgQuery.data === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar categories={homeQuery.data?.categories} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">الهيكل التنظيمي</h1>
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

  const page = orgQuery.data;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar categories={homeQuery.data?.categories} />

      <main className="flex-1">
        <div className="gradient-hero py-14 md:py-20">
          <div className="container mx-auto px-4 text-center">
            {orgQuery.isLoading ? (
              <div className="h-24 max-w-2xl mx-auto rounded-xl bg-primary-foreground/10 animate-pulse" />
            ) : page ? (
              <>
                <h1 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground mb-3">{page.title}</h1>
                {page.leadText?.trim() ? (
                  <p className="text-primary-foreground/90 text-lg max-w-3xl mx-auto leading-relaxed">{page.leadText}</p>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
          {orgQuery.isLoading ? (
            <div className="space-y-6">
              <div className="h-40 rounded-2xl bg-muted animate-pulse" />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-48 rounded-2xl bg-muted animate-pulse" />
                <div className="h-48 rounded-2xl bg-muted animate-pulse" />
              </div>
            </div>
          ) : page ? (
            <div className="space-y-14">
              {introHtml.trim() ? (
                <section className="rounded-2xl border border-border/60 bg-card/80 p-6 md:p-8 shadow-sm text-start">
                  <div className="article-body ql-snow">
                    <div className="ql-editor max-w-none text-foreground [&_img]:rounded-lg" dir="rtl" lang="ar" dangerouslySetInnerHTML={{ __html: introHtml }} />
                  </div>
                </section>
              ) : null}

              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-3">
                  <Building2 className="h-7 w-7 text-primary shrink-0" aria-hidden />
                  <div>
                    <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">الإدارات واللجان</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">هيكل اللجان والفرق العاملة</p>
                  </div>
                </div>

                {page.committees.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8 rounded-2xl border border-dashed border-border">لا توجد لجان معروضة حالياً.</p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {page.committees.map((c) => (
                      <article
                        key={c.id}
                        className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col text-start"
                      >
                        <h3 className="text-lg font-bold text-foreground mb-2">{c.name}</h3>
                        {c.description?.trim() ? <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.description}</p> : null}
                        {c.positions.length > 0 ? (
                          <ul className="mt-auto space-y-2 border-t border-border/60 pt-4">
                            {c.positions.map((p) => (
                              <li key={p.id} className="flex flex-col gap-0.5 rounded-lg bg-muted/50 px-3 py-2">
                                <span className="font-medium text-foreground">{p.title}</span>
                                {p.holderName?.trim() ? (
                                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <UserCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                    {p.holderName}
                                  </span>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-4 border-t border-border/60 pt-4">لا مناصب مرتبطة بهذه اللجنة.</p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {page.rootPositions.length > 0 ? (
                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-3">
                    <UserCircle className="h-7 w-7 text-primary shrink-0" aria-hidden />
                    <div>
                      <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">المناصب الرسمية</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">مناصب على المستوى العام للحركة</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {page.rootPositions.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-xl border border-border/70 bg-gradient-to-br from-card to-muted/30 p-5 text-start shadow-sm"
                      >
                        <p className="font-semibold text-foreground">{p.title}</p>
                        {p.holderName?.trim() ? <p className="text-sm text-muted-foreground mt-2">{p.holderName}</p> : null}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          ) : null}
        </div>
      </main>

      <Footer socialLinks={homeQuery.data?.socialLinks} />
    </div>
  );
};

export default OrganizationPage;
