# worker-app
worker-app assignment: - This is a "worker" that subscribe to race simulator events
and saved those data in a MongoDB database.
This worker will run and subscribe default `100` requests of race simulator events,
but you can change `REQUEST_LIMIT` number in env config file.

# Code Overview

## Dependencies

- worker_threads - The worker_threads module enables the use of threads that execute JavaScript in parallel.
- axios - Promise based HTTP client for the browser and node.js. 
- axios-mock-adapter - Axios adapter that allows to easily mock requests to perform unit test.
- dotenv - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
- jest - Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

## Application Structure

- `app.js` - The entry point to our application. This file will execute worker to subscribe the race simulator event data.
- `service/` - This folder contains the request service to call `/auth` and `/results` APIs and save result by help of data service to connect MongoDB using mongoose.
- `models/` - This folder contains the schema definitions for our Mongoose models and application model.
- `test/` - This folder contains unit test scripts and integration test script for the application.

## Database
- Used `MongoDB` to store race event results in `WorkerResults` database.
- You need to install local MongoDB to run application by `npm start` command.
- Application will use local connection (`mongodb://localhost:27017/`) , make sure connection and port is working.
- `Docker` Compose file will connect (`mongodb://mongo:27017`) application image with a MongoDB image (`mongo`).
- You need to run mongo image first to start application image (`worker`) manually.

## Getting Started

These instructions will get you a copy of the project up and running
on your local machine for development and testing purposes.

## Installation

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/ORG/PROJECT.git
$ cd PROJECT
```

To install and set up the library, run:

```sh
$ npm install
```

## Usage

### Serving the app

```sh
$ npm start
```

### Running the tests

```sh
$ npm test
```
- This task will execute jest runner to perform unit tests and integration test.
- This test file will use `axios-mock-adapter` to remove dependency from race simulator.
- And also contains integration test case against database.
- You can also execute command `npx jest --coverage` to generate code coverage.

### Building a distribution version

```sh
$ npm run build
```

This task will create a distribution version of the project
inside your local `dist/` folder

## Docker

### Running application

```bash
$ docker-compose up
```

### Stopping application

```bash
$ docker-compose down
```
