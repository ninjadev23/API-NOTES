import { Router } from "express";
import { UserModel } from "../models/Users";
import { userSchema } from "../types";
import {z} from "zod";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { handleError } from "../utils";

const router = Router()

router.post("/",async (req, res)=>{
    try{
        // Validando entrada
        const userValided = userSchema.parse(req.body)    
        userValided.password = await bcrypt.hash(userValided.password, 10)
        const newUser = new UserModel(userValided)
        await newUser.save()
        res.status(201).json({
            message:"New User Created!"
        })
        
    }catch(err){
        handleError(res, (err as Error));
    }
})
router.post("/login", async (req, res)=>{
    try{
        const userValidator = z.object({
            email: z.string().email({message:"Incorrect Email"}),
            password: z.string()
        })
        const userValided = userValidator.parse(req.body)
        const userData = await UserModel.findOne({email: userValided.email})
        if(!userData) throw new Error("User not found, please register first")    
        if(await bcrypt.compare(userValided.password, userData.password)){
            const token = jwt.sign({
               userID: userData._id
            },(process.env.SECRET_KEY as string),{
                expiresIn: "20d" //fecha de expiracion del token 20 dias
            })
            res.cookie("name", userData.name)
            res.cookie("access_token",token, {
                httpOnly: true, //opcion que hace que esta cookie solo la pueda leer el servidor
                secure: process.env.NODE_ENV === "production",
                sameSite: "none"//Sino se activa esto el frontend rechaza las cookies por estar en diferentes sitos
            }).json({
                message: "User Authenticated Correctly"
            })
        }
    }catch(err){
        handleError(res, (err as Error));
    }
})
router.delete("/logout", (_req, res)=>{
    try{
        res.clearCookie("name")
        res.clearCookie("access_token").json({
            message: "User Logged Out"
        })
    }catch(err){
        handleError(res, (err as Error));
    }
})
export default router