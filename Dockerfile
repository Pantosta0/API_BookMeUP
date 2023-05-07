# Selecciona la imagen de node que se va a utilizar
FROM node:14

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json al directorio /app
COPY package.json .

# Instala las dependencias del proyecto
RUN npm install

# Copia todo el contenido de la aplicación al directorio /app
COPY . .


# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Ejecuta la aplicación
CMD [ "npm", "run", "dev" ]
