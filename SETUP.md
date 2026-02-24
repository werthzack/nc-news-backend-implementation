# 🛠️ Project Setup Guide

This guide explains how to run the **Chronicle API** locally for development and testing.

---

## 📦 Prerequisites

Ensure you have the following installed on your machine:

| Tool       | Minimum Version |
| ---------- | --------------- |
| Node.js    | v18+            |
| PostgreSQL | v12+            |

## 📦 Installing Dependencies

Install all required project dependencies:

npm install

## 🛠️ Environment Setup

This project uses Node.js and PostgreSQL, with environment variables managed via .env files. These files are ignored by Git and must be created manually.

## 📁 Required .env Files

Create the following files in the root of the project:

**.env.development** — for local development

```env
PG_DATABASE = nc_news
```

**.env.test** — for running tests with Jest

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

## 🧹 Common Issues

    Database does not exist
    Run npm run setup-dbs

    Unable to connect to PostgreSQL
    Ensure PostgreSQL is running and environment variables are correctly set

    Tests failing unexpectedly
    Confirm the test database exists and is correctly configured
