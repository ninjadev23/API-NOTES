import { User } from "../types";
import {model, Schema} from "mongoose"

const UserSchema = new Schema<User>({
    name: {
        type: String,
        required: true   
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    }
})
export const UserModel = model<User>("Users",UserSchema)