import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import { typeDefs } from './graphql/type-defs.js';
import { resolvers } from './graphql/resolvers.js';
import express from "express";
import { getUser } from './helpers/functions.js';
const app = express();
const MONGODB = "mongodb+srv://abduljebarsani:2GqywOK36mOiCezC@cluster0.owhjmg4.mongodb.net/";

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

mongoose.connect(MONGODB)
    .then(async () => {
        await startStandaloneServer(server, {
            listen: { port: 4000 },
            context: async ({ req }) => {
                const tokenString = req.headers.authorization || '';
                if (tokenString.length != 0) {
                    const token = tokenString.split(' ')[1];
                    const user = getUser(token);
                    return { user };
                }
            },
        });
    }).then(() => {
        console.log(`listening on port 4000`)
    })
