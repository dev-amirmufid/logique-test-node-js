# Logique Test Node.js

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
- Docker (optional)

## Project Structure
```base
src/
├── controllers/            # Route controllers
├── middlewares/            # Middleware (e.g., validation, logging, error handling)
├── routes/                 # Route definitions
├── services/               # Services
├── utils/                  # Utility functions (e.g., logger)
├── swagger.ts              # Swagger setup
└── app.ts                  # Main application setup
prisma/                     # Prisma schema and migrations
├── schema.prisma.ts        # Prisma database schema
└── ...                     # Other prisma files
tests/
└──book.controller.test.ts  # Tests for book routes
```

## Getting Started (using Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/dev-amirmufid/logique-test-node-js.git
cd logique-test-node
```

### 2. Build and Run the Application with Docker
Use Docker Compose to build and run the application and database containers:

```bash
docker-compose up --build
```

### 3. Run Migrations
After the containers are up and running, apply Prisma migrations inside the Docker container:

```bash
docker-compose exec app npx prisma migrate dev --name init
docker-compose exec app npx prisma generate
```

### 4. Access Swagger Documentation
You can access the Swagger UI for API documentation at:
```bash
http://localhost:3000/api-docs
```

### 5. Run Unit and Integration Tests
To run all the tests using Jest inside the Docker container, use the following command:
```bash
docker-compose exec app npm run test
//or
docker-compose exec app npx jest --coverage
```

## Getting Started

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/library-book-management.git](https://github.com/dev-amirmufid/logique-test-node-js.git)
cd logique-test-node
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables
Create a .env file in the root of the project and add the following environment variables:

```bash
DATABASE_URL="mysql://youruser:yourpassword@localhost:3306/logique_test_db"
PORT=3000
```

### 4. Set Up the Database
#### Run Prisma Migrations
After setting up your database, run the following commands to apply the database migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run App

#### Development
```bash
npm run dev
```

#### Build
```bash
npm run build
npm run start
```

#### Run Unit and Integration Tests
```bash
npm run test
//or
npx jest --coverage

```

The application will start at http://localhost:3000.

### 6. Access Swagger Documentation
You can access the Swagger UI for API documentation at:
```bash
http://localhost:3000/api-docs
```
