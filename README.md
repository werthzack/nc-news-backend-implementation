# NC News Seeding

## 🛠️ Environment Setup

This project uses Node.js and PostgreSQL, with environment variables managed via .env files. These files are ignored by Git and must be created manually.

## 📁 Required .env Files

Create the following files in the root of the project:

.env.development — for local development

.env.test — for running tests with Jest

Each file should point to a separate PostgreSQL database

## 🗃️ Database Setup

After setting up your .env files, you can create both local databases using the following command:

```bash
npm run setup-dbs
```

This script will execute a SQL file that creates the necessary databases (both development and test).

## 🧪 Running Tests with Jest

The test suite uses Jest

```bash
npm test
```

> Make sure you've run **npm run setup-dbs** beforehand so the test database is available.
