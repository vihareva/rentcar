const express = require("express");
//создаем переменную router из функции Router
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51KZNyDGfonS0kOfXtcKWwF5TZmpAeBTpdTCSljBV00QIAn2knKElA8tUo6UL3oFvfCeHzPglwXY3mpYBavgPvAB300hpnJAvRg"
);

router.post("/bookcar", async (req, res) => {
  const { token } = req.body;
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: req.body.totalAmount,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email
      },
      {
        idempotencyKey: uuidv4(),
        
      }
    );

    if (payment) {
      req.body.transactionId = payment.source.id;
      const newbooking = new Booking(req.body);
      await newbooking.save();
      const car = await Car.findOne({ _id: req.body.car });
      console.log(req.body.car);
      car.bookedTimeSlots.push(req.body.bookedTimeSlots);

      await car.save();
      res.send("Your booking is successfull");
    } else {
      return res.status(400).json(error);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

//обрабатываем GET запрос( запрос от клиента /api/bookings/getallbookings - axios.get(/api/bookings/getallbookings) )
router.get("/getallbookings", async(req, res) => {

    try {
        const bookings = await Booking.find().populate('car')
        res.send(bookings)
        
    } catch (error) {
        return res.status(400).json(error);
    }
  
});

//экспорт router, созданного в начале файла, наружу
module.exports = router;
