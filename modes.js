// ============================================================
// MODES.JS — Data file for Mode Switch dashboard
// All data as plain globals (no ES modules)
// Required fields per mode:
//   id, name, shortName, color, colorVar, energyLevel, intent,
//   objective, when, immediateAction, blocks[], interdictionsShort,
//   validationShort, planning[], core[], criticalRules[],
//   interdictions[], classicError, validation, exitSignal,
//   startChecklist[], endChecklist[], nextModes[], transitionNote
// ============================================================

const MODES = {

  // ----------------------------------------------------------
  // MODE NORMAL
  // ----------------------------------------------------------
  normal: {
    id: 'normal',
    name: 'MODE NORMAL',
    shortName: 'Normal',
    color: '#4a9eff',
    colorVar: '--mode-normal',
    energyLevel: 'HAUTE',
    intent: 'Performance maximale et progression réelle',
    objective: 'Exécuter les 2 blocs profonds. Méditer. Bouger. Réciter. Dormir à l\'heure.',
    when: 'Journée standard sans garde ni récupération. Contexte normal, système intact.',

    immediateAction: 'Réveil 05:30 — debout, 50 pompes, douche, méditation. Pas d\'écran.',

    blocks: [
      { id: 'matin',   label: 'MATIN',         anchor: '05:30', desc: 'Routine complète — physique · hygiène · méditation · petit-déjeuner · bloc 1 médecine' },
      { id: 'journee', label: 'JOURNÉE',        anchor: null,    desc: 'Vie réelle + obligations — bloc 2 médecine intégré dans les plages libres' },
      { id: 'fin',     label: 'FIN DE JOURNÉE', anchor: null,    desc: 'Sport · hygiène · repas du soir' },
      { id: 'soir',    label: 'SOIR',           anchor: '21:30', desc: 'Récitation · wind down · sommeil 21:30' },
    ],

    interdictionsShort: 'Scroll · multitâche · contenu long',
    validationShort: 'Bloc 1 + sport + sommeil',

    planning: [
      { time: '05:30',       action: 'Réveil',                                        type: 'anchor'   },
      { time: '05:30–05:45', action: '50 pompes + 50 abdos',                         type: 'physical' },
      { time: '05:45–06:06', action: 'Méditation (21 min)',                           type: 'core'     },
      { time: '06:10–07:00', action: 'Deep work — bloc 1 (médecine)',                type: 'deep'     },
      { time: '07:00–07:15', action: 'Extraction contenu médical (15 min MAX)',       type: 'content'  },
      { time: '07:15–08:00', action: 'Petit-déjeuner + transition',                  type: 'anchor'   },
      { time: '14:30–16:00', action: 'Deep work — bloc 2 (médecine)',                type: 'deep'     },
      { time: '16:15–17:15', action: 'Sport',                                         type: 'physical' },
      { time: '18:00–18:20', action: 'Récitation cas cliniques',                      type: 'core'     },
      { time: '20:30',       action: 'Début wind-down',                               type: 'anchor'   },
      { time: '21:30',       action: 'Sommeil',                                       type: 'anchor'   },
    ],

    core: [
      'Méditation 21 min',
      '2 blocs d\'étude profonde (médecine)',
      'Sport 60 min',
      'Récitation cas cliniques',
      'Sommeil à 21h30',
    ],

    criticalRules: [
      'Contenu ≤ 15 min — pas une minute de plus',
      'Aucune consommation algorithmique (scroll passif interdit)',
      'La médecine passe avant le contenu en toutes circonstances',
      'Les 2 blocs profonds sont non-négociables',
    ],

    interdictions: [
      'Scroll passif sur réseau social',
      'Multi-écran pendant l\'étude',
      'Multitâche cognitif',
      'Transformer l\'extraction en création longue',
      'Regarder les stats contenu pendant la journée',
      'Commencer une tâche contenu sans timer posé',
    ],

    classicError: 'Transformer les 15 min d\'extraction contenu en session de création de 2h. Le contenu prend le dessus sur la médecine.',

    validation: '1 bloc profond + méditation + sport + sommeil correct = journée validée.',

    exitSignal: 'Heure de coucher atteinte. Planning respecté. Noyau exécuté.',

    startChecklist: [
      'Reset environnement fait',
      'Timer prêt pour le premier bloc',
      'Téléphone hors de portée ou en mode avion',
      'Intention du bloc notée (1 phrase)',
      'Onglets inutiles fermés',
      'Eau posée sur le bureau',
    ],

    endChecklist: [
      'Bilan rapide : noyau respecté ?',
      'Prochain mode identifié pour demain',
      'Logistique lendemain préparée (affaires, repas)',
      'Heure de coucher respectée',
      'Aucun écran après 21h00',
    ],

    nextModes: ['stage', 'pregarde'],
    transitionNote: 'Si garde demain → passe en mode PRÉ-GARDE dès aujourd\'hui après-midi.',
  },

  // ----------------------------------------------------------
  // MODE STAGE
  // ----------------------------------------------------------
  stage: {
    id: 'stage',
    name: 'MODE STAGE',
    shortName: 'Stage',
    color: '#8888aa',
    colorVar: '--mode-stage',
    energyLevel: 'MODÉRÉE',
    intent: 'Présence totale au stage, étude maintenue en marge',
    objective: 'Être pleinement présent au stage. Maintenir 1 bloc d\'étude le soir ou le matin. Ne pas s\'effondrer.',
    when: 'Journée de stage hospitalier ou terrain. Présence physique et cognitive requise en externat.',

    immediateAction: 'Réveil 05:30 — routine matin · révision rapide · départ stage à l\'heure.',

    blocks: [
      { id: 'matin',   label: 'MATIN',         anchor: '05:30', desc: 'Routine + bloc court révision — physique · hygiène · méditation · départ' },
      { id: 'journee', label: 'JOURNÉE',        anchor: null,    desc: 'Stage — présence totale, observation active, pas de téléphone pendant les soins' },
      { id: 'fin',     label: 'FIN DE JOURNÉE', anchor: null,    desc: 'Hygiène · repas · bloc étude 45 min minimum' },
      { id: 'soir',    label: 'SOIR',           anchor: '21:30', desc: 'Récitation · wind down · sommeil 21:30' },
    ],

    interdictionsShort: 'Passivité après stage · scroll',
    validationShort: 'Présence stage + 1 bloc + sommeil',

    planning: [
      { time: '05:30',       action: 'Réveil',                                                        type: 'anchor'   },
      { time: '05:30–05:45', action: 'Mobilisation physique légère (pompes, étirements)',             type: 'physical' },
      { time: '05:45–06:06', action: 'Méditation (si possible, 10 min minimum)',                      type: 'core'     },
      { time: '06:10–06:45', action: 'Révision rapide cas du jour / fiche synthèse',                 type: 'deep'     },
      { time: '07:00',       action: 'Départ stage',                                                  type: 'anchor'   },
      { time: '08:00–17:00', action: 'Stage — présence totale, observation active',                   type: 'deep'     },
      { time: '17:30–18:00', action: 'Décompression + transition',                                    type: 'anchor'   },
      { time: '18:00–19:00', action: 'Bloc étude médecine (1 seul, concentré)',                       type: 'deep'     },
      { time: '19:15–19:30', action: 'Récitation / révision active',                                  type: 'core'     },
      { time: '21:00',       action: 'Wind-down, pas d\'écrans',                                      type: 'anchor'   },
      { time: '21:30',       action: 'Sommeil',                                                       type: 'anchor'   },
    ],

    core: [
      'Présence totale au stage (pas de demi-présence)',
      '1 bloc d\'étude médecine (minimum 45 min)',
      'Méditation (même 10 min)',
      'Sommeil à l\'heure',
    ],

    criticalRules: [
      'Le stage EST l\'étude — observation active, pas passive',
      'Ne pas utiliser le téléphone pendant les soins ou les visites',
      '1 bloc d\'étude le soir même si fatigué — 45 min minimum',
      'Pas de session contenu les jours de stage',
    ],

    interdictions: [
      'Téléphone pendant les moments de soin',
      'Session contenu le soir après stage',
      'Commencer un deuxième bloc si épuisé',
      'Sacrifier le sommeil pour l\'étude',
      'Scroll après 20h30',
    ],

    classicError: 'Rentrer du stage épuisé et passer 2h sur le téléphone avant de se coucher. Zéro récupération, zéro étude.',

    validation: 'Stage effectué avec présence + 1 bloc étude + sommeil = journée validée.',

    exitSignal: 'Retour du stage, bloc étude effectué, couché à l\'heure.',

    startChecklist: [
      'Affaires de stage préparées la veille',
      'Fiche ou cas du jour relu (5 min)',
      'Téléphone en mode silencieux pour le stage',
      'Bloc étude du soir planifié (heure notée)',
      'Repas préparé ou prévu',
    ],

    endChecklist: [
      'Bilan du stage : qu\'ai-je observé/appris ?',
      'Bloc étude fait ?',
      'Couché à l\'heure',
      'Mode de demain identifié',
    ],

    nextModes: ['normal', 'pregarde', 'recovery'],
    transitionNote: 'Si lendemain garde → mode PRÉ-GARDE. Si lendemain repos → mode RECOVERY léger.',
  },

  // ----------------------------------------------------------
  // MODE PRÉ-GARDE
  // ----------------------------------------------------------
  pregarde: {
    id: 'pregarde',
    name: 'MODE PRÉ-GARDE',
    shortName: 'Pré-Garde',
    color: '#ffaa33',
    colorVar: '--mode-pregarde',
    energyLevel: 'ANTICIPATION',
    intent: 'Maximiser les réserves avant la garde. Préparer le corps et l\'esprit.',
    objective: 'Dormir tôt. Manger correctement. Réduire la charge cognitive. Se préparer sans s\'épuiser.',
    when: 'Veille de garde. La garde commence demain matin ou dans la nuit.',

    immediateAction: 'Préparation système — routine légère · bloc unique d\'étude ciblée urgences.',

    blocks: [
      { id: 'matin',   label: 'MATIN',          anchor: null,    desc: 'Routine légère · bloc unique étude urgences · petit-déjeuner complet' },
      { id: 'journee', label: 'JOURNÉE',         anchor: null,    desc: 'Logistique garde · repas nourrissant · hygiène · tâches légères uniquement' },
      { id: 'central', label: 'SIESTE',          anchor: '12:30', desc: 'Sieste obligatoire — 60 à 90 min. Non-négociable.' },
      { id: 'fin',     label: 'FIN DE JOURNÉE',  anchor: '16:00', desc: 'Préparation sac de garde · repas du soir complet' },
      { id: 'soir',    label: 'SOIR',            anchor: '20:30', desc: 'Wind down total · aucun écran stimulant · sommeil anticipé 20:30' },
    ],

    interdictionsShort: 'Effort intense · écran · stimulation',
    validationShort: 'Sieste + préparation + sommeil anticipé',

    planning: [
      { time: '05:30',       action: 'Réveil (si possible, ne pas forcer)',                        type: 'anchor'   },
      { time: '05:30–05:45', action: 'Mobilisation légère — pas d\'effort intense',               type: 'physical' },
      { time: '05:45–06:06', action: 'Méditation — focus sur la préparation mentale',             type: 'core'     },
      { time: '06:15–07:30', action: 'Seul bloc d\'étude de la journée (médecine urgences)',      type: 'deep'     },
      { time: '07:30–08:00', action: 'Petit-déjeuner complet et calme',                           type: 'anchor'   },
      { time: '08:00–12:00', action: 'Tâches légères, organisation, logistique garde',            type: 'content'  },
      { time: '12:00–12:30', action: 'Repas nourrissant',                                         type: 'anchor'   },
      { time: '12:30–14:00', action: 'Sieste ou repos horizontal (non-négociable)',               type: 'core'     },
      { time: '14:00–16:00', action: 'Activité légère ou révision passive',                       type: 'content'  },
      { time: '16:00',       action: 'Préparation sac de garde',                                  type: 'anchor'   },
      { time: '19:00',       action: 'Repas du soir — complet, pas d\'alcool',                    type: 'anchor'   },
      { time: '20:00',       action: 'Wind-down total. Aucun écran stimulant.',                   type: 'anchor'   },
      { time: '20:30',       action: 'Sommeil (coucher anticipé)',                                type: 'anchor'   },
    ],

    core: [
      'Sieste ou repos post-déjeuner (obligatoire)',
      '1 seul bloc d\'étude le matin',
      'Repas complets et nourrissants',
      'Coucher anticipé (20h30–21h00)',
      'Préparation matérielle de la garde',
    ],

    criticalRules: [
      'Pas d\'effort physique intense la veille de garde',
      'La sieste est non-négociable — c\'est de la préparation, pas de la paresse',
      'Coucher avant 21h00 — sans exception',
      'Aucun contenu créatif ou cognitif lourd après 14h',
    ],

    interdictions: [
      'Sport intense',
      'Deuxième bloc d\'étude l\'après-midi',
      'Session contenu',
      'Alcool ou caféine après 14h',
      'Film/série stimulant le soir',
      'Planification complexe',
    ],

    classicError: 'Essayer d\'être "productif" la veille de garde et arriver épuisé. La garde est un marathon, pas un sprint.',

    validation: 'Sieste faite + coucher avant 21h + sac préparé = journée pré-garde validée.',

    exitSignal: 'Couché avant 21h. Corps reposé. Matériel prêt. Mental stabilisé.',

    startChecklist: [
      'Confirmer l\'heure de début de garde',
      'Liste de révision urgences consultée',
      'Repas du jour planifiés (nourrissants)',
      'Sieste bloquée dans le planning',
      'Téléphone en mode "ne pas déranger" après 20h',
    ],

    endChecklist: [
      'Sac de garde prêt et complet',
      'Repas de garde prévu ou préparé',
      'Sieste effectuée',
      'Couché à l\'heure cible',
    ],

    nextModes: ['garde'],
    transitionNote: 'Demain = GARDE. Tout est préparé. Le repos EST la performance.',
  },

  // ----------------------------------------------------------
  // MODE GARDE
  // ----------------------------------------------------------
  garde: {
    id: 'garde',
    name: 'MODE GARDE',
    shortName: 'Garde',
    color: '#ff4444',
    colorVar: '--mode-garde',
    energyLevel: 'SURVIE',
    intent: 'Tenir. Rester compétent. Ne pas s\'effondrer. Rentrer entier.',
    objective: 'Assurer la garde avec compétence et calme. Utiliser les temps morts pour réviser. Rentrer et se coucher.',
    when: 'Journée ou nuit de garde aux urgences ou en service. Mode opérationnel extrême.',

    immediateAction: 'Prise de poste — briefing · identification priorités · repas si pas fait.',

    blocks: [
      { id: 'continu',  label: 'EN CONTINU',   anchor: null, desc: 'Soins · décisions cliniques · transmission propre' },
      { id: 'opportun', label: 'TEMPS MORT',   anchor: null, desc: 'Micro-sieste dès possible — fermer les yeux. Pas d\'écran.' },
      { id: 'physio',   label: 'PHYSIOLOGIQUE', anchor: null, desc: 'Manger même sans faim · boire · uriner · hygiène minimale' },
      { id: 'retour',   label: 'RETOUR',        anchor: null, desc: 'Transmission soignée · rentrer direct · hygiène · sommeil immédiat' },
    ],

    interdictionsShort: 'Deep work · contenu · sport',
    validationShort: 'Garde tenue + sommeil',

    planning: [
      { time: 'Début garde',            action: 'Briefing, prise de poste, identification priorités',     type: 'anchor'  },
      { time: 'En continu',             action: 'Soins, observations, décisions cliniques',               type: 'deep'    },
      { time: 'Temps mort (< 30 min)',  action: 'Fermer les yeux / micro-sieste assise',                  type: 'core'    },
      { time: 'Temps mort (30–60 min)', action: 'Révision active 1 cas clinique',                         type: 'content' },
      { time: 'Repas garde',            action: 'Manger même si pas faim — protéines prioritaires',       type: 'anchor'  },
      { time: 'Fin garde',              action: 'Transmission soignée, pas de bâclage',                   type: 'anchor'  },
      { time: 'Retour',                 action: 'Transport direct. Pas d\'arrêt inutile.',                type: 'anchor'  },
      { time: 'Arrivée domicile',       action: 'Repas léger si besoin. Douche. Sommeil immédiat.',       type: 'anchor'  },
    ],

    core: [
      'Compétence clinique maximale pendant la garde',
      'Manger même sans appétit (énergie)',
      'Micro-siestes dans les temps morts',
      'Transmission propre en fin de garde',
      'Sommeil immédiat au retour',
    ],

    criticalRules: [
      'Ne jamais refuser de manger pendant la garde — performance directe',
      'Micro-sieste dès que possible (même 10 min)',
      'Zéro scroll pendant les temps morts — repos ou révision uniquement',
      'Rentrer directement au domicile après la garde',
      'Aucune décision importante dans les 12h post-garde',
    ],

    interdictions: [
      'Scroll ou réseaux sociaux pendant les temps morts',
      'Sauter les repas',
      'Prendre des engagements post-garde pendant la garde',
      'Conduire si plus de 24h sans sommeil',
      'Session d\'étude intensive au retour',
      'Alcool dans les 24h post-garde',
    ],

    classicError: 'Utiliser les temps morts pour scroller au lieu de dormir. Arriver en fin de garde complètement vidé alors que des siestes étaient possibles.',

    validation: 'Garde assurée avec compétence + sommeil dès le retour = mission accomplie.',

    exitSignal: 'Transmission faite. Retour à domicile. Sommeil de récupération engagé.',

    startChecklist: [
      'Repas consistant avant prise de poste',
      'Caféine si nécessaire (pas excessive)',
      'Médicaments / matériel personnel ok',
      'Téléphone chargé',
      'Mental : mode "opérationnel" — pas "performatif"',
    ],

    endChecklist: [
      'Transmission faite correctement',
      'Rentré directement',
      'Repas léger si besoin',
      'Douche',
      'Sommeil immédiat — minimum 8–9h',
    ],

    nextModes: ['recovery'],
    transitionNote: 'Après toute garde → mode RECOVERY obligatoire. Pas de négociation.',
  },

  // ----------------------------------------------------------
  // MODE RECOVERY
  // ----------------------------------------------------------
  recovery: {
    id: 'recovery',
    name: 'MODE RECOVERY',
    shortName: 'Recovery',
    color: '#44bb88',
    colorVar: '--mode-recovery',
    energyLevel: 'RESTAURATION',
    intent: 'Récupération structurée. Pas de repos passif — récupération active et intentionnelle.',
    objective: 'Dormir autant que nécessaire. Manger proprement. Bouger doucement. Ne rien forcer.',
    when: 'Post-garde (24–48h après), post-surmenage, ou après une séquence intense. Corps et esprit à restaurer.',

    immediateAction: 'Nourrir le corps — hydrater · manger · pas d\'alarme.',

    blocks: [
      { id: 'matin',  label: 'MATIN',        anchor: null,    desc: 'Réveil naturel · hygiène · petit-déjeuner complet · méditation courte' },
      { id: 'journee', label: 'JOURNÉE',     anchor: null,    desc: 'Marche 20–30 min · repos · sieste si besoin' },
      { id: 'leger',  label: 'TÂCHES LÉGÈRES', anchor: null,  desc: 'Lecture passive ou 1 tâche simple uniquement — pas d\'étude intensive' },
      { id: 'fin',    label: 'SOIR',         anchor: '21:00', desc: 'Repas · hygiène · wind down · sommeil 21:00' },
    ],

    interdictionsShort: 'Deep work · culpabilité',
    validationShort: 'Sommeil + marche + alimentation',

    planning: [
      { time: 'Matin',       action: 'Réveil naturel — aucune alarme',                                       type: 'anchor'  },
      { time: 'Matin',       action: 'Petit-déjeuner complet, protéines, hydratation',                      type: 'anchor'  },
      { time: 'Matin',       action: 'Méditation courte (10 min)',                                           type: 'core'    },
      { time: 'Matin–Midi',  action: 'Marche légère 20–30 min (non-négociable)',                             type: 'physical'},
      { time: 'Après-midi',  action: 'Sieste si besoin',                                                     type: 'core'    },
      { time: 'Après-midi',  action: 'Révision passive : relire des fiches, pas de nouveau contenu',         type: 'content' },
      { time: 'Après-midi',  action: '1 tâche administrative légère si nécessaire',                          type: 'content' },
      { time: 'Soir',        action: 'Repas nourrissant et calme',                                           type: 'anchor'  },
      { time: '20:30',       action: 'Wind-down',                                                            type: 'anchor'  },
      { time: '21:00',       action: 'Sommeil — retour au rythme normal',                                    type: 'anchor'  },
    ],

    core: [
      'Sommeil autant que nécessaire (pas d\'alarme)',
      'Marche légère (20–30 min minimum)',
      'Alimentation propre et complète',
      'Méditation même courte',
      'Zéro pression de performance',
    ],

    criticalRules: [
      'PAS de deep work ni de blocs d\'étude intensifs',
      'PAS de décision importante — le cerveau est encore en récupération',
      'La marche n\'est pas optionnelle — même par mauvais temps',
      'Le repos EST le travail aujourd\'hui',
    ],

    interdictions: [
      'Blocs d\'étude intensifs',
      'Session contenu (création ou consommation longue)',
      'Activité physique intense',
      'Prendre des engagements nouveaux',
      'Culpabiliser de ne pas "produire"',
      'Réunions ou interactions sociales drainantes',
    ],

    classicError: 'Culpabiliser de ne pas travailler et rompre la récupération avec une session d\'étude intense. Résultat : récupération incomplète + pas de performance non plus.',

    validation: 'Sommeil suffisant + marche + repas corrects + aucune culpabilité = recovery réussi.',

    exitSignal: 'Corps et esprit sentent la stabilité revenue. Énergie de base restaurée. Prêt pour le mode Normal.',

    startChecklist: [
      'Aucune alarme posée (ou alarme tardive)',
      'Repas de recovery planifié (nourrissant)',
      'Marche inscrite dans la journée',
      'Objectif du jour : récupérer, pas performer',
      'Notifications désactivées',
    ],

    endChecklist: [
      'Marche effectuée',
      'Sommeil suffisant (8h+)',
      'Alimentation correcte',
      'Mode de demain décidé',
      'Retour au rythme : coucher à 21h30',
    ],

    nextModes: ['normal', 'off'],
    transitionNote: 'Recovery complet → retour en mode NORMAL. Si encore fragile → mode OFF.',
  },

  // ----------------------------------------------------------
  // MODE OFF
  // ----------------------------------------------------------
  off: {
    id: 'off',
    name: 'MODE OFF',
    shortName: 'Off',
    color: '#66aacc',
    colorVar: '--mode-off',
    energyLevel: 'LIBRE',
    intent: 'Jour intentionnellement libéré. Pas de performance, pas de culpabilité.',
    objective: 'Être présent. Faire ce qui ressource réellement. Maintenir le noyau biologique minimal.',
    when: 'Jour de repos délibéré, week-end libre, jour férié. Décidé consciemment, pas subi.',

    immediateAction: 'Calme + respiration — pas d\'alarme, pas d\'écran dans les 10 premières minutes.',

    blocks: [
      { id: 'matin',   label: 'MATIN',    anchor: null,    desc: 'Hygiène · petit-déjeuner lent · méditation même courte' },
      { id: 'journee', label: 'JOURNÉE',  anchor: null,    desc: 'Activité libre réelle choisie · mouvement physique agréable' },
      { id: 'social',  label: 'SOCIAL',   anchor: null,    desc: 'Interaction si désirée — famille, amis, sortie' },
      { id: 'fin',     label: 'SOIR',     anchor: '21:30', desc: 'Repas · hygiène · sommeil ancré 21:30' },
    ],

    interdictionsShort: 'Binge numérique · dérive',
    validationShort: 'Récupération réelle + sommeil maintenu',

    planning: [
      { time: 'Matin',   action: 'Réveil naturel ou légèrement plus tard',                             type: 'anchor'  },
      { time: 'Matin',   action: 'Méditation (même 5–10 min)',                                         type: 'core'    },
      { time: 'Matin',   action: 'Petit-déjeuner sans précipitation',                                  type: 'anchor'  },
      { time: 'Journée', action: 'Activité choisie librement (lecture, sport, nature, famille)',        type: 'content' },
      { time: 'Journée', action: 'Mouvement physique agréable (marche, vélo, sport plaisir)',          type: 'physical'},
      { time: 'Journée', action: 'Moment de connexion sociale si désiré',                              type: 'content' },
      { time: 'Soir',    action: 'Bonne nuit de sommeil — retour au rythme',                           type: 'anchor'  },
      { time: '21:30',   action: 'Sommeil (maintenir l\'ancre)',                                        type: 'anchor'  },
    ],

    core: [
      'Méditation minimale (même 5 min)',
      'Mouvement physique agréable',
      'Maintenir heure de coucher',
      'Aucune culpabilité',
    ],

    criticalRules: [
      'Le mode OFF doit être choisi, pas subi — si c\'est subi, c\'est le mode RECOVERY',
      'L\'ancre de sommeil reste : coucher au plus tard à 22h',
      'Pas de décision de "travailler quand même" à mi-journée — tenir l\'intention',
      'Pas de consommation algorithmique passive comme "repos"',
    ],

    interdictions: [
      'Scroll passif comme activité principale',
      'Culpabilité de ne pas étudier',
      'Travailler "juste un peu" sans intention',
      'Coucher après 22h30',
      'Consommation de contenu sur le travail ou la médecine',
    ],

    classicError: 'Passer le jour OFF à scroller passivement en se disant que c\'est du repos. Ce n\'est pas du repos — c\'est de la dérive.',

    validation: 'Journée passée à faire quelque chose de réellement ressourçant + ancre de sommeil maintenue = mode OFF réussi.',

    exitSignal: 'Journée passée intentionnellement. Énergie de base maintenue. Retour au rythme demain.',

    startChecklist: [
      'Mode OFF décidé consciemment (pas par défaut)',
      'Activité ressourçante identifiée',
      'Travail et médecine hors de portée',
      'Heure de coucher gardée en tête',
    ],

    endChecklist: [
      'Journée passée intentionnellement ?',
      'Méditation faite ?',
      'Mouvement fait ?',
      'Heure de coucher respectée',
      'Mode de demain décidé',
    ],

    nextModes: ['normal', 'recovery'],
    transitionNote: 'Après le OFF → retour en mode NORMAL ou RECOVERY si encore besoin.',
  },

  // ----------------------------------------------------------
  // MODE REPRISE
  // ----------------------------------------------------------
  reprise: {
    id: 'reprise',
    name: 'MODE REPRISE',
    shortName: 'Reprise',
    color: '#ff8844',
    colorVar: '--mode-reprise',
    energyLevel: 'RELANCE',
    intent: 'Reprendre le système après une interruption. Pas de rattrapage — réinitialisation propre.',
    objective: 'Réenclencher les automatismes. Méditer. Faire 1 bloc d\'étude. Ne pas essayer de rattraper.',
    when: 'Après 48h+ de chaos, disruption, voyage, maladie, ou dérive. Retour au système.',

    immediateAction: 'Réveil 05:30 — reset environnement physique. Bureau. Téléphone hors de portée.',

    blocks: [
      { id: 'matin',   label: 'MATIN',         anchor: '05:30', desc: 'Routine + 1 bloc unique d\'étude — méditation en premier, pas d\'excuses' },
      { id: 'journee', label: 'JOURNÉE',        anchor: null,    desc: 'Tâches normales sans surcharge — pas de rattrapage' },
      { id: 'fin',     label: 'FIN DE JOURNÉE', anchor: null,    desc: 'Sport léger · hygiène · repas' },
      { id: 'soir',    label: 'SOIR',           anchor: '21:30', desc: 'Récitation optionnelle · sommeil ancré 21:30' },
    ],

    interdictionsShort: 'Rattrapage · surcharge',
    validationShort: 'Bloc 1 + ancre sommeil',

    planning: [
      { time: '05:30',       action: 'Réveil — remettre l\'ancre temporelle',                          type: 'anchor'   },
      { time: '05:30–05:45', action: 'Mobilisation physique légère',                                   type: 'physical' },
      { time: '05:45–06:06', action: 'Méditation — sans jugement sur l\'interruption',                 type: 'core'     },
      { time: '06:10–07:00', action: '1 seul bloc d\'étude — matière prioritaire',                    type: 'deep'     },
      { time: '07:00–07:15', action: 'Bilan rapide : qu\'est-ce qui a dérivé ?',                      type: 'content'  },
      { time: 'Journée',     action: 'Tâches normales, sans surcompensation',                         type: 'content'  },
      { time: '16:00–17:00', action: 'Sport (si énergie disponible)',                                  type: 'physical' },
      { time: '18:00',       action: 'Récitation si possible',                                        type: 'core'     },
      { time: '21:30',       action: 'Sommeil — remettre l\'ancre',                                   type: 'anchor'   },
    ],

    core: [
      'Méditation (sans culpabilité)',
      '1 seul bloc d\'étude (pas de rattrapage)',
      'Ancres temporelles remises en place',
      'Bilan de la dérive (5 min, pas plus)',
      'Coucher à l\'heure',
    ],

    criticalRules: [
      'PAS de session de rattrapage — cela empire la situation',
      'PAS de jugement ni de culpabilité — juste la réinitialisation',
      '1 seul bloc d\'étude aujourd\'hui, même si tu "pourrais faire plus"',
      'Remettre les ancres temporelles immédiatement (réveil, repas, coucher)',
    ],

    interdictions: [
      'Session de rattrapage intensive',
      'Culpabilité et auto-flagellation',
      'Promettre "plus jamais" et surcompenser',
      'Analyse excessive de ce qui a mal tourné',
      'Zapper le réveil parce qu\'on est "encore en mode chaos"',
    ],

    classicError: 'Tenter de tout rattraper en une seule journée. Surcompensation → épuisement → nouvelle dérive. Le retour doit être progressif.',

    validation: '1 bloc + méditation + ancres remises + sommeil à l\'heure = reprise réussie.',

    exitSignal: 'Système remis en marche. Ancres temporelles actives. Prêt pour le mode NORMAL demain.',

    startChecklist: [
      'Accepter que la disruption est passée — elle n\'existe plus',
      'Réveil à l\'heure habituelle (même si dur)',
      'Méditation en premier — pas d\'excuses',
      '1 seul objectif d\'étude pour la journée',
      'Reset environnement physique (bureau, chambre)',
    ],

    endChecklist: [
      'Méditation faite',
      '1 bloc étude fait',
      'Ancres respectées (réveil, repas, coucher)',
      'Bilan de la dérive fait (5 min)',
      'Mode NORMAL prévu pour demain',
    ],

    nextModes: ['normal'],
    transitionNote: 'Reprise réussie → mode NORMAL dès demain. Ne pas rester en Reprise plus d\'une journée.',
  },

};


