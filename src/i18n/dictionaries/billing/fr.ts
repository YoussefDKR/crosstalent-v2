import type { BillingMessages } from "@/i18n/dictionaries/billing/en";

export const billingFr: BillingMessages = {
  pageTitle: "Tarifs employeurs",
  pageSubtitle:
    "Les candidats rejoignent toujours gratuitement. Les employeurs choisissent une offre quand ils sont prêts à publier.",
  billingDashboard: "Tableau de bord facturation",
  freeToStart: "Gratuit pour commencer",
  perMonth: "/ mois",
  currentTier: "Votre offre d'exploration actuelle",
  signupEmployer: "S'inscrire comme employeur",
  mostPopular: "Le plus populaire",
  stripeNotReady: "Ajoutez les clés Stripe dans .env.local pour activer le paiement",
  contactUs: "Contactez-nous",
  needCustom: "Besoin d'une offre sur mesure ?",
  plans: {
    starter: {
      name: "Starter",
      description:
        "Profil entreprise et brouillons d'offres. Essai gratuit pour les outils de recrutement.",
      features: [
        "Configuration du profil entreprise",
        "Brouillons d'offres",
        "Essai 30 jours : 1 offre live + recherche candidats",
      ],
    },
    growth: {
      name: "Growth",
      description: "Pour les équipes qui recrutent régulièrement au-delà des frontières.",
      cta: "Démarrer Growth",
      features: [
        "Jusqu'à 5 offres actives",
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
        "Offres illimitées",
        "Recherche candidats prioritaire",
        "Messagerie illimitée",
        "Onboarding dédié",
        "Support prioritaire",
      ],
    },
  },
};
