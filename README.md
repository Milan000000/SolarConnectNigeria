# SolarConnect Nigeria

A modern, full-stack lead generation platform for solar installation services.

## Features
- **Public Website**: Landing page, quote request form, contact page.
- **Admin Dashboard**: Lead management, installer management, stats.
- **Monetization**: Monthly subscription model for installers.
- **WhatsApp Integration**: Automatic message generation for leads.
- **Security**: Rate limiting, input validation, JWT authentication.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js, SQLite (better-sqlite3).
- **Auth**: JWT-based session management.

## Setup Instructions

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Access the app at `http://localhost:3000`.

### Admin Access
- **Route**: `/admin`
- **Password**: `milan000000`

## Deployment Guide

### GitHub
1. Create a new repository on GitHub.
2. Push the code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

### Vercel
1. Connect your GitHub repository to Vercel.
2. Set the **Build Command** to `npm run build`.
3. Set the **Output Directory** to `dist`.
4. Add Environment Variables:
   - `JWT_SECRET`: A secure random string.
   - `NODE_ENV`: `production`.
5. For the backend to work on Vercel, you may need to convert the Express server to Vercel Serverless Functions or use a separate backend host like Render or Railway.

## Environment Variables
- `GEMINI_API_KEY`: (Optional) For AI features.
- `JWT_SECRET`: Secret for signing admin tokens.
- `APP_URL`: The public URL of the application.
