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
  configureStripeEnv: "اضبط Stripe في .env.local",
  missingPriceEnv: "عيّن STRIPE_PRICE_{plan}",
  stripeNotConnectedTitle: "المدفوعات غير متصلة بعد",
  stripeNotConnectedDesc:
    "يعمل CrossTalent بالكامل أثناء الاستكشاف. عند إنشاء حساب Stripe، أضف مفاتيحك في .env.local — ستُفعَّل أزرار الدفع تلقائياً.",
  stripeSetupGuideReady: "دليل إعداد Stripe (عندما تكون جاهزاً)",
  finishStripeSetup: "أكمل إعداد Stripe",
  addPriceIds: "أضف معرّفات الأسعار:",
  webhookSecretHint:
    "عيّن STRIPE_WEBHOOK_SECRET وشغّل Stripe CLI أو webhook من لوحة Stripe",
  setupGuide: "دليل الإعداد",
  checkoutRedirecting: "جارٍ التحويل…",
  checkoutFailed: "فشل الدفع",
  checkoutNetworkError: "خطأ في الشبكة. حاول مرة أخرى.",
  manageSubscription: "إدارة الاشتراك",
  portalFailed: "تعذر فتح بوابة الفوترة",
  portalNetworkError: "خطأ في الشبكة",
  subscriptionStatus: {
    inactive: "غير مشترك",
    trialing: "تجربة مجانية",
    active: "نشط",
    past_due: "متأخر السداد",
    canceled: "ملغى",
    unpaid: "غير مدفوع",
  },
  contactUs: "اتصل بنا",
  needCustom: "تحتاج خطة مخصصة؟",
  plans: {
    starter: {
      name: "البداية",
      description: "ملف الشركة ومسودات الوظائف. تجربة مجانية لأدوات التوظيف.",
      features: [
        "إعداد ملف الشركة",
        "مسودات الوظائف",
        "تجربة 30 يوماً: وظيفة واحدة + بحث المرشحين",
      ],
    },
    growth: {
      name: "النمو",
      description: "للفرق التي توظّف بانتظام عبر الحدود.",
      cta: "ابدأ خطة النمو",
      features: [
        "حتى 5 وظائف نشطة",
        "بحث كامل عن المرشحين",
        "رسائل غير محدودة",
        "ملف الشركة على اللوحة",
        "دعم عبر البريد",
      ],
    },
    scale: {
      name: "التوسع",
      description: "لبرامج التوظيف الأكبر.",
      cta: "ابدأ خطة التوسع",
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
