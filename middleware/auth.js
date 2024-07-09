const jwt = require('jsonwebtoken');
const userModel = require('../models/user');


const checkUserAuth = async(req,res,next)=>{
   const {token} = req.cookies;
   if(!token){
        req.flash('error','Unauthorised user please login');
        res.redirect('/');
   }else{
        const verifyLogin = jwt.verify(token,'pninfosystytytt');

        const userData = await userModel.findOne({_id:verifyLogin.ID})
     //    console.log(userData);
        req.Udata = userData;

        next(); //for sending to the route
   }
}

module.exports = checkUserAuth