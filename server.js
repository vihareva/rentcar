//подключили библиотеку express
const express = require('express')
const jwt = require('jsonwebtoken')

//объект нашего приложения(создали наше приложение)
const app = express()

const bodyParser = require('body-parser');
const cors = require('cors');

//на каком порту запускается всё приложение
const port = process.env.PORT || 5000


const dbConnection = require('./db')

//добавляем middleware чтобы распознать входящий ОБЪЕКТ запроса как объект JSON
app.use(express.json())


//регистрируем Роуты(для первого use: у всех начало будет /api/cars/ и дальше что-то)
app.use('/api/cars/' , require('./routes/carsRoute'))
app.use('/api/users/' , require('./routes/usersRoute'))
app.use('/api/bookings/' , require('./routes/bookingsRoute'))
app.use('/api/reviews/' , require('./routes/reviewsRoute'))

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const path = require('path')

app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/result.pdf`)
})

if(process.env.NODE_ENV==='production')
{

    app.use('/' , express.static('client/build'))

    app.get('*' , (req , res)=>{

          res.sendFile(path.resolve(__dirname, 'client/build/index.html'));

    })

}


//открытие localhost 5000 в браузере это запрос методом GET
app.get('/', (req, res) => res.send('Hello World!'))


 

//запускаем сервер и колбэк который вызывается если сервер запущен
app.listen(port, () => console.log(`Node JS Server Started in Port ${port}`))