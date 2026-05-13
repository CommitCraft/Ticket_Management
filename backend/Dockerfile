FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "start"]
