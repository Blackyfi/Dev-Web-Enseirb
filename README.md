# SeenFlix

## Dependencies

- **Docker** - See the [Official Documentation](https://docs.docker.com/get-started/)
- **Node.js** (v18+) - Required for local development

## Quick Start

### 1. Clone and configure

```bash
git clone https://github.com/Blackyfi/Dev-Web-Enseirb.git
cd Dev-Web-Enseirb
```

### 2. Configure the variables

Copy the `.env.example` file into `.env` and add your development variables. 

### 3. Run the app !

```bash
docker compose up -d --build
```

This will:
- Start the database via Docker
- Run the backend and frontend
- Expose ports 9090 and 9080 (9080 for main pages and 9090 for the Swagger)

### Other commands

You can also test the code using vitest

```bash
cd backend/src

npm run test:coverage
```

Other useful docker commands

```bash
docker compose logs
docker compose down 
```

## Project Structure

```
.
├── backend/          # Node.js API
├── frontend/         # Frontend app
├── database/         # SQL scripts
├── docker-compose.yml
├── .env.example      # Environment template
```

## Contributors

We have a authors.md file at the root of the project in which you have the translation "Contributor" to "Github Username".
- Malo Andre
- Nicolas Thongphao
- Tim Mazzolini
