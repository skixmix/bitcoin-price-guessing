# Bitcoin (BTC-USD) Price Guessing WebApp 🪙💸

In this app, users make guesses on whether the price of Bitcoin will go **Up** or **Down**. The guess is resolved whenever the Bitcoin price changes, and at least **60 seconds** have passed since the guess.

> Note: this was made in 1 day for a coding challenge, so of course can still be improved, see the [future enhancements](#future-enhancements) section for more.

#### How it works

- You will find a login page, in which you can enter your username.

  - If the username is found, you will be logged in;
  - Otherwise, a new account will be created, starting with score 0;
  - You will be logged in in both cases.

- On the home page, you will be able to

  - Logout;
  - See the updated BTCUSD price;
  - Perform a single guess for UP or DOWN with the respective buttons.
    - You will not be able to perform a guess if there is already one unresolved in place.
    - A snackbar will appear to tell you the operation result in any case.

- The login state is persisted through a Cookie and a global local state with Zustand.
  - Whenever the API call to place a guess fails with code 401 Unauthorized, you will be logged out by the interceptor and brought back to the login page automatically.

## 📑 Index

1. [🏗️ Project Structure](#project-structure)
2. [🧰 Technologies Used](#technologies-used)
3. [🛠️ Microservices](#backend-microservices)
4. [⚡ Running Locally](#running-locally)
5. [🛠️ Running Services Independently](#running-services-independently)
6. [⚙️ Development Tools](#development-tools)
7. [📢 MQTT Topics](#mqtt-topics)
8. [🗄️ Database](#database)
9. [📚 Microservices Scaling](#microservices-scaling)
10. [⚡ Future Enhancements](#future-enhancements)
11. [📄 License](#license)

## Project Structure

This project is composed of a **frontend**, **backend microservices**, a **PostgreSQL** database and an **EMQX** message broker. It uses **Docker** for easy deployment.

### Folders:

- **`frontend`**: Vite + TypeScript + React + Zustand + MUI (really simple) frontend application.
- **`backend`**: Microservices for authentication, price guessing, and price tracking.
- **`docker-compose.yml`**: Docker Compose configuration to set up the entire architecture.

## Technologies Used

- **NestJS** with **Fastify** for microservices.
- **TypeScript** for type safety.
- **PostgreSQL** with **TypeORM** for the database.
- **EMQX** as the **MQTT broker** for real-time communication between microservices.
- **Docker** for containerization.
- **Vite**, **React**, and **Zustand** for the frontend.
- **Jest** for testing.
- **JWT** authentication
- **EventSource** and **SSE** for real-time updates without polling.

## Backend Microservices

The backend consists of **3 microservices**:

### 1. **authentication-service 🔐**

- **Purpose**: Handles user authentication using a simple **username** (no password).
- **JWT** is issued after a successful login to authenticate the user for other services.
- **Built with**: NestJS, TypeScript, Fastify.
- **API Docs**: Reachable locally here: http://localhost:3000/api-docs

### 2. **price-guessing-service 🎮**

- **Purpose**: Allows users to make a guess (Up or Down) on the Bitcoin price and track their score in real-time via **SSE**.
- **Built with**: NestJS, TypeScript, Fastify.
- **JWT** is required for protected routes.
- **API Docs**: Reachable locally here: http://localhost:3001/api-docs

### 3. **price-tracker-service 📊**

- **Purpose**: Tracks the BTC/USD price every **X seconds** (configurable via `INTERVAL_IN_SECONDS`) and updates the user scores.
- **Uses MQTT** to send updates to the `price-guessing-service`, which streams data to the frontend.
- **Built with**: Node.js, TypeScript.
- **API Docs**: Not required, as it's a cron job-based service.

## Running Locally

To run the entire application locally with Docker, follow these steps:

1. Ensure you have **Docker** and **Docker Compose** installed on your machine.
2. In the root of the repository, run the following command:
   ```bash
   docker-compose up
   ```
3. The services will be available as follows:
   - Frontend: http://localhost:3003
   - Authentication Service API Docs: http://localhost:3000/api-docs
   - Price Guessing Service API Docs: http://localhost:3001/api-docs

Once everything is up, you can interact with the frontend at http://localhost:3003, where you can make guesses on the Bitcoin price. Real-time updates will be streamed to your browser using **SSE**.

## Running Services Independently

If you'd like to run the individual services locally (without Docker), follow these steps for each service:

- Install dependencies:
  ```bash
  npm install
  # Start the service
  npm run start
  # For the frontend
  npm run dev
  ```
- You can also run the test suite with Jest:
  ```bash
  npm run test
  ```

## Development Tools

If you're using VSCode, I've included a .vscode folder with configurations to automatically format your code and run Prettier and ESLint.

## MQTT Topics

- `price/update/BTCUSD`: Sent when the price updates.

- `score/update`: Sent when user scores are updated.

These topics are consumed by the price-guessing-service, which updates the frontend in real-time.

## Database

The entire application data is stored in PostgreSQL. The data is managed using TypeORM, a TypeScript ORM.

## Microservices Scaling

The project is designed to use microservices, which makes it easy to scale the services horizontally:

- Authentication Service: Can be scaled to handle multiple user logins.

- Price Guessing Service: Can be scaled horizontally to allow multiple users to make guesses without downtime.

- Price Tracker Service: Only needs a single instance because it handles periodic updates.

## Future Enhancements

- Move the cron job logic from the price-tracker-service to the PostgreSQL database using stored procedures or triggers.

- Implement user registration and password-based authentication for more security.

- Implement a 401 Unauthorized interception also for the EventSources, in order to logout the user as soon as any 401 is received.

- Some tests could be improved, and the backend e2e tests are missing (other than the health-check).

## License

This project is licensed under the MIT License. See the [LICENSE](/LICENSE) file for details.
