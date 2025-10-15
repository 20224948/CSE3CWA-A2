# ---------- Builder ----------
FROM node:18-alpine AS builder
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of your app (public, app, etc.)
COPY . .

# Build the Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Runtime ----------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy the built app from the builder stage
COPY --from=builder /app /app

# Expose and run
EXPOSE 3000
CMD ["npm", "run", "start"]
