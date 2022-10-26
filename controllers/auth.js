import User from "../models/user.js"
import bcrypt from "bcryptjs";

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
      errorMessage:message
    });
}
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
    errorMessage:message
  })
};
   
export const postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({email:email})
      .then(user => {
        if (!user) {
          req.flash('error','Invalid email or password')
          return res.redirect('/login')
        }
        bcrypt
          .compare(password,user.password)
          .then(doMatch => {
            if (doMatch){
              req.session.isLoggedIn = true
              req.session.user = user
              return req.session.save(err => {
                console.log(err)
                res.redirect('/')
              })
            }
            req.flash('error','Invalid email or password')
            res.redirect('/login')
          })
          .catch(err => {
            console.log(err)
            res.redirect('/login')
          })
        })
        .catch(err => console.log(err))
}

export const postSignup = (req,res) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  User.findOne({email:email})
    .then(userDoc => {
      if (userDoc) {
        req.flash('error','Email exists already')
        return res.redirect('/signup')
      }
      return bcrypt
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
        })
    })
    .catch((err) => {
      console.log(err)
    })
}

export const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
}
