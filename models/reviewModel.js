const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
        car : {type : mongoose.Schema.Types.ObjectID , ref:'cars'},
        user : {type : mongoose.Schema.Types.ObjectID , ref:'users'},
        description : {type:String , required: [true, 'Description is required']},
},
    {timestamps: true}
)

//наша модель: название users(по сути users это название коллекции /ТАБЛИЦЫ), и второй арг: схема, по которой формирется модель
const reviewModel = mongoose.model('reviews' , reviewSchema)

//экспортируем нашу модель
module.exports = reviewModel