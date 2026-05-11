export type Language = "en" | "fr";

export const translations = {
  en: {
    common: {
      language: "Language",
      english: "English",
      french: "French",
      login: "Login",
      contactSchool: "Contact School",
      learnMore: "Learn More",
      live: "Live",
      online: "Online",
      send: "Send"
    },
    nav: {
      dashboard: "Dashboard",
      superAdmin: "Super Admin",
      admin: "Admin",
      teacher: "Teacher",
      parent: "Parent",
      timetable: "Timetable",
      messages: "Messages"
    },
    shell: {
      brand: "Enterprise ERP",
      academicYear: "Academic year 2026",
      operations: "School Operations"
    },
    landing: {
      navFeatures: "Features",
      navContact: "Contact",
      eyebrow: "Enterprise academic operations",
      title: "School ERP",
      subtitle:
        "A secure, realtime school management platform for academic monitoring, report cards, preparation cards, smart timetables, messaging, and parent visibility.",
      liveMonitoring: "Live monitoring",
      command: "Super Admin Command",
      teacherExample: "Teacher John Doe",
      teacherStatus: "Online now - Logged in at 07:12 AM - Session duration: 2h14m - Antananarivo",
      statsBimesters: "Bimesters per year",
      statsGrades: "Grade levels",
      statsSubjects: "High-school subjects",
      statsMonitoring: "Monitoring",
      features: [
        ["Secure RBAC", "Centralized permissions for super admins, admins, teachers, and parents."],
        ["Smart Timetables", "Conflict detection for teachers, rooms, classes, and overloads."],
        ["Academic Intelligence", "Validation engine compares preparation cards against real logbooks."],
        ["Realtime Messaging", "Typing, reactions, delivery state, announcements, and voice workflows."]
      ],
      timetablePreview: "Animated timetable preview",
      reportPreview: "Report card preview",
      contactSection: "Contact section",
      contactTitle: "Bring realtime academic operations to your school.",
      contactText: "Request onboarding, platform configuration, teacher training, and data migration support.",
      footer: "School ERP - Secure academic management for modern institutions.",
      subjects: ["Mathematics", "English", "Science", "History"]
    },
    login: {
      eyebrow: "Username authentication",
      title: "Login",
      help: "Use the seeded administrator account to enter the ERP.",
      username: "Username",
      password: "Password",
      submit: "Secure Login",
      failed: "Login failed"
    },
    dashboard: {
      activeUsers: "Active users",
      activeUsersDetail: "Teachers, parents, and admins",
      onlineTeachers: "Online teachers",
      onlineTeachersDetail: "12 currently teaching",
      recentLogins: "Recent logins",
      recentLoginsDetail: "Last 24 hours",
      alerts: "Alerts",
      alertsDetail: "3 need admin review",
      performance: "Academic performance and program completion",
      monitoring: "Realtime monitoring"
    },
    monitoring: {
      teacher: "Teacher",
      now: "now",
      loggedIn: "Logged in at",
      session: "Session duration",
      online: "online",
      idle: "idle",
      offline: "offline"
    },
    admin: {
      cards: ["Announcements", "Report card approval", "Teacher locations", "Suspicious logins", "Class averages", "Student image uploads"],
      detail: "Administrative workflow queue with audit trails, RBAC protection, and realtime status."
    },
    superAdmin: {
      controls: "Platform controls",
      items: ["Create users", "Block accounts", "Reset passwords", "Configure security", "Audit activity"],
      sessions: "Online users and sessions"
    },
    teacher: {
      preparationCards: "Preparation cards",
      fields: ["Lesson title", "Objectives", "Planned activities", "Planned tests", "Bimester progression"],
      validation: "Logbook and AI validation",
      validationText: "The validation engine compares planned lessons with actual teaching records and flags missing, delayed, or inconsistent entries.",
      warning: "3 delayed lessons detected for Bimester 2"
    },
    parent: {
      selector: "Student selector",
      childOne: "Miora Rakoto - Middle School - Grade 8",
      childTwo: "Andry Rakoto - Primary - Grade 4",
      cards: ["Report cards", "Attendance", "Teacher comments", "Messaging", "Announcements", "Academic averages"]
    },
    reportCards: {
      title: "Five-bimester report card",
      headings: ["Subject", "Test", "Exam", "Average", "Coeff", "Weighted", "Mention", "Remark"],
      subjects: ["Mathematics", "English", "Science", "History", "Geography", "Physics", "Chemistry", "Civics", "French", "Computer Science"],
      remark: "Consistent progress"
    },
    timetable: {
      title: "Smart timetable engine",
      available: "Available teachers Monday 10:00-11:00",
      noConflicts: "No conflicts",
      mathRoom: "Math - Room 204",
      free: "Available"
    },
    messaging: {
      conversations: "Conversations",
      chats: ["Admin Office", "Grade 8 Teachers", "Parent Rakoto"],
      firstMessage: "Please review the Bimester 2 progression warnings.",
      secondMessage: "Reviewed. I will update the preparation card today.",
      placeholder: "Type a message"
    }
  },
  fr: {
    common: {
      language: "Langue",
      english: "Anglais",
      french: "Français",
      login: "Connexion",
      contactSchool: "Contacter l'école",
      learnMore: "En savoir plus",
      live: "En direct",
      online: "En ligne",
      send: "Envoyer"
    },
    nav: {
      dashboard: "Tableau de bord",
      superAdmin: "Super Admin",
      admin: "Administration",
      teacher: "Enseignant",
      parent: "Parent",
      timetable: "Emploi du temps",
      messages: "Messages"
    },
    shell: {
      brand: "ERP scolaire",
      academicYear: "Année scolaire 2026",
      operations: "Pilotage scolaire"
    },
    landing: {
      navFeatures: "Fonctionnalités",
      navContact: "Contact",
      eyebrow: "Gestion académique d'entreprise",
      title: "ERP Scolaire",
      subtitle:
        "Une plateforme scolaire sécurisée et temps réel pour le suivi académique, les bulletins, les fiches de préparation, les emplois du temps intelligents, la messagerie et le portail parent.",
      liveMonitoring: "Suivi en temps réel",
      command: "Centre de contrôle Super Admin",
      teacherExample: "Enseignant John Doe",
      teacherStatus: "En ligne - Connexion à 07:12 - Session : 2h14 - Antananarivo",
      statsBimesters: "Bimestres par année",
      statsGrades: "Niveaux scolaires",
      statsSubjects: "Matières au lycée",
      statsMonitoring: "Supervision",
      features: [
        ["RBAC sécurisé", "Permissions centralisées pour super admins, admins, enseignants et parents."],
        ["Emploi du temps intelligent", "Détection des conflits enseignants, salles, classes et surcharges."],
        ["Intelligence académique", "Le moteur compare les fiches de préparation avec les cahiers de texte."],
        ["Messagerie temps réel", "Saisie en direct, réactions, statuts, annonces et workflows vocaux."]
      ],
      timetablePreview: "Aperçu animé de l'emploi du temps",
      reportPreview: "Aperçu du bulletin",
      contactSection: "Contact",
      contactTitle: "Pilotez votre établissement en temps réel.",
      contactText: "Demandez l'accompagnement, la configuration, la formation des enseignants et la migration des données.",
      footer: "ERP Scolaire - Gestion académique sécurisée pour établissements modernes.",
      subjects: ["Mathématiques", "Anglais", "Sciences", "Histoire"]
    },
    login: {
      eyebrow: "Authentification par identifiant",
      title: "Connexion",
      help: "Utilisez le compte administrateur initial pour entrer dans l'ERP.",
      username: "Identifiant",
      password: "Mot de passe",
      submit: "Connexion sécurisée",
      failed: "Échec de connexion"
    },
    dashboard: {
      activeUsers: "Utilisateurs actifs",
      activeUsersDetail: "Enseignants, parents et admins",
      onlineTeachers: "Enseignants en ligne",
      onlineTeachersDetail: "12 en cours actuellement",
      recentLogins: "Connexions récentes",
      recentLoginsDetail: "Dernières 24 heures",
      alerts: "Alertes",
      alertsDetail: "3 à vérifier par l'administration",
      performance: "Performance académique et progression du programme",
      monitoring: "Suivi temps réel"
    },
    monitoring: {
      teacher: "Enseignant",
      now: "maintenant",
      loggedIn: "Connecté à",
      session: "Durée de session",
      online: "en ligne",
      idle: "inactif",
      offline: "hors ligne"
    },
    admin: {
      cards: ["Annonces", "Validation des bulletins", "Localisation des enseignants", "Connexions suspectes", "Moyennes de classe", "Images des élèves"],
      detail: "File de travail administrative avec audit, RBAC et statut temps réel."
    },
    superAdmin: {
      controls: "Contrôles plateforme",
      items: ["Créer des utilisateurs", "Bloquer des comptes", "Réinitialiser les mots de passe", "Configurer la sécurité", "Auditer l'activité"],
      sessions: "Utilisateurs et sessions en ligne"
    },
    teacher: {
      preparationCards: "Fiches de préparation",
      fields: ["Titre de la leçon", "Objectifs", "Activités prévues", "Évaluations prévues", "Progression du bimèstre"],
      validation: "Cahier de texte et validation IA",
      validationText: "Le moteur compare les leçons prévues avec les cours réellement saisis et signale les absences, retards ou incohérences.",
      warning: "3 leçons en retard détectées pour le Bimèstre 2"
    },
    parent: {
      selector: "Sélection de l'élève",
      childOne: "Miora Rakoto - Collège - 8e",
      childTwo: "Andry Rakoto - Primaire - 4e",
      cards: ["Bulletins", "Présence", "Commentaires enseignants", "Messagerie", "Annonces", "Moyennes académiques"]
    },
    reportCards: {
      title: "Bulletin à cinq bimèstres",
      headings: ["Matière", "Contrôle", "Examen", "Moyenne", "Coeff", "Pondéré", "Mention", "Remarque"],
      subjects: ["Mathématiques", "Anglais", "Sciences", "Histoire", "Géographie", "Physique", "Chimie", "Éducation civique", "Français", "Informatique"],
      remark: "Progression régulière"
    },
    timetable: {
      title: "Moteur d'emploi du temps intelligent",
      available: "Enseignants disponibles lundi 10:00-11:00",
      noConflicts: "Aucun conflit",
      mathRoom: "Maths - Salle 204",
      free: "Disponible"
    },
    messaging: {
      conversations: "Conversations",
      chats: ["Bureau administratif", "Enseignants 8e", "Parent Rakoto"],
      firstMessage: "Veuillez vérifier les alertes de progression du Bimèstre 2.",
      secondMessage: "Vu. Je mettrai à jour la fiche de préparation aujourd'hui.",
      placeholder: "Écrire un message"
    }
  }
} as const;

export type Translation = typeof translations.en;

