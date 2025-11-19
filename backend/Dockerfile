FROM node:18-alpine

WORKDIR /app

COPY src/package.json src/package-lock.json* ./
RUN npm install --production

COPY src/. .

EXPOSE 3000

CMD ["node", "app.js"]