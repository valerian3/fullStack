const mongoose = require('mongoose')
const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getByCategoryId = async function (req, res){
    try {
        const positions = await Position.find({
            category: req.params.categoryId,
            user: req.user.id // user береться з passport, коли при успішній авторизація ми в req.user передаємо поточного користувача
        })
        res.status(200).json(positions)
    }catch (e){
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res){
    try {
        const position = await new Position({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category,
            user: req.user.id
        }).save()
        res.status(201).json(position)
    }catch (e){
        errorHandler(res, e)
    }
}

module.exports.remove = async function (req, res){
    try {
        await Position.remove({
        _id: req.params.id
        })
        res.status(200).json({
            message: "Позиція була видалена."
        })
    }catch (e){
        errorHandler(res, e)
    }
}

module.exports.update = async function (req, res){
    try {
        const position = await Position.findByIdAndUpdate(
            {_id: req.params.id},
            {$set: req.body}, // змінюємо значення
            {new: true} // спочатку обновить цей запис в mongoose, і після цього поверне її нам
        )
        res.status(200).json(position)
    }catch (e){
        errorHandler(res, e)
    }
}
