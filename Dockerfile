# Build dependencies layer
FROM node:22-slim AS dependencies
WORKDIR /app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
COPY ./.npmrc ./
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install pnpm -g
RUN pnpm i 

# Build application layer
FROM node:22-slim AS builder
RUN apt update
RUN apt install openssl -y
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install pnpm -g
RUN pnpm generate
RUN pnpm build 

# Prepare Next.js runtime environment
FROM node:22-slim AS runner
RUN apt update
RUN apt install openssl -y
# Set up working directory
WORKDIR /app

# Environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Copy necessary files for Next.js
COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/.next/static ./standalone/.next/static
COPY --from=builder /app/public ./standalone/public

CMD  node ./standalone/server.js
