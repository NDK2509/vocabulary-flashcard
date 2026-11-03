# Request — 20261103-custom-auth-api

- **Date:** 2026-11-03
- **Requested by:** user
- **Type:** feature / change
- **Branch / start commit:** main @ 4c336bf221a77dcc6e8ddd360ab8cc3b7dbb43d3

## Raw input (verbatim)

> Make my own authentication API and inplement to FE
> Dont need to verify anything when register

## Clarifications (Q&A log)

| # | Question (from BA) | Answer (from user) |
|---|--------------------|--------------------|
| 1 | Should user accounts be stored in PostgreSQL with password hashing (e.g. bcrypt/scrypt/argon2/pbkdf2 via Node `crypto`), or in-memory? | Stored in PostgreSQL `users` table with standard secure password hashing (Node.js standard `crypto.scrypt` / `pbkdf2` or `bcrypt`) and cookie-based sessions / JWT. |
| 2 | What endpoints should the custom Auth API provide? | `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`. |
| 3 | How should the session be preserved? | HttpOnly cookie containing a secure session token or signed JWT, read by middleware and server components. |

