import type { BillingMessages } from "@/i18n/dictionaries/billing/en";

export const billingAr: BillingMessages = {
  pageTitle: "أسعار أصحاب العمل",
  pageSubtitle:
    "المرشحون ينضمون مجاناً دائماً. يختار أصحاب العمل خطة عند الجاهزية للنشر.",
  billingDashboard: "لوحة الفوترة",
  freeToStart: "ابدأ مجاناً",
  perMonth: "/ شهر",
  currentTier: "خطتك الحالية للاستكشاف",
  signupEmployer: "التسجيل كصاحب عمل",
  mostPopular: "الأكثر شعبية",
  stripeNotReady: "أضف مفاتيح Stripe في .env.local لتفعيل الدفع",
  contactUs: "اتصل بنا",
  needCustom: "تحتاج خطة مخصصة؟",
  plans: {
    starter: {
      name: "Starter",
      description: "ملف الشركة ومسودات الوظائف. تجربة مجانية لأدوات التوظيف.",
      features: [
        "إعداد ملف الشركة",
        "مسودات الوظائف",
        "تجربة 30 يوماً: وظيفة واحدة + بحث المرشحين",
      ],
    },
    growth: {
      name: "Growth",
      description: "للفرق التي توظّف بانتظام عبر الحدود.",
      cta: "ابدأ Growth",
      features: [
        "حتى 5 وظائف نشطة",
        "بحث كامل عن المرشحين",
        "رسائل غير محدودة",
        "ملف الشركة على اللوحة",
        "دعم عبر البريد",
      ],
    },
    scale: {
      name: "Scale",
      description: "لبرامج التوظيف الأكبر.",
      cta: "ابدأ Scale",
      features: [
        "وظائف غير محدودة",
        "بحث مرشحين بأولوية",
        "رسائل غير محدودة",
        "إعداد مخصص",
        "دعم أولوية",
      ],
    },
  },
};
