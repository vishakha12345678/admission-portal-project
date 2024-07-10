const UserModel = require('../models/user')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary');
const jwt = require('jsonwebtoken');
const CourseModel = require('../models/course');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');


cloudinary.config({ 
    cloud_name: "dfgz8av1e", 
    api_key: "322822142235236", 
    api_secret: "_us5TgGMmeGfUgtM6w0Qy6KGq1A" // Click 'View Credentials' below to copy your API secret
});
    

class FrontController{
    static login = async(req,res)=>{
        try{
            res.render('login',{message:req.flash('success'),msg:req.flash('error')});
        }catch(error){
            console.log(error);
        }
    }

    static register = async(req,res)=>{
        try{

            res.render('register',{msg:req.flash('error'),msg1:req.flash('success')});
        }catch(error){
            console.log(error);
        }
    }

    static home = async(req,res)=>{
        try{
            const {name,image,email,id,role} = req.Udata;
            const btech = await CourseModel.findOne({user_id:id,course:"btech"})
            const bca = await CourseModel.findOne({user_id:id,course:"bca"})
            const mca = await CourseModel.findOne({user_id:id,course:"mca"})

            res.render('home',{name:name,image:image,email:email,btech:btech,bca:bca,mca:mca,role:role});
        }catch(error){
            console.log(error);
        }
    }
    static about = async(req,res)=>{
        try{
            const {name,image,role} = req.Udata;
            res.render('about',{name:name,image:image,role:role});
        }catch(error){
            console.log(error);
        }
    }
    static contact = async(req,res)=>{
        try{
            const {name,image,role} = req.Udata;
            const msg = req.flash('error');
            const msg1 = req.flash('success');
            res.render('contact',{name:name,image:image,msg:msg,msg1:msg1,role:role});
        }catch(error){
            console.log(error);
        }
    }

