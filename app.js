const e = require('express');

const app = e();
const port = 3000;
const web = require('./routes/web');
const connectdb = require('./db/ConnectDb');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')

app.use(cookieParser());

app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true,
}));

app.use(flash());

const fileUpload = require('express-fileupload');
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
//ejs set html css ejs a template engines we using for setting view files
app.set('view engine', 'ejs')

//include public folder files like images and css all the static files 
app.use(e.static('public'));

//parse the form request in object
app.use(e.urlencoded({ extended: false }))

//route load
app.use('/',web);

//db connection 
connectdb();
//server 4listen
app.listen(port,()=>console.log('server start :3000'));
