import type { PrivacyMessages } from "@/i18n/dictionaries/legal/privacy/en";

export const privacyFr: PrivacyMessages = {
  metaTitle: "Politique de confidentialité",
  metaDescription:
    "Comment CrossTalent collecte, utilise et protège vos données",
  title: "Politique de confidentialité",
  lastUpdatedLabel: "Dernière mise à jour :",
  updatedDate: "5 juin 2026",
  intro:
    "{name} ({url}) met en relation candidats et employeurs en Afrique du Nord et en Europe. Cette politique explique ce que nous collectons et comment nous l'utilisons.",
  questions: "Des questions ?",
  contactUs: "Contactez-nous",
  sections: [
    {
      title: "Qui sommes-nous",
      paragraphs: [
        "CrossTalent est exploité depuis l'Union européenne. Pour toute question relative à la confidentialité, contactez-nous à {email}.",
      ],
    },
    {
      title: "Informations que nous collectons",
      items: [
        {
          label: "Données de compte :",
          text: "nom, e-mail, identifiants de connexion, type de compte et photo de profil si vous en téléversez une.",
        },
        {
          label: "Données de profil :",
          text: "CV, compétences, langues, parcours professionnel, localisation et autres détails que vous choisissez d'ajouter.",
        },
        {
          label: "Données employeur :",
          text: "nom de l'entreprise, logo, offres d'emploi et messages avec d'autres utilisateurs.",
        },
        {
          label: "Données d'utilisation :",
          text: "informations techniques de base telles que l'adresse IP, le type de navigateur et les pages visitées, utilisées pour sécuriser et faire fonctionner le service.",
        },
        {
          label: "Communications :",
          text: "e-mails et messages que vous nous envoyez via nos canaux de contact ou d'assistance.",
        },
      ],
    },
    {
      title: "Comment nous utilisons vos informations",
      list: [
        "Créer et gérer votre compte",
        "Afficher les offres et profils candidats aux bons utilisateurs",
        "Permettre aux employeurs et candidats de s'envoyer des messages",
        "Traiter les candidatures",
        "Gérer les forfaits payants et l'accès au compte",
        "Répondre aux demandes d'assistance et de contact",
        "Améliorer la sécurité et prévenir les abus",
      ],
      paragraphsAfter: ["Nous ne vendons pas vos données personnelles."],
    },
    {
      title: "Services tiers",
      paragraphs: [
        "Nous travaillons avec des prestataires de confiance qui nous aident à exploiter la plateforme. Selon votre utilisation de CrossTalent, vos données peuvent être traitées par des partenaires fournissant :",
      ],
      list: [
        "Hébergement et infrastructure du site",
        "Connexion et authentification des comptes",
        "Traitement sécurisé des paiements",
        "Envoi d'e-mails et de notifications",
        "Stockage de fichiers pour les CV, logos et autres téléversements",
      ],
      paragraphsAfter: [
        "Ces partenaires ne reçoivent que les informations nécessaires à leurs services et sont tenus de les protéger. Ils peuvent avoir leurs propres politiques de confidentialité, que nous vous invitons à consulter.",
      ],
    },
    {
      title: "Qui peut voir vos informations",
      paragraphs: [
        "Les offres et profils d'entreprise que vous publiez peuvent être visibles sur notre job board public. Les informations de profil sont partagées avec d'autres utilisateurs uniquement lorsque cela est nécessaire au fonctionnement de la plateforme — par exemple, lorsque des employeurs consultent des talents ou que des candidats postulent. Les messages privés ne sont visibles que par les personnes concernées.",
      ],
    },
    {
      title: "Durée de conservation",
      paragraphs: [
        "Nous conservons vos données de compte tant que votre compte est actif. Si vous supprimez votre compte ou nous demandez de retirer vos données, nous les supprimerons ou les anonymiserons dans un délai raisonnable, sauf obligation légale ou de facturation.",
      ],
    },
    {
      title: "Vos droits",
      paragraphs: [
        "Selon votre lieu de résidence (y compris dans l'UE/EEE au titre du RGPD), vous pouvez avoir le droit d'accéder, rectifier, supprimer ou exporter vos données, et de vous opposer à certains traitements ou d'en demander la limitation. Pour exercer ces droits, écrivez à {email}.",
        "Vous pouvez également introduire une réclamation auprès de votre autorité locale de protection des données.",
      ],
    },
    {
      title: "Cookies",
      paragraphs: [
        "Nous utilisons des cookies essentiels pour vous maintenir connecté et protéger le service. Nous n'utilisons pas de cookies publicitaires.",
      ],
    },
    {
      title: "Enfants",
      paragraphs: [
        "CrossTalent n'est pas destiné aux utilisateurs de moins de 16 ans. Nous ne collectons pas sciemment de données concernant des enfants.",
      ],
    },
    {
      title: "Modifications",
      paragraphs: [
        "Nous pouvons mettre à jour cette politique de temps à autre. La nouvelle version sera publiée sur cette page avec la date mise à jour ci-dessus.",
      ],
    },
  ],
};
