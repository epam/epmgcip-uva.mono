# Mono repository instruction

## First run
Run in the `root` folder to install packages for all workspaces `yarn install`

### To run frontend locally
Run in the `root` folder `yarn web:dev`

### To build frontend
Run in the `root` folder `yarn web:build`

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
