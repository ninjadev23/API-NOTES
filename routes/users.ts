import { Router } from "express";
import { UserModel } from "../models/Users";
import { userSchema } from "../types";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleError } from "../utils";

const router = Router();

const cookiesConfig = {
  //Configuracion general de las cookies
  httpOnly: true,//hace que la cookie solo pueda ser leida por el sevidor y no por javascript
  maxAge: 1000 * 60 * 60 * 24 * 20, // 20 días
  secure: process.env.NODE_ENV_FOR_SECURE === "production",
  sameSite: "none" as const, //Sino se activa esto el frontend rechaza las cookies por estar en diferentes sitios
};

router.post("/signup", async (req, res) => {
  try {
    // Validando entrada
    const userValided = userSchema.parse(req.body);
    userValided.password = await bcrypt.hash(userValided.password, 10);
    const newUser = new UserModel(userValided);
    await newUser.save();
    res.status(201).json({
      message: "New User Created!",
    });
  } catch (err) {
    handleError(res, err as Error);
  }
});
router.post("/login", async (req, res) => {
  try {
    const userValidator = z.object({
      email: z.string().email({ message: "Incorrect Email" }),
      password: z.string(),
    });
    const userValided = userValidator.parse(req.body);
    const userData = await UserModel.findOne({ email: userValided.email });
    if (!userData) throw new Error("User not found, please register first");
    if (await bcrypt.compare(userValided.password, userData.password)) {
      const token = jwt.sign(
        {
          userID: userData._id,
        },
        process.env.SECRET_KEY as string,
        {
          expiresIn: "20d", //fecha de expiracion del token 20 dias
        }
      );
      res
        .cookie("access_token", token, {
            ...cookiesConfig,
        })
        .json({
          message: "User Authenticated Correctly",
        });
    } else {
      throw new Error("Incorrect password");
    }
  } catch (err) {
    handleError(res, err as Error);
  }
});
router.delete("/logout", (_req, res) => {
  try {
    res.clearCookie("access_token", {
      ...cookiesConfig,
    });
    res.json({
      message: "User Logged Out",
    });
  } catch (err) {
    handleError(res, err as Error);
  }
});
export default router;
