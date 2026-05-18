# 📰 NC News API

### _(NC News Backend Project)_

NC Mews API is a RESTful backend service built as part of the **NC News** project.  
It provides endpoints for managing articles, topics, users, and comments, mimicking the behaviour of a real-world news platform API.

The project focuses on backend fundamentals such as database design, RESTful routing, error handling, and test-driven development.

---

## 🧰 Tech Used

- **Node.js**
- **Express**
- **PostgreSQL**
- **node-postgres (pg)**
- **pg-format**
- **Jest**
- **Supertest**
- **dotenv**

---

## ✨ Features

- RESTful API following standard CRUD conventions
- Articles endpoint with:
  - sorting
  - filtering
  - comment counts
- Full comment system:
  - create
  - delete
  - retrieve by article
- Topic and user data retrieval
- Centralised error handling for:
  - invalid routes
  - invalid IDs
  - database errors
- Comprehensive test suite using Jest and Supertest
- Public API documentation served at `/docs`

---

## 🛠️ The Process

This project was built incrementally using a **test-driven development (TDD)** approach.

The development process included:

1. Designing the database schema and relationships
2. Writing failing tests for each endpoint
3. Implementing models and controllers to satisfy test requirements
4. Adding robust error handling and edge-case coverage
5. Refactoring for readability and maintainability
6. Documenting the API with semantic HTML for developer usability

The API structure follows REST principles, with endpoints grouped by resource (articles, comments, users, topics).

---

## 📘 What I Learned

Through this project, I gained hands-on experience with:

- Building a REST API using Express
- Writing and structuring SQL queries for relational data
- Using PostgreSQL error codes to handle invalid input
- Implementing test-driven development in a backend environment
- Structuring an Express application using MVC principles
- Writing clear, developer-focused API documentation
- Managing environment variables securely using `.env` files

This project strengthened my understanding of backend architecture and how APIs are designed for real-world use.

---

## 🚀 How to Run the Project

Setup and usage instructions are documented in detail here:

👉 **[Project Setup Guide](./SETUP.md)**

This includes:

- cloning the repository
- installing dependencies
- creating `.env` files
- setting up and seeding the database
- running the server
- running tests

---

## 🌐 Hosted Version

🔗 **Live API:** _<https://nc-news-backend-b1yp.onrender.com>_  
🔗 **API Documentation:** `/docs`

---

## 🧱 Minimum Requirements

| Tool           | Version |
| -------------- | ------- |
| **Node.js**    | v18+    |
| **PostgreSQL** | 12+     |
