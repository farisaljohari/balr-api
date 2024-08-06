# Backend

## Overview
This is the backend for an IoT application built using NestJS. It interfaces with the Tuya IoT cloud platform to manage homes, rooms, devices, ...etc.
This is the backend APIs project, developed with NestJS for Syncrow IOT Project. 

## Database Model
The database uses PostgreSQL and TypeORM. Below is an entity relationship diagram:

The main entities are:

User - Stores user account information
Home - Represents a  home/space
Room - Represents a  room/sub-space
Device - Represents a connected device
Product - Stores metadata about device products
Other Entities - sessions, OTPs, etc.

The entities have a one-to-many relationship - a user has multiple homes, a home has multiple rooms, and a room has multiple devices.

## Architecture
The application is deployed on Azure App Service using Docker containers. There are separate deployment slots for development, staging, and production environments.


## Installation
First, ensure that you have Node.js `v20.11` or newer (LTS ONLY) installed on your system.

To install the project dependencies, run the following command in the project root directory:

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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## ERD Diagram

![Syncrow ERD Digram](https://github.com/SyncrowIOT/backend/assets/83524184/94273a2b-625c-4a34-9cd4-fb14415ce884)


## Architecture
                                       +----------------------------------+
                                       |                                  |
                                       |         Applications             |
                                       |                                  |
         +-----------------------------+-------------+--------------------+
         |                                             |                   |
         |                                             | API Calls         |
         |                                             |                   |
         |                                             v                   |
         |            +---------------------+------------------------+     |
         |            |                     |                        |     |
         |            |     Dev Slot        |     Staging Slot       |     |
         |            |                     |                        |     |
         |            +---------------------+------------------------+     |
         |                     |                          |                |
         |                     |                          |                |
         |                     |                          |                |
         |            +------------------+       +---------------------+     |
         |            |  Dev Database    |       |  Staging Database   |     |
         |            +------------------+       +---------------------+     |
         |                                                                 |
         |              +-----------------------------------------+        |
         |              |                                         |        |
         |              |                Production               |        |
         |              |                                         |        |
         |              +-----------------------------------------+        |
         |                     |                          |                |
         |                     |                          |                |
         |                     |                          |                |
         |            +------------------+                |                |
         |            | Production DB    |                |                |
         |            | Highly Available |                |                |
         |            |     Cluster      |                |                |
         |            +------------------+----------------+                |
         |            |  Production DB   |                |                |
         |            |  Standby Node    |                |                |
         |            +------------------+                |                |
         |            |  Production DB   |                |                |
         |            |  Standby Node    |                |                |
         |            +------------------+                |                |
         |            |  Production DB   |                |                |
         |            |  Standby Node    |                |                |
         |            +------------------+----------------+                |
         +-----------------------------------------------------------------+
