import { GraphQLError } from 'graphql';
import { LOGIN_FAILED_MESSAGE, LOGIN_FAILED_TWO_FACTOR_MESSAGE, LOGIN_SUCCESS_MESSAGE } from '../helpers/constants.js';
import { authorizeUser, checkPassword, encryptPassword, generateAccessToken, generateRefreshToken, generateSecretKey } from '../helpers/functions.js';
import User from '../models/user.js';
import qrcode from 'qrcode';


//resolvers is where we implement all defined functions in typeDefs
export const resolvers = {
    Query: {
        //this method returns all users with optional limit parameter which is integer
        users: async (_, { limit }) => {
            return await User.find().sort({ createdAt: -1 }).limit(limit)
        },
        //this method returns one user with given id
        user: async (_, { id }) => {
            return await User.findById(id);
        }
    },
    Mutation: {
        //addUser method adds new user
        addUser: async (_, { input }) => {
            //secret is key which identifies user when two-step verification is enabled
            const secret = generateSecretKey(10);
            //here we are initializing our user schema
            const createUser = new User({
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
                password: input.password,
                createdAt: new Date().toISOString(),
                secretKey: secret
            });
            //we are sending initialized data to database
            const res = await createUser.save();
            return res;
        },
        //used to update user informations
        updateUser: async (_, { input }, { user }) => {
            //here we are checking if the user is authorized
            authorizeUser(user);
            //if user is authorized we continue updaing the user
            const id = user._id;
            //this method updates user with given id, automatically
            const res = (await User.findByIdAndUpdate(id, input));
            if (res) {
                return true;
            }
            return false;
        },
        login: async (parent, { email, password, secretKey },) => {
            //here we are preparing our response model
            let response = {
                message: LOGIN_FAILED_MESSAGE,
                user: null,
                accessToken: null,
                refreshToken: null
            }
            //first we need to get user with given email
            const user = await User.findOne({ email });
            if (!user) {
                //if user email not found anywhere we need to return error
                return response;
            }
            //if given email is found then we need to check if password is correct
            //we can get that from our function which returns true or false
            const isPasswordValid = await checkPassword(password, user.password);
            if (!isPasswordValid) {
                //if password is incorrect we need to return error
                return response;
            }
            //once the user has correct information we need to check if two-factor authentication is enabled
            if (user.twoFactorAuthentication) {
                //if the request is inside here, it means two-factor authentication is enabled
                //we have to check secret key from qr code here
                response.message = LOGIN_FAILED_TWO_FACTOR_MESSAGE;
                if (secretKey != user.secretKey) {
                    return response;
                }
            }
            //we are preparing our success response below
            //since all information are verified
            response.user = user;
            response.message = LOGIN_SUCCESS_MESSAGE;
            //we are calling functions to generate token
            const token = generateAccessToken(user);
            const resfreshToken = generateRefreshToken(user);
            response.accessToken = token;
            response.refreshToken = resfreshToken;
            return response;
        },
        changePassword: async (_, { password }, { user }) => {
            //change password route is protected, we need to call the functin below
            authorizeUser(user);
            const id = user._id;
            const res = await User.findByIdAndUpdate(id, { password: password });
            res.password = password;
            //after password changed we need to send the given password to user schema
            //user schema has method to encrypt the password before save once save() called
            await res.save();
            if (res) return true;
            return false;
        },
        //is where we enable two-way authentication and generated qr-code
        generateQRCode: async (_, args, { user }) => {
            //route is protected
            authorizeUser(user);
            const id = user._id;
            const res = (await User.findByIdAndUpdate(id, { twoFactorAuthentication: true }));
            //the following line generate qr code with given information
            const qrCodeData = JSON.stringify({ id: user.id, secretKey: res.secretKey });
            try {
                const qrCode = await qrcode.toDataURL(qrCodeData);
                return qrCode;
            } catch (error) {
                throw new Error('Failed to generate QR code');
            }
        }
    }
}