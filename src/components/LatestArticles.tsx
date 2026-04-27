import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import { HomeStripSlider } from "@/components/HomeStripSlider";
import type { ArticleSummaryDto, PagedResult } from "@/types/api";

interface LatestArticlesProps {
  initial: PagedResult<ArticleSummaryDto>;
}

const LatestArticles = ({ initial }: LatestArticlesProps) => {
  if (!initial.totalCount) return null;

  const items = initial.items;
  const isSingle = items.length === 1;
  const isPair = items.length === 2;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              أحدث <span className="text-gradient-gold">المقالات</span>
            </h2>
            <div className="mt-3 w-20 h-1 rounded-full bg-secondary" />
          </div>
          <Link to="/articles" className="hidden sm:flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors">
            <span>عرض الكل</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        {isSingle || isPair ? (
          <div
            className={
              isSingle
                ? "mx-auto max-w-xl"
                : "mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2"
            }
          >
            {items.map((article) => (
              <div key={article.id} className="h-full min-w-0">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <HomeStripSlider
            items={items}
            getKey={(a) => a.id}
            renderSlide={(article) => (
              <div className="h-full min-w-0 [&>a]:min-w-0 [&>a]:max-w-full">
                <ArticleCard article={article} />
              </div>
            )}
          />
        )}

        <Link to="/articles" className="sm:hidden flex items-center justify-center gap-1 mt-8 text-sm font-medium text-secondary">
          <span>عرض كل المقالات</span>
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
};

export default LatestArticles;
