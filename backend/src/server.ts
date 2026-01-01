import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./libs/db.js";
import { protectedRoute } from "./middlewares/authMiddleware.ts";
import authRoute from "./routes/authRoute.ts";
import userRoute from "./routes/userRoute.ts";
import blogRoute from "./routes/blogRoute.ts";
import documentRoute from "./routes/documentRoute.ts";
import examRoute from "./routes/examRoute.ts";
import passport from "passport";
import "./libs/passport.ts"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(passport.initialize());

//Public routes
app.use('/api/auth', authRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/documents", documentRoute);
app.use("/api/exams", examRoute); 

//Private routes
app.use(protectedRoute);
app.use("/api/users", userRoute);


//Start server
connectDB(process.env.MONGODB_CONNECTION_STRING || "").then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});