const CourseModel = require('../models/course');
const ContactModel = require('../models/contact');

const nodemailer = require('nodemailer');


class AdminController{
    static display = async(req,res)=>{
        try{
            const {name,image,email,role} = req.Udata;
            const courses = await CourseModel.find()

            const contacts = await ContactModel.find()
          
            res.render('admin/display',{name:name,image:image,email:email,courses:courses,role:role,contacts:contacts,msg:req.flash('success')});
        }catch(error){
            console.log(error);
        }
    }

    static updateStatus = async(req,res)=>{
        try{
        
           
          const {name,email,status,comment,course} = req.body;
          const update = await CourseModel.findByIdAndUpdate(req.params.id,{
            status:status,
            comment:comment
          });
          this.sendEmail(name,email,status,comment,course)
          req.flash('success','Status updated successfullyx');
          res.redirect('/admin/display');
        }catch(error){
            console.log(error);
        }
    }

    static sendEmail = async (name,email,status,comment,course) => {
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
                subject: ` ${course} course ${status}`, // Subject line
                text: "heelo", // plain text body
                html: `<b>${name}</b> ${course} Course <b>${status}</b>  Successful <br>
                <b> Comment for Admin</b>${comment}
                `, // html body
            });
    }
}

module.exports = AdminController;