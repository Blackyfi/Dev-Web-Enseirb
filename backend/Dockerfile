FROM node:20-alpine

WORKDIR /app

COPY src/package.json src/package-lock.json* ./

RUN npm ci

COPY openapi.yaml ./
COPY src/. .

EXPOSE 3000

CMD ["node", "app.js"]