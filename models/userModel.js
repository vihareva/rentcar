const mongoose = require("mongoose");

//создаем схему, которая формирует модель, у которой будут два поля: username и password
const userSchema = new mongoose.Schema({
     //тип стринг, обязательное поле, если с клиента придет объект без поля username то модель не создастся
     //поле ID создается по умолчани!!!!!!!
     username : {type:String , required: [true, 'Username is required']},
     password : {type:String , required: [true, 'Password is required'], minlength: [5, 'password should be minimum 5 symbols']},
     isAdmin : {type: Boolean}
})

//наша модель: название users(по сути users это название коллекции /ТАБЛИЦЫ), и второй арг: схема, по которой формирется модель
const userModel = mongoose.model('users' , userSchema)

//экспортируем нашу модель
module.exports = userModel