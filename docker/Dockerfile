# Stage 1: Development
FROM node:22.11-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

ENV MODE=development

CMD [ "npm" , "run", "start:dev"]

# Stage 2: Production
FROM node:22.11-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production --silent

COPY . .

RUN npm run build

EXPOSE 3001

ENV MODE=production

CMD [ "npm", "run", "start:prod" ]
