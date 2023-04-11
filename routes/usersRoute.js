const express = require("express");
const router = express.Router();
//подключаем модель User
const User = require("../models/userModel")
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
    //получили с клиента в теле запроса объект из которого достали нужные св-ва
    const {username, password} = req.body

    try {
        //ищем нужного user
        const user = await User.findOne({username, password})
        console.log(user)
        if (user) {
            // Создание JWT
            // const jwtUser = { username: user.username };
            // console.log("jwtUser", jwtUser)
            // const accessToken = jwt.sign(jwtUser, String(process.env.ACCESS_TOKEN_SECRET));
            // console.log(accessToken)
            // console.log("{ accessToken, user }", { accessToken, user })
            // res.send({ accessToken, user })
            res.send({ user })
        }
        else {
         res.status(400).send({ error: 'Incorrect username or password' });
        }
    } catch (error) {
        res.status(400).send({ error: 'Something failed!'  });
    }

});


router.post("/register", async (req, res) => {

    try {
        //создаем новый объект user исходя из тех параметров что передаются с клиента
        //с помощью ключевого слова new обращаемся к модели User
        const newuser = new User({...req.body, isAdmin: false})

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

