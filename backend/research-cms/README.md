# 🚀 GDD Toolkit — Research CMS (Strapi v5)

This directory contains the headless CMS backend for the **Global Development Dialogue (GDD) Toolkit**, built with [Strapi v5](https://docs.strapi.io).

It manages content types, data relations, and site roles (RBAC) for:
- AI Ethics Tools & Dashboard
- Geopolitical Analysis Modules
- Case Studies & Podcasts
- Funding Resources & Grants
- Project Planning Tools
- User Authentication & Site Roles (`student`, `researcher`, `admin`)

---

## 📋 Table of Contents
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
  - [1. Install Dependencies](#1-install-dependencies)
  - [2. Environment Configuration](#2-environment-configuration)
  - [3. Feeding the Database (Seed Data)](#3-feeding-the-database-seed-data)
  - [4. Running Strapi](#4-running-strapi)
- [Logging In to the Admin Panel](#-logging-in-to-the-admin-panel)
  - [First-Time Admin Setup](#first-time-admin-setup)
  - [Creating an Admin Account via CLI](#creating-an-admin-account-via-cli)
  - [Resetting an Admin Password](#resetting-an-admin-password)
- [Modifying Data Types & Content Types](#-modifying-data-types--content-types)
  - [Best Practices](#best-practices)
  - [Using the Content-Type Builder](#using-the-content-type-builder)
  - [Schema Files Architecture](#schema-files-architecture)
  - [Avoiding Breaking Changes](#avoiding-breaking-changes)
- [Exporting Seed Data for Your Team](#-exporting-seed-data-for-your-team)
- [Git Workflow: Staging & Pushing Changes](#-git-workflow-staging--pushing-changes)
- [Useful Commands Reference](#-useful-commands-reference)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## ⚙️ Prerequisites

Ensure your local development environment meets the required versions:
- **Node.js**: `>= 20.0.0 <= 24.x.x` (Recommended: `v20.x LTS`)
- **npm**: `>= 6.0.0`
- **Git**

Check versions in your terminal:
```bash
node -v
npm -v
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
From the repository root or inside this folder:
```bash
cd backend/research-cms
npm install
```

### 2. Environment Configuration
Create your local environment file by copying `.env.example`:
```bash
cp .env.example .env
```

For **local development**, SQLite is the default and recommended database. Ensure your `.env` contains at least:
```dotenv
HOST=0.0.0.0
PORT=1337

# Application Secrets (fill in any secure string for local dev)
APP_KEYS="localDevKey1,localDevKey2"
API_TOKEN_SALT=localDevApiTokenSalt
ADMIN_JWT_SECRET=localDevAdminJwtSecret
TRANSFER_TOKEN_SALT=localDevTransferTokenSalt
JWT_SECRET=localDevJwtSecret

# Local SQLite Database (recommended for local dev)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

> [!NOTE]
> When `DATABASE_CLIENT=sqlite`, Strapi automatically writes to `.tmp/data.db`. You do not need to configure Postgres or AWS credentials for local feature development.

---

### 3. Feeding the Database (Seed Data)

To populate your database with existing schemas, relations, permissions, and sample data (AI tools, case studies, podcasts, funding resources, etc.):

```bash
npm run seed:local
```

#### What this does:
Under the hood, this runs:
```bash
strapi import -f ./data/seed_data.tar.gz --force --exclude files
```
- It loads all content entities, configurations, and users-permissions mappings from `data/seed_data.tar.gz` into your local SQLite database.
- It ensures your local CMS is immediately populated with realistic mock data matching the frontend application.

> [!IMPORTANT]
> **Always stop the Strapi server (`Ctrl+C`) before running `npm run seed:local`!** If Strapi is running, the SQLite file will be locked and the import will fail with `SQLITE_BUSY`.
>
> If you ever want a clean reset, delete the SQLite file and re-import:
> ```bash
> rm -f .tmp/data.db
> npm run seed:local
> ```

---

### 4. Running Strapi

Start Strapi in **development mode** (with auto-reload and Content-Type Builder enabled):
```bash
npm run develop
# or
npm run dev
```

Once started:
- **Admin Panel UI**: [http://localhost:1337/admin](http://localhost:1337/admin)
- **REST API Root**: [http://localhost:1337/api](http://localhost:1337/api)

To stop the server at any time, press `Ctrl + C`.

---

## 🔐 Logging In to the Admin Panel

### First-Time Admin Setup
1. Open [http://localhost:1337/admin](http://localhost:1337/admin) in your web browser.
2. If this is your first time starting Strapi on a fresh database, Strapi will greet you with the **Welcome / First Administrator Registration** page.
3. Fill in your details:
   - **First name**
   - **Last name**
   - **Email** (use your university/student email)
   - **Password** (minimum 8 characters with upper/lowercase and symbols)
4. Click **Let's start** to access the dashboard.

### Creating an Admin Account via CLI
If you already imported seed data and need to create a new administrator account from the terminal:
```bash
npm run strapi admin:create-user
```
Follow the interactive prompts:
```text
? First name: Student
? Last name: Developer
? Email: student@example.edu
? Password: [hidden]
```
The user will be created immediately with the `Super Admin` role.

### Resetting an Admin Password
If you forget your local admin credentials:
```bash
npm run strapi admin:reset-password
```
Select the admin user and enter a new password.

---

## 🛠️ Modifying Data Types & Content Types

### Best Practices

1. **Always work in `develop` mode (`npm run develop`)**:
   Strapi only enables the **Content-Type Builder** and schema file editing in development mode. In production (`npm run start`), the schema is read-only.
2. **Use the Admin UI for Schema Changes**:
   Unless you are deeply familiar with Strapi v5 schema syntax, make data type modifications through the browser interface. Strapi handles syntax validation, relations, and TypeScript generation automatically.
3. **Commit generated types**:
   Whenever a content type is added or modified, Strapi automatically regenerates `types/generated/contentTypes.d.ts`. Always commit this file along with your schema changes.

### Using the Content-Type Builder
1. Log in to the Admin Panel at [http://localhost:1337/admin](http://localhost:1337/admin).
2. In the left navigation bar, click **Content-Type Builder** (under *Plugins*).
3. Select the collection or single type you wish to edit (e.g. `Ai Tool`, `Case Study`, `Funding Resource`).
4. **To add a field**: Click **+ Add another field**, choose the data type (Text, Rich Text, Number, Boolean, Relation, Component, etc.), and configure settings.
5. **To modify a field**: Click the pencil icon next to the existing field to change its label, validation rules, or advanced settings.
6. Click the green **Save** button in the top right.
7. Strapi will automatically restart the server, write the updated JSON to disk, and regenerate TypeScript types.

### Schema Files Architecture
All schema definitions are stored as version-controlled code:
- **Custom Content Types**: `src/api/<collection-name>/content-types/<collection-name>/schema.json`
- **Users & Permissions Overrides**: `src/extensions/users-permissions/content-types/user/schema.json`
- **Generated TypeScript Types**: `types/generated/contentTypes.d.ts`

### Avoiding Breaking Changes
When modifying existing content types:
- ⚠️ **Changing Field Types**: Changing an existing field type (e.g. from `String` to `Integer` or from `Single Media` to `Multiple Media`) may corrupt or discard existing entries in the database. If necessary, test with a test field first.
- ⚠️ **Renaming Fields**: Renaming a field (e.g. `title` to `headline`) drops the old database column and creates a new one. Values in existing records will be lost unless manually migrated.
- ⚠️ **Adding Required Fields**: If you mark a new field as **Required**, existing entries created before this change will fail validation when saved unless a default value is provided or records are updated.
- ⚠️ **Relations**: Ensure both sides of bidirectional relations are saved before testing API endpoints.

---

## 📦 Exporting Seed Data for Your Team

When you create new content types, adjust relations, or add test entries that the rest of your team (and frontend developers) need, **export the updated data back into the seed archive**:

```bash
npm run seed:export
```

*(This runs `strapi export -f ./data/seed_data.tar.gz --no-encrypt --exclude files`)*

This command exports the updated schema, permissions, and database records directly to [data/seed_data.tar.gz](file:///home/ssefa/gdd/gdd-toolkit-2026/backend/research-cms/data/seed_data.tar.gz) so other students can simply run `npm run seed:local` and have your latest data!

---

## 🚀 Git Workflow: Staging & Pushing Changes

When you make changes to Strapi, follow this checklist to ensure all necessary files are pushed to Git without leaking secrets or temporary database files:

### What TO Commit:
- ✅ `src/api/**/schema.json` (modified or new content types)
- ✅ `src/extensions/` (any custom schema extensions)
- ✅ `types/generated/contentTypes.d.ts` (updated TypeScript definitions)
- ✅ `data/seed_data.tar.gz` (updated seed data archive)
- ✅ `src/api/**/controllers/`, `services/`, `routes/` (custom API logic)
- ✅ `package.json` and `package-lock.json` (if new packages were installed)

### What NEVER to Commit:
- ❌ `.env` (contains secrets, API keys, and database passwords)
- ❌ `.tmp/` or `.tmp/data.db` (local SQLite database file)
- ❌ `*.pem` or `*.key` (SSH keys or private certificates)
- ❌ `build/`, `dist/`, `.cache/`, or `node_modules/`

### Step-by-Step Git Commands:
```bash
# 1. From the backend/research-cms folder, check what files changed
git status

# 2. Stage your schema, types, and seed data
git add src/api/ types/generated/ data/seed_data.tar.gz

# 3. If you installed dependencies or edited configuration
git add package.json package-lock.json config/

# 4. Commit with a meaningful message
git commit -m "feat(cms): update ai-tool schema and refresh seed_data"

# 5. Push to your working branch
git push origin <your-feature-branch>
```

---

## 📖 Useful Commands Reference

| Command | Description |
| :--- | :--- |
| `npm run develop` / `npm run dev` | Starts Strapi with auto-reload and Content-Type Builder at `http://localhost:1337/admin` |
| `npm run seed:local` | Imports seed data from `data/seed_data.tar.gz` into local database |
| `npm run seed:export` | Exports current local database & schema to `data/seed_data.tar.gz` |
| `npm run build` | Compiles the Strapi admin panel and generates production assets |
| `npm run start` | Starts Strapi in production mode (schema editing disabled) |
| `npm run strapi admin:create-user` | Interactively creates a new admin user from terminal |
| `npm run strapi admin:reset-password` | Resets an admin user password from terminal |
| `npm run console` | Opens interactive Strapi CLI console for running queries |

---

## ❓ Troubleshooting & FAQ

#### `SQLITE_BUSY: database is locked` during `npm run seed:local`
- **Cause**: Strapi or another process is currently running and holding a lock on `.tmp/data.db`.
- **Solution**: Stop the Strapi server (`Ctrl + C` in the running terminal) before executing `npm run seed:local`.

#### `strapi: command not found`
- **Cause**: Dependencies are not installed or `node_modules` is missing.
- **Solution**: Run `npm install` inside `backend/research-cms`.

#### My new fields do not show up in the frontend or TypeScript errors appear
- **Solution**: Run `npm run build` in Strapi to re-trigger TypeScript type generation. Make sure permissions for the content type are granted under **Settings > Users & Permissions Plugin > Roles > Public / Student**.

#### How do I wipe everything and start from scratch?
```bash
# 1. Stop Strapi
# 2. Delete the SQLite file
rm -f .tmp/data.db
# 3. Re-import clean seed data
npm run seed:local
# 4. Restart Strapi
npm run develop
```
