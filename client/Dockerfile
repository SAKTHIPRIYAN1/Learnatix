# Builder stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build Next.js app
RUN npm run build

#  Runner stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built app and node_modules from builder
COPY --from=builder /app ./

# Expose Next.js port
EXPOSE 3000

# Start Next.js
CMD npm run dev