// ============================================================
// EMERGENCY PROTOCOLS
// ============================================================

const EMERGENCY_PROTOCOLS = [
  {
    id: 'digital-drift',
    name: 'Dérive numérique',
    icon: '⚠',
    symptom: 'Tu scrolles depuis plus de 30 min. Tu ne sais plus ce que tu faisais. Tu as ouvert Instagram/Twitter/YouTube "juste une minute" il y a longtemps.',
    immediateResponse: [
      'Poser le téléphone maintenant. Pas dans 5 min. Maintenant.',
      'Debout. Marche 5 min dans la pièce ou douche froide 30 secondes.',
      'Fermer TOUS les onglets. Rouvrir uniquement le fichier de travail.',
      'Lancer le timer 20 min sur une seule tâche — la plus simple possible.',
      'Ne pas se juger — juste reprendre.',
    ],
    cancel: [
      'La "session de rattrapage" immédiate intense',
      'Le "je vais juste finir ça" sur le téléphone',
      'Le multi-onglet de "compensation"',
      'L\'analyse de "pourquoi j\'ai dévié"',
    ],
    minVital: 'Poser l\'écran. Faire une action physique (même 2 min). Reprendre 1 tâche avec un timer.',
  },
  {
    id: 'extreme-fatigue',
    name: 'Fatigue extrême',
    icon: '⚡',
    symptom: 'Tu ne peux pas garder les yeux ouverts. Tu relis la même ligne depuis 10 min. Tu t\'es endormi sur ton travail. Ton cerveau est dans du coton.',
    immediateResponse: [
      'Arrêter immédiatement — forcer ne sert à rien.',
      'Sieste de 20 min MAXIMUM (timer obligatoire).',
      'Avant la sieste : eau fraîche sur le visage.',
      'Après la sieste : 5 min de marche avant de reprendre.',
      'Si toujours pas fonctionnel → passer en mode RECOVERY pour le reste de la journée.',
    ],
    cancel: [
      'La caféine en excès pour forcer (délai seulement, crash garanti)',
      'L\'étude "en mode zombie" (inefficace + crée de fausses habitudes)',
      'La culpabilité d\'avoir besoin de dormir',
      'Raccourcir la sieste pour "gagner du temps"',
    ],
    minVital: 'Sieste 20 min. Si pas récupéré : mode RECOVERY. Le corps a la priorité.',
  },
  {
    id: 'loss-of-control',
    name: 'Perte de contrôle',
    icon: '🔴',
    symptom: 'Tu te sens submergé, dépassé. Trop de choses à faire, impossible de choisir. Paralysie, anxiété, envie de tout fuir. Le planning semble irréaliste.',
    immediateResponse: [
      'STOP. S\'asseoir. Respirer 5 fois lentement (4 temps inspiré, 6 temps expiré).',
      'Prendre une feuille de papier. Écrire TOUT ce qui pèse.',
      'Choisir UNE seule chose à faire dans la prochaine heure.',
      'Faire cette une chose. Ignorer le reste.',
      'Après : reprendre le protocole du mode en cours.',
    ],
    cancel: [
      'Essayer de tout résoudre en même temps',
      'Ouvrir plusieurs tâches "pour avancer"',
      'Appeler/texter pour chercher validation externe',
      'Consommation de contenu comme fuite',
    ],
    minVital: 'Respirer. Écrire ce qui pèse. Faire UNE seule chose. Ensuite réévaluer.',
  },
  {
    id: 'day-ruined',
    name: 'Journée ratée',
    icon: '↺',
    symptom: 'La journée n\'a pas du tout fonctionné. Rien n\'a été fait. Tu as l\'impression d\'avoir "gâché" la journée. Il est 17h ou plus et tu n\'as pas commencé.',
    immediateResponse: [
      'Accepter que la journée est ce qu\'elle est — elle ne peut pas être refaite.',
      'Il reste du temps : faire UNE chose significative maintenant (30–45 min).',
      'Manger correctement si ce n\'est pas fait.',
      'Se coucher à l\'heure habituelle — protéger le sommeil pour demain.',
      'Demain matin : mode REPRISE. Pas de punition, réinitialisation.',
    ],
    cancel: [
      'La session de rattrapage nocturne (sacrifier le sommeil)',
      'L\'analyse interminable de "pourquoi ça a raté"',
      'La promesse de "tout rattraper demain"',
      'Se coucher tard pour "valider" quand même la journée',
    ],
    minVital: 'UNE chose faite maintenant + sommeil à l\'heure + mode REPRISE demain.',
  },
  {
    id: 'broken-sleep',
    name: 'Sommeil cassé',
    icon: '◑',
    symptom: 'Tu as mal dormi (< 5h ou sommeil fragmenté). Tu es réveillé à 3h et tu n\'arrives pas à te rendormir. Réveil brutal, corps pas récupéré.',
    immediateResponse: [
      'Si réveillé la nuit : pas d\'écran. Méditation allongé ou lecture papier.',
      'Si moins de 5h de sommeil : sieste de 20 min dans la matinée (timer).',
      'Réduire les attentes de la journée — journée à 60% de capacité.',
      'Supprimer les tâches cognitives lourdes l\'après-midi.',
      'Coucher anticipé : 20h30–21h00 ce soir.',
    ],
    cancel: [
      'Forcer la pleine performance avec peu de sommeil',
      'Caféine excessive pour compenser (crash garanti)',
      'Sieste trop longue (> 30 min) qui empêche le sommeil du soir',
      'Coucher encore plus tard ce soir',
    ],
    minVital: 'Sieste 20 min si < 5h. Journée à 60%. Coucher anticipé ce soir.',
  },
  {
    id: 'chaos-return',
    name: 'Retour après 48h de chaos',
    icon: '⟳',
    symptom: 'Tu reviens après 2+ jours de dérive totale : voyage, maladie, événement, effondrement. Le système est cassé. Tu ne sais pas par où recommencer.',
    immediateResponse: [
      'Ne pas essayer de tout rattraper. Jamais.',
      'Activer le mode REPRISE immédiatement.',
      'Remettre les ancres dans l\'ordre : réveil, repas, coucher.',
      'Premier acte : méditation. Même 5 min. Même si ça "ne sert à rien".',
      'Premier bloc d\'étude : 45 min sur matière prioritaire. Un seul.',
    ],
    cancel: [
      'La session marathon de rattrapage',
      'Le planning "hyper-optimisé de reprise"',
      'La culpabilité prolongée',
      'Attendre de "se sentir prêt" pour recommencer',
      'Analyser les causes avant d\'avoir repris l\'action',
    ],
    minVital: 'Mode REPRISE. Méditation. 1 bloc. Ancres remises. Demain : Normal.',
  },
];


