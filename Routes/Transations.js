import express from "express";
const router = express.Router();

import {
  getAllTrastations,
  getCategoryData,
  getStaticsDate,
  getProductRangeData,
} from "../Controllers/Transations.js";

router.get("/:month", getAllTrastations);
router.get("/product-range/:month", getProductRangeData);
router.get("/statics/:month", getStaticsDate);
router.get("/category/:month", getCategoryData);


export default router;