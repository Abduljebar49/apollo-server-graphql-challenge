import bcrypt from 'bcrypt';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserDocument } from '../models/user.js';
import { GraphQLError } from 'graphql';

//we used dotenv to read from .env file in our root folder
//where we added our access token and refresh token secrets
dotenv.config();

//we are reading from .env file
//our secret help us generate token key and also help us read token back
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

//these method help us check password if encrypted password is the same as given password
//if the given password is correct it returns true
export const checkPassword = async (password: string, existingPassword: string) => {
    return await bcrypt.compare(password, existingPassword);
}

//this method is used to generate access token using jsonwebtoken library 
export const generateAccessToken = (user: UserDocument) => {
    return jwt.sign(
        //we are passing user information to store it on token
        JSON.parse(JSON.stringify(user)),
        //we are passing secret from .env to create a token
        accessTokenSecret
        ,
        //here I am setting the time for access token to expire which is 1 hour
        { expiresIn: "1h" }
    );
}

//this method is used to generate refresh token using jsonwebtoken library 
export const generateRefreshToken = (user: UserDocument) => {
    return jwt.sign(
        JSON.parse(JSON.stringify(user)),
        refreshTokenSecret,
        { expiresIn: '2h' }
    );
}

//this method is used to verify our token if it is valid or not
//if the given token is valid it returns user data
export const getUser = (token: string) => {
    try {
        if (token) {
            return jwt.verify(token, accessTokenSecret)
        }
        return null
    } catch (error) {
        return null
    }
}

//this method is for protected user routes
//if there is no valid token given it returns unauthenticated
export const authorizeUser = (user: UserDocument) => {
    if (!user) {
        throw new GraphQLError('User is not authenticated', {
            extensions: {
                code: 'UNAUTHENTICATED',
                http: { status: 401 },
            },
        });
    }
}
//this method encypt our password and generated secret key
export const encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

//this method generated user secret key
export const generateSecretKey = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}