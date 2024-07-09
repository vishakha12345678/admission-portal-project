const CourseModel = require('../models/course');
const nodemailer = require('nodemailer');


class CourseController{

    static courseInsert = async(req,res)=>{
        try{

            const {name,email,phone,dob,address,gender,education,course} = req.body;

            const result = new CourseModel({
                name:name,
                email:email,
                phone:phone,
                dob:dob,
                address:address,
                gender:gender,
                education:education,
                course:course,
                user_id: req.Udata.id
            })
            await result.save();
            this.sendEmail(name,email,course);
            req.flash('success','Course saved successfully');
            res.redirect('/courseView');
            
           console.log(req.body);
        }catch(error){
            console.log(error);
        }
    }

    static courseView = async(req,res)=>{
        try{
            const {name,image,email,id,role} = req.Udata;

            const courses = await CourseModel.find({user_id:id})
          
            res.render('course/view',{name:name,image:image,email:email,courses:courses,role:role});
        }catch(error){
            console.log(error);
        }
    }

    static courseShow = async(req,res)=>{
        try{
            const {name,image,email,id,role} = req.Udata;

            const courseshow = await CourseModel.findById(req.params.id);
            console.log(courseshow);
          
            res.render('course/show',{name:name,image:image,email:email,courseshow:courseshow,role:role});
        }catch(error){
            console.log(error);
        }
    }
    static courseEdit = async(req,res)=>{
        try{
            const {name,image,email,id,role} = req.Udata;

            const courseedit = await CourseModel.findById(req.params.id);
          
            res.render('course/edit',{name:name,image:image,email:email,courseedit:courseedit,role:role});
        }catch(error){
            console.log(error);
        }
    }

    static courseUpdate = async(req,res)=>{
        try{

            const {name,email,phone,dob,address,gender,education,course} = req.body;
            const courseedit = await CourseModel.findByIdAndUpdate(req.params.id,{
                name:name,
                email:email,
                phone:phone,
                dob:dob,
                address:address,
                gender:gender,
                education:education,
                course:course,
                
            });

            res.redirect('/courseView');
          
        }catch(error){
            console.log(error);
        }
    }

    static courseDelete = async (req, res) => {
        try {
            const {name,image,id} = req.Udata
            await CourseModel.findByIdAndDelete(req.params.id)
            res.redirect('/courseView')
          

        } catch (error) {
            console.log(error)
        }
    }

    static sendEmail = async (name,email,course) => {
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
                subject: ` Course Insert`, // Subject line
                text: "heelo", // plain text body
                html: `<b>${name}</b>  <b>${course}</b> Course Successful Insert! <br>
                `, // html body
            });
    }

}

module.exports = CourseController;