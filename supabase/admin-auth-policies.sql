-- Maison Délice — authentification admin
-- 1) Créez d'abord l'utilisateur admin dans Supabase Dashboard > Authentication > Users.
-- 2) Puis exécutez ce SQL.
--
-- Le rôle authentifié peut lire/modifier les commandes.
-- Les visiteurs anonymes conservent uniquement la création des commandes.
--
-- IMPORTANT : si vous avez des policies SELECT/UPDATE "Public..." de test,
-- supprimez-les avant d'utiliser ces policies en production.

CREATE POLICY "Authenticated admins can read orders"
ON public.orders
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated admins can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated admins can read order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (true);

-- La lecture des produits peut rester publique pour la boutique.
-- La création des commandes reste gérée par les policies publiques déjà en place.
