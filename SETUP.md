# Setup (Windows PowerShell)

This file shows the minimal steps to run the project locally on Windows using PowerShell.

Prerequisites
- Node.js (16+ recommended) and npm
- MongoDB (local or Atlas)
- (Optional) Cloudinary account for image uploads

1) Backend

Open PowerShell, then:

```powershell
cd backend
npm install
```

Create a `.env` file in `backend/` with these example variables (replace with your values):

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.example.mongodb.net/mydb
JWT_SECRET=some_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

Seed (optional, if you want sample data):

```powershell
npm run seed
```

Start backend dev server (nodemon):

```powershell
npm run dev
```

The API should be available at http://localhost:5000/api by default.

2) Frontend

Open a new PowerShell window/tab and run:

```powershell
cd frontend
npm install
```

Create a `.env` file in `frontend/` (Vite requires `VITE_` prefix) with this example (adjust if backend is served elsewhere):

```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server (Vite):

```powershell
npm run dev
```

3) Notes
- Frontend picks the API base URL from `import.meta.env.VITE_API_URL` (see `frontend/src/utils/api.js`).
- Make sure `.env` files are not committed. The repo's `.gitignore` already contains `.env` entries. Keep secrets out of git.
- If you use a different port for the backend, update `VITE_API_URL` accordingly.

Troubleshooting
- If ports are in use, change `PORT` in backend `.env` and update `VITE_API_URL`.
- If you can't connect to MongoDB, verify network access (Atlas IP whitelist) and correct URI.

If you'd like, I can add an example `.env.example` to the repo with these variables (no secrets), or make a small script to run both servers concurrently.
