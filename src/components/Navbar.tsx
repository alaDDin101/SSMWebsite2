import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ChevronDown, Info, Network, Sparkles, UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/services/api";
import { SITE_LOGO_PATH } from "@/lib/siteImage";
import type { CategoryDto } from "@/types/api";

function scrollToAboutUsSection() {
  document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

interface NavbarProps {
  categories?: CategoryDto[];
}
   
const Navbar = ({ categories = [] }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const goAboutUs = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate({ pathname: "/", hash: "about-us" });
    setMobileOpen(false);
    requestAnimationFrame(() => scrollToAboutUsSection());
    setTimeout(scrollToAboutUsSection, 200);
    setTimeout(scrollToAboutUsSection, 600);
  };

  const activeCategories = categories.filter((c) => c.isActive);

  const isCategoryActive = (cat: CategoryDto) =>
    location.pathname === `/categories/${cat.slug}` || location.search.includes(cat.id);

  const anyCategoryActive = activeCategories.some(isCategoryActive);

  useEffect(() => {
    if (!mobileOpen) setMobileCategoriesOpen(false);
  }, [mobileOpen]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo: text inline-start, image on the right (physical) in RTL */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="order-2 text-start min-w-0">
            <h1 className="text-base sm:text-lg font-heading font-bold text-foreground leading-tight truncate">حركة أبناء سوريا</h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground truncate">توعية · عدالة · بناء</p>
          </div>
          <img
            src={SITE_LOGO_PATH}
            alt="حركة أبناء سوريا"
            className="order-1 h-12 w-12 shrink-0 rounded-full shadow-md transition-transform group-hover:scale-110"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
            }`}
          >
            الرئيسية
          </Link>
          {activeCategories.length > 0 && (
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    anyCategoryActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
                  )}
                >
                  <span>التصنيفات</span>
                  <ChevronDown className="h-4 w-4 opacity-80 shrink-0" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="start"
                collisionPadding={8}
                className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-[min(24rem,70vh)] overflow-y-auto p-0"
              >
                <div className="p-1 text-start">
                  {activeCategories.map((cat) => (
                    <DropdownMenuItem key={cat.id} asChild>
                      <Link
                        to={`/categories/${cat.slug}`}
                        className={cn(
                          "flex w-full cursor-pointer flex-row items-center gap-3 rounded-sm px-2 py-2.5",
                          isCategoryActive(cat) && "bg-accent font-medium",
                        )}
                      >
                        <img
                          src={getImageUrl(cat.backgroundImageUrl)}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded-md border border-border/60 object-cover"
                          loading="lazy"
                        />
                        <span className="min-w-0 flex-1 text-start leading-snug">{cat.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Link
            to={{ pathname: "/", hash: "about-us" }}
            onClick={goAboutUs}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              location.pathname === "/" && location.hash === "#about-us"
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <Info className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            من نحن
          </Link>
          <Link
            to="/organization"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              location.pathname === "/organization" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
            }`}
          >
            <Network className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            الهيكل التنظيمي
          </Link>
          <Link
            to="/projects"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              location.pathname.startsWith("/projects") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            المشاريع والمبادرات
          </Link>
          <Link
            to="/articles"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/articles" && !location.search ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
            }`}
          >
            المقالات
          </Link>
          <Link
            to="/join-us"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              location.pathname === "/join-us" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
            }`}
          >
            <UserPlus className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            انضم إلينا
          </Link>
        </div>

        {/* Auth / menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="hidden xl:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/profile" title="الملف الشخصي" aria-label="الملف الشخصي">
                  <User className="h-4 w-4" />
                </Link>
              </Button>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={logout} title="تسجيل الخروج" aria-label="تسجيل الخروج">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild variant="secondary" size="sm" className="hidden xl:inline-flex">
              <Link to="/login">تسجيل الدخول</Link>
            </Button>
          )}
          <button className="xl:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-border bg-background animate-fade-in px-4 pb-4">
          <div className="flex flex-col gap-1 pt-2">
            <Link to="/" className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium" onClick={() => setMobileOpen(false)}>
              الرئيسية
            </Link>
            {activeCategories.length > 0 && (
              <div className="flex flex-col">
                <button
                  type="button"
                  className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium flex items-center justify-between gap-2 text-start"
                  onClick={() => setMobileCategoriesOpen((o) => !o)}
                  aria-expanded={mobileCategoriesOpen}
                >
                  <span>التصنيفات</span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", mobileCategoriesOpen && "rotate-180")} aria-hidden />
                </button>
                {mobileCategoriesOpen && (
                  <div className="flex flex-col border-s-2 border-border ms-3 me-1 mb-1">
                    {activeCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/categories/${cat.slug}`}
                        className={cn(
                          "flex flex-row items-center gap-3 px-4 py-2.5 ps-6 text-sm rounded-lg hover:bg-muted",
                          isCategoryActive(cat) && "bg-muted font-medium text-foreground",
                        )}
                        onClick={() => {
                          setMobileOpen(false);
                          setMobileCategoriesOpen(false);
                        }}
                      >
                        <img
                          src={getImageUrl(cat.backgroundImageUrl)}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-md border border-border/60 object-cover"
                          loading="lazy"
                        />
                        <span className="min-w-0 flex-1 text-start leading-snug">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            <Link
              to={{ pathname: "/", hash: "about-us" }}
              className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium inline-flex items-center gap-2"
              onClick={goAboutUs}
            >
              <Info className="h-4 w-4 shrink-0" aria-hidden />
              من نحن
            </Link>
            <Link
              to="/organization"
              className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium inline-flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <Network className="h-4 w-4 shrink-0" aria-hidden />
              الهيكل التنظيمي
            </Link>
            <Link
              to="/projects"
              className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium inline-flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
              المشاريع والمبادرات
            </Link>
            <Link to="/articles" className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium" onClick={() => setMobileOpen(false)}>
              المقالات
            </Link>
            <Link
              to="/join-us"
              className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium inline-flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <UserPlus className="h-4 w-4 shrink-0" aria-hidden />
              انضم إلينا
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium inline-flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="h-4 w-4 shrink-0" aria-hidden />
                  الملف الشخصي
                </Link>
                <button className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium text-end text-destructive w-full" onClick={() => { logout(); setMobileOpen(false); }}>
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium text-center" onClick={() => setMobileOpen(false)}>
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
