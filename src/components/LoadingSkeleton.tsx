import { Skeleton } from "@/components/ui/skeleton";

export const HomePageSkeleton = () => (
  <div>
    <Skeleton className="w-full h-[500px]" />
    <div className="container mx-auto px-4 py-20">
      <Skeleton className="h-10 w-64 mx-auto mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
    <div className="container mx-auto px-4 py-20">
      <Skeleton className="h-10 w-48 mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export const ArticleListSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Skeleton key={i} className="h-80 rounded-xl" />
    ))}
  </div>
);

export const ArticleDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <Skeleton className="h-8 w-32 mb-4" />
    <Skeleton className="h-12 w-full mb-4" />
    <Skeleton className="h-6 w-2/3 mb-8" />
    <Skeleton className="h-96 w-full rounded-xl mb-8" />
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  </div>
);
