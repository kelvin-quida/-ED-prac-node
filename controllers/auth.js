import User from "../models/user.js"
import bcrypt from "bcryptjs";
import nodemailer from 'nodemailer'
import sendgridTransport from "nodemailer-sendgrid-transport";
import crypto from 'crypto'
import user from "../models/user.js";
import {validationResult} from 'express-validator'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
  api_key:`${process.env.SENDPASS}`
  }
}))

export const getLogin = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0){
      message = message[0]
    }else{
      message = null
    }
    res.render('auth/login',{
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated:false,
      errorMessage:message,
      oldInput:{
        email:'',
        password: ''
      }
    });
}

export const postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

export const getSignup = (req,res) => {
  let message = req.flash('error')
  if (message.length > 0){
    message = message[0]
  }else{
    message = null
  }
  res.render('auth/signup',{
    path:'/signup',
    pageTitle:'Signup',
    isAuthenticated:false,
    errorMessage:message,
    oldInput:{
      email:'',
      password:'',
      confirmPassword:''
    }
  })
};

export const postSignup = (req,res) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render('auth/signup',{
      path:'/signup',
      pageTitle:'Signup',
      isAuthenticated:false,
      errorMessage:errors.array()[0].msg,
      oldInput :{
        email:email,
        password:password,
        confirmPassword:confirmPassword
      }
    })
  }
  bcrypt
    .hash(password,12)
    .then(hashedPassword => {
      const user = new User({
        email:email,
        password:hashedPassword,
        cart:{items:[]}
      })
      return user.save()
    })
    .then(result => {
      res.redirect('/login')
      return transporter.sendMail({
        to:email,
        from:'kelvinquida24@gmail.com',
        subject: 'Signup succeeded',
        html:'<h1> You sucessfully signed up!</h1>'
      })
    })
    .catch(err => {
      error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

export const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}

export const getReset = (req,res) => {
  let message = req.flash('error')
  if (message.length > 0){
    message = message[0]
  }else{
    message = null
  }
  res.render('auth/reset',{
    path: '/reset',
    pageTitle: 'Reset Password',
    isAuthenticated:false,
    errorMessage:message
  })
}

export const postReset = (req,res) => {
  crypto.randomBytes(32,(err,buffer) =>{
    if(err){
      console.log(err)
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex')
    user
      .findOne({email:req.body.email})
      .then(user => {
        if(!user){
          req.flash('error','No account with that email found.')
          return res.redirect('/reset')
        }
        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000
        return user.save()
      })
      .then(result => {
        res.redirect('/')
        transporter.sendMail({
          to:req.body.email,
          from:'kelvinquida24@gmail.com',
          subject: 'Password Reset',
          html:`
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new passoword></p>
          `
        })
      })
      .catch(err => {
        error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      })
  })
}
 
export const getNewPassword = (req,res,next) => {
  const token = req.params.token
  User
    .findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
    .then(user => {
      let message = req.flash('error')
      if (message.length > 0){
        message = message[0]
      }else{
        message = null
      }
      res.render('auth/new-password',{
        path: '/new-password',
        pageTitle: 'New Password',
        isAuthenticated:false,
        errorMessage:message,
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(err => {
      error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
  
}

export const postNewPassword = (req,res,next) => {
  const newPassword = req.body.password
  const userId = req.body.userId
  const passwordToken = req.body.passwordToken
  let resetUser

  User
    .findOne({
      resetToken:passwordToken,
      resetTokenExpiration:{$gt:Date.now()},
      _id:userId
    })
    .then((user) => {
      resetUser = user
      return bcrypt.hash(newPassword,12)
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword
      resetUser.resetToken = undefined
      resetUser.resetTokenExpiration = undefined
      return resetUser.save()
    })
    .then((result) => {
      res.redirect('/login')
    })
    .catch(err => {
      error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}