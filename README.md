# MODE SWITCH — Tableau de bord opérationnel personnel

Un dashboard statique personnel. Pas une app de productivité. Un commutateur d'état.

---

## Mode d'emploi

1. Ouvrir la page le matin
2. Identifier le mode du jour (contexte réel, pas l'idéal)
3. Appuyer sur le mode → lire le protocole complet
4. Appuyer sur J'EXÉCUTE
5. Suivre le planning et le noyau, rien de plus
6. Ne pas improviser
7. Changer de mode seulement si le contexte réel change

---

## Les 7 modes

### MODE NORMAL
**Énergie : HAUTE**
Journée standard. Pas de garde, pas de récupération. Système intact.
- 2 blocs d'étude profonde
- Méditation, sport, récitation
- Contenu médical : 15 min MAX
- Coucher à 21h30

### MODE STAGE
**Énergie : MODÉRÉE**
Journée de stage hospitalier. Présence totale requise.
- Présence active au stage (pas passive)
- 1 bloc d'étude le soir (45 min min)
- Pas de session contenu les jours de stage
- Coucher à l'heure

### MODE PRÉ-GARDE
**Énergie : ANTICIPATION**
Veille de garde. Maximiser les réserves.
- Sieste post-déjeuner obligatoire
- 1 seul bloc d'étude le matin
- Coucher anticipé : 20h30
- Zéro effort intense

### MODE GARDE
**Énergie : SURVIE**
Journée ou nuit de garde aux urgences.
- Compétence clinique maximale
- Manger même sans faim
- Micro-siestes dans les temps morts
- Sommeil immédiat au retour

### MODE RECOVERY
**Énergie : RESTAURATION**
Post-garde ou post-surmenage. Récupération structurée.
- Réveil naturel
- Marche légère (non-négociable)
- Pas de deep work ni de blocs intensifs
- Zéro culpabilité de ne pas produire

### MODE OFF
**Énergie : LIBRE**
Jour intentionnellement libéré. Décidé, pas subi.
- Activité ressourçante choisie
- Méditation minimale maintenue
- Ancre de sommeil respectée
- Pas de scroll passif comme "repos"

### MODE REPRISE
**Énergie : RELANCE**
Après 48h+ de chaos, disruption, maladie ou dérive.
- Pas de rattrapage — réinitialisation propre
- Méditation en premier
- 1 seul bloc d'étude
- Ancres temporelles remises immédiatement

---

## Protocoles d'urgence

Accessible via le bouton **URGENCE / REPRISE** ou la touche **U**.

| Situation | Déclencheur |
|-----------|-------------|
| Dérive numérique | Scroll > 30 min, perte de contexte |
| Fatigue extrême | Impossibilité de garder les yeux ouverts |
| Perte de contrôle | Paralysie, trop de choses simultanées |
| Journée ratée | Rien fait, il est 17h |
| Sommeil cassé | Moins de 5h ou réveil 3h du matin |
| Retour après 48h de chaos | Dérive prolongée, système cassé |

---

## Raccourcis clavier

| Touche | Action |
|--------|--------|
| `1` | Mode Normal |
| `2` | Mode Stage |
| `3` | Mode Pré-Garde |
| `4` | Mode Garde |
| `5` | Mode Recovery |
| `6` | Mode Off |
| `7` | Mode Reprise |
| `Entrée` | Entrer dans le mode sélectionné |
| `Échap` | Retour / Fermer modal |
| `R` | Reset Environnement |
| `U` | Urgence / Protocoles |
| `T` | Focaliser le Timer |
| `F` | Timer Plein Écran |
| `Espace` | Démarrer / Arrêter Timer |
| `D` | Basculer thème sombre/clair |
| `P` | Imprimer le protocole actif |
| `?` | Aide / Raccourcis |

---

## Reset Environnement

Effectuer avant chaque bloc de travail. Accessible via `R`.

- Bureau physique dégagé
- Téléphone en mode avion ou autre pièce
- Fermer tous les onglets sauf le travail en cours
- Notifications désactivées
- Timer prêt et configuré
- Une seule tâche ouverte — intention notée

---

## Structure du projet

```
No reflection/
├── index.html      — Structure HTML complète
├── styles.css      — Design system complet, mobile-first
├── app.js          — Logique applicative (vanilla JS)
├── modes.js        — Données : 7 modes, urgences, règles
├── manifest.json   — Manifest PWA
└── README.md       — Ce fichier
```

---

## Persistance des données

Toutes les données sont stockées localement via `localStorage` :

- `lastMode` — dernier mode utilisé
- `lastModeTimestamp` — horodatage du dernier mode
- `activeMode` — mode actif de la session
- `checklistState` — état des cases à cocher par mode
- `theme` — préférence thème clair/sombre
- `timerPreset` — dernière durée de timer sélectionnée

**Aucune donnée n'est envoyée à un serveur. Tout reste local.**

---

## Déploiement GitHub Pages

1. Créer un repository GitHub
2. Uploader les 5 fichiers (index.html, styles.css, app.js, modes.js, manifest.json)
3. Aller dans Settings → Pages
4. Source : branch `main`, dossier `/ (root)`
5. Sauvegarder

L'URL sera : `https://[username].github.io/[repository-name]/`

Pour un accès direct sans GitHub Pages, ouvrir `index.html` directement dans le navigateur — tout fonctionne avec le protocole `file://`.

---

## Règles universelles du système

1. La médecine passe avant le contenu — toujours.
2. Contenu médical : 15 min maximum par jour en mode normal.
3. Aucune décision importante dans les 12h post-garde.
4. L'heure de coucher est une ancre — pas une suggestion.
5. Zéro scroll passif. Consommation consciente uniquement.
6. Un seul écran à la fois. Multi-écran interdit pendant l'étude.
7. Timer posé avant chaque bloc de travail.
8. La récupération est aussi de la performance.
9. L'environnement prime sur la volonté — reset en premier.
10. Reprendre n'est pas échouer — c'est le système qui fonctionne.

---

*Ce dashboard ne demande pas comment tu vas. Il te dit quoi faire.*
