# Usa la imagen oficial de Node.js como base
FROM node:18

# Crea el directorio de la aplicación
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Compila la aplicación
RUN npm run build

# Exponer el puerto en el que tu aplicación se ejecutará
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
