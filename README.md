# DORÉA — Boulangerie, Pâtisserie & Café

Application React + TypeScript + Vite avec Supabase.

## Fonctionnalités

- Produits disponibles chargés depuis Supabase
- Panier persistant dans `localStorage`
- Ajout, suppression et modification des quantités
- Calcul du total
- Formulaire de commande
- Création d'une commande dans `orders`
- Création des lignes dans `order_items`
- Vérification du prix et de la disponibilité des produits au moment de la commande
- Confirmation avec numéro de commande

## Installation

```bash
npm install
npm run dev
```

## Variables d'environnement

Copier `.env.example` vers `.env` puis renseigner les variables Supabase :

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Ne jamais committer le fichier `.env` contenant des secrets.

## Vérifications locales

```bash
npm run lint
npm run build
```

## Structure Supabase attendue

### `products`

Le front utilise notamment : `id`, `name`, `slug`, `description`, `price`, `image_url`, `is_available`, `created_at`.

### `orders`

Colonnes utilisées :

- `id`
- `customer_name`
- `phone`
- `email`
- `address`
- `total`
- `status`
- `created_at`

### `order_items`

Colonnes utilisées :

- `id`
- `order_id`
- `product_id`
- `quantity`
- `price`

Les policies RLS doivent autoriser le parcours prévu par l'application pour les visiteurs non authentifiés.
