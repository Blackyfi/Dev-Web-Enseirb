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


### 2. Run the app

#### Production mode

Copy the `.env.example` file into `.env` and add your variables. 
And then run:


```bash
./start.sh prod
```

This will build and run all services via Docker.

#### Development mode (recommended for local work)

Copy the `.env.example` file into `.env.local` and add your development variables. 
And then run:

```bash
./start.sh dev
```

This will:
- Start the database via Docker
- Run the backend locally with hot reload

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

