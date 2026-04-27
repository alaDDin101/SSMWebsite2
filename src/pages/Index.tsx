import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import CategorySection from "@/components/CategorySection";
import AboutUsSection from "@/components/AboutUsSection";
import LatestArticles from "@/components/LatestArticles";
import HomeProjectsSection from "@/components/HomeProjectsSection";
import { HomePageSkeleton } from "@/components/LoadingSkeleton";

const Index = () => {
  const location = useLocation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["home"],
    queryFn: api.getHome,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (location.hash !== "#about-us" || isLoading || !data) return;
    const scroll = () => document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth", block: "start" });
    scroll();
    const a = window.setTimeout(scroll, 300);
    const b = window.setTimeout(scroll, 900);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [location.hash, location.pathname, isLoading, data]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">تعذّر تحميل المحتوى</h2>
            <p className="text-muted-foreground">تحقّق من الاتصال بالخادم ثم أعد المحاولة.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar categories={data?.categories} />

      {isLoading ? (
        <HomePageSkeleton />
      ) : data ? (
        <main className="flex-1">
          <HeroSlider slides={data.slides} />
          <CategorySection categories={data.categories} />
          <AboutUsSection data={data.aboutUs} />
          {data.projectsSection ? <HomeProjectsSection initial={data.projectsSection} /> : null}
          {data.articlesSection ? <LatestArticles initial={data.articlesSection} /> : null}
        </main>
      ) : null}

      <Footer socialLinks={data?.socialLinks} />
    </div>
  );
};

export default Index;
