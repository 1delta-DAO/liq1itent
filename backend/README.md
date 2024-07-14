# liq1itent - order backend

Backend implementation to collect signatures and orders from frontends and then serve it to solvers.

Includes a draft implementation of a solver that would settle orders as soon as they are available.

Could be served in a RFQ-style manner to a UI (by allowing solvers to show quotes to users)

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
