import jwt from "jsonwebtoken"
import { HttpError, UserSession } from "./types"
export const verifySession = (token: string): UserSession=>{
    if(!token) throw new HttpError("User Not Authenticated", 401)
    const UserSession = jwt.verify(token, (process.env.SECRET_KEY as string)) as UserSession
    return UserSession        
}