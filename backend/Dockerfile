FROM node:18-alpine
WORKDIR /app
RUN npm install -g nodemon
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["nodemon", "index.js"]