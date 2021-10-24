var router = require("express").Router();
var mongoose = require("mongoose");
var Orders = require("../../models/order");
var moment = require("moment");

var Reviews = require("../../models/review");
var contactUs = require("../../models/contactUs");

router.post("/getTilesData", async (req, res) => {
  try {
    const current_date = new Date();
    const startOfMonth = moment(current_date)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfMonth = moment(current_date).endOf("month").format("YYYY-MM-DD");

    const startOfDay = moment(startOfMonth).startOf("day").format();
    const endOfDay = moment(endOfMonth).endOf("day").format();

    const last_month = moment(startOfDay).subtract(1, "days");

    const last_month_firstDay = moment(last_month).startOf("month").format();
    const last_month_lastDay = moment(last_month).endOf("month").format();

    console.log(last_month_firstDay, "last_month_firstDay");
    console.log(last_month_lastDay, "last_month_lastDay");

    const last_month_totalOrders_count = await Orders.find({
      createdAt: {
        $gte: last_month_firstDay,
        $lt: last_month_lastDay,
      },
    }).countDocuments();

    const totalOrders_count = await Orders.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).countDocuments();

    const diff = totalOrders_count - last_month_totalOrders_count;

    const compareToLastMonth = diff / 2;

    // finding Total Orders  count and amount  of current  month

    const totalOrders_Amount = await Orders.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).select("totalAmount");

    var totalAmount = 0;

    totalOrders_Amount.forEach((x) => {
      totalAmount = totalAmount + x.totalAmount;
    });

    //  finding  pending Order Count and amount of Current Month

    const totalPendingOrders = await Orders.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      "tracking_Status.delivered.status": { $ne: "completed" },
      "tracking_Status.order_Confirmed.status": { $ne: "cancelled" },
      "tracking_Status.ready_for_Delivery.status": { $ne: "cancelled" },
      "tracking_Status.out_For_Delivery.status": { $ne: "cancelled" },
      "tracking_Status.delivered.status": { $ne: "cancelled" },
    }).select("totalAmount");

    var totalPendingOrder_count = 0;
    var totalPendingOrder_Amount = 0;
    if (totalPendingOrders != "") {
      totalPendingOrder_count = totalPendingOrders.length;
      totalPendingOrders.forEach((x) => {
        totalPendingOrder_Amount = totalPendingOrder_Amount + x.totalAmount;
      });
    }

    // finding delivered order delivered order

    const totalDeliveredOrders = await Orders.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      "tracking_Status.delivered.status": { $eq: "completed" },
    }).select("totalAmount");

    console.log(totalDeliveredOrders, "totalDeliveredOrders");

    var totalDeliveredOrder_count = 0;
    var totalDeliveredOrder_Amount = 0;

    if (totalDeliveredOrders != "") {
      totalDeliveredOrder_count = totalDeliveredOrders.length;
      totalDeliveredOrders.forEach((x) => {
        totalDeliveredOrder_Amount = totalDeliveredOrder_Amount + x.totalAmount;
      });
    }

    // finding cancel Order's  count and Amount of current month

    const totalCancelOrders = await Orders.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      $or: [
        { "tracking_Status.order_Confirmed.status": { $eq: "cancelled" } },
        { "tracking_Status.ready_for_Delivery.status": { $eq: "cancelled" } },
        { "tracking_Status.out_For_Delivery.status": { $eq: "cancelled" } },
        { "tracking_Status.delivered.status": { $eq: "cancelled" } },
      ],
    }).select("totalAmount");

    var totalCancelOrders_count = 0;
    var totalCancelOrders_Amount = 0;

    if (totalCancelOrders != "") {
      totalCancelOrders_count = totalCancelOrders.length;
      totalCancelOrders.forEach((x) => [
        (totalCancelOrders_Amount = totalCancelOrders_Amount + x.totalAmount),
      ]);
    }

    const result = {
      totalOrders_count: totalOrders_count,
      totalOrders_Amount: totalAmount,
      compareToLastMonth: compareToLastMonth,

      totalPendingOrders_count: totalPendingOrder_count,
      totalPendingOrder_Amount: totalPendingOrder_Amount,

      totalDeliveredOrder_count: totalDeliveredOrder_count,
      totalDeliveredOrder_Amount: totalDeliveredOrder_Amount,

      totalCancelOrders_count: totalCancelOrders_count,
      totalCancelOrders_Amount: totalCancelOrders_Amount,
    };

    return res.status(200).send(result);
  } catch (error) {
    console.log(error, "Error");
    return res.status(400).send(error);
  }
});

