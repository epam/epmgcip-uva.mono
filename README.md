# Mono repository instruction

## First run

Run in the `root` folder to install packages for all workspaces `yarn install`.
Run `yarn build:shared` to build common code.

## Frontend

### Before first start

Create file /packages/frontend/.env and set the following variables (look up values in firebase console or in github secrets)

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_CLOUD_FUNCTIONS_URL=http://127.0.0.1:5001/epmgcip-uva-develop/us-central1/api
```

### To run frontend locally

Run in the `root` folder `yarn web:dev`

### To run frontend tests

Run in the `root` folder `yarn test` or `npx vitest`

### To build frontend

Run in the `root` folder `yarn web:build`

## Backend

### Before first start

Create file /.env and set variables (ask dev lead for the values):

```
DEV_MODE=true
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHANNEL_ID=
AUTH_BOT_TOKEN=
AUTH_SPECIAL_USER_USERNAMES='panela'
```

Create folder /packages/backend/secrets and put here firebase-adminsdk.json (export it from firebase console: /settings -> serviceaccounts -> generate private key). Do not submit this key and keep it private.

### To run functions locally

Run in the `root` folder `yarn be:dev`

## Packages

To add package to the `workspace` you need move to that workspace and run `yarn add package-you-need`
It'l be install in the root node_modules folder

> !Note: You don't need run `yarn install` inside your packages workspaces.
> Make sure you don't have yarn.lock inside your workspaces

## Deploy

### Deploy frontend

```
yarn web:build
yarn deploy:frontend
```

### Deploy functions

```
yarn deploy:functions
```
