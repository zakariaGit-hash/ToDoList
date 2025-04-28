# Étape de build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Étape de production
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY . .

ENV NODE_ENV=production
EXPOSE 3008

# Installer wait-for-it et attendre MySQL
RUN apk add --no-cache bash netcat-openbsd
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
CMD ["/wait-for-it.sh", "mysql:3306", "--", "node", "server.js"]