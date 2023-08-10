import bcrypt from 'bcrypt';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserDocument } from '../models/user.js';
import { GraphQLError } from 'graphql';

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export const checkPassword = async (password: string, existingPassword: string) => {
    return await bcrypt.compare(password, existingPassword);
}

export const generateAccessToken = (user: UserDocument) => {

    return jwt.sign(
        JSON.parse(JSON.stringify(user)),
        accessTokenSecret
        ,
        { expiresIn: "1h" }
    );
}

export const generateRefreshToken = (user: UserDocument) => {
    return jwt.sign(
        JSON.parse(JSON.stringify(user)),
        refreshTokenSecret,
        { expiresIn: '2h' }
    );
}

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

export const encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const generateSecretKey = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}