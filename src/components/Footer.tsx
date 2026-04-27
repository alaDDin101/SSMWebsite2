import { Facebook, Twitter, Instagram, Youtube, Globe } from "lucide-react";
import { getImageUrl } from "@/services/api";
import { SITE_LOGO_PATH } from "@/lib/siteImage";
import type { SocialLinkDto } from "@/types/api";

const iconMap: Record<string, React.ElementType> = {
  facebook: Facebook,
  x: Twitter,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
};

interface FooterProps {
  socialLinks?: SocialLinkDto[];
}

const Footer = ({ socialLinks = [] }: FooterProps) => {
  const activeLinks = socialLinks.filter((l) => l.isActive).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground syrian-pattern">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-6">
          <img src={SITE_LOGO_PATH} alt="حركة أبناء سوريا" className="h-20 w-20 rounded-full shadow-lg" />
          <div className="text-center">
            <h3 className="text-xl font-heading font-bold">حركة أبناء سوريا</h3>
            <p className="text-sm opacity-80 mt-1">توعية · عدالة · بناء</p>
          </div>

          {activeLinks.length > 0 && (
            <div className="flex gap-4">
              {activeLinks.map((link) => {
                const Icon = iconMap[link.platformKey?.toLowerCase() ?? ""] || Globe;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  >
                    {link.iconUrl ? (
                      <img src={getImageUrl(link.iconUrl)} alt="" className="h-5 w-5 object-contain" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </a>
                );
              })}
            </div>
          )}

          <p className="text-xs opacity-60 mt-4">
            © {new Date().getFullYear()} حركة أبناء سوريا — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
