import { GraphQLError } from 'graphql';
import { LOGIN_FAILED_MESSAGE, LOGIN_FAILED_TWO_FACTOR_MESSAGE, LOGIN_SUCCESS_MESSAGE } from '../helpers/constants.js';
import { authorizeUser, checkPassword, encryptPassword, generateAccessToken, generateRefreshToken, generateSecretKey } from '../helpers/functions.js';
import User from '../models/user.js';
import qrcode from 'qrcode';


export const resolvers = {
    Query: {
        users: async (_, { limit }) => {
            return await User.find().sort({ createdAt: -1 }).limit(limit)
        },
        user: async (_, { id }) => {
            return await User.findById(id);
        }
    },
    Mutation: {
        addUser: async (_, { input }) => {
            const secret = generateSecretKey(10);
            const createUser = new User({
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
                password: input.password,
                createdAt: new Date().toISOString(),
                secretKey: secret
            });
            const res = await createUser.save();
            return res;
        },
        updateUser: async (_, { input }, { user }) => {
            authorizeUser(user);
            const id = user._id;
            const res = (await User.findByIdAndUpdate(id, input));
            if (res) {
                return true;
            }
            return false;
        },
        login: async (parent, { email, password, secretKey },) => {
            const user = await User.findOne({ email });
            let response = {
                message: LOGIN_FAILED_MESSAGE,
                user: null,
                accessToken: null,
                refreshToken: null
            }
            if (!user) {
                return response;
            }
            const isPasswordValid = await checkPassword(password, user.password);
            if (!isPasswordValid) {
                return response;
            }
            console.log("user : ",user);
            if (user.twoFactorAuthentication) {
                response.message = LOGIN_FAILED_TWO_FACTOR_MESSAGE;
                if (secretKey != user.secretKey) {
                    return response;
                }
            }
            response.user = user;
            response.message = LOGIN_SUCCESS_MESSAGE;
            const token = generateAccessToken(user);
            const resfreshToken = generateRefreshToken(user);
            response.accessToken = token;
            response.refreshToken = resfreshToken;
            return response;
        },
        changePassword: async (_, { password }, { user }) => {
            authorizeUser(user);
            const id = user._id;
            const res = await User.findByIdAndUpdate(id, { password: password });
            res.password = password;
            console.log("new password : ", password, " former password : ", user.password, " password to be saved : ", res.password)
            await res.save();
            if (res) return true;
            return false;
        },
        generateQRCode: async (_, args, { user }) => {
            authorizeUser(user);
            const id = user._id;
            const res = (await User.findByIdAndUpdate(id, { twoFactorAuthentication: true }));
            const qrCodeData = JSON.stringify({ id: user.id, secretKey: res.secretKey });
            console.log("qrCodeData");
            try {
                const qrCode = await qrcode.toDataURL(qrCodeData);
                return qrCode;
            } catch (error) {
                throw new Error('Failed to generate QR code');
            }
        }
    }
}