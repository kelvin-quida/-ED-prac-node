import express from 'express';
import bodyParser from 'body-parser'
import path from 'path'
import dotenv from 'dotenv'
import mongoose from 'mongoose';

import adminRoutes from './routes/admin.js'
import shopRoutes from './routes/shop.js'

import {get404} from './controllers/error.js'
import User from './models/user.js'

const app = express()
const __dirname = path.resolve();

dotenv.config()

app.set('view engine', 'ejs');
app.set('views', 'views');
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
    User
        .findById('62fcde8f985a7b4566a06edd')
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))
    }) 

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoose
    .connect(`mongodb+srv://${process.env.MY_USER}:${process.env.MY_PASS}@cluster0.t3haj.mongodb.net/shop?retryWrites=true&w=majority`)
    .then(() => {
        User.findOne().then(user => {
            if(!user){
                const user = new User({
                    name:"Kelvin",
                    email:"kelvin@test.com",
                    cart:{
                        items:[]
                    }
                })
                user.save()
            }
        })
        app.listen(3000)
        console.log("Connected")
    })
    .catch(err => {
        console.log(err)
    })