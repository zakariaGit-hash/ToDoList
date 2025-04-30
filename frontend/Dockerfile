FROM node:18-alpine as build

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --include-dev

# Install esbuild
RUN npm install esbuild

# Fix permissions explicitly - Be thorough with permissions
RUN chmod -R +x ./node_modules/.bin/
RUN find ./node_modules -type f -name "vite" -exec chmod +x {} \;

# Copy project files
COPY . .

# Explicitly call the binary with full path
RUN ./node_modules/.bin/vite build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]