import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

// Imports from another files
import BadRequestError from "../errors/bad-request.js";

const DATA_COLLECTION = "products";
const collection = mongoose.connection.collection(DATA_COLLECTION);

// desc: Get all transactions      route: /api/transations/:month
export const getAllTrastations = async (req, res) => {
  const selectedMonth = req.params.month;
  if (selectedMonth < 1 || selectedMonth > 12)
    throw new BadRequestError("Invalid month, Select Month between 01 and 12");

  // Build the query to filter by the specified month
  const query = {
    dateOfSale: { $regex: `-${selectedMonth}-` }, // Match the selected month
  };

  // Fetch all transactions for the given month
  const transactions = await collection.find(query).toArray()
  res.status(StatusCodes.OK).json({ transactions });
};


// desc: Get Product range data for the selected month      route: /api/transations/product-range/:month
export const getProductRangeData = async (req, res) => {
  const selectedMonth = req.params.month;
  if (selectedMonth < 1 || selectedMonth > 12)
    throw new BadRequestError("Invalid month, Select Month between 01 and 12");
  // Array to store price ranges
  const priceRanges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity },
  ];

  const barChartData = await Promise.all(
    priceRanges.map(async ({ min, max }) => {
      const count = await collection.countDocuments({
        price: { $gte: min, $lte: max },
        dateOfSale: { $regex: `-${selectedMonth}-` },
      });
      return { range: `${min}-${max}`, count };
    })
  );

  res.status(StatusCodes.OK).json({ barChartData });
};

// desc: Get statics data for the selected month      route: /api/transations/statics/:month
export const getStaticsDate = async (req, res) => {
  const selectedMonth = req.params.month;
  if (selectedMonth < 1 || selectedMonth > 12)
    throw new BadRequestError("Invalid month, Select Month between 01 and 12");

  // Query MongoDB to get the relevant data
  const soldItems = await collection.countDocuments({
    sold: true,
    dateOfSale: { $regex: `-${selectedMonth}-` }, // Match the selected month
  });
  const unsoldItems = await collection.countDocuments({
    sold: false,
    dateOfSale: { $regex: `-${selectedMonth}-` },
  });

  // Calculate the total sale amount
  const totalSaleAmount = await collection
    .aggregate([
      {
        $match: {
          //   sold: true,
          dateOfSale: { $regex: `-${selectedMonth}-` },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$price" },
        },
      },
    ])
    .toArray();

  res.status(StatusCodes.OK).json({
    statics: {
      totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
      soldItems,
      unsoldItems,
    },
  });
};

// desc: Get Category data for the selected month      route: /api/transations/category/:month
export const getCategoryData = async (req, res) => {
  const selectedMonth = req.params.month;
  if (selectedMonth < 1 || selectedMonth > 12)
    throw new BadRequestError("Invalid month, Select Month between 01 and 12");
  const categoryData = await collection
    .aggregate([
      {
        $match: {
          dateOfSale: { $regex: `-${selectedMonth}-` },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const pieChartData = categoryData.reduce((result, { _id, count }) => {
    result[_id] = count;
    return result;
  }, {});

  res.status(StatusCodes.OK).json({ pieChartData });
};

/** This is something we need to fix */

// export const getAllTrastations = async (req, res) => {
//   const { page, perPage, search, month } = req.query;
//   console.log(page, perPage, search, month);
//   if (month < 1 || month > 12)
//     throw new BadRequestError("Invalid month, Select Month between 01 and 12");
//   // Build the query based on search parameters or month
//   const query = {};
//   if (search) {
//     query.$or = [
//       { title: { $regex: search, $options: "i" } }, // Case-insensitive search
//       { description: { $regex: search, $options: "i" } },
//       { price: { $regex: search, $options: "i" } },
//       { month: { $regex: `-${month}-` } },
//     ];
//   } else if (month) {
//     query.dateOfSale = { $regex: `-${month}-` };
//   }

//   // Fetch paginated data
//   const totalCount = await collection.countDocuments(query);
//   const transactions = await collection
//     .find(query)
//     .skip((page - 1) * perPage)
//     .limit(perPage);

//   res.status(StatusCodes.OK).json({
//     totalCount,
//     currentPage: page,
//     perPage,
//     transactions,
//   });
// };
