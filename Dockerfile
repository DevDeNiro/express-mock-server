FROM node:18


WORKDIR /usr/src/app

COPY package*.json ./

RUN rm -rf node_modules package-lock.json && npm install
RUN npm uninstall bcrypt && npm install bcrypt --build-from-source
# Bundle app source
COPY . .

# Exposer le port sur lequel l'application va tourner
EXPOSE 9000

# Commande pour démarrer l'application
CMD ["node", "bin/www"]
