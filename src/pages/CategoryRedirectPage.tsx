import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HomePageSkeleton } from "@/components/LoadingSkeleton";

/**
 * Pretty URL `/categories/:slug` → same listing as `/articles?categoryId=…`.
 */
const CategoryRedirectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: home, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: api.getHome,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || !home) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <HomePageSkeleton />
        <Footer />
      </div>
    );
  }

  const cat = home.categories.find((c) => c.slug === slug);
  if (!cat) {
    return <Navigate to="/articles" replace />;
  }

  return <Navigate to={`/articles?categoryId=${cat.id}`} replace />;
};

export default CategoryRedirectPage;
