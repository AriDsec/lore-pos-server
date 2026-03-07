FROM node:18-alpine

WORKDIR /app

# Instalar dependencias del servidor
COPY package*.json ./
RUN npm install

# Instalar dependencias del cliente
COPY client/package*.json ./client/
RUN cd client && npm install

# Copiar cliente y construir
COPY client/ ./client/
RUN cd client && npm run build

# Copiar servidor (sin pisar el public ya construido)
COPY server.js .
COPY railway.toml .

EXPOSE 8080

CMD ["node", "server.js"]
