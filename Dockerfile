# ---- Base (builder)
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps first (better cache)
COPY package*.json ./
RUN npm ci

# Copy the rest and build
COPY . .
# Disable Next telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runtime (standalone)
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy the standalone server and assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
