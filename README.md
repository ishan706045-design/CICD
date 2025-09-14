# textuned-backend
TEXTuned backend (GCP Cloud Run + Vertex AI + billing + Matecat integration). Secure API, quotas, SEO-first pipeline.
# Project Setup Guide

A quick guide to set up and run this project in your local development environment.

---

## Prerequisites

Before starting, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

---

## Setup Steps

1. **Clone or Pull the Latest Code**

Ensure you are on the `dev` branch and pull the latest changes:

```bash
   git checkout dev
   git pull origin dev
```

## Install Dependencies

Navigate to the parent folder of the project and install all required dependencies:

```bash
npm install
```

## Set Environment Variables

Place the provided environment variables in a .env file at the root of the project.

**Example .env**

Start the Development Server
Run the project in development mode:

```
npm run start:dev
```

Open your browser and navigate to:

http://localhost:8080/health
 to confirm the server is running.

## Notes
Always pull the latest code from the dev branch before starting development.

Ensure your .env file is correctly set up; missing variables may cause errors.

Use npm run start:dev for development.

## Troubleshooting
Server not starting: Check that all environment variables are correctly set.

Dependencies missing: Run npm install again.

Port conflicts: Make sure no other process is using the port specified in .env.