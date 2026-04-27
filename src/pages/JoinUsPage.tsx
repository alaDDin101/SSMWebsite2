import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

const arabicPattern = /[\u0600-\u06FF]/;
const participationAreaOptions = [
  "إعلام",
  "تنظيم",
  "ميداني",
  "قانوني",
  "إغاثي",
  "تعليمي",
  "بحثي",
  "تقني",
  "علاقات عامة",
  "دعم نفسي مجتمعي",
];

const focusIssueOptions = [
  "حقوق الإنسان",
  "الاقتصاد",
  "التعليم",
  "العدالة الانتقالية",
  "الشباب",
  "تمكين المرأة",
  "الإدارة المحلية",
  "الصحة العامة",
  "مكافحة الفساد",
  "الحوكمة الرقمية",
];

export default function JoinUsPage() {
  const [firstName, setFirstName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [currentProfession, setCurrentProfession] = useState("");
  const [employer, setEmployer] = useState("");
  const [joinReason, setJoinReason] = useState("");
  const [previouslyAffiliated, setPreviouslyAffiliated] = useState<boolean | null>(null);
  const [previousAffiliationDetails, setPreviousAffiliationDetails] = useState("");
  const [participationAreas, setParticipationAreas] = useState("");
  const [focusIssues, setFocusIssues] = useState("");
  const [skills, setSkills] = useState("");
  const [previousExperiences, setPreviousExperiences] = useState("");
  const [languages, setLanguages] = useState("");
  const [weeklyVolunteerHours, setWeeklyVolunteerHours] = useState("");
  const [fieldWorkReady, setFieldWorkReady] = useState<boolean | null>(null);
  const [mobilityTravelAbility, setMobilityTravelAbility] = useState("");
  const [commitToPrinciples, setCommitToPrinciples] = useState(false);
  const [infoIsAccurate, setInfoIsAccurate] = useState(false);
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (
      !firstName.trim() ||
      !fatherName.trim() ||
      !lastName.trim() ||
      !birthDate ||
      !gender.trim() ||
      !city.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !password ||
      !confirmPassword ||
      !preferredContactMethod.trim() ||
      !educationLevel.trim() ||
      !specialization.trim() ||
      !currentProfession.trim() ||
      !joinReason.trim() ||
      !participationAreas.trim() ||
      !focusIssues.trim() ||
      !skills.trim() ||
      !languages.trim() ||
      !weeklyVolunteerHours.trim() ||
      !mobilityTravelAbility.trim()
    ) {
      toast.error("يرجى تعبئة جميع الحقول المطلوبة.");
      return false;
    }
    if (
      !arabicPattern.test(firstName) ||
      !arabicPattern.test(fatherName) ||
      !arabicPattern.test(lastName) ||
      !arabicPattern.test(city)
    ) {
      toast.error("يرجى كتابة الاسم الثلاثي ومكان الإقامة باللغة العربية.");
      return false;
    }
    if (joinReason.trim().length < 20) {
      toast.error("يرجى كتابة سبب الرغبة في الانضمام بشكل مفصل (20 حرفًا على الأقل).");
      return false;
    }
    if (password.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("تأكيد كلمة المرور غير مطابق.");
      return false;
    }
    if (previouslyAffiliated === null || fieldWorkReady === null) {
      toast.error("يرجى تحديد أسئلة الانتماء السابق والاستعداد للعمل الميداني.");
      return false;
    }
    if (previouslyAffiliated && previousAffiliationDetails.trim().length < 5) {
      toast.error("يرجى توضيح تفاصيل الانتماء السابق.");
      return false;
    }
    if (!commitToPrinciples || !infoIsAccurate || !acceptPrivacyPolicy) {
      toast.error("يجب الموافقة على الإقرار والتعهد قبل الإرسال.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.submitJoinRequest({
        firstName: firstName.trim(),
        fatherName: fatherName.trim(),
        lastName: lastName.trim(),
        birthDate,
        gender: gender.trim(),
        city: city.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
        address: address.trim() || null,
        preferredContactMethod: preferredContactMethod.trim(),
        educationLevel: educationLevel.trim(),
        specialization: specialization.trim(),
        currentProfession: currentProfession.trim(),
        employer: employer.trim() || null,
        joinReason: joinReason.trim(),
        previouslyAffiliated,
        previousAffiliationDetails: previousAffiliationDetails.trim() || null,
        participationAreas: participationAreas.trim(),
        focusIssues: focusIssues.trim(),
        skills: skills.trim(),
        previousExperiences: previousExperiences.trim() || null,
        languages: languages.trim(),
        weeklyVolunteerHours: weeklyVolunteerHours.trim(),
        fieldWorkReady,
        mobilityTravelAbility: mobilityTravelAbility.trim(),
        commitToPrinciples,
        infoIsAccurate,
        acceptPrivacyPolicy,
      });
      toast.success("تم إرسال طلب الانضمام بنجاح. سيتم مراجعته من الإدارة.");
      setFirstName("");
      setFatherName("");
      setLastName("");
      setBirthDate("");
      setGender("");
      setCity("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
      setAddress("");
      setPreferredContactMethod("");
      setEducationLevel("");
      setSpecialization("");
      setCurrentProfession("");
      setEmployer("");
      setJoinReason("");
      setPreviouslyAffiliated(null);
      setPreviousAffiliationDetails("");
      setParticipationAreas("");
      setFocusIssues("");
      setSkills("");
      setPreviousExperiences("");
      setLanguages("");
      setWeeklyVolunteerHours("");
      setFieldWorkReady(null);
      setMobilityTravelAbility("");
      setCommitToPrinciples(false);
      setInfoIsAccurate(false);
      setAcceptPrivacyPolicy(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر إرسال الطلب.");
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
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground">انضم إلينا</h1>
            <p className="mt-3 text-primary-foreground/80 max-w-2xl mx-auto">
              املأ طلب الانضمام للحركة وسنراجع بياناتك. قبولك يساعدنا على توسيع العمل بشكل أسرع وأكثر تنظيمًا.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <form className="space-y-5" onSubmit={onSubmit}>
              <h2 className="text-xl font-heading font-bold">1. المعلومات الشخصية الأساسية</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">الاسم الأول *</label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="الاسم الأول" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">اسم الأب *</label>
                  <Input value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="اسم الأب" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الكنية (كما في الوثائق الرسمية) *</label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="الكنية" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">تاريخ الميلاد *</label>
                  <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الجنس *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">اختر</option>
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">مكان الإقامة (المدينة/المنطقة) *</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="دمشق" />
                </div>
              </div>

              <h2 className="text-xl font-heading font-bold pt-2">2. معلومات التواصل</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">رقم الهاتف *</label>
                  <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+963..." dir="ltr" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">البريد الإلكتروني *</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">كلمة المرور *</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 أحرف على الأقل" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">تأكيد كلمة المرور *</label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="أعد إدخال كلمة المرور" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">عنوان السكن (اختياري)</label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="المدينة - الحي" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">وسيلة التواصل المفضلة *</label>
                  <Input
                    value={preferredContactMethod}
                    onChange={(e) => setPreferredContactMethod(e.target.value)}
                    placeholder="هاتف، واتساب، بريد إلكتروني..."
                  />
                </div>
              </div>

              <h2 className="text-xl font-heading font-bold pt-2">3. الخلفية التعليمية والمهنية</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">المستوى التعليمي *</label>
                  <Input value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} placeholder="جامعي، ماجستير..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">التخصص *</label>
                  <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="قانون، إعلام..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">المهنة الحالية *</label>
                  <Input value={currentProfession} onChange={(e) => setCurrentProfession(e.target.value)} placeholder="المهنة الحالية" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">جهة العمل (اختياري)</label>
                  <Input value={employer} onChange={(e) => setEmployer(e.target.value)} placeholder="اسم جهة العمل" />
                </div>
              </div>

              <h2 className="text-xl font-heading font-bold pt-2">4. الاهتمامات والانتماء السياسي</h2>
              <div className="space-y-2">
                <label className="text-sm font-medium">سبب الرغبة في الانضمام *</label>
                <Textarea
                  value={joinReason}
                  onChange={(e) => setJoinReason(e.target.value)}
                  rows={4}
                  placeholder="اكتب السبب بشكل واضح..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">هل سبق الانتماء إلى حزب أو حركة أخرى؟ *</label>
                  <select
                    value={previouslyAffiliated === null ? "" : previouslyAffiliated ? "yes" : "no"}
                    onChange={(e) => setPreviouslyAffiliated(e.target.value === "yes")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">اختر</option>
                    <option value="yes">نعم</option>
                    <option value="no">لا</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">تفاصيل الانتماء السابق (إن وجد)</label>
                  <Input
                    value={previousAffiliationDetails}
                    onChange={(e) => setPreviousAffiliationDetails(e.target.value)}
                    placeholder="اسم الحركة أو طبيعة النشاط"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">المجالات التي ترغب بالمشاركة فيها *</label>
                  <select
                    value={participationAreas}
                    onChange={(e) => setParticipationAreas(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">اختر المجال</option>
                    {participationAreaOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">القضايا التي تهتم بها *</label>
                  <select
                    value={focusIssues}
                    onChange={(e) => setFocusIssues(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">اختر القضية</option>
                    {focusIssueOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h2 className="text-xl font-heading font-bold pt-2">5. المهارات والخبرات</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">المهارات *</label>
                  <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="إعلام، كتابة، تنظيم، تقنية..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">اللغات التي يتقنها *</label>
                  <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="العربية، الإنجليزية..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">الخبرات السابقة (تطوع، عمل سياسي، مجتمعي)</label>
                <Textarea
                  value={previousExperiences}
                  onChange={(e) => setPreviousExperiences(e.target.value)}
                  rows={3}
                  placeholder="اختياري"
                />
              </div>

              <h2 className="text-xl font-heading font-bold pt-2">6. الالتزام والمشاركة</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">القدرة على التطوع (ساعات أسبوعيًا) *</label>
                  <Input value={weeklyVolunteerHours} onChange={(e) => setWeeklyVolunteerHours(e.target.value)} placeholder="مثال: 8 ساعات" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الاستعداد للعمل الميداني *</label>
                  <select
                    value={fieldWorkReady === null ? "" : fieldWorkReady ? "yes" : "no"}
                    onChange={(e) => setFieldWorkReady(e.target.value === "yes")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">اختر</option>
                    <option value="yes">نعم</option>
                    <option value="no">لا</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">إمكانية السفر أو التنقل *</label>
                  <Input
                    value={mobilityTravelAbility}
                    onChange={(e) => setMobilityTravelAbility(e.target.value)}
                    placeholder="متاحة داخل/خارج المحافظة"
                  />
                </div>
              </div>

              <h2 className="text-xl font-heading font-bold pt-2">7. الإقرار والتعهد</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={commitToPrinciples}
                    onChange={(e) => setCommitToPrinciples(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  أتعهد بالالتزام بمبادئ الحركة ونظامها الداخلي
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={infoIsAccurate}
                    onChange={(e) => setInfoIsAccurate(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  أقر بأن المعلومات المقدمة صحيحة وكاملة
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={acceptPrivacyPolicy}
                    onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  أوافق على سياسة الخصوصية ومعالجة البيانات
                </label>
              </div>

              <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                {submitting ? "جاري إرسال الطلب..." : "إرسال طلب الانضمام"}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
