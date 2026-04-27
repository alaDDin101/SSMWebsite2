import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

function loadGsiScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const finish = () => {
      if (window.google?.accounts?.id) resolve();
      else reject(new Error("تعذّر تحميل تسجيل الدخول عبر جوجل"));
    };
    const existing = document.getElementById("gsi-client-script");
    if (existing) {
      if (window.google?.accounts?.id) return void finish();
      existing.addEventListener("load", finish, { once: true });
      existing.addEventListener("error", () => reject(new Error("فشل تحميل تسجيل الدخول عبر جوجل")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = "gsi-client-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => finish();
    script.onerror = () => reject(new Error("فشل تحميل تسجيل الدخول عبر جوجل"));
    document.head.appendChild(script);
  });
}

type Props = {
  /** Tailwind / shadcn classes for the wrapper around the Google-rendered control */
  className?: string;
  /** Wider button for mobile drawer */
  fullWidth?: boolean;
};

/**
 * Renders Google Identity Services "Sign in" and exchanges the ID token for our API JWT.
 */
const GoogleSignInButton = ({ className, fullWidth }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { login } = useAuth();

  useEffect(() => {
    const el = containerRef.current;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
    if (!el || !clientId) return;

    let cancelled = false;

    void (async () => {
      try {
        await loadGsiScript();
        if (cancelled || !el || !window.google?.accounts?.id) return;
        el.replaceChildren();
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (resp) => {
            if (!resp.credential) return;
            try {
              const token = await api.googleAuth(resp.credential);
              login(token);
              toast.success("تم تسجيل الدخول بنجاح");
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "فشل تسجيل الدخول");
            }
          },
        });
        window.google.accounts.id.renderButton(el, {
          type: "standard",
          theme: "filled_blue",
          size: "large",
          text: "signin_with",
          width: fullWidth ? 320 : 260,
          locale: "ar",
        });
      } catch (e) {
        if (!cancelled) toast.error(e instanceof Error ? e.message : "تعذّر بدء تسجيل الدخول عبر جوجل");
      }
    })();

    return () => {
      cancelled = true;
      el.replaceChildren();
    };
  }, [login, fullWidth]);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    return (
      <Button type="button" variant="secondary" size="sm" disabled title="عيّن VITE_GOOGLE_CLIENT_ID لتفعيل تسجيل الدخول عبر جوجل" className={className}>
        تسجيل الدخول عبر جوجل
      </Button>
    );
  }

  return <div ref={containerRef} className={className} />;
};

export default GoogleSignInButton;
