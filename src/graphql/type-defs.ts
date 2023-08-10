import { UserDocument } from "../models/user.js";

export const typeDefs = `#graphql
  # I am defining by User type
  type User {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    createdAt: String
    twoFactorAuthentication: Boolean
    secretKey: String
  }
  #login response is type that is required to be returned from login
  type LoginResponse {
    message:String!
    accessToken: String
    refreshToken: String
    user:User
  }
  #UserInput contains values that we need from user to be registered
  input UserInput{
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }
  #When editing a model we don't most of the fields won't be required 
  #so we need new input type for that
  input EditUserInput{
    email: String
    firstName: String
    lastName: String
  }
  #Query is basic thing in qraphql and it is like get request for rest api
  type Query {
    users(limit: Int): [User]
    user(ID:ID!):User
  }
  #Mutation is like POST, PUT, DELETE request operations in rest api
  type Mutation{
    #used to add new user to the database
    addUser(input: UserInput!):User!
    #used to update our user information
    #now, it is limitted to only fields in EditUserInput type above
    updateUser(input: EditUserInput!):Boolean!
    #login is used, can be used for two step verification if it is enabled
    login(email:String!, password: String!, secretKey:String):LoginResponse
    #password is not the field to be edited with update user information method above
    #so we implemented it separately
    changePassword(password: String!):Boolean!
    #GenerateQRCode method enables two-factor authorization to login for the user
    generateQRCode(ID:ID):String
  }
`;
