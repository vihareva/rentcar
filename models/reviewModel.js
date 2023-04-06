const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
        car : {type : mongoose.Schema.Types.ObjectID , ref:'cars'},
        user : {type : mongoose.Schema.Types.ObjectID , ref:'users'},
        booking : {type : mongoose.Schema.Types.ObjectID , ref:'bookings'},
        description : {type:String , required: [true, 'Description is required']},
        rating : {type:Number , required: [true, 'Rating is required']},
},
    {timestamps: true}
)

const reviewModel = mongoose.model('reviews' , reviewSchema)

//экспортируем нашу модель
module.exports = reviewModel