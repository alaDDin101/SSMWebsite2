import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import type { UpdateMemberProfileDto } from "@/types/api";

const arabicPattern = /[\u0600-\u06FF]/;

const emptyProfile: UpdateMemberProfileDto = {
  firstName: "",
  fatherName: "",
  lastName: "",
  birthDate: "",
  gender: "",
  city: "",
  email: "",
  phoneNumber: "",
  address: "",
  preferredContactMethod: "",
  educationLevel: "",
  specialization: "",
  currentProfession: "",
  employer: "",
  joinReason: "",
  previouslyAffiliated: false,
  previousAffiliationDetails: "",
  participationAreas: "",
  focusIssues: "",
  skills: "",
  previousExperiences: "",
  languages: "",
  weeklyVolunteerHours: "",
  fieldWorkReady: false,
  mobilityTravelAbility: "",
  commitToPrinciples: true,
  infoIsAccurate: true,
  acceptPrivacyPolicy: true,
};

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UpdateMemberProfileDto>(emptyProfile);
  const [joinStatus, setJoinStatus] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    api.getProfile()
      .then((p) => {
        setForm({
          firstName: p.firstName,
          fatherName: p.fatherName,
          lastName: p.lastName,
          birthDate: p.birthDate,
          gender: p.gender,
          city: p.city,
          email: p.email,
          phoneNumber: p.phoneNumber,
          address: p.address ?? "",
          preferredContactMethod: p.preferredContactMethod,
          educationLevel: p.educationLevel,
          specialization: p.specialization,
          currentProfession: p.currentProfession,
          employer: p.employer ?? "",
          joinReason: p.joinReason,
          previouslyAffiliated: p.previouslyAffiliated,
          previousAffiliationDetails: p.previousAffiliationDetails ?? "",
          participationAreas: p.participationAreas,
          focusIssues: p.focusIssues,
          skills: p.skills,
          previousExperiences: p.previousExperiences ?? "",
          languages: p.languages,
          weeklyVolunteerHours: p.weeklyVolunteerHours,
          fieldWorkReady: p.fieldWorkReady,
          mobilityTravelAbility: p.mobilityTravelAbility,
          commitToPrinciples: p.commitToPrinciples,
          infoIsAccurate: p.infoIsAccurate,
          acceptPrivacyPolicy: p.acceptPrivacyPolicy,
        });
        setJoinStatus(p.joinStatus);
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "تعذر تحميل الملف الشخصي.");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const validate = () => {
    if (!form.firstName.trim() || !form.fatherName.trim() || !form.lastName.trim() || !form.city.trim()) {
      toast.error("يرجى تعبئة الاسم الثلاثي ومكان الإقامة.");
      return false;
    }
    if (!arabicPattern.test(form.firstName) || !arabicPattern.test(form.fatherName) || !arabicPattern.test(form.lastName) || !arabicPattern.test(form.city)) {
      toast.error("يرجى كتابة الاسم الثلاثي ومكان الإقامة باللغة العربية.");
      return false;
    }
    if (!form.email.trim() || !form.phoneNumber.trim()) {
      toast.error("يرجى تعبئة البريد الإلكتروني ورقم الهاتف.");
      return false;
    }
    if (form.joinReason.trim().length < 20) {
      toast.error("يرجى كتابة سبب الانضمام بشكل مفصل.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await api.updateProfile({
        ...form,
        firstName: form.firstName.trim(),
        fatherName: form.fatherName.trim(),
        lastName: form.lastName.trim(),
        city: form.city.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        address: form.address?.trim() || null,
        preferredContactMethod: form.preferredContactMethod.trim(),
        educationLevel: form.educationLevel.trim(),
        specialization: form.specialization.trim(),
        currentProfession: form.currentProfession.trim(),
        employer: form.employer?.trim() || null,
        joinReason: form.joinReason.trim(),
        previousAffiliationDetails: form.previousAffiliationDetails?.trim() || null,
        participationAreas: form.participationAreas.trim(),
        focusIssues: form.focusIssues.trim(),
        skills: form.skills.trim(),
        previousExperiences: form.previousExperiences?.trim() || null,
        languages: form.languages.trim(),
        weeklyVolunteerHours: form.weeklyVolunteerHours.trim(),
        mobilityTravelAbility: form.mobilityTravelAbility.trim(),
      });
      toast.success("تم تحديث الملف الشخصي بنجاح.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحديث الملف الشخصي.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="gradient-hero py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-heading font-bold text-primary-foreground">الملف الشخصي</h1>
            <p className="mt-2 text-primary-foreground/80">يمكنك مراجعة وتحديث بيانات طلب الانضمام بعد الموافقة.</p>
            {joinStatus ? <p className="mt-1 text-primary-foreground/90 text-sm">حالة الطلب: {joinStatus}</p> : null}
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
            {loading ? (
              <p className="text-center text-muted-foreground py-10">جاري تحميل البيانات...</p>
            ) : (
              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input value={form.firstName} onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))} placeholder="الاسم الأول" />
                  <Input value={form.fatherName} onChange={(e) => setForm((s) => ({ ...s, fatherName: e.target.value }))} placeholder="اسم الأب" />
                  <Input value={form.lastName} onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))} placeholder="الكنية" />
                  <Input type="date" value={form.birthDate} onChange={(e) => setForm((s) => ({ ...s, birthDate: e.target.value }))} />
                  <Input value={form.gender} onChange={(e) => setForm((s) => ({ ...s, gender: e.target.value }))} placeholder="الجنس" />
                  <Input value={form.city} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} placeholder="المدينة" />
                  <Input type="email" dir="ltr" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="البريد الإلكتروني" />
                  <Input dir="ltr" value={form.phoneNumber} onChange={(e) => setForm((s) => ({ ...s, phoneNumber: e.target.value }))} placeholder="رقم الهاتف" />
                  <Input value={form.address || ""} onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))} placeholder="العنوان" />
                  <Input value={form.preferredContactMethod} onChange={(e) => setForm((s) => ({ ...s, preferredContactMethod: e.target.value }))} placeholder="وسيلة التواصل" />
                  <Input value={form.educationLevel} onChange={(e) => setForm((s) => ({ ...s, educationLevel: e.target.value }))} placeholder="المستوى التعليمي" />
                  <Input value={form.specialization} onChange={(e) => setForm((s) => ({ ...s, specialization: e.target.value }))} placeholder="الاختصاص" />
                  <Input value={form.currentProfession} onChange={(e) => setForm((s) => ({ ...s, currentProfession: e.target.value }))} placeholder="المهنة الحالية" />
                  <Input value={form.employer || ""} onChange={(e) => setForm((s) => ({ ...s, employer: e.target.value }))} placeholder="جهة العمل" />
                  <Input value={form.participationAreas} onChange={(e) => setForm((s) => ({ ...s, participationAreas: e.target.value }))} placeholder="مجالات المشاركة" />
                  <Input value={form.focusIssues} onChange={(e) => setForm((s) => ({ ...s, focusIssues: e.target.value }))} placeholder="القضايا المهتم بها" />
                  <Input value={form.skills} onChange={(e) => setForm((s) => ({ ...s, skills: e.target.value }))} placeholder="المهارات" />
                  <Input value={form.languages} onChange={(e) => setForm((s) => ({ ...s, languages: e.target.value }))} placeholder="اللغات" />
                  <Input value={form.weeklyVolunteerHours} onChange={(e) => setForm((s) => ({ ...s, weeklyVolunteerHours: e.target.value }))} placeholder="ساعات التطوع أسبوعياً" />
                  <Input value={form.mobilityTravelAbility} onChange={(e) => setForm((s) => ({ ...s, mobilityTravelAbility: e.target.value }))} placeholder="إمكانية التنقل/السفر" />
                </div>

                <Textarea value={form.joinReason} onChange={(e) => setForm((s) => ({ ...s, joinReason: e.target.value }))} rows={4} placeholder="سبب الانضمام" />
                <Textarea value={form.previousAffiliationDetails || ""} onChange={(e) => setForm((s) => ({ ...s, previousAffiliationDetails: e.target.value }))} rows={3} placeholder="تفاصيل الانتماء السابق (إن وجد)" />
                <Textarea value={form.previousExperiences || ""} onChange={(e) => setForm((s) => ({ ...s, previousExperiences: e.target.value }))} rows={3} placeholder="الخبرات السابقة" />

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.previouslyAffiliated} onChange={(e) => setForm((s) => ({ ...s, previouslyAffiliated: e.target.checked }))} className="h-4 w-4 accent-primary" />
                    انتماء سياسي سابق
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.fieldWorkReady} onChange={(e) => setForm((s) => ({ ...s, fieldWorkReady: e.target.checked }))} className="h-4 w-4 accent-primary" />
                    جاهزية للعمل الميداني
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.commitToPrinciples} onChange={(e) => setForm((s) => ({ ...s, commitToPrinciples: e.target.checked }))} className="h-4 w-4 accent-primary" />
                    ملتزم بالمبادئ
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.infoIsAccurate} onChange={(e) => setForm((s) => ({ ...s, infoIsAccurate: e.target.checked }))} className="h-4 w-4 accent-primary" />
                    المعلومات دقيقة
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.acceptPrivacyPolicy} onChange={(e) => setForm((s) => ({ ...s, acceptPrivacyPolicy: e.target.checked }))} className="h-4 w-4 accent-primary" />
                    موافق على سياسة الخصوصية
                  </label>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
