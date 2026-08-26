# ---- Stage 1: build the frontend ----
FROM node:20-alpine AS frontend_builder

WORKDIR /app

COPY ./Frontend/package.json ./Frontend/package-lock.json ./
RUN npm ci

COPY ./Frontend .
RUN npm run build

# ---- Stage 2: production server ----
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY ./Backend/package.json ./Backend/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY ./Backend .

COPY --from=frontend_builder /app/dist /app/public

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-3000}/health || exit 1

CMD ["node", "server.js"]
