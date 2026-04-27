import { Link } from "react-router-dom";
import { Eye, Heart, MessageCircle, Calendar } from "lucide-react";
import { getImageUrl } from "@/services/api";
import type { ArticleSummaryDto } from "@/types/api";

interface ArticleCardProps {
  article: ArticleSummaryDto;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const date = article.publishedAt
    ? new Intl.DateTimeFormat("ar", { year: "numeric", month: "short", day: "numeric" }).format(new Date(article.publishedAt))
    : "—";

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex h-full flex-col rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(article.coverImageUrl)}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 end-3 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          {article.categoryName}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-heading font-bold text-card-foreground group-hover:text-secondary transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>
        {article.summary ? (
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{article.summary}</p>
        ) : (
          <p className="text-sm text-muted-foreground/60 line-clamp-2 flex-1 italic">لا يوجد ملخص</p>
        )}

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {date}</span>
          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {article.viewCount}</span>
          <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {article.likeCount}</span>
          <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {article.commentCount}</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
