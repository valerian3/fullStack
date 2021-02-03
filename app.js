const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')
// const cors = require('cors')
const morgan = require('morgan')
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')
const keys = require('./config/keys')
const app = express()

mongoose.connect(keys.mongoURI, {
     useUnifiedTopology: true,
     useNewUrlParser: true,
     useCreateIndex: true
})
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch((error) => {
        console.log(error)
    })

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(morgan('dev'))// кажемо що ми в режимі розробки
app.use('/uploads', express.static('uploads')) // для отримання доступу напряму
app.use(bodyParser.urlencoded({extended: true})) // помагає розкодувати певні url адреси
app.use(bodyParser.json()) // при роботі з данними які отримуємо, допомагає в форматі
app.use(require('cors')())

app.use('/api/auth', authRoutes) //буде конкатонуватися з шляхом в самому роуті, /api/auth/login
app.use('/api/analytics', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/dist/client'))

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'dist', 'client', 'index.html'
            )
        )
    }) // будемо слухати всі запити, і віддавати index.html, адже наш додаток в форматі single-page
}

module.exports = app
