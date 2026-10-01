# Administration des commandes

L'interface est accessible en ajoutant `#admin` à l'URL du site.

Exemple :
`http://localhost:5173/#admin`

Elle permet de consulter les commandes, rechercher par numéro/nom/téléphone,
filtrer par statut et modifier le statut.

Les permissions Supabase doivent autoriser la lecture des tables `orders` et
`order_items` pour le rôle utilisé par l'interface. Pour un vrai déploiement,
il est recommandé de protéger cette interface par une authentification admin
avant de l'exposer publiquement.

## Correction du statut des commandes

Si les statuts reviennent à `pending` après actualisation, exécuter
`supabase/fix-order-status-policy.sql` dans Supabase SQL Editor.
