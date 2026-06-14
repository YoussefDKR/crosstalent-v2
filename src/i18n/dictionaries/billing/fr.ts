import type { BillingMessages } from "@/i18n/dictionaries/billing/en";

export const billingFr: BillingMessages = {
  pageTitle: "Tarifs employeurs",
  pageSubtitle:
    "Les candidats rejoignent toujours gratuitement. Les employeurs choisissent une offre quand ils sont prêts à publier.",
  billingDashboard: "Tableau de bord facturation",
  freeToStart: "Gratuit pour commencer",
  oneTimePost: "Paiement unique",
  perMonth: "/ mois",
  perOneTime: " paiement unique",
  currentTier: "Votre offre d'exploration actuelle",
  signupEmployer: "S'inscrire comme employeur",
  mostPopular: "Le plus populaire",
  stripeNotReady: "Ajoutez les clés Stripe dans .env.local pour activer le paiement",
  configureStripeEnv: "Configurez Stripe dans .env.local",
  missingPriceEnv: "Définissez STRIPE_PRICE_{plan}",
  stripeNotConnectedTitle: "Paiements pas encore connectés",
  stripeNotConnectedDesc:
    "CrossTalent fonctionne entièrement pendant votre exploration. Créez un compte Stripe, ajoutez vos clés dans .env.local — les boutons de paiement s'activeront automatiquement.",
  stripeSetupGuideReady: "Guide Stripe (quand vous êtes prêt)",
  finishStripeSetup: "Terminer la configuration Stripe",
  addPriceIds: "Ajoutez les ID de prix :",
  webhookSecretHint:
    "Définissez STRIPE_WEBHOOK_SECRET et lancez le CLI Stripe ou le webhook du tableau de bord",
  setupGuide: "Guide de configuration",
  checkoutRedirecting: "Redirection…",
  checkoutFailed: "Échec du paiement",
  checkoutNetworkError: "Erreur réseau. Réessayez.",
  manageSubscription: "Gérer l'abonnement",
  portalFailed: "Impossible d'ouvrir le portail de facturation",
  portalNetworkError: "Erreur réseau",
  subscriptionStatus: {
    inactive: "Non abonné",
    trialing: "Essai gratuit",
    active: "Actif",
    past_due: "En retard",
    canceled: "Annulé",
    unpaid: "Impayé",
  },
  contactUs: "Contactez-nous",
  needCustom: "Besoin d'une offre sur mesure ?",
  plans: {
    starter: {
      name: "Starter",
      description:
        "Essayez CrossTalent avec une offre en ligne sur le site.",
      features: [
        "Configuration du profil entreprise",
        "1 offre en ligne pendant 10 jours",
        "Recherche candidats pendant l'accès gratuit",
      ],
    },
    growth: {
      name: "Growth",
      description: "Pour les équipes qui recrutent régulièrement au-delà des frontières.",
      cta: "Démarrer Growth",
      features: [
        "3 offres en ligne (30 jours chacune)",
        "Recherche candidats complète",
        "Messagerie illimitée",
        "Profil entreprise sur le site",
        "Support par e-mail",
      ],
    },
    scale: {
      name: "Scale",
      description: "Pour les programmes de recrutement plus importants.",
      cta: "Démarrer Scale",
      features: [
        "10 offres en ligne (30 jours chacune)",
        "Recherche candidats prioritaire",
        "Messagerie illimitée",
        "Onboarding dédié",
        "Support prioritaire",
      ],
    },
    single_post: {
      name: "Offre unique",
      description: "Publiez un poste 30 jours — paiement unique, sans abonnement.",
      cta: "Publier une offre — 79 €",
      features: [
        "1 offre en ligne pendant 30 jours",
        "Visible sur le site CrossTalent",
        "Candidature via votre lien externe",
        "Sans engagement mensuel",
      ],
    },
  },
};
