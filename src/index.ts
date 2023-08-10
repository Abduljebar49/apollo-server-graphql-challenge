import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import { typeDefs } from './graphql/type-defs.js';
import { resolvers } from './graphql/resolvers.js';
import { getUser } from './helpers/functions.js';

//this is connection string from mongo db
// mongodb+srv://<username>:<password>@cluster0.owhjmg4.mongodb.net/
const connectionString = process.env.MONGO_DB_CONNECTION_STRING;

//I am setting our apollo server with typeDefs and resolvers
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

//I am setting our connection here
mongoose.connect(connectionString)
    .then(async () => {
        //once our database connected, I am starting our apollo server
        await startStandaloneServer(server, {
            listen: { port: 4000 },
            context: async ({ req }) => {
                //there are protected routes, so we need to get token from header
                const tokenString = req.headers.authorization || '';
                if (tokenString.length != 0) {
                    //Authorization: Bearer token
                    // if there is token I am splitting token from Bearer text
                    const token = tokenString.split(' ')[1];
                    //I am getting user if token is valid, other wise getUser returns null
                    const user = getUser(token);
                    return { user };
                }
            },
        });
    }).then(() => {
        console.log(`listening on port 4000`)
    })
