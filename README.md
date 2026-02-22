# Hydrapp

Hydrapp includes email/password authentication with:

- Sign-up with email, password, and password confirmation
- Sign-in with JWT stored in an HTTP-only cookie
- Authentication handled with Next.js server actions
- Backend validation with zod
- Frontend forms built with react-hook-form + zod resolver

## Local Setup

1. Copy env variables:

```bash
cp .env.example .env
```

2. Start Postgres:

```bash
npm run db:up
```

3. Run DB migration (creates the `users` table):

```bash
npm run db:migrate
```

4. Start the app:

```bash
npm run dev
```

##### How to run postgres locally

```bash
## we are mapping the port 5432 to 5433 to avoid conflicts with the default port 5432
docker run --name hydrapp_db -p 5433:5432 -e POSTGRES_USER=jakub -e POSTGRES_PASSWORD=password -e POSTGRES_DB=hydrapp -d postgres

docker start hydrapp_db
```