router.get("/monthlyOrdersAndAmount", async (req, res) => {
  try {
    const FIRST_MONTH = 1;
    const LAST_MONTH = 12;
    const MONTHS_ARRAY = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const LastDayOfYear = new Date(new Date().getFullYear(), 12, 0);
    firstDayOfYear.setDate(firstDayOfYear.getDate() + 1);

    console.log(firstDayOfYear, "firstDayOfYear");
    console.log(LastDayOfYear, "LastDayOfYear");

    const monthly_Orders_count = await Orders.aggregate([
      {
        $match: {
          $and: [
            { "tracking_Status.order_Confirmed.status": { $ne: "cancelled" } },
            {
              "tracking_Status.ready_for_Delivery.status": { $ne: "cancelled" },
            },
            { "tracking_Status.out_For_Delivery.status": { $ne: "cancelled" } },
            { "tracking_Status.delivered.status": { $ne: "cancelled" } },
          ],
        },
      },
      {
        $group: {
          _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year_month": 1 },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          month_year: {
            $concat: [
              {
                $arrayElemAt: [
                  MONTHS_ARRAY,
                  {
                    $subtract: [
                      { $toInt: { $substrCP: ["$_id.year_month", 5, 2] } },
                      1,
                    ],
                  },
                ],
              },
              "-",
              { $substrCP: ["$_id.year_month", 0, 4] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          data: { $push: { k: "$month_year", v: "$count" } },
        },
      },
      {
        $addFields: {
          start_year: { $substrCP: [firstDayOfYear, 0, 4] },
          end_year: { $substrCP: [LastDayOfYear, 0, 4] },
          months1: {
            $range: [
              { $toInt: { $substrCP: [firstDayOfYear, 5, 2] } },
              { $add: [LAST_MONTH, 1] },
            ],
          },
          months2: {
            $range: [
              FIRST_MONTH,
              { $add: [{ $toInt: { $substrCP: [LastDayOfYear, 5, 2] } }, 1] },
            ],
          },
        },
      },
      {
        $addFields: {
          template_data: {
            $concatArrays: [
              {
                $map: {
                  input: "$months1",
                  as: "m1",
                  in: {
                    count: 0,
                    month_year: {
                      $concat: [
                        {
                          $arrayElemAt: [
                            MONTHS_ARRAY,
                            { $subtract: ["$$m1", 1] },
                          ],
                        },
                        "-",
                        "$start_year",
                      ],
                    },
                  },
                },
              },
              {
                $map: {
                  input: "$months2",
                  as: "m2",
                  in: {
                    count: 0,
                    month_year: {
                      $concat: [
                        {
                          $arrayElemAt: [
                            MONTHS_ARRAY,
                            { $subtract: ["$$m2", 1] },
                          ],
                        },
                        "-",
                        "$end_year",
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      },
      {
        $addFields: {
          data: {
            $map: {
              input: "$template_data",
              as: "t",
              in: {
                k: "$$t.month_year",
                v: {
                  $reduce: {
                    input: "$data",
                    initialValue: 0,
                    in: {
                      $cond: [
                        { $eq: ["$$t.month_year", "$$this.k"] },
                        { $add: ["$$this.v", "$$value"] },
                        { $add: [0, "$$value"] },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          data: { $arrayToObject: "$data" },
          _id: 0,
        },
      },
    ]);

    const monthly_Orders_Amount = await Orders.aggregate([
      {
        $match: {
          $and: [
            { "tracking_Status.order_Confirmed.status": { $ne: "cancelled" } },
            {
              "tracking_Status.ready_for_Delivery.status": { $ne: "cancelled" },
            },
            { "tracking_Status.out_For_Delivery.status": { $ne: "cancelled" } },
            { "tracking_Status.delivered.status": { $ne: "cancelled" } },
          ],
        },
      },
      {
        $group: {
          _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
          count: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id.year_month": 1 },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          month_year: {
            $concat: [
              {
                $arrayElemAt: [
                  MONTHS_ARRAY,
                  {
                    $subtract: [
                      { $toInt: { $substrCP: ["$_id.year_month", 5, 2] } },
                      1,
                    ],
                  },
                ],
              },
              "-",
              { $substrCP: ["$_id.year_month", 0, 4] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          data: { $push: { k: "$month_year", v: "$count" } },
        },
      },
      {
        $addFields: {
          start_year: { $substrCP: [firstDayOfYear, 0, 4] },
          end_year: { $substrCP: [LastDayOfYear, 0, 4] },
          months1: {
            $range: [
              { $toInt: { $substrCP: [firstDayOfYear, 5, 2] } },
              { $add: [LAST_MONTH, 1] },
            ],
          },
          months2: {
            $range: [
              FIRST_MONTH,
              { $add: [{ $toInt: { $substrCP: [LastDayOfYear, 5, 2] } }, 1] },
            ],
          },
        },
      },
      {
        $addFields: {
          template_data: {
            $concatArrays: [
              {
                $map: {
                  input: "$months1",
                  as: "m1",
                  in: {
                    count: 0,
                    month_year: {
                      $concat: [
                        {
                          $arrayElemAt: [
                            MONTHS_ARRAY,
                            { $subtract: ["$$m1", 1] },
                          ],
                        },
                        "-",
                        "$start_year",
                      ],
                    },
                  },
                },
              },
              {
                $map: {
                  input: "$months2",
                  as: "m2",
                  in: {
                    count: 0,
                    month_year: {
                      $concat: [
                        {
                          $arrayElemAt: [
                            MONTHS_ARRAY,
                            { $subtract: ["$$m2", 1] },
                          ],
                        },
                        "-",
                        "$end_year",
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      },
      {
        $addFields: {
          data: {
            $map: {
              input: "$template_data",
              as: "t",
              in: {
                k: "$$t.month_year",
                v: {
                  $reduce: {
                    input: "$data",
                    initialValue: 0,
                    in: {
                      $cond: [
                        { $eq: ["$$t.month_year", "$$this.k"] },
                        { $add: ["$$this.v", "$$value"] },
                        { $add: [0, "$$value"] },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          data: { $arrayToObject: "$data" },
          _id: 0,
        },
      },
    ]);

    console.log(monthly_Orders_count, "monthly_Orders_count");
    console.log(monthly_Orders_Amount, "monthly_Orders_Amount");

    const result = {
      monthly_Orders_count: monthly_Orders_count[0].data,
      monthly_Orders_Amount: monthly_Orders_Amount[0].data,
    };
    return res.status(200).send(result);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/getMessages", async (req, res) => {
  try {
    const latest_5_reviews = await Reviews.find()
      .limit(5)
      .sort({ $natural: -1 });
    const latest_5_Messages = await contactUs
      .find()
      .limit(5)
      .sort({ $natural: -1 });

    console.log(latest_5_reviews, "latest_5_reviews");
    console.log(latest_5_Messages, "latest_5_Messages");

    const result = {
      latest_5_reviews: latest_5_reviews,
      latest_5_Messages: latest_5_Messages,
    };

    return res.status(200).send(result);
  } catch (err) {
    console.log.log(err, "err");
    return res.status(400).send(err);
  }
});

router.get("/salesBySource", async (req, res) => {
  try {
    const current_date = new Date();
    const startOfMonth = moment(current_date)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfMonth = moment(current_date).endOf("month").format("YYYY-MM-DD");

    const startOfDay = moment(startOfMonth).startOf("day").format();
    const endOfDay = moment(endOfMonth).endOf("day").format();

    const Total_Orders = await Orders.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).countDocuments();
    console.log(Total_Orders, "Total_Orders");
  } catch (err) {
    console.log.log(err, "err");
    return res.status(400).send(err);
  }
});

module.exports = router;
