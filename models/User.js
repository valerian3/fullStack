const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // кажемо, що користувач повинен бути унікальним в системі, і якщо він вже знаходить його, то виникає помилка
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('users', userSchema)


