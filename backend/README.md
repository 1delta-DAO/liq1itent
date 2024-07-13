# liq1itent - order backend

## Provision Database
```bash
docker compose up
```

## Install
```ts
yarn
```

## ENV
- Copy `.env.example` to `.env`

## Run
```ts
yarn start
```

## Use

Go to `localhost:4000/api` to see the API documentation.

#### Create a new order
```bash
/order/create
```

#### Get all orders
```bash
/order/get
```
#### Update order status
```bash
/order/update-status
```
