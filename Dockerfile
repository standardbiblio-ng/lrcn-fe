# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Set build-time environment variables
ARG VITE_API_BASE_URL
ARG VITE_REMITA_PUBLIC_KEY

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_REMITA_PUBLIC_KEY=${VITE_REMITA_PUBLIC_KEY}

# Build the app (Vite will use the env vars above)
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy built files to nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

