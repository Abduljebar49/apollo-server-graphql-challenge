# apollo-server-graphql-test-task

## Getting Started

This project contains authentication example using apollo-server graphql
using Mongodb and Mongoose which is ORM for MongoDb schema
### Prerequisites

To run this project you need to have node installed in your system
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

There are a couple of things 

1. Get a free API Key at [https://www.mongodb.com/atlas/database](https://www.mongodb.com/atlas/database)
2. Clone the repo
   ```sh
   git clone https://github.com/Abduljebar49/apollo-server-graphql-challenge.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. add .env file in root folder
  ```sh
    touch .env
  ```
5. Enter your connection string from mongo db in `.env` file
    and alse we need access token  and refresh token constant value
   ```js
    ACCESS_TOKEN_SECRET = "your access token secret"
    REFRESH_TOKEN_SECRET = "your refresh token secret"
    MONGO_DB_CONNECTION_STRING="mongodb+srv://<username>:<password>@<db-url>.mongodb.net/"
   ```
6. Now run the project
    ```sh
    npm start
    ```


<p align="right">(<a href="#readme-top">back to top</a>)</p>