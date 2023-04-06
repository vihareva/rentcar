const mongoose = require("mongoose");

const Review = require("../models/reviewModel");
const AverageRating = require("../models/averageRatingModel");

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


bookingSchema.methods.calculateAverageRating = async function () {
    const booking = this;
    const car = booking.car;
    const user = booking.user;

    //ищем отзывы конкретного пользователя на данную машину
    const reviews = await Review.find({ car, user });
    console.log(reviews)
    //считаем среднюю оценку на эту машину
    const totalRating = reviews.reduce((total, review) => total + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    console.log(totalRating)
    console.log(averageRating)

    //обновляем в коллекции поле averageRating для данной машины и п-ля
    //{ upsert: true } <=> mongodb будет обновлять документ, если он найден, и создавать новый, если такого документа нет.
    await AverageRating.findOneAndUpdate({ car, user }, { averageRating }, { upsert: true });
};

const bookingModel = mongoose.model('bookings', bookingSchema)

module.exports = bookingModel