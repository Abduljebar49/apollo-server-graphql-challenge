import { UserDocument } from "../models/user.js";

export const typeDefs = `#graphql
  type User {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    createdAt: String
    twoFactorAuthentication: Boolean
    secretKey: String
  }

  type LoginResponse {
    message:String!
    accessToken: String
    refreshToken: String
    user:User
  }

  input UserInput{
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  input EditUserInput{
    email: String
    firstName: String
    lastName: String
  }

  type Query {
    users(limit: Int): [User]
    user(ID:ID!):User
  }

  type Mutation{
    addUser(input: UserInput!):User!
    updateUser(input: EditUserInput!):Boolean!
    login(email:String!, password: String!, secretKey:String):LoginResponse
    changePassword(password: String!):Boolean!
    generateQRCode(ID:ID):String
  }
`;
