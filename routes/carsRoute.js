const express = require("express");
const router = express.Router();
const Car = require("../models/carModel");
const Location = require("../models/locationModel");

router.get("/getallcars", async (req, res) => {
  try {
    // const cars = await Car.find();
    // res.send(cars);

    await Car.aggregate([{
      $lookup: {
        from: "locations", // collection name in db
        localField: "address",
        foreignField: "_id",
        as: "address"
      }}],{
    }).exec(function(err, cars) {
      console.log(cars)
      res.send(cars)
    });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/getfilteredcars", async (req, res) => {
  try {
    const { name, rentPerHour} = req.body
    const cars = await Car.find({
          $and: [
            {rentPerHour: {$lte: rentPerHour[1]}},
            {rentPerHour: {$gte: rentPerHour[0]}},
            // {name: {$regex : name}} //case sensitive
            {name: new RegExp(name, 'i') } //case insensitive
          ]
        });
    res.send(cars);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/addcar", async (req, res) => {
  try {
    const {country,city,street, ...carInfo}=req.body

    const newlocation = new Location({country,city,street});
    console.log(newlocation)
    await newlocation.save();

    const newcar = new Car({...carInfo, address: newlocation._id});
    await newcar.save();
    res.send("Car added successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/editcar", async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.body._id });
    car.name = req.body.name;
    car.image = req.body.image;
    car.fuelType = req.body.fuelType;
    car.rentPerHour = req.body.rentPerHour;
    car.capacity = req.body.capacity;

    await car.save();

    res.send("Car details updated successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/deletecar", async (req, res) => {
  try {
    await Car.findOneAndDelete({ _id: req.body.carid });

    res.send("Car deleted successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
