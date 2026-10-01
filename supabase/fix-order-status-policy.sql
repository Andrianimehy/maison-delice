-- Maison Délice: autoriser la modification du statut des commandes
-- À exécuter une seule fois dans Supabase > SQL Editor.
-- Cette policy est adaptée à notre phase de test. Pour la production,
-- il faudra protéger l'administration avec une authentification admin.

CREATE POLICY "Public can update order status"
ON public.orders
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
