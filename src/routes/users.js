const express = require('express');
const router = express.Router();
const {body,validationResult,check} = require('express-validator');
const User = require('../models/User');
const passport = require('passport');


router.get('/user/signin',(req, res) => {
  res.render('users/signin.hbs');
});


router.post('/user/signin',passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/user/signin',
    failureFlash: true
}));


router.get('/user/signup',((req, res) => {
    res.render('users/signup.hbs');
}))

router.post('/user/signup',
    [
        check('name')
                   .isLength({min:2}).withMessage('must be at least 2 chars long'),
        check('password')
                    .isLength({min:5}).withMessage('must be at least 5 chars long'),
        check('email')
                    .isEmail().normalizeEmail().withMessage('Thas it not an value email')
    ],async (req, res) => {
        const {name, email, password, confirm_password} = req.body;
        let errorsArray = [];
        const errores = validationResult(req);

        if(password!==confirm_password){
            errorsArray.push({text:'the passwords didnt coincide'})
        };

        errores.array().forEach(obj =>{
            errorsArray.push({text: obj.msg});
        })

        if(!errores.isEmpty()){
            res.render('users/signup',{errorsArray,name, email, password, confirm_password});
        }else{

            const emailUser = await User.findOne({email:email})

            if(emailUser){

                res.render('users/signup',{error: 'email is used',name});
            }else{
                const newUser = new User({name,email,password});
                newUser.password = await newUser.encryptPassword(password);
                await newUser.save()
                req.flash('success_msg','You are registered');
                res.redirect('/user/signin');
            }

        }

});

router.get('/user/logout',(req, res) => {
    req.logout();
    req.flash('success_msg','you are logged out now');
    res.redirect('/');
})

module.exports = router;
