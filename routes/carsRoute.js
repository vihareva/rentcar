const express = require("express");
const router = express.Router();
const Car = require("../models/carModel");
const Location = require("../models/locationModel");
const Category = require("../models/categoryModel");


const pdf = require('html-pdf');


const pdfTemplate = require('./documents');

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
            }
        }, {
            $lookup: {
                from: "categories", // collection name in db
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        }], {}).exec(function (err, cars) {
            console.log(cars)
            res.send(cars)
        });
    } catch (error) {
        return res.status(400).json(error);
    }
});


router.post("/getsavedcars", async (req, res) => {
    try {
        const cars = await Car.find({_id: {$in: req.body}});
        res.send(cars);

    } catch (error) {
        return res.status(400).json(error);
    }
});




router.post("/filter", async (req, res) => {
    try {
        let queryCategories = req.body.categories
        let queryName = req.body.name
        let queryRentPerHour = req.body.rentPerHour
        let {addressID} = req.body.address

        if (queryName === ' ') {
            queryName = null
        }

        if (queryCategories.length ===0) {
            queryCategories = null
        }

        if (!addressID) {
            //варианты где  в запросе есть все фильтры
            if (queryCategories && queryName && queryRentPerHour) {
                const categories = await Category.find({category: {$in: queryCategories}})
                console.log(categories)
                const cars = await Car.find({
                    $and: [
                        {category: {$in: categories.map(c => c._id)}},
                        {name: new RegExp(queryName, 'i')},
                        {rentPerHour: {$lte: queryRentPerHour[1]}},
                        {rentPerHour: {$gte: queryRentPerHour[0]}},
                    ]
                })
                res.send(cars);
                console.log(cars);
            }

//варианты где  в запросе есть категории(сортируем только по имени или только по цене или обоим)
            if (queryCategories && !queryName && !queryRentPerHour) {
                const categories = await Category.find({category: {$in: queryCategories}})
                console.log(categories)
                const cars = await Car.find({category: {$in: categories.map(c => c._id)}}).sort({rentPerHour: 1})
                console.log(cars);
                res.send(cars);
            }

            if (queryCategories && queryName && !queryRentPerHour) {
                const categories = await Category.find({category: {$in: queryCategories}})
                console.log(categories)
                const cars = await Car.find({
                    $and: [
                        {category: {$in: categories.map(c => c._id)}},
                        {name: new RegExp(queryName, 'i')}
                    ]
                })
                console.log(cars);
                res.send(cars);
            }

            if (queryCategories && !queryName && queryRentPerHour) {
                const categories = await Category.find({category: {$in: queryCategories}})
                console.log(categories)
                const cars = await Car.find({
                    $and: [
                        {category: {$in: categories.map(c => c._id)}},
                        {rentPerHour: {$lte: queryRentPerHour[1]}},
                        {rentPerHour: {$gte: queryRentPerHour[0]}},
                    ]
                })
                console.log(cars);
                res.send(cars);
            }


//варианты где нет в запросе категории(сортируем только по имени или только по цене или обоим)
            if (!queryCategories && queryName && queryRentPerHour) {
                const cars = await Car.find({
                    $and: [
                        {rentPerHour: {$lte: queryRentPerHour[1]}},
                        {rentPerHour: {$gte: queryRentPerHour[0]}},
                        // {name: {$regex : name}} //case sensitive
                        {name: new RegExp(queryName, 'i')} //case insensitive
                    ]
                });
                console.log(cars);
                res.send(cars);
            }

            if (!queryCategories && !queryName && queryRentPerHour) {
                const cars = await Car.find({
                    $and: [
                        {rentPerHour: {$lte: queryRentPerHour[1]}},
                        {rentPerHour: {$gte: queryRentPerHour[0]}},
                    ]
                });
                console.log(cars);
                res.send(cars);
            }

            if (!queryCategories && queryName && !queryRentPerHour) {
                const cars = await Car.find({
                    name: new RegExp(queryName, 'i') //case insensitive
                });
                console.log(cars);
                res.send(cars);
            }
        } else {
            //варианты где  в запросе есть все фильтры
            if (queryCategories && queryName && queryRentPerHour) {
                const categories = await Category.find({category: {$in: queryCategories}})
                console.log(categories)
                const cars = await Car.find({
                    $and: [
                        {category: {$in: categories.map(c => c._id)}},
                        {name: new RegExp(queryName, 'i')},
                        {rentPerHour: {$lte: queryRentPerHour[1]}},
                        {rentPerHour: {$gte: queryRentPerHour[0]}},
                        {address: addressID}
                    ]
                })
                res.send(cars);
                console.log(cars);
            }

//варианты где  в запросе есть категории(сортируем только по имени или только по цене или обоим)
            if (queryCategories && !queryName && !queryRentPerHour) {
                const categories = await Category.find({category: {$in: queryCategories}})
                console.log(categories)
                const cars = await Car.find({
                    $and: [
                        {category: {$in: categories.map(c => c._id)}},
                        {address: addressID}
                    ]
                })
                console.log(cars);
                res.send(cars);
            }

            if (queryCategories && queryName && !queryRentPerHour) {
                const categories = await Category.find({category: {$in: queryCategories}})
                console.log(categories)
                const cars = await Car.find({
                    $and: [
                        {category: {$in: categories.map(c => c._id)}},
                        {name: new RegExp(queryName, 'i')},
                        {address: addressID}
                    ]
                })
                console.log(cars);
                res.send(cars);
            }

            if (queryCategories && !queryName && queryRentPerHour) {
                const categories = await Category.find({category: {$in: queryCategories}})
                console.log(categories)
                const cars = await Car.find({
                    $and: [
                        {category: {$in: categories.map(c => c._id)}},
                        {rentPerHour: {$lte: queryRentPerHour[1]}},
                        {rentPerHour: {$gte: queryRentPerHour[0]}},
                        {address: addressID}
                    ]
                })
                console.log(cars);
                res.send(cars);
            }


//варианты где нет в запросе категории(сортируем только по имени или только по цене или обоим)
            if (!queryCategories && queryName && queryRentPerHour) {
                const cars = await Car.find({
                    $and: [
                        {rentPerHour: {$lte: queryRentPerHour[1]}},
                        {rentPerHour: {$gte: queryRentPerHour[0]}},
                        // {name: {$regex : name}} //case sensitive
                        {name: new RegExp(queryName, 'i')}, //case insensitive
                        {address: addressID}
                    ]
                });
                console.log(cars);
                res.send(cars);
            }

            if (!queryCategories && !queryName && queryRentPerHour) {
                const cars = await Car.find({
                    $and: [
                        {rentPerHour: {$lte: queryRentPerHour[1]}},
                        {rentPerHour: {$gte: queryRentPerHour[0]}},
                        {address: addressID}
                    ]
                });
                console.log(cars);
                res.send(cars);
            }

            if (!queryCategories && queryName && !queryRentPerHour) {
                const cars = await Car.find({
                    $and: [
                        {name: new RegExp(queryName, 'i')}, //case insensitive
                        {address: addressID}
                    ]
                });
                console.log(cars);
                res.send(cars);
            }
        }


    } catch (error) {
        return res.status(400).json(error);
    }

});

