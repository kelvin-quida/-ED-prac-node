const path = require('path');
const express = require('express');
const app = express()
const bodyParser = require('body-parser');

require('dotenv').config()

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect
const User = require('./models/user')

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
    User.findById('62ee70a0bd693608ed1726f4')
    .then(user => {
        req.user = user
        next()
    })
    .catch(err => console.log(err))
    next()
}) 

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000)
})
 