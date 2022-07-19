const express = require("express");
const router = express();
const Order = require("../models/Order");
const OrderItem = require("../models/order-item");

//Read all Orders
router.get("/orders", async (req, res) => {
  const orderList = await Order.find()
    // .populate("user", "name")
    .sort({ dateOrdered: -1 })
    // .populate({
    //   path: "orderItems",
    //   populate: {
    //     path: "product",
    //     populate: "category",
    //   },
    // });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

//Read order by ID
router.get("/orders/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
//   .populate("name", "user");

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

//Create Order
router.post("/orders", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) return res.status(404).send("Order cannot be created");
  res.send(order);
});

router.put("/orders/:id", async (req, res) => {
    if (req.body.userId == req.params.id) {
      try {
        const updatedOrder = await Order.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(500).json(updatedOrder);
      } catch (err) {
        res.status(500).send(err);
      }
    } else {
      res.status(401).send("You can only Update your Profile");
    }
  });
//Delete Order
router.delete("/orders/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "Order deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Order cannot find" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
module.exports = router;






































































// router.get('/orders/get/count', async (req, res) => {
//     const orderCount = await Order.countDocuments((count) => count);
//     if (!orderCount) {
//         res.status(500), json({ success: false })
//     }
//     res.status(200).send({
//         orderCount: orderCount
//     });
// })

// router.get('/orders/get/totalsales', async (req, res) => {
//     const totalSales = await Order.aggregate([
//         { $group: {_id: null, totalsales:{ $sum :'$totalPrice'}}}
//     ])

//     if (!totalSales){
//         return res.status(400).send('the order sales cannot be generated')
//     }
//     res.send({ totalsales: totalSales.pop().totalsales})
// })

// router.get('/orders/get/usersorders/:userid', async (req, res) => {
//     const userOrderList = await Order.find({user: req.params.userid})
//         .populate({
//             path: 'orderItems', populate: {
//                 path: 'product', populate: 'category'
//             }
//         }).sort({ 'dateOrdered': -1 });

//     if (!userOrderList) {
//         res.status(500).json({ success: false })
//     }
//     res.send(userOrderList)
// })
