const express = require("express");
const router = express.Router();
const Review = require("../models/reviewModel");
const Car = require("../models/carModel");
const Booking = require("../models/bookingModel");
const AverageRating = require("../models/averageRatingModel");

router.get("/getallreviews", async (req, res) => {
    try {
        const reviews = await Review.find();
      // await Car.aggregate([{
      //       $lookup: {
      //           from: "reviews", // collection name in db
      //           localField: "_id",
      //           foreignField: "car",
      //           as: "reviews"
      //       }
      //   }]).exec(function(err, cars) {
      //      console.log(cars)
      //     res.send(cars)
      //   });
    //     [
    //         {
    //             _id: new ObjectId("622149290a8d78a034a2e1d3"),
    //             name: 'Tata Nexon',
    //             image: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Nexon/7384/1614326304397/front-left-side-47.jpg?tr=w-456',
    //             capacity: 5,
    //             fuelType: 'petrol',
    //             bookedTimeSlots: [ [Object] ],
    //             rentPerHour: 400,
    //             createdAt: 2022-03-03T23:03:05.731Z,
    //         updatedAt: 2022-03-12T15:44:38.436Z,
    //         __v: 1,
    //         user: new ObjectId("622143f3111188d6402524b6"),
    //         reviews: []
    // },
    //     {
    //         _id: new ObjectId("62214a1f0a8d78a034a2e1dd"),
    //             name: 'Tata Altroz',
    //         image: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Altroz/7247/1578642800962/front-left-side-47.jpg?tr=w-456',
    //         capacity: 5,
    //         fuelType: 'petrol',
    //         bookedTimeSlots: [ [Object] ],
    //         rentPerHour: 352,
    //         createdAt: 2022-03-03T23:07:11.387Z,
    //         updatedAt: 2022-03-12T17:17:02.124Z,
    //         __v: 1,
    //         user: new ObjectId("622143f3111188d6402524b6"),
    //         reviews: []
    //     },
    //     {
    //         _id: new ObjectId("622cc758ccf7b54dbb7c61fc"),
    //             name: 'Lexus NX',
    //         user: new ObjectId("6228a9cc3934336c0faadacf"),
    //         image: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Lexus/NX/8887/1646816229708/front-left-side-47.jpg?tr=w-456',
    //         capacity: 5,
    //         fuelType: 'petrol',
    //         bookedTimeSlots: [],
    //         rentPerHour: 200,
    //         createdAt: 2022-03-12T16:16:24.370Z,
    //         updatedAt: 2022-03-12T16:16:24.370Z,
    //         __v: 0,
    //         reviews: [ [Object], [Object] ]
    //     }
    // ]
        await Review.aggregate([{
            $lookup: {
                from: "cars", // collection name in db
                localField: "car",
                foreignField: "_id",
                as: "car"
            }}, {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }}],{
        }).exec(function(err, reviews) {
            console.log(reviews)
            res.send(reviews)
        });

        // await Review.aggregate([{
        //     $lookup: {
        //         from: "cars", // collection name in db
        //         localField: "car",
        //         foreignField: "_id",
        //         as: "car"
        //     }
        // }]).exec(function(err, reviews) {
        //     console.log(reviews)
        //     res.send(reviews)
        // });


        //res.send(reviews);
    } catch (error) {
        return res.status(400).json(error);
    }
});


router.post("/addreview", async (req, res) => {
    try {
        const newreview = new Review(req.body);
        console.log(req.body)
        await newreview.save();

        let booking = await Booking.findOne({_id: req.body.booking});
        await booking.calculateAverageRating();

        const ratings = await AverageRating.find();
        console.log(ratings)

        res.send("Review added successfully");
    } catch (error) {
        return res.status(400).json(error);
    }
});

module.exports = router;