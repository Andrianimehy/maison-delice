# Administration sécurisée

L'administration est accessible avec `#admin`.

## Première configuration

1. Dans Supabase Dashboard → Authentication → Users, créer le compte administrateur.
2. Exécuter `supabase/admin-auth-policies.sql`.
3. Garder les policies nécessaires à la boutique pour permettre la création des commandes.
4. Pour la production, supprimer les anciennes policies publiques de lecture/modification
   des commandes utilisées pendant les tests.

L'interface utilise Supabase Auth et ne demande pas de mot de passe codé dans le projet.
