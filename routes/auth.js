import {Router} from 'express'
import { getLogin,postLogin,postLogout,getSignup,postSignup,getReset,postReset } from '../controllers/auth.js'

const router = Router()

router.get('/login',getLogin)

router.get('/signup',getSignup)

router.get('/reset',getReset)

router.post('/reset',postReset)

router.post('/login',postLogin)

router.post('/signup',postSignup)

router.post('/logout',postLogout)

export default router

