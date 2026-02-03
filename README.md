# Recipe App

Web app for recipes with search, filters by category and country, recommendations, and favorites. Uses [TheMealDB](https://www.themealdb.com/) and is built with Next.js and a glass / iOS-style UI.

---

## What the app does

The app lets you:

- **Browse recipes** by category (e.g. Beef, Dessert) or by country/area (e.g. British, Mexican).
- **Search** recipes by name from the global search bar.
- **Get recommendations** at random or filtered by cuisine and category from the Hero (home) or footer.
- **Save favorites** (recipes only) and view recommendation history with feedback (Yes/No).
- **View details** for each recipe: ingredients, instructions, image, and related links.

The UI uses a **glass / iOS** style (backdrop blur, ghost chips, soft ring buttons) and is designed for mobile and desktop.

---

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind CSS**.
- **TheMealDB** as the only data source (public API).
- **Routes**:
  - `/` — Home with Hero (area + category wizard → recommendation)
  - `/categories` — Listing with “By category” / “By country” filter, A–Z / Z–A sort
  - `/category/[category]` — Recipes by category with infinite scroll
  - `/area/[area]` — Recipes by country/area
  - `/meal/[id]` — Recipe detail (ingredients, instructions, image)
  - `/search?q=...` — Search results by name
  - `/favorites` — Favorites (recipes only)
- **Reusable components**: `Card`, `SearchBox`, `RecipeImage`, `FavoriteButton`, `Switch`, chips and ghost buttons.
- **Internal APIs**: `/api/areas`, `/api/categories`, `/api/meals/[id]`, `/api/meals/random`, `/api/meals/recommend`, `/api/search`.
- **Persistence**: `localStorage` for favorites, feedback preference, and recommendation history.
- **404** and custom error page.

---

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

---

## Pending / possible improvements

- **Tests**: unit tests (services, utils, hooks) and/or E2E (main flows: search, favorites, recommendation).
- **Accessibility**: review contrast, focus, labels, and keyboard navigation in SearchBox, drawer, and chips.
- **Deploy**: configure Vercel and env vars for APIs or feature flags.
- **“Recent views” in UI**: recipe view history exists in context but there is no screen or block showing it yet.
- **PWA / offline**: consider service worker and cache for recently viewed recipes.

---

## Relevant structure

```
src/
├── app/              # Routes (page, layout, not-found, api)
├── components/       # NavBar, Hero, Card, Footer, CategoriesWithFilter, RecommendationDrawer, etc.
├── contexts/         # Search, Recommendation, RecommendationFeedback, Favorites, RecipeHistory
├── services/         # meals.ts (TheMealDB), mealDbClient
├── hooks/            # usePersistedPreference
├── utils/            # mealImage, parseIngredients
└── store/            # Redux (StoreProvider, appSlice)
```

---

## License

Internal / educational use. TheMealDB has its own usage policy.
