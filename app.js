import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";

//Imports from another files
import NotFound from "./Middleware/not-found.js";
import CustomErrorHandler from "./Middleware/error-handler.js";
import TranstationRoutes from "./Routes/Transations.js";

dotenv.config();
const app = express();

/* Middlewares */
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1> Welcome to Roxiler Backend </h1>");
});

app.use("/api/transtation", TranstationRoutes);
app.use(NotFound);
app.use(CustomErrorHandler);

// selecting Collection name to store transaction data
const DATA_COLLECTION = "products";
//  Function to Populates data from a JSON file into a MongoDB collection.
const populateData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const collection = mongoose.connection.collection(DATA_COLLECTION);
    // Check if collection exists and collection has data
    const collectionExists = (await collection.countDocuments()) > 0;
    if (!collectionExists) {
      // fetching data from roxiler.com
      const dataUrl =
        "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
      const response = await axios.get(dataUrl);
      const data = response.data;
      await collection.insertMany(data);
      console.log("Data populated successfully!");
    } else console.log("Collection already exists, skipping data population.");
  } catch (error) {
    console.error("Error fetching or saving data:", error);
  }
};
const PORT = process.env.PORT || 4000;

// Starting the server and populateData function only when server starts
const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
    await populateData();
  } catch (error) {
    console.error(error);
  }
};

start();