    static userInsert = async(req,res)=>{
        try{

            const file = req.files.image
            console.log(req.files.image);
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath,({
                folder: "users"
            }))
            console.log(imageUpload);

            const {name,email,password,confirmpassword} = req.body;
            const checkEmail = await UserModel.findOne({email:email});
            console.log(checkEmail);
            if(checkEmail){
                req.flash('error','email already exist');
                res.redirect('/register');
            }else{
                if(name && email && password && confirmpassword){
                    if( password == confirmpassword){
                        const hashPassword = await bcrypt.hash(password,10);
                        const result = new UserModel({
                            name:name,
                            email:email,
                            password:hashPassword,
                            image:{
                                public_id:imageUpload.public_id,
                                url:imageUpload.secure_url
                            }
                        })

                        const userdata = await result.save();
                        if (userdata) {
                            const token = jwt.sign({ ID: userdata._id }, "pninfosystytytt");
                            //console.log(token)
                            res.cookie("token", token);
                            this.sendVerifymail(name, email, userdata._id);
                            //To redirect to login page
                            req.flash(
                              "success",
                              "Your Registration has been successfully.Please verify your mail. ."
                            );
                            res.redirect("/register");
                        } else {
                            req.flash("error", "Not Register.");
                            res.redirect("/register");
                        }
                        req.flash('success','Registration done successfully');
                        res.redirect('/')
                    }else{
                        req.flash('error','password and confirm password does not match');

                        res.redirect('/register');
                    }
                    
                }else{
                    req.flash('error','all fields are required');
                    res.redirect('/register');
                }
            }
           
        }catch(error){
            console.log(error);
        }
    }

    static verifyLogin = async(req,res)=>{
        try{
            console.log(req.body);

            const {email,password} = req.body
            const user = await UserModel.findOne({email:email})
            if(user){

                const isMatch = await bcrypt.compare(password,user.password);
                // console.log(isMatch);
                if(isMatch){
                    // const token = jwt.sign( {ID:user._id},'pninfosystytytt');
                    // res.cookie('token',token);
                    // console.log(token);
                    // req.flash('success','Logged in successfully!');
                    // res.redirect('/home');

                
                    //multiple login
                    if(user.role == 'admin' && user.is_verified == 1){
                        const token = jwt.sign({ID:user._id},'pninfosystytytt');
                        res.cookie('token',token)
                        // const token = jwt.sign({ ID: user._id }, 'pninfosystytytt', {
                        //     expiresIn: '2h', // Set an expiration time for the token
                        // });
    
                        // res.cookie('token', token, {
                        //     httpOnly: true,
                        //     secure: false,
                        //     sameSite: 'Strict',
                        //     path: '/', 
                        // });
                        res.redirect('/home');
                    }else if(user.role == 'student' && user.is_verified == 1){
                        const token = jwt.sign({ID:user._id},'pninfosystytytt');
                        res.cookie('token',token)
                        res.redirect('/home');
                    }else{
                        req.flash('error','Please verify your email');
                        res.redirect('/');
                    }
                   
                }else{
                    res.redirect('/');
                    req.flash('error','Password does not match!');
                }
            }else{
                req.flash('error','Email not found,Please register!');
                res.redirect('/');
            }
        }catch(error){
            console.log(error);
        }
    }
    static logout = async(req,res)=>{
        try{
            res.clearCookie('token');
            req.flash('success','Logged out successfully!');
            res.redirect('/');
        }catch(error){
            console.log(error);
        }
    }

    static profile = async(req,res)=>{
        try{
            const {name,image,email,role} = req.Udata;
            res.render('profile',{name:name,image:image,email:email,role:role});
        }catch(error){
            console.log(error);
        }
    }

    static changePassword = async(req,res)=>{
        try{

            const {id} = req.Udata;
            const {op,np,cp} = req.body;
            if(op && np && cp){
                const user = await UserModel.findById(id);
                const isMatched = await bcrypt.compare(op,user.password);
                if(!isMatched){
                    req.flash('error','Current password is incorrect');
                    res.redirect('/profile');
                }else{
                    if(np != cp){
                        req.flash('error','Password does not match');
                        res.redirect('/profile');
                    }else{
                        const newHashPassword = await bcrypt.hash(np,10);
                        await UserModel.findByIdAndUpdate(id,{
                            password:newHashPassword,
                        });
                        req.flash('error','Password updated successfully');
                        res.redirect('/');
                    }
                }
            }else{
                req.flash('error','All fields are required');
                res.redirect('/profile');
            }

        }catch(error){
            console.log(error);
        }
    }


    static updateProfile = async (req, res) => {
        try {
          const { id } = req.Udata;
          const { name, email } = req.body;
          if (req.files) {
            const user = await UserModel.findById(id);
            const imageID = user.image.public_id;
            console.log(imageID);
    
            //deleting image from Cloudinary
            await cloudinary.uploader.destroy(imageID);
            //new image update
            const imagefile = req.files.image;
            const imageupload = await cloudinary.uploader.upload(
              imagefile.tempFilePath,
              {
                folder: "userprofile",
              }
            );
            var data = {
              name: name,
              email: email,
              image: {
                public_id: imageupload.public_id,
                url: imageupload.secure_url,
              },
            };
          } else {
            var data = {
              name: name,
              email: email,
            };
          }
          await UserModel.findByIdAndUpdate(id, data);
          req.flash("success", "Update Profile successfully");
          res.redirect("/profile");
        } catch (error) {
          console.log(error);
        }
    };

    static sendVerifymail = async (name,email,user_id) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server

        
        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "vishakhasaxena1998@gmail.com",
                pass: "xrwfrhmthgzouldy",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: "For Verification mail", // Subject line
            text: "hello", // plain text body
            html:
              "<p>Hii " +
              name +
              ',Please click here to <a href="http://localhost:3000/verify?id=' +
              user_id +
              '">Verify</a>Your mail</p>.',
        });
        
    }
    static verifyEmail = async(req,res)=>{
        try{
          await UserModel.findByIdAndUpdate(req.query.id,{
            is_verified:1
          })
          res.redirect('/home');
        }catch(error){
            console.log(error);
        }
    }

    static forgetPasswordVerify = async (req, res) => {
        try {
          const { email } = req.body;
          const userData = await UserModel.findOne({ email: email });
          //console.log(userData)
          if (userData) {
            const randomString = randomstring.generate();
            await UserModel.updateOne(
              { email: email },
              { $set: { token: randomString } }
            );
            this.sendEmail(userData.name, userData.email, randomString);
            req.flash("success", "Plz Check Your mail to reset Your Password!");
            res.redirect("/");
          } else {
            req.flash("error", "You are not a registered Email");
            res.redirect("/");
          }
        } catch (error) {
          console.log(error);
        }
    };

    static sendEmail = async (name, email, token) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server
    
        let transporter = await nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
    
          auth: {
            user: "vishakhasaxena1998@gmail.com",
            pass: "xrwfrhmthgzouldy",
          },
        });
        let info = await transporter.sendMail({
          from: "test@gmail.com", // sender address
          to: email, // list of receivers
          subject: "Reset Password", // Subject line
          text: "heelo", // plain text body
          html:
            "<p>Hii " +
            name +
            ',Please click here to <a href="http://localhost:3000/reset-password?token=' +
            token +
            '">Reset</a>Your Password.',
        });
      };

      static reset_Password = async (req, res) => {
        try {
          const token = req.query.token;
          const tokenData = await UserModel.findOne({ token: token });
          if (tokenData) {
            res.render("reset-password", { user_id: tokenData._id });
          } else {
            res.render("404");
          }
        } catch (error) {
          console.log(error);
        }
      };
      static reset_Password1 = async (req, res) => {
        try {
          const { password, user_id } = req.body;
          const newHashPassword = await bcrypt.hash(password, 10);
          await UserModel.findByIdAndUpdate(user_id, {
            password: newHashPassword,
            token: "",
          });
          req.flash("success", "Reset Password Updated successfully ");
          res.redirect("/");
        } catch (error) {
          console.log(error);
        }
      };
}

module.exports = FrontController;