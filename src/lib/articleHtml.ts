import DOMPurify from "dompurify";
import { getImageUrl } from "@/services/api";

/**
 * Sanitize stored article HTML and fix root-relative media URLs so images load
 * from the API origin when the SPA is served from another host (Quill stores `/uploads/...`).
 */
export function prepareArticleBodyForClient(html: string): string {
  const clean = DOMPurify.sanitize(html, {
    ADD_ATTR: ["target", "rel"],
  });

  if (typeof document === "undefined") return clean;

  const wrap = document.createElement("div");
  wrap.innerHTML = clean;

  wrap.querySelectorAll("img[src]").forEach((img) => {
    const src = img.getAttribute("src")?.trim();
    if (!src) {
      img.setAttribute("src", getImageUrl(null));
      return;
    }
    if (src.startsWith("data:") || /^https?:\/\//i.test(src)) return;
    img.setAttribute("src", getImageUrl(src));
  });

  wrap.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href")?.trim();
    if (!href || href.startsWith("#") || /^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    if (href.startsWith("/uploads/") || href.startsWith("/media/")) {
      a.setAttribute("href", getImageUrl(href));
    }
  });

  return wrap.innerHTML;
}
