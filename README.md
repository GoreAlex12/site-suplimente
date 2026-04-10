# Site Suplimente — Frontend

React SPA for browsing supplements, diseases and categories — plus a protected
admin panel for managing the data.

## Stack

- **React 19** with hooks
- **React Router 6** (nested routes for admin)
- **Tailwind CSS** for styling (existing `index.css` kept for navbar)
- **Context API** for auth state (JWT stored in `localStorage`)

## Prerequisites

- The backend must be running first:
  [`../site-suplimente-server`](../site-suplimente-server). See the backend
  README for setup and seeding instructions.

## Setup

```bash
cd site-suplimente
npm install
```

Create `.env` at the project root (already created with sane defaults):
```
REACT_APP_API_URL=http://localhost:5001/api
```

Run the dev server:
```bash
npm start
```
Opens on [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── components/
│   ├── Navbar.js              # dynamic categories (from /api/categories/tree) + search
│   ├── DropdownMenu.js        # hover dropdown, uses dynamic data
│   ├── SupplementCard.js
│   ├── ProtectedRoute.js
│   ├── Loader.js
│   └── Message.js
├── context/
│   └── AuthContext.js         # login/logout/me helpers
├── pages/
│   ├── Home.js                # "most used" supplements
│   ├── Products.js            # list + filter by category
│   ├── ProductDetails.js      # auto-tracks clicks
│   ├── Diseases.js            # list + filter by symptom
│   ├── DiseaseDetails.js      # disease + its supplements
│   ├── Search.js              # /search?q=...
│   ├── Login.js               # admin login
│   ├── Cart.js
│   └── admin/
│       ├── AdminLayout.js     # sidebar layout
│       ├── AdminDashboard.js  # stats + top supplements
│       ├── CategoriesAdmin.js
│       ├── SupplementsAdmin.js
│       └── DiseasesAdmin.js
├── services/
│   └── api.js                 # fetch-based API client
├── App.js
└── index.js
```

## Public routes

| Path                  | Page                          |
| --------------------- | ----------------------------- |
| `/`                   | Home — most popular products  |
| `/products`           | All supplements + category filter |
| `/products/:id`       | Supplement details (increments click count) |
| `/diseases`           | All diseases (filter by symptom) |
| `/diseases/:id`       | Disease + related supplements |
| `/search?q=<term>`    | Search by supplement/disease/symptom |
| `/login`              | Admin login                   |
| `/cart`               | Cart (demo)                   |

## Admin routes (protected — admin JWT required)

| Path                   | Page                  |
| ---------------------- | --------------------- |
| `/admin`               | Dashboard + top stats |
| `/admin/categories`    | Categories manager    |
| `/admin/supplements`   | Supplements manager   |
| `/admin/diseases`      | Diseases manager (with related supplements editor) |

Default admin credentials after running `npm run seed` in the backend:

```
email:    admin@suplimente.ro
password: admin123
```

## How dynamic data flows

- The **navbar** calls `GET /api/categories/tree` on mount and builds the
  dropdown structure from the response. Root categories group themselves under
  `produse / suplimente / producatori / afectiuni` via the `group` field.
- Clicking a category in the dropdown navigates to
  `/products?category=<id>`; the Products page then calls
  `GET /api/supplements?category=<id>` which includes root + sub categories.
- The **home page** calls `GET /api/supplements/popular?limit=8` — supplements
  are ranked by `cartCount` then `clickCount`, which are incremented every
  time a user opens a product details page or adds it to the cart.
- The **search bar** submits to `/search?q=…`, which calls
  `GET /api/supplements/search?q=…` (matches supplement name/description,
  disease name, and disease symptoms).

## Scripts

- `npm start` — dev server
- `npm run build` — production build
- `npm test` — tests
