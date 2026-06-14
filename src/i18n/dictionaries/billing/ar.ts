import type { BillingMessages } from "@/i18n/dictionaries/billing/en";

export const billingAr: BillingMessages = {
  pageTitle: "أسعار أصحاب العمل",
  pageSubtitle:
    "المرشحون ينضمون مجاناً دائماً. يختار أصحاب العمل خطة عند الجاهزية للنشر.",
  billingDashboard: "لوحة الفوترة",
  freeToStart: "ابدأ مجاناً",
  oneTimePost: "دفعة واحدة",
  perMonth: "/ شهر",
  perOneTime: " دفعة واحدة",
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
      description: "جرّب CrossTalent مع وظيفة واحدة على اللوحة.",
      features: [
        "إعداد ملف الشركة",
        "وظيفة واحدة لمدة 10 أيام",
        "بحث المرشحين خلال الوصول المجاني",
      ],
    },
    growth: {
      name: "النمو",
      description: "للفرق التي توظّف بانتظام عبر الحدود.",
      cta: "ابدأ خطة النمو",
      features: [
        "3 وظائف (30 يوماً لكل منها)",
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
        "10 وظائف (30 يوماً لكل منها)",
        "بحث مرشحين بأولوية",
        "رسائل غير محدودة",
        "إعداد مخصص",
        "دعم أولوية",
      ],
    },
    single_post: {
      name: "وظيفة واحدة",
      description: "انشر وظيفة لمدة 30 يوماً — دفعة واحدة دون اشتراك.",
      cta: "انشر وظيفة — 79 يورو",
      features: [
        "وظيفة واحدة لمدة 30 يوماً",
        "ظهور على لوحة CrossTalent",
        "التقديم عبر رابطك الخارجي",
        "بدون التزام شهري",
      ],
    },
  },
};
