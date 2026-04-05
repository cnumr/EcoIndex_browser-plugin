# POLITIQUE DE CONFIDENTIALITÉ DES UTILISATEURS

## 1. Objet

Les présentes Conditions Générales d’Utilisation (CGU) régissent l’utilisation de l’extension navigateur **Ecoindex Browser** (ci-après « l’Extension »).

L’Extension permet d’afficher le score Ecoindex d’une page web en interrogeant un service backend dédié ([Ecoindex BFF](https://github.com/cnumr/EcoIndex_BFF) which is a Ecoindex official API middleware).

---

## 2. Fonctionnement du service

Lorsque l’Extension est activée sur une page web :

- L’URL de la page courante est transmise au service backend Ecoindex BFF.
- Le service vérifie si un score Ecoindex existe déjà :
  - en base de données, ou
  - dans un cache existant.

- Si un score existe, il est retourné immédiatement.
- Si aucun score n’est disponible :
  - un calcul peut être effectué,
  - le résultat est ensuite stocké de manière sécurisée.

### Stockage des résultats

Les résultats sont stockés sous forme chiffrée selon le principe suivant :

- Clé : `ecoindex_sha1(url)`
- Valeur : score Ecoindex associé

Aucune URL en clair n’est stockée dans ce mécanisme de cache.

### 2.1 Permissions du navigateur (transparence)

Le fichier manifeste de l’Extension peut contenir les déclarations suivantes, utilisées uniquement dans les conditions décrites ici :

```json
{
  "permissions": ["activeTab", "storage"],
  "host_permissions": ["<all_urls>"]
}
```

- **`activeTab`** — Accorde un accès **temporaire** à l’onglet actif lorsque vous utilisez l’Extension (par exemple à l’ouverture de la popup). Elle sert à lire **l’URL de la page affichée** afin d’interroger le backend Ecoindex pour le résultat correspondant. Elle **ne** permet pas de lire en continu tous les onglets en arrière-plan.

- **`storage`** — Sert à conserver **localement sur votre appareil** des données d’Extension : préférences et état d’interface de courte durée (par exemple le badge de la barre d’outils lié à l’onglet courant). Ce stockage n’est pas utilisé pour constituer un historique de navigation exploité par des tiers.

- **`host_permissions` : `<all_urls>`** — Indique que l’Extension peut **s’exécuter dans le contexte des pages web sur les sites que vous visitez**. Ce schéma est en particulier nécessaire lorsque l’Extension injecte des **scripts de contenu** sur toutes les pages (par exemple pour partager du code avec la popup) ou lorsque le navigateur associe ce type d’injection à des autorisations d’hôtes larges. **Il ne s’agit pas d’un dispositif de suivi comportemental** : l’objectif reste d’obtenir l’URL de la page pour la requête Ecoindex décrite ci-dessus. Lorsque les politiques des magasins d’extensions le permettent, l’**accès réseau** au backend est limité à l’API officielle Ecoindex (`https://bff.ecoindex.fr/`) plutôt qu’à des sites arbitraires.

Certaines versions peuvent aussi demander la permission **`tabs`** pour que la partie « arrière-plan » réagisse aux changements d’onglet ou de chargement de page, toujours dans le même objectif (par exemple mettre à jour le badge pour l’onglet actif).

---

## 3. Données collectées

### 3.1 Adresse IP

- L’adresse IP de l’utilisateur peut être collectée **uniquement dans les logs techniques** du service backend.
- Ces logs sont utilisés exclusivement à des fins de sécurité, de maintenance et de diagnostic.

### 3.2 URL des pages visitées

- L’URL de la page visitée est transmise au service afin de récupérer ou calculer le score Ecoindex.
- Cette URL peut être utilisée pour générer une clé de cache (hash SHA1).

---

## 4. Confidentialité et protection des données

L’Extension respecte les principes suivants :

- **Aucun croisement des données** :
  - Les adresses IP et les URL ne sont pas corrélées ni stockées conjointement.

- **Absence de tracking** :
  - Les données ne sont pas utilisées à des fins d’analyse comportementale.
  - Aucun mécanisme de suivi utilisateur n’est implémenté.

- **Aucune exploitation commerciale** :
  - Les données ne sont pas utilisées à des fins marketing ou publicitaires.

- **Aucune transmission à des tiers** :
  - Les données collectées ne sont en aucun cas transmises à des services tiers.

---

## 5. Sécurité

- Les données de cache sont stockées de manière chiffrée.
- Le système repose sur des mécanismes de hachage irréversible pour limiter l’exposition des URL.

---

## 6. Acceptation des conditions

L’installation et l’activation de l’Extension impliquent l’acceptation pleine et entière des présentes CGU, notamment en matière de traitement des données et de confidentialité.

---

## 7. Évolution des CGU

Ces conditions peuvent être mises à jour à tout moment. Il appartient à l’utilisateur de les consulter régulièrement.

---

## 8. Contact

Pour toute question relative à ces conditions ou au traitement des données, vous pouvez contacter les mainteneurs du projet.
