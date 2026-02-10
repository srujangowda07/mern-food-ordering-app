# MERN Food Ordering App

A fully functional food ordering platform inspired by apps like Zomato and Swiggy, built using the MERN stack (MongoDB, Express, React, Node). Supports browsing restaurants and food items, authentication, cart, order checkout (demo), and Cloudinary image support.

---

## Tech Stack

* **Frontend:** React (Vite), Tailwind CSS
* **Backend:** Node.js, Express.js, MongoDB, Mongoose
* **Cloud Storage:** Cloudinary for food and restaurant images
* **Auth:** JWT + bcrypt

---

## Key Features

### User Features

* Login / Signup with JWT authentication
* View **all restaurants** and **all food items**
* Search + Category filtering
* Add items to **cart**
* **Demo checkout** for orders
* View **order history**
* Fully responsive UI

###  Restaurant

* Restaurant listing
* Restaurant-specific food menus
* Focused on **North & South Indian cuisine**

---

## Project File Structure

```
package.json
backend/
    package.json
    server.js                # Express app entry point
    seed.js                  # Seeding restaurants & food data
    config/
        db.js                # MongoDB connection
        cloudinary.js        # Cloudinary configuration
    controllers/             # Controllers for auth, food, orders, etc.
    middleware/              # JWT auth & error handlers
    models/                  # Mongoose models (User, Food, Order, Restaurant)
    routes/                  # Routers for API endpoints

frontend/
    package.json
    index.html
    vite.config.js
    src/
        main.jsx
        App.jsx
        components/          # UI (Navbar, Cards, SearchBar, etc.)
        pages/               # Views (Home, Login, Restaurants, Cart, Orders)
        context/             # AuthContext & CartContext
        utils/
            api.js           # Axios base URL using VITE_API_URL
        styles/              # Tailwind styles
    public/                  # Static assets
```

---

## Environment Variables

Backend → `backend/.env`

```
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<your-secret>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
PORT=5000
```

Frontend → `frontend/.env`

```
VITE_API_URL=http://localhost:5000/api
```

---

## How to Run Locally

### Backend

```bash
cd backend
npm install
npm run seed     # Add Indian restaurants + foods
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Backend runs at: `http://localhost:5000`
Frontend runs at: `http://localhost:5173`

---

## 🔥 API Endpoints Overview

| Method | Endpoint         | Description                      |
| ------ | ---------------- | -------------------------------- |
| GET    | /api/foods       | All food items                   |
| GET    | /api/foods/:id   | Food details                     |
| GET    | /api/restaurants | All restaurants                  |
| POST   | /api/auth/login  | Login user                       |
| POST   | /api/auth/signup | Register user                    |
| POST   | /api/orders      | Create an order                  |
| GET    | /api/orders      | Order history for logged-in user |

---

## ✅ Status

* ✅ DB seeded with Indian restaurants & food
* ✅ Cart + Demo Checkout working
* ✅ Auth & Order history working
* ⏳ UI Enhancements coming (modern cards, filters, animations)

