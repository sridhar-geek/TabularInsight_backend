import express from 'express'
import "express-async-errors";
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cors from 'cors'


//Imports from another files
import NotFound from "./Middleware/not-found.js";
import CustomErrorHandler from "./Middleware/error-handler.js";


dotenv.config()
const app = express()

/* Middlewares */
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req, res) => {
    res.send("<h1> Welcome to Roxiler Backend </h1>");
})

app.use(NotFound);
app.use(CustomErrorHandler);
const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database");
    app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
};

start();