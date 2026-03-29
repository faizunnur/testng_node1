FROM node:18-alpine

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install server dependencies
RUN npm install --production

# Copy client package files and install
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy all source files
COPY . .

# Build React frontend
RUN cd client && npm run build

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Start the server
CMD ["node", "server.js"]