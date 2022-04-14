const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
        country : {type:String , required: [true, 'Description is required']},
        city : {type:String , required: [true, 'Description is required']},
        street : {type:String , required: [true, 'Description is required']},
    },
    {timestamps: true}
)

//наша модель: название users(по сути users это название коллекции /ТАБЛИЦЫ), и второй арг: схема, по которой формирется модель
const locationModel = mongoose.model('locations' , locationSchema)

//экспортируем нашу модель
module.exports = locationModel