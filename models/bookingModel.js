const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
            //СВЯЗИ В MONGODB
        car: {type: mongoose.Schema.Types.ObjectID, ref: 'cars'},
        user: {type: mongoose.Schema.Types.ObjectID, ref: 'users'},
        bookedTimeSlots: {
            from: {type: String},
            to: {type: String}
        },
        totalHours: {type: Number},
        totalAmount: {type: Number},
        transactionId: [
            {type: String}
        ],
        driverRequired: {type: Boolean},
        phone: {type:Number , required: false},
    },
    {timestamps: true}
)

const bookingModel = mongoose.model('bookings', bookingSchema)

module.exports = bookingModel