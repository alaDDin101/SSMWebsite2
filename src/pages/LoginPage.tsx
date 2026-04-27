import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = await api.loginClient({ email: email.trim(), password });
      login(token);
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/");
    } catch (err) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("expiresAt");
      sessionStorage.removeItem("userData");
      toast.error(err instanceof Error ? err.message : "تعذر تسجيل الدخول");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground">تسجيل الدخول</h1>
            <p className="mt-3 text-primary-foreground/80">بعد الموافقة على طلب الانضمام يمكنك الدخول عبر البريد وكلمة المرور.</p>
          </div>
        </section>
        <section className="container mx-auto px-4 py-12">
          <form onSubmit={onSubmit} className="max-w-md mx-auto rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="space-y-2">
              <label className="text-sm font-medium">البريد الإلكتروني</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">كلمة المرور</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "جاري التحقق..." : "دخول"}
            </Button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
