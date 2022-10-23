import User from "../models/user.js"

export const getLogin = (req, res, next) => {
    res.render('auth/login',{
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated:false
    })
};
   
export const postLogin = (req, res, next) => {
  User.findById('62fcde8f985a7b4566a06edd')
      .then(user => {
        req.session.isLoggedIn = true
        req.session.user = user
        res.redirect('/')
      })
      .catch(err => console.log(err))
};

export const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect('/')
  })
};
 
 