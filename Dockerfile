# Stage 1: Build React frontend
FROM node:18-alpine AS client-builder

WORKDIR /app/client

COPY client/package.json ./
RUN npm install --silent

COPY client/ ./
RUN npm run build

# Stage 2: Build and run the Node.js server
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --production

# Copy server source files
COPY server.js ./
COPY db.js ./

# Copy built React frontend from stage 1
COPY --from=client-builder /app/client/build ./client/build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 && \
    chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]