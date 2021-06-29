var router = require("express").Router();

var ORDER = require("../../models/order");
var helper = require("./helper");

router.post("/createOrder", async (req, res) => {
  const order = new ORDER();
  const newOrder = req.body;

  order.first_Name = newOrder.first_Name;
  order.last_Name = newOrder.last_Name;
  order.phone = newOrder.phone;
  order.Email = newOrder.Email;
  order.Country = newOrder.Country;
  order.City = newOrder.City;
  order.Address = newOrder.Address;
  order.Paid = newOrder.Paid;
  order.items = newOrder.items;

  try {
    const saved_Order = await order.save();
    saved_Order.tracking_Status.placed.date = new Date();
    saved_Order.tracking_Status.placed.status = "completed";
    saved_Order.tracking_Status.placed.comment = "Order Placed";
    saved_Order.tracking_Status.current_Status = "Processing";

    const updated_order = await saved_Order.save();
    return res.status(200).send(updated_order);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/getOrderDetails/:Id", async (req, res) => {
  const is_order = await ORDER.findById(req.params.Id);
  if (!is_order) return res.status(400).send("Order not found");
  return res.status(200).send(is_order);
});

router.put("/UpdateOrderDetails/:Id", async (req, res) => {
  const is_order = await ORDER.findById(req.params.Id);
  if (!is_order) return res.status(400).send("Order not found");
  return res.status(200).send(is_order);
});

module.exports = router;
