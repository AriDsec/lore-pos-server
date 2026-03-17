FROM node:18-alpine
WORKDIR /app

# Dependencias del servidor
COPY package*.json ./
RUN npm install

# Dependencias del cliente
COPY client/package*.json ./client/
RUN cd client && npm install

# Copiar TODO el código
COPY . .

# Compilar cliente — siempre fresco
RUN rm -rf public && cd client && npm run build

EXPOSE 8080
CMD ["node", "server.js"]
