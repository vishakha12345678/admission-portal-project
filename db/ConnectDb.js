const mongoose = require('mongoose'); //for database connectivity
const local_url = 'mongodb://127.0.0.1:27017/Admissionproject';
const live_url = 'mongodb+srv://vishakha:vishakha1998@cluster0.9u3vwbx.mongodb.net/admission-portal?retryWrites=true&w=majority&appName=Cluster0';

const connectDb = () => {
    return mongoose.connect(live_url)
          .then(()=>{
            console.log('connect successfully');
          }).catch((error)=>{
            console.log(error)
          })
}

module.exports= connectDb;