const express = require('express');
const FrontController = require('../controllers/FrontController');
const CourseController = require('../controllers/CourseController');
const AdminController = require('../controllers/AdminController');
const ContactController = require('../controllers/ContactController');



const route = express.Router()

const checkUserAuth = require('../middleware/auth');
const adminRole =  require('../middleware/admin-role');
const checkNotAuth = require('../middleware/checkNotAuth');


//routing
// route.get('/',(req,res)=>{
//     res.send('home page')
// });

// route.get('/about',(req,res)=> {
//     res.send('about page')
// });

//controller routing
route.get('/',checkNotAuth,FrontController.login);
route.get('/register',FrontController.register);
route.get('/home',checkUserAuth,FrontController.home);
route.get('/about',checkUserAuth,FrontController.about);
route.get('/contact',checkUserAuth,FrontController.contact);
route.get('/profile',checkUserAuth,FrontController.profile);
route.post('/changePassword',checkUserAuth,FrontController.changePassword);
route.post('/updateProfile',checkUserAuth,FrontController.updateProfile);

route.post('/forgot_Password',FrontController.forgetPasswordVerify)
route.get('/reset-password',FrontController.reset_Password)
route.post('/reset_Password1',FrontController.reset_Password1)
//user insert route
route.post('/userInsert',FrontController.userInsert);
route.post('/verifyLogin',FrontController.verifyLogin);

//courses route
route.post('/course_insert',checkUserAuth,CourseController.courseInsert);
route.get('/courseView',checkUserAuth,CourseController.courseView);
route.get('/courseShow/:id',checkUserAuth,CourseController.courseShow);

route.get('/courseEdit/:id',checkUserAuth,CourseController.courseEdit);
route.post('/courseUpdate/:id',checkUserAuth,CourseController.courseUpdate);
route.get('/courseDelete/:id',checkUserAuth,CourseController.courseDelete)

//contact routes
route.post('/contactInsert',checkUserAuth,ContactController.contactInsert);
route.get('/contact-view',checkUserAuth,ContactController.contactView);



//admin controller
route.get('/admin/display',checkUserAuth,adminRole('admin'),AdminController.display);
route.post('/admin/updateStatus/:id',checkUserAuth,adminRole('admin'),AdminController.updateStatus);


route.get('/logout',FrontController.logout);
route.get('/verify',FrontController.verifyEmail)


module.exports=route