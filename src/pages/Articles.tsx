import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { api } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { ArticleListSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

const ArticlesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId") || undefined;
  const searchText = searchParams.get("q")?.trim() ?? "";
  const pageFromUrl = Number(searchParams.get("page") || "1");
  const page = Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  const homeQuery = useQuery({ queryKey: ["home"], queryFn: api.getHome, staleTime: 5 * 60 * 1000 });

  const { data, isLoading } = useQuery({
    queryKey: ["articles", page, categoryId, searchText],
    queryFn: () => api.getArticles({ page, pageSize: PAGE_SIZE, categoryId, search: searchText || undefined }),
  });

  const categories = homeQuery.data?.categories.filter((c) => c.isActive) || [];
  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / PAGE_SIZE)) : 1;

  const updateParams = (next: { categoryId?: string; q?: string; page?: number }) => {
    const sp = new URLSearchParams(searchParams);
    if (next.categoryId !== undefined) {
      if (next.categoryId) sp.set("categoryId", next.categoryId);
      else sp.delete("categoryId");
    }
    if (next.q !== undefined) {
      const trimmed = next.q.trim();
      if (trimmed) sp.set("q", trimmed);
      else sp.delete("q");
    }
    if (next.page !== undefined) {
      const safePage = Math.max(1, next.page);
      if (safePage === 1) sp.delete("page");
      else sp.set("page", String(safePage));
    }
    setSearchParams(sp);
  };

  const handleCategoryChange = (id?: string) => {
    updateParams({ categoryId: id, page: 1 });
  };

  const handleSearchChange = (value: string) => {
    updateParams({ q: value, page: 1 });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar categories={homeQuery.data?.categories} />

      <main className="flex-1">
        {/* Header */}
        <div className="gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground">المقالات</h1>
            <p className="mt-3 text-primary-foreground/80">تابع آخر الأخبار والتحديثات</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="mb-6">
            <Input
              type="search"
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="ابحث في المقالات بالعنوان أو الملخص..."
              className="max-w-xl"
              aria-label="البحث في المقالات"
            />
          </div>

          {/* Category filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => handleCategoryChange()}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !categoryId ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                الكل
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    categoryId === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <ArticleListSkeleton />
          ) : data && data.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.items.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => updateParams({ page: page - 1 })}>
                    <ChevronRight className="h-4 w-4 ms-1" /> السابق
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    صفحة {page} من {totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => updateParams({ page: page + 1 })}>
                    التالي <ChevronLeft className="h-4 w-4 me-1" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">لا توجد مقالات مطابقة</h3>
              <p className="text-muted-foreground">
                جرّب تغيير كلمة البحث أو اختر تصنيفًا مختلفًا.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer socialLinks={homeQuery.data?.socialLinks} />
    </div>
  );
};

export default ArticlesPage;
