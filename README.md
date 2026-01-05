# Go Trek Web (Frontend + Backend)

This repository is now organized as a monorepo with a separate backend folder.

## Structure

- `backend/` → Express backend (route-controller-service-repository)
- `app/`, `contexts/`, `lib/` → Next.js frontend

## Backend Architecture (Auth)

- Route: `backend/src/routes/auth.route.ts`
- Controller: `backend/src/controllers/auth.controller.ts`
- Service: `backend/src/services/auth.service.ts`
- Repository: `backend/src/repositories/user.repository.ts`
- DTO: `backend/src/dto/auth.dto.ts`
- Model: `backend/src/models/user.model.ts`

## User Model

The `User` collection includes:

- `name`
- `email` (unique, sparse)
- `identification` (unique, sparse)
- `password` (hashed)
- `role` with enum `user | admin`, default `user`

## Run Frontend

```bash
npm install
npm run dev
```

Frontend calls backend at `http://localhost:5050` by default (or `NEXT_PUBLIC_API_URL`).

## Run Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Backend Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`

Base URL: `http://localhost:5050`

## Postman Video Checklist (2-5 min)

1. Successful registration
2. Duplicate email or duplicate identification response
3. DTO validation error response
4. Successful login (returns JWT token)
5. Invalid login response (wrong password or non-existent email)

## GitHub Submission

Since this is a monorepo, create a branch like `sprint-1` and push:

```bash
git checkout -b sprint-1
git add .
git commit -m "Setup separate backend auth architecture"
git push -u origin sprint-1
```
