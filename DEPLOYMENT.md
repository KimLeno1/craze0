# Closet Kraze - Deployment & Documentation

Closet Kraze is a high-octane, gamified eCommerce platform for limited-edition archival fashion. It features real-time drops, social proofing, and a specialized dashboard for suppliers and administrators.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide React, Sonner.
- **Backend**: Express 5, Node.js, WebSockets (ws), Multer (for uploads).
- **Database**: SQLite (better-sqlite3).
- **Real-time**: WebSockets for live user counts, social proof notifications, and activity simulation.

## Key Features

- **Gamified Shopping**: Reputation system (REP), levels, and ranks (Neophyte to Arch-Archiver).
- **Real-time Drops**: Scheduled releases of limited-edition products.
- **Social Proof**: Live notifications of other users' purchases and activities.
- **Supplier Dashboard**: Specialized panel for suppliers to manage products, orders, and price anomalies.
- **Admin Panel**: Comprehensive oversight for metrics, security, and global settings.
- **Stylist AI & Try-On**: Interactive features for personalized style recommendations and virtual try-ons.
- **Mystery Boxes & Games**: Earn rewards through interactive mini-games and mystery box openings.

## Local Setup & Deployment

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository (or download the source).
2. Navigate to the project directory.
3. Install dependencies:
   ```bash
   npm install
   ```

### Running in Development Mode

To start the server with hot-reloading for the backend and Vite middleware for the frontend:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Building for Production

To optimize the frontend for production:
```bash
npm run build
```
This will generate the static files in the `dist/` directory.

### Running in Production Mode

After building the frontend, start the server in production mode:
```bash
NODE_ENV=production npm start
```
The server will serve the static files from `dist/` and handle all API and WebSocket requests.

## Login Details

The application comes with pre-seeded mock data for testing.

### Admin Access
- **Identifier**: `leno`
- **Password**: `1q2w3!`

### Supplier Access
Suppliers can log in using their ID or Name as the identifier (no password required in mock mode).
- **Supplier 1**: `sup1` (CyberKnit Industries)
- **Supplier 2**: `sup2` (Void Loom Textiles)
- **Supplier 3**: `sup3` (Ethereal Silks)

### User Access
All mock users use the password `password123`.
- **User 1 (Viper_X)**: `viper@archivers.net`
- **User 2 (Ghost_Shell)**: `ghost@void.com`
- **User 3 (Luxe_Lord)**: `lord@heirloom.io`
- **User 4 (Glitch_Boi)**: `glitch@chaos.org`

## Project Structure

- `/api`: Backend logic, database schema, and API routes.
- `/src`: Frontend React components, hooks, and services.
- `/uploads`: Directory for stored product and feed images.
- `server.ts`: Main entry point for the Express and WebSocket server.
- `database.sqlite`: SQLite database file (generated on first run).
