# NestJS Microservice Template

This is a NestJS microservice starter template for my backend applications. This template includes built-in support for database access, MQTT messaging, Dockerized environments and some code quality tools.

## 🚀 Main Features

- 🔥 Fastify-based NestJS server
- 🧪 Unit & E2E testing with Jest
- 🐘 PostgreSQL via TypeORM
- 📡 MQTT client support (e.g., EMQX)
- 🧰 Environment-based configuration with `.env`
- 📄 Swagger documentation (e.g., available at `/api-docs`)
- 📦 Docker + Docker Compose support (DB & MQTT included)
- 🎨 ESLint + Prettier + Husky (pre-commit & pre-push)
- 📘 Node version controlled via `.nvmrc`


## 🛠 Requirements

### Local Development

Ensure the following tools are installed:

- [Node.js](https://nodejs.org/en/download)
- [nvm](https://github.com/nvm-sh/nvm) – Node version manager
- [VS Code](https://code.visualstudio.com/) with Prettier, ESLint, and TypeScript support (recommended)

You can also run the app entirely via Docker with:

```bash
docker-compose up
````
This will bootstrap everything: the app, PostgreSQL, and MQTT broker.

## Getting Started
```bash
nvm use    # Uses the Node version in .nvmrc
npm install
npm run prepare:husky  # Sets up Husky hooks

# Run the app
npm run start
```

You should now be able to see a response if you go to http://localhost:3000/status

> Note, you will need an instance of PostgreSQL and an MQTT Broker up and running (see docker-compose file).

## Testing
This repo supports both unit and end-to-end (E2E) testing strategies:

- Unit Tests	
  ```bash
  npm run test
  ```
- E2E Tests	(Requires DB + MQTT running)
  ```bash
  npm run test:e2e	
  ```

## 📁 Configuration
[ConfigModule](https://docs.nestjs.com/techniques/configuration) is used to retrieve environment variables from the `.env` file (if any). Otherwise, they will be retrieved from the `process.env`.

The Docker Compose automatically injects environment variables, configured at the `environment` level.