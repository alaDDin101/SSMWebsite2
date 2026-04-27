import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "quill/dist/quill.snow.css";
import { Heart, Eye, Calendar, ArrowLeft, MessageCircle, Send, Trash2 } from "lucide-react";
import { api, getImageUrl } from "@/services/api";
import { prepareArticleBodyForClient } from "@/lib/articleHtml";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArticleDetailSkeleton } from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { ArticleCommentDto } from "@/types/api";

const COMMENTS_PAGE_SIZE = 10;

const CommentNode = ({
  comment,
  depth = 0,
  articleId,
  currentUserId,
}: {
  comment: ArticleCommentDto;
  depth?: number;
  articleId: string;
  currentUserId?: string | null;
}) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const replyMutation = useMutation({
    mutationFn: () => api.addComment(articleId, replyText, comment.id),
    onSuccess: () => {
      toast.success("تم نشر الرد بنجاح.");
      setReplyText("");
      setShowReply(false);
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteComment(articleId, comment.id),
    onSuccess: () => {
      toast.success("تم حذف التعليق.");
      queryClient.invalidateQueries({ queryKey: ["article"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const date = new Intl.DateTimeFormat("ar", { year: "numeric", month: "short", day: "numeric" }).format(new Date(comment.createdAt));

  return (
    <div className={`${depth > 0 ? "ms-6 pe-4 border-s-2 border-border" : ""} mb-4`}>
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm text-foreground">{comment.userDisplayName || "عضو"}</span>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <p className="text-sm text-foreground/90">{comment.body}</p>
        {isAuthenticated && (
          <div className="mt-2 flex items-center gap-3">
            <button type="button" onClick={() => setShowReply(!showReply)} className="text-xs text-secondary hover:underline">
              رد
            </button>
            {currentUserId && currentUserId === comment.userId ? (
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1 text-xs text-destructive hover:underline disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
                حذف
              </button>
            ) : null}
          </div>
        )}
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف التعليق</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا التعليق نهائياً مع جميع الردود التابعة له. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate()}
            >
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showReply && (
        <div className="mt-2 ms-4 flex gap-2">
          <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="اكتب ردك..." className="text-sm min-h-[60px]" />
          <Button size="sm" onClick={() => replyMutation.mutate()} disabled={!replyText.trim() || replyMutation.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}

      {comment.replies?.map((reply) => (
        <CommentNode key={reply.id} comment={reply} depth={depth + 1} articleId={articleId} currentUserId={currentUserId} />
      ))}
    </div>
  );
};

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [commentsPage, setCommentsPage] = useState(1);

  const homeQuery = useQuery({ queryKey: ["home"], queryFn: api.getHome, staleTime: 5 * 60 * 1000 });

  const { data: article, isLoading, isError, error } = useQuery({
    queryKey: ["article", slug, commentsPage],
    queryFn: () => api.getArticle(slug!, { commentsPage, commentsPageSize: COMMENTS_PAGE_SIZE }),
    enabled: !!slug,
  });

  useEffect(() => {
    setCommentsPage(1);
  }, [slug]);

  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} — حركة أبناء سوريا`;
    }
    return () => {
      document.title = "حركة أبناء سوريا";
    };
  }, [article?.title]);

  const likeMutation = useMutation({
    mutationFn: () => {
      if (!article) throw new Error("لا يوجد مقال");
      return article.likedByCurrentUser ? api.unlikeArticle(article.id) : api.likeArticle(article.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["article", slug] }),
    onError: (err: Error) => toast.error(err.message),
  });

  const commentMutation = useMutation({
    mutationFn: () => api.addComment(article!.id, commentText),
    onSuccess: () => {
      toast.success("تم نشر التعليق بنجاح.");
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["article", slug, commentsPage] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const bodyHtml = useMemo(
    () => prepareArticleBodyForClient(article?.bodyHtml ?? ""),
    [article?.bodyHtml],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar categories={homeQuery.data?.categories} />
        <ArticleDetailSkeleton />
        <Footer socialLinks={homeQuery.data?.socialLinks} />
      </div>
    );
  }

  if (isError || !article) {
    const message = isError && error instanceof Error ? error.message : "المقال غير موجود";
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar categories={homeQuery.data?.categories} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-2xl font-heading font-bold mb-2">{isError ? "تعذّر تحميل المقال" : "المقال غير موجود"}</h2>
            <p className="text-muted-foreground text-sm mb-4">{message}</p>
            <Link to="/articles" className="text-secondary hover:underline">العودة إلى المقالات</Link>
          </div>
        </div>
        <Footer socialLinks={homeQuery.data?.socialLinks} />
      </div>
    );
  }

  const date = article.publishedAt
    ? new Intl.DateTimeFormat("ar", { year: "numeric", month: "long", day: "numeric" }).format(new Date(article.publishedAt))
    : "";
  const commentsTotalPages = Math.max(1, Math.ceil(article.comments.totalCount / article.comments.pageSize));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar categories={homeQuery.data?.categories} />

      <main className="flex-1">
        {/* Cover (logo when no cover image) */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img src={getImageUrl(article.coverImageUrl)} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>

        <article className="container mx-auto px-4 max-w-4xl py-8 -mt-16 relative">
          <Link to="/articles" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            <span>العودة إلى المقالات</span>
          </Link>

          <div className="bg-card rounded-xl border border-border p-6 md:p-10 shadow-lg">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary mb-4">
              {article.categoryName}
            </span>

            <h1 className="text-3xl md:text-4xl font-heading font-bold text-card-foreground leading-tight mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
              {date ? (
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {date}</span>
              ) : null}
              {article.authorDisplayName ? <span>بقلم {article.authorDisplayName}</span> : null}
              <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {article.viewCount}</span>
            </div>

            {/* Body: Quill classes + snow.css; media URLs resolved for API origin */}
            <div className="article-body ql-snow">
              <div
                className="ql-editor max-w-none text-foreground [&_img]:rounded-lg"
                dir="rtl"
                lang="ar"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </div>

            {/* Like */}
            <div className="mt-10 pt-6 border-t border-border flex items-center gap-4">
              <Button
                variant={article.likedByCurrentUser ? "default" : "outline"}
                onClick={() => {
                  if (!isAuthenticated) { toast.error("سجّل الدخول لتتمكن من الإعجاب بالمقالات."); return; }
                  likeMutation.mutate();
                }}
                disabled={likeMutation.isPending}
                className={article.likedByCurrentUser ? "bg-secondary text-secondary-foreground" : ""}
              >
                <Heart className={`h-4 w-4 ms-2 ${article.likedByCurrentUser ? "fill-current" : ""}`} />
                {article.likeCount} {article.likeCount === 1 ? "إعجاب" : "إعجابات"}
              </Button>
            </div>
          </div>

          {/* Comments */}
          <div className="mt-10">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-secondary" /> التعليقات
            </h2>

            {isAuthenticated && (
              <div className="mb-8 bg-card rounded-xl border border-border p-6">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="شاركنا رأيك..."
                  className="min-h-[100px] mb-3"
                />
                <Button
                  onClick={() => commentMutation.mutate()}
                  disabled={!commentText.trim() || commentMutation.isPending}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Send className="h-4 w-4 ms-2" /> إرسال التعليق
                </Button>
              </div>
            )}

            {article.comments.items.length > 0 ? (
              article.comments.items.map((comment) => (
                <CommentNode key={comment.id} comment={comment} articleId={article.id} currentUserId={user?.userId} />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">لا توجد تعليقات بعد. كن أول من يشاركنا رأيه.</p>
            )}

            {commentsTotalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={commentsPage <= 1}
                  onClick={() => setCommentsPage((p) => Math.max(1, p - 1))}
                >
                  السابق
                </Button>
                <span className="text-sm text-muted-foreground">
                  صفحة {commentsPage} من {commentsTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={commentsPage >= commentsTotalPages}
                  onClick={() => setCommentsPage((p) => Math.min(commentsTotalPages, p + 1))}
                >
                  التالي
                </Button>
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer socialLinks={homeQuery.data?.socialLinks} />
    </div>
  );
};

export default ArticleDetail;
