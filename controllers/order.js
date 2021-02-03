const mongoose = require('mongoose')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

// (get) localhost:5000/api/order?offset=2&limit=5
module.exports.getAll = async function (req, res){
    const query = {
        user: req.user.id,
    }

    //дата старту
    if(req.query.start) { // всі закази, які старші по даті за старт
        query.date = {
            // більше або дорінює
            $gte: req.query.start
        }
    }

    if(req.query.end){
        if(!query.date){
            query.date = {}
        }

        query.date['$lte'] = req.query.end
    }

    if(req.query.order){
        query.order = +req.query.order
    }

    try{
        const orders = await Order
            .find(query)
            .sort({date: -1})
            .skip(+req.query.offset) // параметр для пагінації
            .limit(+req.query.limit) // кількість елементів

        res.status(200).json(orders)
    }
    catch (e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function (req, res){
    try{
        const lastOrder = await Order.findOne({ // повертає один елемент, бо метод findOne
        user: req.user.id
        }).sort({date: -1}) // щоб дані за цим полем, розміщувалися в порядку спадання

        const maxOrder = lastOrder ? lastOrder.order : 0

        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder + 1
        }).save()

        res.status(201).json(order)
    }catch (e) {
        errorHandler(res, e)
    }
}
