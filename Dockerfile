# Étape 1 : Build de l'application
FROM node:18 AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# Étape 2 : Déploiement
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY backend/ .

# Créer le dossier uploads
RUN mkdir -p uploads

EXPOSE 10000
CMD ["node", "server.js"]