// ============================================================
// UNIVERSAL RULES
// ============================================================

const UNIVERSAL_RULES = [
  'La médecine passe avant le contenu — toujours, sans exception.',
  'Contenu médical : 15 minutes maximum par session en mode Normal.',
  'Aucune décision importante dans les 12h post-garde.',
  'L\'heure de coucher est une ancre — pas une suggestion.',
  'Zéro scroll passif. Consommation consciente uniquement.',
  'Un seul écran à la fois. Multi-écran interdit pendant l\'étude.',
  'Timer posé avant chaque bloc de travail — pas de bloc sans limite.',
  'La sieste n\'est pas de la paresse — c\'est de la gestion d\'énergie.',
  'La récupération est aussi de la performance.',
  'Ne jamais promettre "plus jamais" après une dérive — juste reprendre.',
  'L\'environnement prime sur la volonté — reset l\'environnement en premier.',
  'Une tâche à la fois. Le multitâche est une illusion de productivité.',
  'Les émotions ne changent pas le protocole — le protocole EST la réponse.',
  'Un mauvais début de journée ne justifie pas un mauvais reste de journée.',
  'Répéter sans perfection vaut mieux que perfectionner sans répéter.',
];


// ============================================================
// RESET CHECKLIST
// ============================================================

const RESET_CHECKLIST = [
  'Bureau physique dégagé (rien d\'inutile devant soi)',
  'Téléphone en mode avion ou hors de portée (autre pièce)',
  'Onglets navigateur : fermer TOUT sauf le travail en cours',
  'Notifications désactivées (mode "ne pas déranger")',
  'Eau posée sur le bureau',
  'Timer prêt et configuré',
  'Une seule tâche ouverte — intention notée en 1 phrase',
  'Musique de travail ou silence (pas de podcast/vidéo)',
  'Fenêtre ouverte ou aération si possible',
  'Posture : assis droit, pas avachi',
];


