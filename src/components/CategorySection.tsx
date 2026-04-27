import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getImageUrl } from "@/services/api";
import type { CategoryDto } from "@/types/api";

interface CategorySectionProps {
  categories: CategoryDto[];
}

const CategorySection = ({ categories }: CategorySectionProps) => {
  const active = categories.filter((c) => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
  if (active.length === 0) return null;

  return (
    <section className="py-20 syrian-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            تصفّح <span className="text-gradient-gold">التصنيفات</span>
          </h2>
          <div className="mt-3 mx-auto w-20 h-1 rounded-full bg-secondary" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-xl h-64 shadow-lg hover:shadow-xl transition-all duration-500"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${getImageUrl(cat.backgroundImageUrl)})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-6">
                <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-1">{cat.name}</h3>
                {cat.description && (
                  <p className="text-sm text-primary-foreground/80 line-clamp-2">{cat.description}</p>
                )}
                <div className="mt-3 flex items-center gap-1 text-secondary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>عرض المقالات</span>
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
