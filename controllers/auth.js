const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function (req, res){
    const candidate = await User.findOne({email: req.body.email})

    if(candidate){
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult){
            // generate token
            const token = jwt.sign({ // увійти
                // параметри, які ми будемо зчитувати з даного токена
                // першим параметром ми передаємо дані, які хочемо зашифрувати, а далі передаємо ключ для шифрування
                // третім параметром передаємо час життя токена
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, { expiresIn: 60*60 })

            res.status(200).json({
                token: `Bearer ${token}` // По правилах rest добавляємо bearer
            })
        }else {
            res.status(401).json({ // паролі не співпали
                message: 'Паролі не співпадають. Спробуйте знову.'
            })
        }
    }else {
        res.status(404).json({
            message: 'Користувач з таким email не знайдений'
        })
    }
}

module.exports.register = async function (req, res){

    const candidate = await User.findOne({email: req.body.email})

    if(candidate){
        res.status(409).json({
            message: 'Такий email вже зайнятий. Спробуйте інший.'
        })
    }else {

        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({ // тут не потрібен await, адже ми зберігаємо його локально, а не родимо запит до бази даних
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try{
            await user.save()
            res.status(201).json(user)
        }
        catch (e){
            errorHandler(res, e)
        }
    }
}
