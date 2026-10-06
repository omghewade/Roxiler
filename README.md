# Roxiler

Store Rating Web Application built with React, Node.js, Express, and SQLite.

## Features

- Role-Based Access Control (System Administrator, Store Owner, Normal User)
- Single login portal for all user types
- Store catalog with search by Name and Address
- 1 to 5 Star Rating system with submit and modify capabilities
- Store Owner dashboard with average ratings and rater details
- System Administrator dashboard with store and user management
- Column sorting across all data tables
- Input validations on Name (20-60 chars), Password (8-16 chars with uppercase and special character), Address (max 400 chars), and Email

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
npm run install:all
```

### Seeding Demo Data

```bash
npm run seed
```

### Running Locally

```bash
npm run dev
```

The backend server runs on `http://localhost:5000` and the frontend application runs on `http://localhost:5173`.

### Demo Credentials

- System Administrator: `admin@roxiler.com` / `Admin@12345`
- Store Owner: `owner.tech@roxiler.com` / `Owner@12345`
- Normal User: `user1@roxiler.com` / `User@12345`
