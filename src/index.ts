import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import router from "./routes";
import cors from "cors";
dotenv.config();

import connectDb from "./config/db";
import Venue from "./models/VENUE";

const app = express();
const PORT = process.env.PORT || 4567;
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors({
  origin: "*"
})); // todo: specify cors options

//routes
app.use("/api/v1", router);

app.get("/", (req, res) => {  
  res.send("wE'RE UP!");
});

// const inputIntoVenueDoc = async () => {
//   const venue = new Venue({
//     name_of_venue: "Bucodel Lab 1",
//     longitude: 6.99349,
//     latitude: 3.68134,
//     radius: 20
//   });
//   await venue.save();
//   console.log("Venue added to database");
// }

// inputIntoVenueDoc();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});