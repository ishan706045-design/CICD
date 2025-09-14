# Dockerfile
# Build stage
FROM node:20-bullseye AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

# Production stage
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production

# Copy built JS
COPY --from=builder /usr/src/app/dist ./dist


EXPOSE 8080
CMD ["node", "dist/server.js"]

