# ShopNest — Client

Next.js (App Router, TypeScript, Tailwind CSS) frontend for ShopNest, a full-stack e-commerce platform. Talks to the [shopnest-server](https://github.com/GeorgeBlaize/shopnest-server) Express API.

## Features

- Home page with 8+ marketing sections, product listing with search/filter/sort/pagination, product detail pages, cart + mock (COD) checkout
- Email/password auth plus Google sign-in (Firebase), with one-click demo login
- Role-based dashboard (User / Admin / Manager) with real charts, data tables, and CRUD for products/categories/orders/users
- Light & dark mode, fully responsive

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in NEXT_PUBLIC_API_URL + Firebase Web SDK keys
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000). Requires the [shopnest-server](https://github.com/GeorgeBlaize/shopnest-server) API running (default `http://localhost:5000`).

## Environment variables

See [`.env.local.example`](./.env.local.example) for the full list:

- `NEXT_PUBLIC_API_URL` — base URL of the backend API
- `NEXT_PUBLIC_FIREBASE_*` — Firebase Web SDK config, used for Google sign-in

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run a production build
- `npm run lint` — lint

## Demo credentials

| Role    | Email                 | Password    |
|---------|------------------------|-------------|
| Admin   | admin@shopnest.com    | Admin@123   |
| Manager | manager@shopnest.com  | Manager@123 |
| User    | user@shopnest.com     | User@123    |

The login page also has one-click "Demo login" buttons that auto-fill these.
