# Mealy

Mealy is a mobile recipe app built with React Native and Expo. Users can browse and search recipes, and after creating an account they can publish their own recipes, edit or delete them, and save favorites.

Created as an individual project in the React Native course.

## REST API

The app talks to its own REST API, included in the `backend/` folder. It is built with Node.js, Express and PostgreSQL. No external API is used.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Check that the server is running |
| POST | `/api/register` | No | Create an account |
| POST | `/api/login` | No | Log in and receive a token |
| GET | `/api/recipes` | No | List recipes. Optional query: `search`, `category`, `user_id`, `ids` |
| GET | `/api/recipes/:id` | No | Get one recipe |
| POST | `/api/recipes` | Yes | Create a recipe |
| PATCH | `/api/recipes/:id` | Yes, owner only | Update a recipe |
| DELETE | `/api/recipes/:id` | Yes, owner only | Delete a recipe |
| PUT | `/api/recipes/:id/favorite` | Yes | Save a recipe as favorite |
| DELETE | `/api/recipes/:id/favorite` | Yes | Remove a favorite |
| GET | `/api/favorites` | Yes | Ids of the logged-in user's favorites |

## Main features

- Home screen, navigation with React Navigation
- Register, log in and log out
- Recipe list with search and category filter
- Recipe details with ingredients and instructions
- Create, edit and delete your own recipes
- Favorites and a profile with "My recipes"
- Share a recipe with other apps
- Loading, error and empty states for all API calls
- Layout that adapts to different screen sizes, with accessibility labels
- Favorites are saved on the server and updated optimistically: the UI changes immediately and the change is undone if the server request fails
- The user is logged out automatically when the token has expired

## Registration and login

1. The user registers or logs in with email and password (`POST /api/register` or `/api/login`).
2. The backend hashes passwords with bcrypt and returns a JWT token (valid for 7 days) and basic user info.
3. The app stores the token in SecureStore and sends it as `Authorization: Bearer <token>` on protected requests.
4. On app start the token is read from SecureStore, so the user stays logged in.
5. Logging out deletes the token from SecureStore. If the server rejects the token (for example when it has expired), the user is logged out automatically.
6. Screens for creating recipes, the profile and favorites are only registered in the navigator when a token exists, so a logged-out user cannot reach them. The backend also checks the token and that the user owns the recipe before editing or deleting.

Passwords are never stored on the device.

## Local storage

- **SecureStore:** auth token and basic user info (id, email, username)
- **AsyncStorage:** a per-user copy of the favorite recipe ids. Favorites are stored on the server, so they follow the account. The local copy makes the favorite state available instantly when the app starts, before the server has answered.

## Device feature

- **Share:** a recipe can be shared as text through the phone's share menu.

## Installation and start

### Requirements

- Node.js (LTS) and npm
- PostgreSQL
- Expo Go on a phone, on the same wifi as the computer

### 0. Get the code

```bash
git clone https://github.com/juliafrankly/mealy
cd mealy
```

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and set your PostgreSQL password and a long random `JWT_SECRET`. Keep `PORT=3000`, since the app expects that port.

Create the database and tables (run from the `backend` folder):

```bash
psql -U postgres -c "CREATE DATABASE mealy;"
psql -U postgres -d mealy -f schema.sql
```

If `psql` cannot connect, add `-h localhost` to the commands.

Optional: add a demo user and a few recipes. You can then log in with `demo@mealy.app` / `password123`:

```bash
npm run seed
```

Start the server and keep it running:

```bash
npm run dev
```

Check that `http://localhost:3000/api/health` returns `{"status":"ok"}`. If you change `.env`, restart the server manually.

### 2. App

In a second terminal, from the project root:

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go. The app finds the backend automatically, using the address of the computer running Expo.

To try the app, log in with the demo user or register a new account, then create a recipe.

## Known issues and limitations

- The backend must run on the same computer and network as Expo. `npx expo start --tunnel` does not work, since the app cannot reach the backend through the tunnel.
- The recipe list loads all recipes at once (no pagination).
- Ingredients are stored as plain text, one per line.
- The app needs the server to show recipes. Only the favorite ids are cached locally, not the recipes themselves, so there is no offline mode.
- Tested with Expo Go on a Google Pixel 9 Pro. Not tested on web.