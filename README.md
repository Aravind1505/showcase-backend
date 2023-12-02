## Description

Backend for editable website using Nest.js

## Setup

Create .env file containing "DATABASE_URL" with the given format in the root folder

```bash
DATABASE_URL="postgresql://<user>:<pass>@localhost:<port>/<db_name>?schema=public"
```

Create Docker image using this in docker-compose.yml from above url

```
version: '3.8'
services:
  dev-db:
    image: postgres:13
    ports:
      - <port>:5432
    environment:
      POSTGRES_USER: <user>
      POSTGRES_PASSWORD: <pass>
      POSTGRES_DB: <db_name>
```

start the container using 

```bash
$ docker compose up dev-db -d
```

deploy prisma changes after setting up the container using 

```bash
$ npx prisma migrate deploy
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```