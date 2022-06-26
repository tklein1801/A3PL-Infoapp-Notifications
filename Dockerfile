FROM node:alpine

LABEL org.opencontainers.image.source https://github.com/DulliAG/Infoapp-Notifications

WORKDIR /usr/src/infoapp-notifications/

ARG NPM_TOKEN
COPY .npmrc .npmrc
COPY package*.json ./

RUN npm install
RUN rm -f .npmrc

COPY . .

RUN npm run build

CMD ["node", "out/index.js"]