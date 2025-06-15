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

app.use(cors({
  origin: ["http://localhost:5173", "https://notes-typescript-react-app.netlify.app"],
  credentials: true
}));
app.use("/api", UserRouter)
app.use("/api/notes", NoteRouter)
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>console.log(`Application running on http://localhost:${PORT}`))