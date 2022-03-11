//подключаем пакет mongoose(базу данных MongoDB)
const mongoose = require("mongoose");

function connectDB() {
    //позволяет подключиться к Базе Данных
    //адрес по которому подключаемся
    mongoose.connect('mongodb+srv://vihareva:Katia16072002@cluster0.n8pza.mongodb.net/rentcars', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })

    const connection = mongoose.connection

    connection.on('connected', () => {
        console.log('Mongo DB Connection Successfull')
    })

    connection.on('error', () => {
        console.log('Mongo DB Connection Error')
    })


}

connectDB()

module.exports = mongoose