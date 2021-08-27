var router = require("express").Router();
var ORDER = require("../../models/order");
var helper = require("./helper/helper");

router.post("/createOrder", async (req, res) => {
  try {
    // orderService.SendMailtoCustomer();
    const order = new ORDER();
    const newOrder = req.body;
    order.first_Name = newOrder.first_Name;
    order.last_Name = newOrder.last_Name;
    order.phone = newOrder.phone;
    order.Email = newOrder.Email;
    order.Country = newOrder.Country;
    order.City = newOrder.City;
    order.State = newOrder.State;
    order.postalCode = newOrder.postalCode;
    order.Address = newOrder.Address;
    order.totalAmount = newOrder.totalAmount;
    order.products = newOrder.products;
    const saved_Order = await order.save();
    saved_Order.tracking_Status.order_Confirmed.date = new Date();
    saved_Order.tracking_Status.order_Confirmed.status = "completed";
    saved_Order.tracking_Status.order_Confirmed.comment = "Order Placed";
    saved_Order.tracking_Status.current_Status = "ready_for_Delivery";
    saved_Order.tracking_Status.ready_for_Delivery.date = new Date();
    saved_Order.tracking_Status.ready_for_Delivery.status = "inProgress";
    saved_Order.tracking_Status.ready_for_Delivery.comment =
      "your  order is under process";
    helper.sendNotification();
    const updated_order = await saved_Order.save();

    return res.status(200).send(updated_order);
  } catch (err) {
    console.log(err, "err");
    return res.status(400).send(err);
  }
});

router.get("/getOrderbyId/:Id", async (req, res) => {
  try {
    const is_order = await ORDER.findById(req.params.Id);
    if (!is_order) return res.status(400).send("Order not found");
    return res.status(200).send(is_order);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/getOrders", async (req, res) => {
  try {
    const is_order = await ORDER.find();
    if (!is_order) return res.status(400).send("Order not found");
    return res.status(200).send(is_order);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.put("/updateOrderStatus", async (req, res) => {
  try {
    const params = req.body;
    const isOrder = await ORDER.findById(params.orderId);

    if (!isOrder) return res.status(400).send("Invalid Request");
    //  ready_for_Delivery
    if (params.current_status == "ready_for_Delivery") {
      if (params.status == "completed") {
        isOrder.tracking_Status.ready_for_Delivery.date = new Date();
        isOrder.tracking_Status.ready_for_Delivery.status = "completed";
        isOrder.tracking_Status.current_Status = "out_For_Delivery";
        isOrder.tracking_Status.out_For_Delivery.comment =
          "Your Order is on the way";
        isOrder.tracking_Status.out_For_Delivery.date = new Date();
        isOrder.tracking_Status.out_For_Delivery.status = "inProgress";
      } else if (params.status == "cancelled") {
        isOrder.tracking_Status.ready_for_Delivery.date = new Date();
        isOrder.tracking_Status.ready_for_Delivery.comment = params.comment;
        isOrder.tracking_Status.ready_for_Delivery.status = "cancelled";
        isOrder.tracking_Status.current_Status = "ready_for_Delivery";
      } else if (params.status == "") {
        // isOrder.tracking_Status.Paid.date = new Date();
        isOrder.tracking_Status.ready_for_Delivery.status = "inProgress";
        isOrder.tracking_Status.ready_for_Delivery.comment = "";
        isOrder.tracking_Status.current_Status = "ready_for_Delivery";
      }
    }
    //
    else if (params.current_status == "out_For_Delivery") {
      if (params.status == "completed") {
        isOrder.tracking_Status.out_For_Delivery.date = new Date();
        isOrder.tracking_Status.out_For_Delivery.status = "completed";

        isOrder.tracking_Status.delivered.date = new Date();
        isOrder.tracking_Status.delivered.comment = "Your Order is delivered.";
        isOrder.tracking_Status.delivered.status = "completed";
        isOrder.tracking_Status.current_Status = "Paid";
        isOrder.tracking_Status.Paid.status = "inProgress";
      } else if (params.status == "cancelled") {
        isOrder.tracking_Status.out_For_Delivery.date = new Date();
        isOrder.tracking_Status.out_For_Delivery.comment = params.comment;
        isOrder.tracking_Status.out_For_Delivery.status = "cancelled";
        isOrder.tracking_Status.current_Status = "out_For_Delivery";
      } else if (params.status == "") {
        // isOrder.tracking_Status.Paid.date = new Date();
        isOrder.tracking_Status.out_For_Delivery.status = "inProgress";
        isOrder.tracking_Status.out_For_Delivery.comment = "";
        isOrder.tracking_Status.current_Status = "out_For_Delivery";
      }
    } else if (params.current_status == "Paid") {
      if (params.status == "completed") {
        isOrder.tracking_Status.Paid.date = new Date();
        isOrder.tracking_Status.Paid.status = "completed";
        isOrder.tracking_Status.Paid.comment = "Payment Done";

        isOrder.tracking_Status.current_Status = "Paid";
      } else if (params.status == "cancelled") {
        isOrder.tracking_Status.Paid.date = new Date();
        isOrder.tracking_Status.Paid.status = "cancelled";
        isOrder.tracking_Status.Paid.comment = params.comment;
        isOrder.tracking_Status.current_Status = "Paid";
      } else if (params.status == "") {
        // isOrder.tracking_Status.Paid.date = new Date();
        isOrder.tracking_Status.Paid.status = "inProgress";
        isOrder.tracking_Status.Paid.comment = "";
        isOrder.tracking_Status.current_Status = "Paid";
      }
    }

    const savedOrder = await isOrder.save();
    return res.status(200).send(savedOrder);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});
// router.put("/UpdateOrderDetails/:Id", async (req, res) => {
//   const is_order = await ORDER.findById(req.params.Id);
//   if (!is_order) return res.status(400).send("Order not found");
//   return res.status(200).send(is_order);
// });

module.exports = router;
