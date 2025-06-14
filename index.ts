import express from "express"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
import UserRouter from "./routes/users"
import NoteRouter from "./routes/notes"
import dotenv from "dotenv"

dotenv.config()
import "./configDB"

const app = express()
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.use((req, _res, next) => {
  if (
    (req.method === "DELETE" || req.method === "GET") &&
    req.headers["content-length"] === "0"
  ) {
    return next();
  }
  return next();
});
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use("/api", UserRouter)
app.use("/api/notes", NoteRouter)
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>console.log(`Application running on http://localhost:${PORT}`))