# Porto Atlântica

Site vitrine : mise en relation entre entreprises françaises et entreprises de la région de Porto.

HTML, CSS et JavaScript natifs. Pas de framework, pas de build, pas de dépendance.
Le site est publié tel quel par GitHub Pages.

## Mise en ligne (GitHub Pages)

1. Remplacer le contenu du dépôt par ces fichiers (à la racine).
2. Sur GitHub : **Settings → Pages → Source : Deploy from a branch → `main` / `/ (root)`**.
3. Le site est en ligne en 1 à 2 minutes sur
   `https://robertinho-devfront.github.io/porto-connect-pro/`

## Avant le lancement (à compléter)

| Quoi | Où |
|---|---|
| Adresse email réelle (reçoit le formulaire) | `index.html` (formulaire, footer, JSON-LD), pages légales |
| Numéro WhatsApp réel (actuellement `351900000000`) | `index.html` (2 occurrences) |
| URL de la page LinkedIn | `index.html` (footer) |
| Raison sociale, adresse, SIRET, directeur de publication | `mentions-legales/index.html` |
| Nom et adresse du responsable de traitement | `politique-de-confidentialite/index.html` |
| Vraie photo du fondateur | `assets/img/fondateur.jpg` (format 4:5, 1024×1280) |

**Formulaire :** au premier envoi, FormSubmit envoie un email de confirmation à l'adresse configurée.
Cliquer sur le lien d'activation : sans ça, aucune demande n'arrive.

**Nom de domaine personnalisé :** si tu en branches un, remplace
`https://robertinho-devfront.github.io/porto-connect-pro/` partout (rechercher/remplacer), ainsi que
`/porto-connect-pro/` dans `404.html`.

## Structure

```
index.html                        page d'accueil (une seule page, un seul objectif : l'étude gratuite)
mentions-legales/                 mentions légales
politique-de-confidentialite/     RGPD
merci/                            page de confirmation (non indexée, utile pour mesurer les conversions)
404.html                          page d'erreur
assets/css/style.css              styles
assets/js/main.js                 menu, animations, formulaire, mesure
assets/fonts/                     polices auto-hébergées (Sora, Manrope)
assets/img/                       images, icônes, image de partage (og-image.jpg)
sitemap.xml, robots.txt           référencement
```

## Mesure des conversions

Les événements `cta_click`, `whatsapp_click`, `contact_form_start`, `contact_form_submit`,
`contact_form_success` et `contact_form_error` sont poussés dans `window.dataLayer`.
Ils seront captés automatiquement si tu ajoutes un outil de mesure (Plausible, Matomo, GA4…).
