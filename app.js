import express from 'express';
import bodyParser from 'body-parser'
import path from 'path'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import session from 'express-session'
import flash from 'connect-flash'

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const MongoDBStore = require('connect-mongodb-session')(session);

import adminRoutes from './routes/admin.js'
import shopRoutes from './routes/shop.js'
import authRoutes from './routes/auth.js'

import {get404, get500} from './controllers/error.js'
import User from './models/user.js'

dotenv.config()

const app = express()
const __dirname = path.resolve();
const MONGODB_URI = `mongodb+srv://${process.env.MY_USER}:${process.env.MY_PASS}@cluster0.t3haj.mongodb.net/shop?retryWrites=true&w=majority`

const store = new MongoDBStore({
    uri:MONGODB_URI,
    collection:'sessions'
})


app.set('view engine', 'ejs');
app.set('views', 'views');
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret:'my secret',
        resave:false,
        saveUninitialized:false,
        store:store
    }))

app.use(flash())

app.use((req,res,next) => {
    if (!req.session.user){
        return next()
    }
    User.findById(req.session.user._id)
    .then(user => {
        if(!user){
            return next()
        }
        req.user = user
        next()
    })
    .catch(err => {
        throw new Error(err)
    })
})     
    
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500',get500)
app.use(get404);

app.use((error,req,res,next) => {
    res.redirect('/500')
})
    
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(3000)
        console.log("Connected")
    })
    .catch(err => {
        console.log(err)
    })