// ============================================================
// MEDICAL CONTENT RULES
// ============================================================

const MEDICAL_CONTENT_RULES = [
  'Durée max : 15 minutes par session en mode Normal',
  'Format : extraction uniquement — pas de création longue',
  'Objectif : 1 cas clinique, 1 signe, 1 diagnostic différentiel',
  'Aucune production de contenu les jours de stage ou de garde',
  'Le contenu ne remplace jamais l\'étude clinique directe',
  'Si l\'extraction dépasse 15 min → arrêter immédiatement, timer obligatoire',
  'Pas de vérification des statistiques pendant la journée de travail',
  'Le contenu se planifie — jamais improvisé au fil de l\'eau',
];


// ============================================================
// NUTRITION REMINDERS
// ============================================================

const NUTRITION_REMINDERS = [
  'Petit-déjeuner : protéines + glucides complexes avant tout bloc cognitif',
  'Hydratation : eau toujours disponible sur le bureau — 2L/jour minimum',
  'Café : maximum 2/jour, pas après 14h, jamais à jeun',
  'Pré-garde : repas complet 2h avant le début de garde',
  'Pendant la garde : manger même sans faim — énergie = compétence',
  'Post-garde : repas léger, facile à digérer, pas d\'alcool',
  'Mode Recovery : alimentation anti-inflammatoire, éviter ultra-transformés',
  'Pas de sucre rapide en début de bloc cognitif (crash garanti)',
  'Repas 20–30 min avant une session physique intense : glucides + protéines légères',
  'Dîner : protéines + légumes, glucides modérés, pas > 2h avant le coucher',
];


// ============================================================
// SYSTEM MATERIAL (récitation / cas cliniques)
// ============================================================

const SYSTEM_MATERIAL = [
  'Urgences cardiaques : IDM, OAP, EP, tamponnade, dissection aortique',
  'Urgences neurologiques : AVC, épilepsie, HTIC, méningite, coma',
  'Urgences respiratoires : détresse respiratoire, pneumothorax, asthme aigu',
  'Urgences digestives : occlusion, perforation, hémorragie digestive',
  'Urgences infectieuses : sepsis, choc septique, méningite bactérienne',
  'Urgences métaboliques : hypoglycémie, DKA, hyperkaliémie, hyponatrémie',
  'Urgences traumatologiques : polytraumatisme, TCE, trauma rachidien',
  'Réanimation : RCP, défibrillation, intubation, voies veineuses',
  'Score GCS, NIHSS, score de Glasgow pour brûlés, critères de Prague',
  'Médicaments d\'urgence : doses, voies, contre-indications principales',
];
