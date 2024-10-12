import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import router from "./routes/auth";
dotenv.config();

import { connectDb } from "./config/db";

const app = express();
const PORT = process.env.PORT || 4567;
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//routes
app.use("/api", router);

app.get("/", (req, res) => {  
  res.send("wE'RE UP!");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});