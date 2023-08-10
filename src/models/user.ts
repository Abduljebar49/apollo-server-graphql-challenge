import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { encryptPassword } from '../helpers/functions.js';

export interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    twoFactorAuthentication: Boolean;
    secretKey: string;
}

const userSchema = new mongoose.Schema<UserDocument>({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdAt: String,
    twoFactorAuthentication: { type: Boolean, default: false },
    secretKey: String
});

userSchema.pre<UserDocument>('save', async function (next) {
    const user = this;
    //this middle ware will run only save called and we called it when password changed
    try {
        user.password = await encryptPassword(user.password);
        next();
    } catch (error) {
        return next(error);
    }
});

// Post-save hook to encrypt the password if it's edited
// userSchema.post<UserDocument>('findOneAndUpdate', async function (doc: any) {
//     if (doc.password) {
//         try {
//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(doc.password, salt);
//             doc.password = hashedPassword;
//             await doc.update();
//         } catch (error) {
//             console.error('Error encrypting password:', error);
//         }
//     }
// });

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;