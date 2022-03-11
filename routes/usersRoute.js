const express = require("express");
const router = express.Router();
//подключаем модель User
const User = require("../models/userModel")


router.post("/login", async (req, res) => {
    //получили с клиента в теле запроса объект из которого достали нужные св-ва
    const {username, password} = req.body

    try {
        //ищем нужного user
        const user = await User.findOne({username, password})
        if (user) {
            //если нашли то отправляем его обратно
            res.send(user)
        }
        else {
         res.status(400).send({ error: 'Incorrect username or password' });
            // return res.status(400).json({ error: 'Incorrect email or password' });
        }
    } catch (error) {
        res.status(400).send({ error: 'Something failed!'  });
        //return res.status(400).json({ error: 'Something failed!' });
    }

});


router.post("/register", async (req, res) => {

    try {
        //создаем новый объект user исходя из тех параметров что передаются с клиента
        //с помощью ключевого слова new обращаемся к модели User
        const newuser = new User(req.body)

        //асинхронный метод, сохраняем модель
        await newuser.save()
        res.send('User registered successfully')
    } catch (error) {
        // console.log(error.errors['password'].message)
        //return res.status(400).json(error);
        res.status(400).send(error);
    }

});


module.exports = router

