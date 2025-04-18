FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install -g @nestjs/cli

# Install OpenSSL (required by Prisma)
RUN apk add --no-cache openssl

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 6000

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'npm run start:prod' >> /app/start.sh && \
    chmod +x /app/start.sh

# Command to run the application
CMD ["sh", "/app/start.sh"] 