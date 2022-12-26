const express = require("express");
//создаем переменную router из функции Router
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const User= require("../models/userModel");
const moment = require("moment");
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
      req.body.transactionId = [];
      req.body.transactionId.push(payment.source.id);
      const newbooking = new Booking(req.body);
      await newbooking.save();

      const car = await Car.findOne({ _id: req.body.car });
      console.log(req.body.car);
      car.bookedTimeSlots.push(req.body.bookedTimeSlots);
      await car.save();

        const user = await User.findOne({_id: req.body.user});
        user.email = req.body.email;


        await user.save();
      res.send("Your booking is successfull");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.post("/editbooking", async (req, res) => {
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
            let booking = await Booking.findOne({_id: req.body.bookingId});
          booking.transactionId.push(payment.source.id);
            booking.bookedTimeSlots=req.body.bookedTimeSlots;
            booking.totalHours+=req.body.totalHours;
            booking.totalAmount+=req.body.totalAmount;
            await booking.save();

            const car = await Car.findOne({ _id: req.body.car });

           for(let slot of car.bookedTimeSlots ){
               if(moment(slot.from).isSame(req.body.bookedTimeSlots.from)){
                   slot.to=req.body.bookedTimeSlots.to
               }
           }
            await car.save();

            // const user = await User.findOne({_id: req.body.user});
            // user.email = req.body.email;
            // await user.save();

            res.send("Your extension is successfull");
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
});


//обрабатываем GET запрос( запрос от клиента /api/bookings/getallbookings - axios.get(/api/bookings/getallbookings) )
router.get("/getallbookings", async(req, res) => {

    try {
       await Booking.aggregate([{
            $lookup: {
                from: "cars", // collection name in db
                localField: "car",
                foreignField: "_id",
                as: "car"
            }
        },  {
            $lookup: {
                from: "locations", // collection name in db
                localField: "car.address",
                foreignField: "_id",
                as: "carAddress"
            }
        }], {}).exec(function (err,  bookings) {
            console.log( bookings)
            res.send( bookings)
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
  
});

//экспорт router, созданного в начале файла, наружу
module.exports = router;
