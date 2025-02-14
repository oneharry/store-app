# Store Management API
A simple RESTful API to manage products in a store. It's a containerized app built with Typescript, Express.js and MongoDB and other libraries such JWT for authentication, Zod for input validation. 


## Features

- User registration and login with JWT authentication
- User logout
- User profile retrieval
- Product management with CRUD operations
- Protected product route


## Tech Stack

- **Node.js** - JavaScript runtime environment
- **TypeScript** - Typed superset of JavaScript
- **Express.js** - Web framework
- **MongoDB** - NoSQL database for user data storage
- **JWT** - For token-based authentication
- **bcrypt** - Password hashing
- **Zod** - Input validation
- **Jest** - For unit testing
- **Docker** - Containerization

## Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/oneharry/store-app.git
cd store-app
```
2. Install NPM packages
   ```bash
   npm install
   ```
   
3. Enter the MongoDB variable in an `.env` file
   ```
    MONGODB_USERNAME="your username"
    MONGODB_USER_PASSWORD="user pass"
    MONGODB_DATABASE="db name"
    MONGODB_CLUSTER="cluster name"

    JWT_SECRET="your jwt secret key"
   ```
4. Start the app
    ```bash
    npm run dev
    ```
   Or run in the container

    ```bash
    docker-compose up
    ```
## Usage
    See the complete usage  [Documentation](https://documenter.getpostman.com/view/16000236/2sAYX2N4VW)

## Testing
1. Run unit test
    ``` bash
    npm test
    ```


## Contribution
You can contribute to the project

1. Fork the repository.
2. Create a new branch (git checkout -b feature/feature-name).
3. Commit your changes (git commit -am 'Add new feature').
4. Push your branch (git push origin feature/feature-name).
5. Open a pull request.

Please add tests for new functionalities.