router.get("/getallcategories", async (req, res) => {
    try {
        const categories = await Category.find();
        res.send(categories);
        console.log(categories)

    } catch (error) {
        return res.status(400).json(error);
    }
});

router.get("/getalllocations", async (req, res) => {
    try {
        const locations = await Location.find();
        res.send(locations);
        console.log(locations)

    } catch (error) {
        return res.status(400).json(error);
    }
});

router.post("/findcarsinaddress", async (req, res) => {
    try {
        const cars = await Car.find({address: req.body.addressID})
        res.send(cars);
    } catch (error) {
        return res.status(400).json(error);
    }
});

router.post("/getfilteredcars", async (req, res) => {
    try {
        const {name, rentPerHour} = req.body
        const cars = await Car.find({
            $and: [
                {rentPerHour: {$lte: rentPerHour[1]}},
                {rentPerHour: {$gte: rentPerHour[0]}},
                // {name: {$regex : name}} //case sensitive
                {name: new RegExp(name, 'i')} //case insensitive
            ]
        });
        res.send(cars);
    } catch (error) {
        return res.status(400).json(error);
    }
});

//админ добавляет машину, у него уже будет на фронте предложенный ассортимент категорий и он выберет существующий,
//и в бд в машине которую мы хотим добавить будет поле категория с ссылкой на сущность из таблицы категория
//а где размещен офис если мы добавляем машины мы вносим улицу город страну тем самым якобы у нас там офис открылся

router.post("/addcar", async (req, res) => {
    try {
        const {country, city, street, category, ...carInfo} = req.body

        const currentcategory = await Category.findOne({category: category});


        const address = await Location.findOne({country: country, city: city, street: street});
        if (address) {
            const newcar = new Car({...carInfo, category: currentcategory._id, address: address._id});
            await newcar.save();
        } else {

            const newlocation = new Location({country, city, street});
            await newlocation.save();

            const newcar = new Car({...carInfo, address: newlocation._id});
            await newcar.save();
        }

        pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
            if(err) {
                res.send(Promise.reject());
            }

            res.send("Car added successfully");
        });

    } catch (error) {
        return res.status(400).json(error);
    }
});

router.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/result.pdf`)
})

//админ может добавить категории с описанием
router.post("/addcategory", async (req, res) => {
    try {

        const newCategory = new Category(req.body);
        console.log(newCategory)
        await newCategory.save();

        res.send("Category added successfully");
    } catch (error) {
        return res.status(400).json(error);
    }
});

router.post("/editcar", async (req, res) => {
    try {
        const car = await Car.findOne({_id: req.body._id});
        car.name = req.body.name;
        car.image = req.body.image;
        car.fuelType = req.body.fuelType;
        car.rentPerHour = req.body.rentPerHour;
        car.capacity = req.body.capacity;
        car.transmission = req.body.transmission;
        car.engineCapacity = req.body.engineCapacity;

        await car.save();

        res.send("Car details updated successfully");
    } catch (error) {
        return res.status(400).json(error);
    }
});

router.post("/deletecar", async (req, res) => {
    try {
        await Car.findOneAndDelete({_id: req.body.carid});

        res.send("Car deleted successfully");
    } catch (error) {
        return res.status(400).json(error);
    }
});

module.exports = router;
