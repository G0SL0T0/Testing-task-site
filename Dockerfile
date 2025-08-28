# --------------------
FROM node:20-alpine AS build-scraper
WORKDIR /build
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci
RUN npm run build

# --------------------
FROM node:20-alpine AS build-ui
WORKDIR /ui
COPY frontend/package*.json ./
COPY frontend/tsconfig.json ./
COPY frontend/vite.config.ts ./
COPY frontend/src ./src
RUN npm ci
RUN npm run build

# --------------------
FROM nginx:alpine
RUN apk add --no-cache nodejs npm

WORKDIR /scrapper
COPY --from=build-scraper /build/dist ./dist
COPY --from=build-scraper /build/node_modules ./node_modules
COPY --from=build-scraper /build/package.json ./package.json
RUN chmod +x /scrapper/dist/scraper.js

COPY --from=build-ui /ui/dist /usr/share/nginx/html/ui
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /usr/share/nginx/html/site

EXPOSE 8008
CMD ["nginx", "-g", "daemon off;"]