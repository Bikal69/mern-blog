import express from 'express';
import { google, isUserSignedin, signin, signup } from '../controllers/auth.controller.js';
const router=express.Router();

router.post('/signup',signup)
router.post('/signin',signin)
router.post('/google',google)
router.get('/authenticateUser',isUserSignedin)

export default router;