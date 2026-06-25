FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund --registry=https://registry.npmjs.org/

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY server.js ./server.js

EXPOSE 80

CMD ["node", "server.js"]
