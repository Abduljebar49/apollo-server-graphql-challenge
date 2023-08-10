# apollo-server-graphql-test-task

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Get a free API Key at [https://www.mongodb.com/atlas/database](https://www.mongodb.com/atlas/database)
2. Clone the repo
   ```sh
   git clone https://github.com/Abduljebar49/apollo-server-graphql-challenge.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. add .env file in our root folder
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