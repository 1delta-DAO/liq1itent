FROM node:lts-alpine AS builder
WORKDIR /liqu1tent
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine
WORKDIR /liqu1tent
COPY --from=builder /liqu1tent ./
EXPOSE 4000
CMD ["npm", "run", "start:prod"]