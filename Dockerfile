# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Устанавливаем nodemon и concurrently глобально
RUN npm install -g nodemon concurrently

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем все зависимости (включая devDependencies)
RUN npm install

# Копируем весь исходный код внутрь контейнера
COPY . .

# Открываем порты для Express (5000) и Vite (5005)
EXPOSE 5000
EXPOSE 5005

# Запускаем команду, которая параллельно поднимет сервер и клиент
CMD ["npm", "run", "dev"]
