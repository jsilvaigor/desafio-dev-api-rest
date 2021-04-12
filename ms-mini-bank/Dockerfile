FROM node:lts as builder

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
