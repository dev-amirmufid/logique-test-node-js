# Library Book Management System

This is a RESTful API for managing a library book system, built using TypeScript, Express, and Prisma. The API includes features for CRUD operations on books, search functionality, pagination, and error handling. 

## Features
- CRUD operations for books
- Search books by title, author, or genre
- Pagination for book listings
- Validation using Joi
- Error handling with custom exceptions
- Logging using Winston
- Swagger documentation
- Tests using Jest and Supertest

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (>=14.x)
- npm (>=6.x)
- Docker (optional, for running the database container)

## Getting Started

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/library-book-management.git](https://github.com/dev-amirmufid/logique-test-node-js.git)
cd logique-test-node

### 2. Install Dependencies

```bash
npm install

### 3. Set Up Environment Variables
Create a .env file in the root of the project and add the following environment variables:

```bash
DATABASE_URL="mysql://youruser:yourpassword@localhost:3306/logique_test_db"
PORT=3000

### 4. Set Up the Database
#Run Prisma Migrations
After setting up your database, run the following commands to apply the database migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate

### 5. Run App

#Development
```bash
npm run dev

#Build
```bash
npm run build
npm run start



