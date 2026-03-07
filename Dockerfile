FROM node:18-alpine

WORKDIR /app

# Instalar dependencias del servidor
COPY package*.json ./
RUN npm install

# Instalar y construir el frontend
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# Copiar resto del servidor
COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
