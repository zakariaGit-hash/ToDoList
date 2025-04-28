# Étape de build
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

# Ajout des variables d'environnement
ENV npm_config_platform=linux
ENV npm_config_arch=x64

# Installation des dépendances et des outils nécessaires
RUN npm install --include-dev
RUN npm install esbuild

# Ajout des permissions d'exécution aux binaires dans node_modules/.bin/
RUN chmod -R +x ./node_modules/.bin/

# Copie du reste des fichiers du projet
COPY . .

# Définition des variables d'environnement pour VITE et NODE_ENV
ENV VITE_API_URL=/api
ENV NODE_ENV=production

# Construction du projet
RUN npm run build

# Étape de production
FROM nginx:alpine

# Copie des fichiers générés par le build dans l'image Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
