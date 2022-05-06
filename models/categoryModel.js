const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
        category : {type:String , required: [true, 'category is required']},
        description : {type:String , required: [true, 'Description is required']},
    },
    {timestamps: true}
)

//наша модель: название users(по сути users это название коллекции /ТАБЛИЦЫ), и второй арг: схема, по которой формирется модель
const categoryModel = mongoose.model('category' , categorySchema)

//экспортируем нашу модель
module.exports = categoryModel