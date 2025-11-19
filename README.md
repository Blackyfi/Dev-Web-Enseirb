# SeenFlix

## Dependencies

- **Docker** - See the [Official Documentation](https://docs.docker.com/get-started/)
- **Node.js** (v18+) - Required for local development

## Quick Start

### 1. Clone and configure

```bash
git clone <repo-url>
cd Dev-Web-Enseirb
```

### 2. Setup environment variables

Copy the example file and configure your variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
- `JWT_SECRET` - Your secret key for JWT tokens
- `TMDB_API_KEY` - Your TMDB API key

### 3. Run the application

#### Development mode (recommended for local work)

```bash
./start.sh dev
```

This will:
- Start the database via Docker
- Run the backend locally with hot reload

#### Production mode

```bash
./start.sh prod
```

This will build and run all services via Docker.

### Other commands

```bash
./start.sh stop   # Stop all containers
./start.sh logs   # View container logs
```

## Project Structure

```
.
├── backend/          # Node.js API
├── frontend/         # Frontend app
├── database/         # SQL scripts
├── docker-compose.yml
├── .env.example      # Environment template
└── start.sh          # Startup script
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_HOST` | Database host (`localhost` for dev, `database` for prod) |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens |
| `TMDB_API_KEY` | TMDB API key |
| `LOG_LEVEL` | Morgan log level (`dev`, `combined`, etc.) |

## Contributors

- Malo Andre
- Nicolas Thongphao
- Tim Mazzolini

