# Use Node.js LTS (Alpine for smaller image size)
FROM node:20-alpine AS base

# Install Python and build tools for native dependencies (e.g., pg, node-gyp)
RUN apk add --no-cache python3 make g++ libc6-compat

# Set working directory
WORKDIR /app

# Copy the monorepo root package files
COPY package.json package-lock.json ./

# Copy all workspaces' package.json files to leverage Docker caching for dependencies
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/config/package.json packages/config/
COPY packages/indicators/package.json packages/indicators/
COPY packages/types/package.json packages/types/
COPY contracts/package.json contracts/

# Install dependencies using npm ci for deterministic builds
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build all packages and apps in the workspaces
RUN npm run build --workspaces --if-present

# Expose ports for both services (documentation purpose)
EXPOSE 3000 3001

# Default command (overridden in docker-compose.yml)
CMD ["npm", "start"]
