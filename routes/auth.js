import {Router} from 'express'
import { getLogin,postLogin,postLogout,getSignup,postSignup,getReset,postReset,getNewPassword, postNewPassword } from '../controllers/auth.js'

import {check,body} from 'express-validator'

const router = Router()

router.get('/login',getLogin)

router.get('/signup',getSignup)

router.get('/reset',getReset)

router.get('/reset/:token',getNewPassword)

router.post('/new-password',postNewPassword)

router.post('/reset',postReset)

router.post('/login',postLogin)

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.'),
        body('password',
            'Plase enter a password that has only numbers and at least 5 chars')
            .isLength({min:5})
            .isAlphanumeric(),
        body('confirmPassword').custom((value,{req}) => {
            if (value !== req.body.password){
                throw new Error("Passwords have to match")
            }
            return true
        })
    ],
postSignup)

router.post('/logout',postLogout)

export default router

