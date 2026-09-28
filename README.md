# Shopping-App-Frontend

ÉLANE Luxury Fashion Atelier — Editorial e-commerce client built with React 19, Vite, Tailwind CSS v4, Framer Motion, and Lucide React.

## Live Deployments
- **Frontend Client (Vercel):** [https://shopping-app-frontend-rho.vercel.app](https://shopping-app-frontend-rho.vercel.app)
- **REST API (Render):** [https://shopping-app-backend-bwbb.onrender.com/api](https://shopping-app-backend-bwbb.onrender.com/api)

## Features
- **Storefront Experience**: Full-bleed hero banner, seasonal capsule showcase, dynamic filtering by category, palette, and price.
- **Product Presentation**: Multi-angle gallery, variant selector (sizes, colors), live low-stock badges, care accordion.
- **Shopping Bag & Wishlist**: Slide-out bag with free shipping progress bar, promo code validation (`ELANE10`, `VIP20`), persistent wishlist.
- **Administrative Console**: Executive analytics, gross revenue tracking, order fulfillment pipeline, and inventory alerts.
- **Authentication**: JWT authentication with protected routes for user profiles and admin controls.

## Tech Stack
- React 19 + Vite 8
- React Router DOM v7
- Tailwind CSS v4 + `@tailwindcss/vite`
- Framer Motion & Lucide React
- Axios with centralized interceptors

## Setup & Running
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env` (refer to `.env.example`):
   ```env
   VITE_API_URL=https://shopping-app-backend-bwbb.onrender.com/api
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
