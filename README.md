# Weather App

A weather app with favorite cities, search by name, and 5-day forecast. Built with **React**, **React Router v7**, **Prisma**, **PostgreSQL**, **Docker**, and OpenWeather API.

## Stack

- React 19, React Router v7 (loaders, actions, SSR)
- TypeScript, Tailwind CSS
- Prisma + PostgreSQL
- Docker Compose (app + DB)

## Local development (without Docker)

1. Install dependencies:

    ```bash
    npm install
    ```

2. Create `.env` from the example and fill in the variables:

    ```bash
    cp .env.example .env
    ```

    In `.env` you need:
    - `DATABASE_URL` — PostgreSQL connection string (e.g. `postgresql://user:password@localhost:5432/weather_db`)
    - `OPENWEATHER_API_KEY` — API key from [openweathermap.org/api](https://openweathermap.org/api)

3. Apply the database schema (tables are created from `prisma/schema.prisma`):

    ```bash
    npx prisma db push
    ```

4. Start the dev server:

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:5173`.

## Production build

```bash
npm run build
```

## Run with Docker

Useful for running on another machine or for deployment.

1. Clone the repo and go to the project folder.

2. Create `.env` from the example:

    ```bash
    cp .env.example .env
    ```

3. In `.env` set `OPENWEATHER_API_KEY` (and optionally your own `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` for production).

4. Build and run:

    ```bash
    docker compose up --build -d
    ```

    The app will be available at `http://localhost:3000`. On first start, the database schema is applied automatically (`prisma db push`).

## Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Dev server with HMR                |
| `npm run build`      | Production build                   |
| `npm run start`      | Run the built app                  |
| `npm run typecheck`  | TypeScript type check              |
| `npx prisma db push` | Apply schema to DB (no migrations) |
| `npx prisma studio`  | UI to view DB data                 |

## Deployment

The built app (Docker or `npm run build` output) can be deployed to any Node.js or Docker-capable host: AWS ECS, Google Cloud Run, Railway, Fly.io, Render, etc.

---

Built with React Router v7.
