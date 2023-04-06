const mongoose = require("mongoose");


const averageRatingSchema = new mongoose.Schema({
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'cars' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    averageRating: { type: Number, required: [true, 'Average rating is required'] },
}, { timestamps: true });

const averageRatingModel = mongoose.model('averageRatings' , averageRatingSchema)

//экспортируем нашу модель
module.exports = averageRatingModel