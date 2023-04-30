FROM node:alpine

LABEL org.opencontainers.image.source https://github.com/DulliAG/Infoapp-Notifications

WORKDIR /app/infoapp_notifications

COPY package*.json ./

RUN --mount=type=secret,id=npm,target=.npmrc npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]