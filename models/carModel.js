const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({

        name: {type: String, required: true},
        user: {type: mongoose.Schema.Types.ObjectID, ref: 'users'},
        image: {type: String, required: true},
        capacity: {type: Number, required: true},
        fuelType: {type: String, required: true},
        bookedTimeSlots: [
            {
                from: {type: String, required: true},
                to: {type: String, required: true}
            }
        ],
        rentPerHour: {type: Number, required: true},
        transmission: {type: String, required: true},
        engineCapacity: {type: Number, required: true},
        address:{type: mongoose.Schema.Types.ObjectID, ref: 'locations'},
        category:{type: mongoose.Schema.Types.ObjectID, ref: 'category'},

    }, {timestamps: true}
)
const carModel = mongoose.model('cars', carSchema)
module.exports = carModel