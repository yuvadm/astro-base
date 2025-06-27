# Full-Stack Astro + Cloudflare

A complete full-stack application built with Astro, running on Cloudflare Workers with D1 database.

## Features

- **Frontend**: Astro with React components and Tailwind CSS
- **Backend**: Cloudflare Workers with REST API endpoints
- **Database**: Cloudflare D1 SQLite database
- **Local Development**: Integrated Cloudflare Workers runtime via platformProxy

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for deployment)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up local database:**
   ```bash
   npm run db:migrate
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:4321` (or next available port)

## How It Works

This project uses Astro's Cloudflare adapter with `platformProxy.enabled: true`, which provides:

- **Automatic Cloudflare Workers Runtime**: The `workerd` binary runs alongside Astro's dev server
- **Local D1 Database**: A local SQLite database is automatically created and managed
- **Seamless API Integration**: API endpoints receive a real D1 database instance without additional setup
- **Production Parity**: The local environment closely matches the production Cloudflare Workers environment

The platform proxy eliminates the need for separate `wrangler dev` commands while providing full D1 database functionality during development.

### Deployment Setup

1. **Create D1 database:**
   ```bash
   npm run db:create
   ```

2. **Update wrangler.toml:**
   - Copy the database ID from the previous command output
   - Replace `your-database-id-here` in `wrangler.toml`

3. **Initialize production database:**
   ```bash
   npm run db:init
   ```

4. **Build and deploy:**
   ```bash
   npm run build
   npm run deploy
   ```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

## Project Structure

```
src/
├── components/
│   └── TaskManager.tsx    # React component for task management
├── pages/
│   ├── api/
│   │   ├── tasks.ts       # Tasks API endpoints
│   │   └── tasks/[id].ts  # Individual task operations
│   └── index.astro        # Main page
├── layouts/
│   └── StandardLayout.astro
└── env.d.ts              # TypeScript definitions

schema.sql                 # Database schema
wrangler.toml             # Cloudflare Workers configuration
```

## Local vs Production

- **Local**: Uses Wrangler's local D1 database simulator
- **Production**: Uses actual Cloudflare D1 database in the cloud

The same codebase works seamlessly in both environments thanks to Astro's Cloudflare adapter and Wrangler's local development tools.