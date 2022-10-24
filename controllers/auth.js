import User from "../models/user.js"

export const getLogin = (req, res, next) => {
    res.render('auth/login',{
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated:false
    })
};

export const getSignup = (req,res) => {
  res.render('auth/signup',{
    path:'/signup',
    pageTitle:'Signup',
    isAuthenticated:false
  })
}
   
export const postLogin = (req, res, next) => {
  User.findById('62fcde8f985a7b4566a06edd')
      .then(user => {
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(err => {
          console.log(err)
          res.redirect('/')
        })
      })
      .catch(err => console.log(err))
};

export const postSignup = (req,res) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  User.findOne({email:email})
    .then((userDoc) => {
      if (userDoc) {
        res.redirect('/signup')
      }
      const user = new User({
        email:email,
        password:password,
        cart:{items:[]}
      })
      return user.save()
    })
    .then(result => {
      res.redirect('/login')
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
};

 
