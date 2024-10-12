import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4567;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.get("/", (req, res) => {  
  res.send("wE'RE UP!");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});