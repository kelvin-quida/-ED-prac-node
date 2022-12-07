import {Router} from 'express'
import { getLogin,postLogin,postLogout,getSignup,postSignup,getReset,postReset,getNewPassword, postNewPassword } from '../controllers/auth.js'

import {check,body} from 'express-validator'
import  User  from '../models/user.js'

const router = Router()

router.get('/login',getLogin)

router.get('/signup',getSignup)

router.get('/reset',getReset)

router.get('/reset/:token',getNewPassword)

router.post('/new-password',postNewPassword)

router.post('/reset',postReset)

router.post(
    '/login',
    [
        body('email')
          .isEmail()
          .withMessage('Please enter a valid email address.')
          .normalizeEmail(),
        body('password', 'Password has to be valid.')
          .trim()
          .isLength({ min: 5 })
          .isAlphanumeric()
      ],
postLogin)

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom(async(value,{req}) =>{
                const userDoc = await User.findOne({email:value})
                if (userDoc){
                    return Promise.reject('E-mail exists already, please pick a different one')
                }
            })
            .normalizeEmail(),
        body('password',
            'Plase enter a password that has only numbers and at least 5 chars')
            .trim()
            .isLength({min:5})
            .isAlphanumeric(),
        body('confirmPassword')
            .trim()
            .custom((value,{req}) => {
                if (value !== req.body.password){
                    throw new Error("Passwords have to match")
                }
                return true
        })
    ],
postSignup)

router.post('/logout',postLogout)

export default router

