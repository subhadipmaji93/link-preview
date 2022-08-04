FROM node:alpine3.15

WORKDIR /var/app

COPY package.json .

COPY . .

CMD ["node",  "index.js"]